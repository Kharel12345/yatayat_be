const  economicYearServices  = require("../services/master/economic_year.service");

//check wheather the date lies between the provided functional_year_id or not
let validateBsDateAgainstFunctionalYear = async (functional_year_id, date) => {
  //get functional_year_info
  let functional_year_info = await economicYearServices.getEconomicYearInfo(
    functional_year_id
  );
  let functional_year_start_bs =
    functional_year_info[0].functional_year_start_bs;
  let functional_year_end_bs = functional_year_info[0].functional_year_end_bs;

  const currentDate = new Date(date);
  const startDate = new Date(functional_year_start_bs);
  const endDate = new Date(functional_year_end_bs);

  return currentDate >= startDate && currentDate <= endDate;
};

let validateAdDateAgainstFunctionalYear = async (functional_year_id, date) => {
  //get functional_year_info
  let functional_year_info = await economicYearServices.getEconomicYearInfo(
    functional_year_id
  );
  let functional_year_start_ad =
    functional_year_info[0].functional_year_start_ad;
  let functional_year_end_ad = functional_year_info[0].functional_year_end_ad;

  const currentDate = new Date(date);
  const startDate = new Date(functional_year_start_ad);
  const endDate = new Date(functional_year_end_ad);

  return currentDate >= startDate && currentDate <= endDate;
};

const isFutureDate = (inputDate) => {
  // Parse the input date string to a Date object
  const dateToCheck = new Date(inputDate);

  // Get the current date
  const currentDate = new Date();

  // Compare the input date with the current date
  if (dateToCheck > currentDate) {
    // The input date is in the future
    return true;
  } else {
    // The input date is not in the future
    return false;
  }
};

const isBackDate = (date) => {
  // Get the current date and time
  const currentDate = new Date();
  let inputDate = new Date(date);

  // Set both input and current dates to midnight to compare only the dates
  inputDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);

  // Compare the input date with the current date
  if (inputDate < currentDate) {
    return true; // The input date is a back date
  } else {
    return false; // The input date is not a back date
  }
};

module.exports = {
  validateBsDateAgainstFunctionalYear,
  validateAdDateAgainstFunctionalYear,
  isFutureDate,
  isBackDate,
};
