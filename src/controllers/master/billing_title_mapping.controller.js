const logger = require("../../config/winstonLoggerConfig");
const { billingTitleMappingService } = require("../../services/master");

exports.createBillingMapping = async (req, res, next) => {
  try {
    const newMapping = await billingTitleMappingService.create(req.body);
    res.status(201).json(newMapping);
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

exports.findAllBillingMapping = async (req, res, next) => {
  try {
    const mappings = await billingTitleMappingService.findAll(req.query);
    res.json(mappings);
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};

exports.findOneBillingMapping = async (req, res, next) => {
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

exports.updateBillingMapping = async (req, res, next) => {
  try {
    const updatedMapping = await billingTitleMappingService.update(
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

exports.deleteBillingMapping = async (req, res, next) => {
  try {
    const result = await billingTitleMappingService.delete(req.params.id);
    if (!result) return res.status(404).json({ error: "Mapping not found" });
    res.status(204).send();
  } catch (error) {
    logger.error(
      `{ Api:${req.url}, Error:${error.message}, stack:${error.stack} }`
    );
    return next(error);
  }
};
