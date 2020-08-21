const mongoose = require("mongoose");
const moment = require("moment-timezone");
const TIME_ZONE = process.env.TIME_ZONE || "Asia/Ho_Chi_Minh";
const { Schema } = mongoose;

const ScheduleSchema = new Schema({
    studentCode: String,
    day: Date,
    dayOfWeek: {
        type: Number,
        enum: [2, 3, 4, 5, 6, 7, 8],
        default: 2
    },
    subjectCode: String,
    subjectName: String,
    className: String,
    teacher: String,
    lesson: String,
    room: String
})
ScheduleSchema.pre("save", async function (next) {
    const { studentCode, day, lesson, subjectCode } = this;
    const existSchedule = await Schedule.find({ studentCode, day, lesson, subjectCode });
    if (existSchedule && existSchedule.length != 0) next(Error("Schedule is exits."));
    else next();
})
ScheduleSchema.statics.saveTimeTable = async (user, drpSemester) => {
    const { studentCode } = user;
    const timetable = await user.showTimeTable(drpSemester);
    const schedule = timetable.map(lesson => {
        lesson.studentCode = studentCode;
        lesson.dayOfWeek = moment(lesson.day, "DD/MM/YYYY").isoWeekday() + 1;
        lesson.day = moment(lesson.day, "DD/MM/YYYY", TIME_ZONE);
        return lesson;
    })
    const inserted = await Schedule.create(schedule);
    return inserted;
}

ScheduleSchema.statics.search = async (studentCode, days) => {
    days = days.map(e => {
        const format = moment(e, "DD/MM/YYYY", TIME_ZONE);
        if (format.isValid()) return new Date(format.format());
        return new Date(moment("DD/MM/YYYY", TIME_ZONE).format());
    })
    const schedule = await Schedule
        .find({ studentCode, day: { $in: days } });

    return schedule.sort((a, b) => {
        const dayA = moment(a.day);
        const dayB = moment(b.day);
        if (dayB.isBefore(dayA)) return true;
        if (dayA.isBefore(dayB)) return false;
        const [lessonA] = a.lesson.split(',');
        const [lessonB] = b.lesson.split(',');
        return parseInt(lessonA) > parseInt(lessonB);
    })
}
const Schedule = mongoose.model('schedule', ScheduleSchema);

module.exports = Schedule;