// use sendTemplatedSMS(contactNumber, type, data) to send sms
// type: 'invoice' | 'cash_invoice' | 'receipt'

const MessageSetting = require("../../../models/master/message_setting.model");
const { renderTemplate } = require("../../utils/renderTemplete");

const sendSMS = async (to, message) => {
  if (!to || typeof to !== "string" || !to.trim()) {
    throw new Error("sendSMS: 'to' (recipient phone number) is required");
  }
  if (!message || typeof message !== "string" || !message.trim()) {
    throw new Error("sendSMS: 'message' is required");
  }
  if (!process.env.MESSAGE_API) {
    throw new Error("sendSMS: MESSAGE_API is not configured in environment");
  }
  if (!process.env.SMS_API_KEY) {
    throw new Error("sendSMS: SMS_API_KEY is not configured in environment");
  }

  try {
    const response = await fetch(process.env.MESSAGE_API, {
      method: "POST",
      headers: {
        "X-API-Key": process.env.SMS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to: to.trim(), message: message.trim() }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || JSON.stringify(data));
    }
    return data;
  } catch (err) {
    console.error("SMS Error:", err.message);
    throw err;
  }
};

// fetches the active template for a given type, renders it, then sends
const sendTemplatedSMS = async (to, type, data) => {
  if (!type || typeof type !== "string" || !type.trim()) {
    throw new Error("sendTemplatedSMS: 'type' is required (e.g. 'invoice', 'cash_invoice', 'receipt')");
  }
  if (!data || typeof data !== "object") {
    throw new Error("sendTemplatedSMS: 'data' object is required to render the message template");
  }

  const setting = await MessageSetting.findOne({
    where: { status: 1, message_setting_type: type },
    order: [["id", "DESC"]],
  });

  if (!setting) {
    console.warn(`No active message_setting found for type "${type}"; skipping SMS`);
    return null;
  }

  const message = renderTemplate(setting.message, data);

  // --- TEST MODE: preview only, no real SMS sent yet ---
  console.log(`=== SMS PREVIEW (${type}) — API call disabled ===`);
  console.log("To:", to);
  console.log("Template used:", setting.message);
  console.log("Data passed:", data);
  console.log("Rendered message:", message);
  console.log("==================================================");

  // return sendSMS(to, message); // uncomment once API key/format is confirmed
  return null; //uncomment
};

module.exports = { sendSMS, sendTemplatedSMS };