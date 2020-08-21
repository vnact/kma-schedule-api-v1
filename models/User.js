const mongoose = require("mongoose");
const login = require("tin-chi-kma")({ HOST_API: process.env.HOST_API });;
const { Schema } = mongoose;

const UserSchema = new Schema({
    studentCode: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    name: {
        type: String,
        required: false,
        trim: true
    },
    className: {
        type: String,
        required: false,
        trim: true,
    }
})

// UserSchema.pre('save', async function (next) {
//     const user = this;
//     const { studentCode, password } = user;
//     const correctPass = await user.checkLogin();
//     if (!correctPass) next(Error("studentCode / password is not correct!"));
//     try {
//         const { displayName } = await user.showInfo();
//         user.className = studentCode.slice(0, 2);
//         user.name = displayName;
//         next();
//     } catch (error) {
//         next(error);
//     }
// })

UserSchema.methods.checkLogin = async function () {
    const { studentCode, password } = this;
    try {
        const api = await login({ user: studentCode, pass: password });
        return true;
    } catch (error) {
        return false;
    }
}

UserSchema.statics.checkLogin = async (studentCode, password) => {
    try {
        const api = await login({ user: studentCode, pass: password });
        return true;
    } catch (error) {
        return false;
    }
}

UserSchema.methods.login = async function () {
    const { studentCode, password } = this;
    const api = await login({ user: studentCode, pass: password });
    return api;
}
UserSchema.methods.showInfo = async function () {
    const api = await this.login();
    const information = await api.studentProfile.show();
    return information;
}
UserSchema.methods.showSemesters = async function () {
    const api = await this.login();
    const semesters = await api.studentTimeTable.showSemesters();
    if (semesters) return semesters.map(({ name, value }) => ({ name, drpSemester: value }))
    return semesters;
}

UserSchema.methods.showTimeTable = async function (drpSemester) {
    const api = await this.login();
    const timetable = await api.studentTimeTable.showTimeTable(drpSemester);
    return timetable;
}

const User = mongoose.model('user', UserSchema);

module.exports = User;