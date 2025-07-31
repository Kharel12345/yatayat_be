const logger = require("../../config/winstonLoggerConfig");
const { getFormattedDate } = require("../../helpers/date");
const Nepali_Calendar = require("../../helpers/nepaliCalendar");
const { DATA_SAVED, SUCCESS_API_FETCH } = require("../../helpers/response");
const { economicYearServices } = require("../../services/master");

const setupEconomicYear = async (req, res, next) => {
  try {
    const {
      functional_year,
      functional_year_start_bs,
      functional_year_end_bs,
    } = req.body;

    let calendar = new Nepali_Calendar();
    let functional_year_start_ad = calendar.BSToADConvert(
      functional_year_start_bs
    );
    let functional_year_end_ad = calendar.BSToADConvert(functional_year_end_bs);

    let economicYearDetail = {
      functional_year,
      functional_year_start_bs,
      functional_year_start_ad,
      functional_year_end_bs,
      functional_year_end_ad,
      created_by: req.user.user_id,
    };

    await economicYearServices.setupEconomicYear(economicYearDetail);

    res
      .status(201)
      .json(DATA_SAVED("Economic year setup completed successfully !!!"));
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

const adDateToCustomDate = async (req, res, next) => {
  try {
    let { adDate } = req.query;

    let calendar = new Nepali_Calendar();
    let bsDate = calendar.ADToBsConvert(adDate);

    res
      .status(200)
      .json(SUCCESS_API_FETCH(bsDate, "Date converted successfully!!!"));
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

const getEconomicYearList = async (req, res, next) => {
  try {
    let economicYearList = await economicYearServices.getEconomicYearList();
    economicYearList = economicYearList.map((economicYear) => {
      if (economicYear.status == 1) {
        economicYear = {
          ...economicYear,
          functional_year: `FY ${economicYear.functional_year} <ACTIVE> [${economicYear.functional_year_start_bs} to ${economicYear.functional_year_end_bs}]`,
          functional_year_start_ad: getFormattedDate(
            economicYear.functional_year_start_ad
          ),
          functional_year_end_ad: getFormattedDate(
            economicYear.functional_year_end_ad
          ),
        };
      } else {
        economicYear = {
          ...economicYear,
          functional_year: `${economicYear.functional_year} <VIEW ONLY> [${economicYear.functional_year_start_bs} to ${economicYear.functional_year_end_bs}]`,
          functional_year_start_ad: getFormattedDate(
            economicYear.functional_year_start_ad
          ),
          functional_year_end_ad: getFormattedDate(
            economicYear.functional_year_end_ad
          ),
        };
      }
      return economicYear;
    });
    res.status(200).json(SUCCESS_API_FETCH(economicYearList));
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

module.exports = {
  setupEconomicYear,
  adDateToCustomDate,
  getEconomicYearList,
};
