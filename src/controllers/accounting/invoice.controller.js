const { 
  createInvoiceSchema, 
  updateInvoiceSchema, 
  getInvoicesSchema, 
  getRenewalRemindersSchema 
} = require('../../middlewares/validation/accounting/invoice.validation');
const { invoiceServices } = require('../../services/accounting');
const { ValidationError, NotFoundError, DatabaseError } = require('../../utils/error');


  // Create a new invoice
  const createInvoice=async (req, res, next)=> {
    try {
      // Validate request body
      const {  value } = createInvoiceSchema.validate(req.body);
      if (error) {
        throw new ValidationError(error.details[0].message);
      }

      const invoice = await invoiceServices.createInvoice(value);
      
      res.status(201).json({
        success: true,
        message: 'Invoice created successfully',
        data: invoice
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all invoices
  const getAllInvoices=async (req, res, next)=> {
    try {
      // Validate query parameters
      const { error, value } = getInvoicesSchema.validate(req.query);
      if (error) {
        throw new ValidationError(error.details[0].message);
      }

      const result = await invoiceService.getInvoices(value);
      
      res.json({
        success: true,
        message: 'Invoices fetched successfully',
        data: result.invoices,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  // Get invoice by ID
  const getInvoiceById=async (req, res, next)=> {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(parseInt(id))) {
        throw new ValidationError('Valid invoice ID is required');
      }

      const invoice = await invoiceService.getInvoiceById(parseInt(id));
      
      res.json({
        success: true,
        message: 'Invoice fetched successfully',
        data: invoice
      });
    } catch (error) {
      next(error);
    }
  }

  // Update invoice
  const updateInvoice=async (req, res, next)=> {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(parseInt(id))) {
        throw new ValidationError('Valid invoice ID is required');
      }

      // Validate request body
      const { error, value } = updateInvoiceSchema.validate(req.body);
      if (error) {
        throw new ValidationError(error.details[0].message);
      }

      const invoice = await invoiceService.updateInvoice(parseInt(id), value);
      
      res.json({
        success: true,
        message: 'Invoice updated successfully',
        data: invoice
      });
    } catch (error) {
      next(error);
    }
  }

  // Get invoices by vehicle ID
  const getInvoicesByVehicle=async (req, res, next)=> {
    try {
      const { vehicleId } = req.params;
      const { page = 1, limit = 10 } = req.query;
      
      if (!vehicleId || isNaN(parseInt(vehicleId))) {
        throw new ValidationError('Valid vehicle ID is required');
      }

      const result = await invoiceService.getInvoicesByVehicle(parseInt(vehicleId), { page, limit });
      
      res.json({
        success: true,
        message: 'Vehicle invoices fetched successfully',
        data: {
          vehicle: result.vehicle,
          invoices: result.invoices
        },
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  // Get renewal reminders
  const getRenewalReminders=async (req, res, next)=> {
    try {
      // Validate query parameters
      const { error, value } = getRenewalRemindersSchema.validate(req.query);
      if (error) {
        throw new ValidationError(error.details[0].message);
      }

      const invoices = await invoiceService.getRenewalReminders(value.days);
      
      res.json({
        success: true,
        message: `Renewal reminders for next ${value.days} days`,
        data: {
          count: invoices.length,
          invoices
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get dashboard statistics
  const getDashboardStats=async (req, res, next) =>{
    try {
      const stats = await invoiceService.getDashboardStats();
      
      res.json({
        success: true,
        message: 'Dashboard statistics fetched successfully',
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

module.exports = {
    createInvoice,
    getAllInvoices,
    getInvoiceById,
    updateInvoice,
    getInvoicesByVehicle,
    getRenewalReminders,
    getDashboardStats
};