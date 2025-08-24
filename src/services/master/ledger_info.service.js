const getLedgerForPatientAdmission = async () => {

  const query = `
      SELECT ledger_group_name, id FROM accounting_ledgergroup WHERE ledger_group_name = 'Account Payable'
    `
  const ledgerInfo = await con.query(query)

  return ledgerInfo[0]

}

    // const masterLedgerId = await LedgerInfo.getLedgerForPatientAdmission()

    // const master_ledger_group_id = masterLedgerId[0].id
