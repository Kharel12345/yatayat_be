const Nepali_Calendar = require('./nepaliCalendar')

let getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function getFormattedDate(mydate) {
    let newdate = new Date(mydate)
    let year = newdate.getFullYear()
    let month = newdate.getMonth() + 1
    let date = newdate.getDate()
    let formattedDate = year + '-' + month + '-' + date
    return formattedDate
}

const getCurrentDateTimeInBS = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const calendar = new Nepali_Calendar()
    const dateBs = calendar.ADToBsConvert(`${year}-${month}-${day}`)
    return `${dateBs} ${hours}:${minutes}:${seconds}`
}

const getTodayDay = () => {
    const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const today = new Date();
    const dayName = daysOfWeek[today.getDay()];
    return dayName
}

module.exports = {
    getCurrentDateTime,
    getFormattedDate,
    getCurrentDateTimeInBS,
    getTodayDay
}