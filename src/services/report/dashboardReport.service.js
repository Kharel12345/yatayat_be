
const { Op } = require("sequelize");
const { Vehicle } = require("../../../models/master");
const Invoice = require("../../../models/accounting/invoice.model");
const AccountingTransactionDetail = require("../../../models/accounting/accounting_transaction_detail.model");

const startOfDay = new Date();
startOfDay.setHours(0, 0, 0, 0);

const endOfDay = new Date();
endOfDay.setHours(23, 59, 59, 999);



const getDashboardReport = async () => {
    try {
        const vehicleActiveCount = await Vehicle.count({
            where: {
                status: 1
            }
        });

        const expiredVehiclesCount = await Invoice.count({
            where: {
                status: 1,
                expiry_date: {
                    [Op.lt]: new Date(),
                },
            },
            distinct: true,
            col: 'vehicle_id',
        });

        const totalAmountToday = await Invoice.sum('total_amount', {
            where: {
                status: 1,
                created_at: {
                    [Op.gte]: startOfDay,
                    [Op.lte]: endOfDay,
                },
            },
        });

        const totalCashAmount = await Invoice.sum('total_amount', {
            where: {
                status: 1,
                payment_mode: 'cash',
                created_at: {
                    [Op.gte]: startOfDay,
                    [Op.lte]: endOfDay,
                },
            },
        });

        return {
            totalActiveVehicles: vehicleActiveCount,
            totalExpiredVehicles: expiredVehiclesCount,
            totalAmountToday: totalAmountToday,
            totalCashAmount: totalCashAmount
        };


    } catch (error) {
        throw new Error("Failed to fetch ledger report");
    }
};

module.exports = {
    getDashboardReport,
};
