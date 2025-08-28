// const cron = require('node-cron');
// const vehicleSubscriptionService = require('../services/billing/vehicle_subscription.service');
// const logger = require('../config/winstonLoggerConfig');

// class SubscriptionTasks {
//   /**
//    * Initialize all scheduled tasks
//    */
//   static initializeTasks() {
//     // Run daily at 6:00 AM to mark expired subscriptions
//     cron.schedule('0 6 * * *', async () => {
//       try {
//         logger.info('Running daily subscription expiry check...');
//         const updatedCount = await vehicleSubscriptionService.markExpiredSubscriptions();
//         logger.info(`Daily expiry check completed. Marked ${updatedCount} subscriptions as expired.`);
//       } catch (error) {
//         logger.error(`Error in daily expiry check: ${error.message}`);
//       }
//     });

//     // Run weekly on Monday at 9:00 AM to send expiry notifications
//     cron.schedule('0 9 * * 1', async () => {
//       try {
//         logger.info('Running weekly expiry notification check...');
//         const expiringSubscriptions = await vehicleSubscriptionService.getExpiringSubscriptions(7);
        
//         if (expiringSubscriptions.length > 0) {
//           logger.info(`Found ${expiringSubscriptions.length} subscriptions expiring in the next 7 days`);
//           // Here you can add email/SMS notification logic
//           // await notificationService.sendExpiryNotifications(expiringSubscriptions);
//         }
//       } catch (error) {
//         logger.error(`Error in weekly expiry notification check: ${error.message}`);
//       }
//     });

//     // Run monthly on the 1st at 8:00 AM for auto-renewals
//     cron.schedule('0 8 1 * *', async () => {
//       try {
//         logger.info('Running monthly auto-renewal check...');
//         // This would be implemented based on your auto-renewal logic
//         // const autoRenewals = await vehicleSubscriptionService.processAutoRenewals();
//         logger.info('Monthly auto-renewal check completed');
//       } catch (error) {
//         logger.error(`Error in monthly auto-renewal check: ${error.message}`);
//       }
//     });

//     logger.info('Subscription scheduled tasks initialized');
//   }

//   /**
//    * Manual task to mark expired subscriptions
//    */
//   static async markExpiredSubscriptions() {
//     try {
//       const updatedCount = await vehicleSubscriptionService.markExpiredSubscriptions();
//       logger.info(`Manual expiry check completed. Marked ${updatedCount} subscriptions as expired.`);
//       return updatedCount;
//     } catch (error) {
//       logger.error(`Error in manual expiry check: ${error.message}`);
//       throw error;
//     }
//   }

//   /**
//    * Manual task to get expiring subscriptions
//    */
//   static async getExpiringSubscriptions(daysAhead = 7) {
//     try {
//       const expiringSubscriptions = await vehicleSubscriptionService.getExpiringSubscriptions(daysAhead);
//       logger.info(`Found ${expiringSubscriptions.length} subscriptions expiring in the next ${daysAhead} days`);
//       return expiringSubscriptions;
//     } catch (error) {
//       logger.error(`Error getting expiring subscriptions: ${error.message}`);
//       throw error;
//     }
//   }
// }

// module.exports = SubscriptionTasks;