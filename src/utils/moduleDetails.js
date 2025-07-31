const modules = {
    functional_year: [
    "create_functional_year",
    "update_functional_year",
    "view_functional_year",
    "viewall_functional_year",
    "delete_functional_year",
    "allow_backdate_entry_functional_year",
  ],
  branch: [
    "create_branch",
    "update_branch",
    "view_branch",
    "viewall_branch",
    "delete_branch",
    "allow_backdate_entry_branch",
  ],
  department: [
    "create_department",
    "update_department",
    "view_department",
    "viewall_department",
    "delete_department",
    "allow_backdate_entry_department",
  ],
  sms_setting_info: [
    "create_sms_setting_info",
    "view_sms_setting_info",
    "update_sms_setting_info"
  ],
  vehicle: [
    "create_vehicle",
    "renew_vehicle",
    "view_due_vehicle"
  ],
};

module.exports = {
  modules,
};
