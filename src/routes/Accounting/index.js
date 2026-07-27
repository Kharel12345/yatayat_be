const ledgerRoutes = require('./ledger.route')
const invoiceRoutes =   require('./invoice.route')
const cashInvoiceRoutes = require('./cashInvoice.route')
const receiptRoutes = require('./receipt.route')
const cashReceiptRoutes = require('./cashReceipt.route')

module.exports = {
    ledgerRoutes,
    invoiceRoutes,
    cashInvoiceRoutes,
    receiptRoutes,
    cashReceiptRoutes,
}