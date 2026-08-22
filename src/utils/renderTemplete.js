// utils/renderTemplete.js
const renderTemplate = (template, data) => {
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    data[key] !== undefined && data[key] !== null ? data[key] : match
  );
};

module.exports = { renderTemplate };