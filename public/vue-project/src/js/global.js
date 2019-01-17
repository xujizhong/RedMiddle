
const moment = require('moment')

module.exports = {
    postTimeFormat(time) {
        const TimeNow = moment().format('YYYY-MM-DD HH:mm:ss');
        const m = parseInt(moment(TimeNow).diff(moment(time)) / (1000 * 60));

        const dayNow = moment().format('YYYY-MM-DD');
        const Yesterday = moment().subtract('days', 1).format('YYYY-MM-DD');
        const dayArug = moment(time).format('YYYY-MM-DD');
        const clockArug = moment(time).format('HH:mm:ss');

        if (m < 1) {
            return '刚刚'
        } else if (m < 60) {
            return m + '分钟前'
        } else if (dayNow == dayArug) {
            return '今天 ' + clockArug
        } else if (Yesterday == dayArug) {
            return '昨天 ' + clockArug
        } else {
            return moment(time).format('YYYY-MM-DD HH:mm:ss')
        }
    }
}