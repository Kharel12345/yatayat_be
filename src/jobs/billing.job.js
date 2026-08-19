// const cron = require('node-cron');
// const subscriptionService = require('../services/billing/subscription.service');
// const logger = require('../config/winstonLoggerConfig');

// /**
//  * Job to mark expired subscriptions
//  * Runs daily at 1:00 AM
//  */
// const markExpiredSubscriptionsJob = cron.schedule('0 1 * * *', async () => {
//   try {
//     logger.info('Starting expired subscriptions job...');
//     const updatedCount = await subscriptionService.markExpiredSubscriptions();
//     logger.info(`Expired subscriptions job completed. Updated ${updatedCount} subscriptions.`);
//   } catch (error) {
//     logger.error(`Error in expired subscriptions job: ${error.message}`);
//   }
// }, {
//   scheduled: false, // Don't start automatically
//   timezone: 'Asia/Kathmandu' // Adjust timezone as needed
// });

// /**
//  * Job to send expiry notifications
//  * Runs daily at 9:00 AM
//  */
// const expiryNotificationJob = cron.schedule('0 9 * * *', async () => {
//   try {
//     logger.info('Starting expiry notification job...');
    
//     // Get subscriptions expiring in 7 days
//     const expiringIn7Days = await subscriptionService.getExpiringSubscriptions(7);
    
//     // Get subscriptions expiring in 1 day
//     const expiringIn1Day = await subscriptionService.getExpiringSubscriptions(1);
    
//     // Here you can implement notification logic (email, SMS, etc.)
//     logger.info(`Found ${expiringIn7Days.length} subscriptions expiring in 7 days`);
//     logger.info(`Found ${expiringIn1Day.length} subscriptions expiring in 1 day`);
    
//     // TODO: Implement actual notification sending
//     // - Send email notifications
//     // - Send SMS notifications
//     // - Create in-app notifications
    
//     logger.info('Expiry notification job completed.');
//   } catch (error) {
//     logger.error(`Error in expiry notification job: ${error.message}`);
//   }
// }, {
//   scheduled: false,
//   timezone: 'Asia/Kathmandu'
// });

// /**
//  * Job to generate billing cycles for auto-renewal subscriptions
//  * Runs daily at 2:00 AM
//  */
// const autoRenewalJob = cron.schedule('0 2 * * *', async () => {
//   try {
//     logger.info('Starting auto-renewal job...');
    
//     // Get subscriptions that are set for auto-renewal and expiring today
//     const autoRenewableSubscriptions = await subscriptionService.getExpiringSubscriptions(0);
//     const autoRenewals = autoRenewableSubscriptions.filter(sub => sub.auto_renewal);
    
//     let renewedCount = 0;
//     for (const subscription of autoRenewals) {
//       try {
//         await subscriptionService.renewSubscription(subscription.id, {
//           updated_by: 1, // System user ID
//         });
//         renewedCount++;
//         logger.info(`Auto-renewed subscription ${subscription.id} for vehicle ${subscription.vehicle.vehicleNo}`);
//       } catch (error) {
//         logger.error(`Failed to auto-renew subscription ${subscription.id}: ${error.message}`);
//       }
//     }
    
//     logger.info(`Auto-renewal job completed. Renewed ${renewedCount} subscriptions.`);
//   } catch (error) {
//     logger.error(`Error in auto-renewal job: ${error.message}`);
//   }
// }, {
//   scheduled: false,
//   timezone: 'Asia/Kathmandu'
// });

// /**
//  * Start all billing jobs
//  */
// const startBillingJobs = () => {
//   logger.info('Starting billing scheduled jobs...');
  
//   markExpiredSubscriptionsJob.start();
//   expiryNotificationJob.start();
//   autoRenewalJob.start();
  
//   logger.info('All billing jobs started successfully.');
// };

// /**
//  * Stop all billing jobs
//  */
// const stopBillingJobs = () => {
//   logger.info('Stopping billing scheduled jobs...');
  
//   markExpiredSubscriptionsJob.stop();
//   expiryNotificationJob.stop();
//   autoRenewalJob.stop();
  
//   logger.info('All billing jobs stopped.');
// };

// module.exports = {
//   startBillingJobs,
//   stopBillingJobs,
//   markExpiredSubscriptionsJob,
//   expiryNotificationJob,
//   autoRenewalJob,
// };