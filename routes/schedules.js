const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Schedule = require('../models/Schedule');
const makeError = (message) => {
    return {
        success: false,
        error: {
            message
        }
    };
}
const makeResponse = (message) => {
    return {
        success: true,
        message
    };
}
const makeDataResponse = (data) => {
    return {
        data
    };
}
router.get('/', function (req, res) {
    res.send(makeDataResponse([]));
});

router.get('/semesters', async function ({ query: { studentCode } }, res) {
    if (!studentCode) return res.send(makeError('Mã sinh viên không hợp lệ'));
    try {
        const user = await User.findOne({ studentCode });
        if (!user) throw Error('Tài khoản chưa được đăng nhập trên hệ thống');
        const semesters = await user.showSemesters();
        res.send(makeDataResponse(semesters))
    } catch (error) {
        res.send(makeError(error.message));
    }
});

router.post('/save', async function ({ body: { studentCode, drpSemester } }, res) {
    if (!studentCode) return res.send(makeError('Mã sinh viên không hợp lệ'));
    if (!drpSemester) return res.send(makeError('Mã học kỳ không hợp lệ'));
    try {
        const user = await User.findOne({ studentCode });
        if (!user) throw Error('Tài khoản chưa được đăng nhập trên hệ thống');
        const timetable = await Schedule.saveTimeTable(user, drpSemester);
        res.send(makeDataResponse(timetable))
    } catch (error) {
        res.send(makeError(error.message));
    }
});

router.post('/search', async function ({ body: { studentCode, days } }, res) {

    if (!studentCode) return res.send(makeError('Mã sinh viên không hợp lệ'));
    if (!days) return res.send(makeError('Ngày tra cứu không hợp lệ (DD/MM/YYYY)'));
    days = Array.isArray(days) ? days : [days];
    try {
        const user = await User.findOne({ studentCode });
        if (!user) throw Error('Tài khoản chưa được đăng nhập trên hệ thống');        
        const schedule = await Schedule.search(studentCode, days);
        res.send(makeDataResponse(schedule))
    } catch (error) {
        res.send(makeError(error.message));
    }
})
module.exports = router;