const logger = require("../../config/winstonLoggerConfig");
const { billingTitleMappingService } = require("../../services/master");

const createBillingMapping = async (req, res, next) => {
  try {
    const newMapping = await billingTitleMappingService.createBillingMapping(req.body);
    res.status(201).json(newMapping);
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

const findAllBillingMapping = async (req, res, next) => {
  try {
    const mappings = await billingTitleMappingService.findAllBillingMapping(req.query);
    res.status(200).json({
      message: 'Billing title mapping list',
      status: true,
      data: mappings.rows,
      total: mappings.count
    });
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

const findOneBillingMapping = async (req, res, next) => {
  try {
    const mapping = await billingTitleMappingService.findOne(req.params.id);
    if (!mapping) return res.status(404).json({ error: "Mapping not found" });
    res.json(mapping);
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

const updateBillingMapping = async (req, res, next) => {
  try {
    const updatedMapping = await billingTitleMappingService.updateBillingMapping(
      req.params.id,
      req.body
    );
    if (!updatedMapping)
      return res.status(404).json({ error: "Mapping not found" });

    res.json(updatedMapping);
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

const deleteBillingMapping = async (req, res, next) => {
  try {
    const result = await billingTitleMappingService.deleteBillingMapping(req.params.id);
    if (!result) return res.status(404).json({ error: "Mapping not found" });
    res.status(204).send({
      status: true,
      message: "Mapping deleted successfully"
    });
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

module.exports = {
  createBillingMapping,
  updateBillingMapping,
  deleteBillingMapping,
  findAllBillingMapping,
  findOneBillingMapping
};
