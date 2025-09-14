const accounting_transaction_detailModel = require("../../../models/accounting/accounting_transaction_detail.model");
const LedgerInfo = require("../../../models/accounting/ledger.model");
const AccountingLedgerGroup = require("../../../models/accounting/ledgergroup.model");
const { Op } = require("sequelize");

const getIndividualLedgerReport = async (fromDate, toDate, ledgerId) => {
  try {

    // Fetch transactions with relations
    const transactions = await accounting_transaction_detailModel.findAll({
      where: {
        status: 1,
        // ledger_id: ledgerId,
        ...(ledgerId && { ledger_id: ledgerId }),
        voucher_date_bs: { [Op.between]: [fromDate, toDate] },
      },
      include: [
        {
          model: LedgerInfo,
          as: "ledger",
          attributes: ["ledgername", "ledger_type"],
          include: [
            {
              model: AccountingLedgerGroup,
              as: "ledgerGroup",
              attributes: ["ledger_group_name", "formula"],
            },
          ],
        },
      ],
      order: [
        ["voucher_date_bs", "ASC"],
        ["id", "ASC"],
      ],
      raw: true,
      nest: true,
    });

    // Compute running balance in JavaScript
    let runningBalance = 0;
    const result = transactions.map((txn) => {
      const credit = parseFloat(txn.credit) || 0;
      const debit = parseFloat(txn.debit) || 0;
      const formula = txn.ledger.ledgerGroup.formula;

      // Calculate balance update
      runningBalance +=
        formula === "credit-debit" ? credit - debit : debit - credit;

      return {
        credit,
        debit,
        voucher_date_bs: txn.voucher_date_bs,
        functional_year_id: txn.functional_year_id,
        voucher: txn.voucher_number,
        ledgername: txn.ledger.ledgername,
        ledger_type: txn.ledger.ledger_type,
        ledger_group_name: txn.ledger.ledgerGroup.ledger_group_name,
        formula,
        balance: runningBalance,
      };
    });

    return result;
  } catch (error) {
    console.error("Error fetching ledger report:", error);
    throw new Error("Failed to fetch ledger report");
  }
};

module.exports = {
  getIndividualLedgerReport,
};
