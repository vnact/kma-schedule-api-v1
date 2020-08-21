const express = require('express');
const router = express.Router();
const User = require('../models/User');
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
const studentCodeToClassName = (studentCode) => {
    let className = studentCode.slice(0, 2);
    className += studentCode.slice(3, 4);
    const charCode = studentCode.slice(4, 6) - 0 + 64;
    className += String.fromCharCode(charCode);
    return className;
}
router.get('/', async function ({ query: { query = {}, max, cursor } }, res, next) {
    if (!parseInt(max, 10) || parseInt(max, 10) <= 0) {
        max = 1000;
        cursor = 1;
    }
    else {
        max = parseInt(max, 10);
        cursor = parseInt(cursor, 10) || 1;
    }
    try {
        const users = await User
            .find(query, { studentCode: 1, name: 1, _id: 0, className: 1 })
            .limit(max)
            .skip(max * cursor - max);
        res.send(makeDataResponse(users));
    } catch (err) {
        res.send(makeError('Không tìm thấy user nào'));
    }
});
router.post('/login', async function ({ body: { studentCode, password } }, res, next) {
    if (!studentCode) return res.send(makeError('Mã sinh viên không hợp lệ'));
    if (!password) return res.send(makeError('Mật khẩu không hợp lệ'));

    const isCorrectPassword = await User.checkLogin(studentCode, password);
    if (!isCorrectPassword) return res.send(makeError('Tài khoản hoặc mật khẩu không đúng'));
    const user = await User.findOne({ studentCode });

    if (!user) {
        const newUser = new User({
            studentCode,
            password,
            name: studentCode,
            className: studentCodeToClassName(studentCode)
        });
        await newUser.save();
        return res.status(200).send(makeResponse('Đăng nhập thành công'));
    }
    user.password = password;
    await user.save();
    return res.status(200).send(makeResponse('Cập nhật mật khẩu thành công'));
});
module.exports = router;