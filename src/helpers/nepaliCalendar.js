class Nepali_Calendar {
    constructor() {
        this.bs = [
            [2000, 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
            [2001, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
            [2002, 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
            [2003, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
            [2004, 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
            [2005, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
            [2006, 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
            [2007, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
            [2008, 31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
            [2009, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
            [2010, 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
            [2011, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
            [2012, 31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
            [2013, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
            [2014, 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
            [2015, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
            [2016, 31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
            [2017, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
            [2018, 31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
            [2019, 31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
            [2020, 31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
            [2021, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
            [2022, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
            [2023, 31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
            [2024, 31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
            [2025, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
            [2026, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
            [2027, 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
            [2028, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
            [2029, 31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30],
            [2030, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
            [2031, 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
            [2032, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
            [2033, 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
            [2034, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
            [2035, 30, 32, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
            [2036, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
            [2037, 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
            [2038, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
            [2039, 31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
            [2040, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
            [2041, 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
            [2042, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
            [2043, 31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
            [2044, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
            [2045, 31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
            [2046, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
            [2047, 31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
            [2048, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
            [2049, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
            [2050, 31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
            [2051, 31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
            [2052, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
            [2053, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
            [2054, 31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
            [2055, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
            [2056, 31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30],
            [2057, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
            [2058, 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
            [2059, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
            [2060, 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
            [2061, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
            [2062, 30, 32, 31, 32, 31, 31, 29, 30, 29, 30, 29, 31],
            [2063, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
            [2064, 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
            [2065, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
            [2066, 31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
            [2067, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
            [2068, 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
            [2069, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
            [2070, 31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
            [2071, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
            [2072, 31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
            [2073, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
            [2074, 31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
            [2075, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
            [2076, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
            [2077, 31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
            [2078, 31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
            [2079, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
            [2080, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
            [2081, 31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
            [2082, 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
            [2083, 31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
            [2084, 31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
            [2085, 31, 32, 31, 32, 30, 31, 30, 30, 29, 30, 30, 30],
            [2086, 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
            [2087, 31, 31, 32, 31, 31, 31, 30, 30, 29, 30, 30, 30],
            [2088, 30, 31, 32, 32, 30, 31, 30, 30, 29, 30, 30, 30],
            [2089, 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
            [2090, 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30]
        ];
        this.nep_date = {
            year: "",
            month: "",
            date: "",
            day: "",
            nmonth: "",
            num_day: "",
        };
        this.eng_date = {
            year: "",
            month: "",
            date: "",
            day: "",
            emonth: "",
            num_day: "",
        };
        this.debug_info = "";
    }


    getDayOfWeek(day) {
        switch (day) {
            case 1:
                day = "Sunday";
                break;
            case 2:
                day = "Monday";
                break;

            case 3:
                day = "Tuesday";
                break;

            case 4:
                day = "Wednesday";
                break;

            case 5:
                day = "Thursday";
                break;

            case 6:
                day = "Friday";
                break;

            case 7:
                day = "Saturday";
                break;
        }
        return day;
    }

    get_english_month(m) {
        let eMonth = false;
        switch (m) {
            case 1:
                eMonth = "January";
                break;
            case 2:
                eMonth = "February";
                break;
            case 3:
                eMonth = "March";
                break;
            case 4:
                eMonth = "April";
                break;
            case 5:
                eMonth = "May";
                break;
            case 6:
                eMonth = "June";
                break;
            case 7:
                eMonth = "July";
                break;
            case 8:
                eMonth = "August";
                break;
            case 9:
                eMonth = "September";
                break;
            case 10:
                eMonth = "October";
                break;
            case 11:
                eMonth = "November";
                break;
            case 12:
                eMonth = "December";
                break;
        }
        return eMonth;
    }

    get_nepali_month(m) {
        let n_month = false;
        switch (m) {
            case 1:
                n_month = "Baishak";
                break;
            case 2:
                n_month = "Jestha";
                break;
            case 3:
                n_month = "Ashad";
                break;
            case 4:
                n_month = "Shrawn";
                break;
            case 5:
                n_month = "Bhadra";
                break;
            case 6:
                n_month = "Ashwin";
                break;
            case 7:
                n_month = "kartik";
                break;
            case 8:
                n_month = "Mangshir";
                break;
            case 9:
                n_month = "Poush";
                break;
            case 10:
                n_month = "Magh";
                break;
            case 11:
                n_month = "Falgun";
                break;
            case 12:
                n_month = "Chaitra";
                break;
        }
        return n_month;
    }


    isInRangeEng(yy, mm, dd) {
        if (yy < 1944 || yy > 2033) {
            return 'Supported only between 1944-2033';
        }

        if (mm < 1 || mm > 12) {
            return 'Error! month value can be between 1-12 only';
        }

        if (dd < 1 || dd > 31) {
            return 'Error! day value can be between 1-31 only';
        }

        return true;
    }

    /**
 * Check if date range is in Nepali
 *
 * @param {number} yy
 * @param {number} mm
 * @param {number} dd
 * @returns {boolean|string}
 */
    isInRangeNep(yy, mm, dd) {
        if (yy < 2000 || yy > 2089) {
            return 'Supported only between 2000-2089';
        }

        if (mm < 1 || mm > 12) {
            return 'Error! month value can be between 1-12 only';
        }

        if (dd < 1 || dd > 32) {
            return 'Error! day value can be between 1-31 only';
        }

        return true;
    }

    isLeapYear(year) {
        if (year % 100 === 0) {
            return year % 400 === 0;
        } else {
            return year % 4 === 0;
        }
    }

    /**
 * currently can only calculate the date between AD 1944-2033...
 *
 * @param {number} yy
 * @param {number} mm
 * @param {number} dd
 * @return {Object}
 */
    eng_to_nep(yy, mm, dd) {
        // Check for date range
        const chk = this.isInRangeEng(yy, mm, dd);

        if (chk !== true) {
            throw new Error(chk);
        } else {
            // Month data.
            const month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

            // Month for leap year
            const lmonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

            const def_eyy = 1944; // initial english date.
            const def_nyy = 2000;
            const def_nmm = 9;
            const def_ndd = 17 - 1; // inital nepali date.
            let total_eDays = 0;
            let total_nDays = 0;
            let a = 0;
            let day = 7 - 1;
            let m = 0;
            let y = 0;
            let i = 0;
            let j = 0;
            let numDay = 0;

            // Count total no. of days in-terms year
            for (i = 0; i < (yy - def_eyy); i++) {

                // total days for month calculation...(english)
                if (this.isLeapYear(def_eyy + i) == true) {
                    for (j = 0; j < 12; j++) {
                        total_eDays += lmonth[j];
                    }
                } else {
                    for (j = 0; j < 12; j++) {
                        total_eDays += month[j];
                    }
                }
            }

            // Count total no. of days in-terms of month
            for (i = 0; i < (mm - 1); i++) {
                if (this.isLeapYear(yy) == true) {
                    total_eDays += lmonth[i];
                } else {
                    total_eDays += month[i];
                }
            }

            // Count total no. of days in-terms of date
            total_eDays += dd;
            i = 0;
            j = def_nmm;
            total_nDays = def_ndd;
            m = def_nmm;
            y = def_nyy;

            // Count nepali date from array
            while (total_eDays != 0) {
                a = this.bs[i][j];
                total_nDays++; //count the days
                day++; //count the days interms of 7 days

                if (total_nDays > a) {
                    m++;
                    total_nDays = 1;
                    j++;
                }

                if (day > 7) {
                    day = 1;
                }

                if (m > 12) {
                    y++;
                    m = 1;
                }

                if (j > 12) {
                    j = 1;
                    i++;
                }

                total_eDays--;
            }

            numDay = day;
            this.nep_date['year'] = y;
            this.nep_date['month'] = m;
            this.nep_date['date'] = total_nDays;
            this.nep_date['day'] = this.getDayOfWeek(day);
            this.nep_date['nmonth'] = this.get_nepali_month(m);
            this.nep_date['num_day'] = numDay;
            return this.nep_date
        }


    }


    nep_to_eng(yy, mm, dd) {

        let def_eyy = 1943;
        let def_emm = 4;
        let def_edd = 14 - 1;	// initial english date.
        let def_nyy = 2000;
        let def_nmm = 1;
        let def_ndd = 1;		// iniital equivalent nepali date.
        let total_eDays = 0;
        let total_nDays = 0;
        let a = 0;
        let day = 4 - 1;
        let m = 0;
        let y = 0;
        let i = 0;
        let j = 0
        let k = 0;
        let numDay = 0;

        let month = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        let lmonth = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

        let chk = this.isInRangeNep(yy, mm, dd)

        if (chk !== true) {
            throw new Error(chk)
        } else {
            // Count total days in-terms of year
            for (i = 0; i < (yy - def_nyy); i++) {
                for (j = 1; j <= 12; j++) {
                    total_nDays += this.bs[k][j];
                }
                k++;
            }

            // Count total days in-terms of month
            for (j = 1; j < mm; j++) {
                total_nDays += this.bs[k][j];
            }

            // Count total days in-terms of dat
            total_nDays += dd;

            // Calculation of equivalent english date...
            total_eDays = def_edd;
            m = def_emm;
            y = def_eyy;

            while (total_nDays != 0) {
                if (this.isLeapYear(y)) {
                    a = lmonth[m];
                }
                else {
                    a = month[m];
                }

                total_eDays++;
                day++;

                if (total_eDays > a) {
                    m++;
                    total_eDays = 1;
                    if (m > 12) {
                        y++;
                        m = 1;
                    }
                }

                if (day > 7) {
                    day = 1;
                }

                total_nDays--;
            }

            numDay = day;

            this.eng_date['year'] = y;
            this.eng_date['month'] = m;
            this.eng_date['date'] = total_eDays;
            this.eng_date['day'] = this.getDayOfWeek(day);
            this.eng_date['nmonth'] = this.get_english_month(m);
            this.eng_date['num_day'] = numDay;

            return this.eng_date;
        }
    }


    ADToBsConvertWithoutFormat(addate) {
        let addateArray = addate.split('-');
        let bsDateArray = this.eng_to_nep(addateArray[0], addateArray[1], addateArray[2]);
        return bsDateArray['year'] + (bsDateArray['month'] < 10 ? '0' : '') + bsDateArray['month'] + (bsDateArray['date'] < 10 ? '0' : '') + bsDateArray['date'];
    }


    ADToBsConvert(addate) {
        let addateArray = addate.split('-');
        let bsDateArray = this.eng_to_nep(addateArray[0] / 1, addateArray[1] / 1, addateArray[2] / 1);
        return bsDateArray['year'] + '-' + ('0' + bsDateArray['month']).slice(-2) + '-' + ('0' + bsDateArray['date']).slice(-2);
    }

    BSToADConvert(bsdate) {
        const nepdateArray = bsdate.split('-');
        const engdateArray = this.nep_to_eng(nepdateArray[0] / 1, nepdateArray[1] / 1, nepdateArray[2] / 1);
        return engdateArray['year'] + '-' + engdateArray['month'].toString().padStart(2, '0') + '-' + engdateArray['date'].toString().padStart(2, '0');
    }


    bsDateValidation(incommingDate) {
        const incommingDarteArray = incommingDate.split('-');
        if (incommingDarteArray[1] <= 12) {
            if (incommingDarteArray[0] > 2090 || incommingDarteArray[0] < 2001 || incommingDarteArray[1] == 0 || incommingDarteArray[2] == 0) {
                return false;
                //return 'error1';
            } else {
                if (incommingDarteArray[0] > 2009) {
                    var mainArrayKey = incommingDarteArray[0].slice(-2);
                } else {
                    var mainArrayKey = incommingDarteArray[0].slice(-1);
                }
                if (incommingDarteArray[1] > 9) {
                    var monthKey = incommingDarteArray[1].slice(-2);
                } else {
                    var monthKey = incommingDarteArray[1].slice(-1);
                }
                if (incommingDarteArray[2] > this.bs[mainArrayKey][monthKey]) {
                    return false;
                    //return 'error 2';
                } else {
                    return true;
                }
            }
        } else {
            return false;
        }
    }

    generateADDateWithValidation(BSDate, errorMessage) {
        if (BSDate != '') {
            var BSDateValidationStatus = this.bsDateValidation(BSDate);
            if (BSDateValidationStatus == false) {
                console.log(JSON.stringify({ 'errorMsg': errorMessage }));
                return null;
            } else {
                return this.BSToADConvert(BSDate);
            }
        } else {
            return '';
        }
    }

    getNoOfDays(yearInBs, monthIndex) {
        let yearDetail = this.bs.filter((list) => {
            return list[0] == yearInBs
        })
        return yearDetail[0][monthIndex]
    }

}

module.exports = Nepali_Calendar
