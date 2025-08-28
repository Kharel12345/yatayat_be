const request = require('supertest');
const app = require('../src/app');
const { Subscription, Payment, BillingCycle } = require('../models/billing');

describe('Billing System API', () => {
  let authToken;
  let testVehicleId = 1;
  let testBillingTitleId = 1;
  let testSubscriptionId;
  let testPaymentId;

  beforeAll(async () => {
    // Login to get auth token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    authToken = loginResponse.body.token;
  });

  describe('Subscription Management', () => {
    test('Create monthly subscription', async () => {
      const subscriptionData = {
        vehicle_id: testVehicleId,
        billing_title_id: testBillingTitleId,
        subscription_type: 'monthly',
        start_date: '2025-01-01',
        auto_renewal: true
      };

      const response = await request(app)
        .post('/api/billing/subscriptions')
        .set('Authorization', `Bearer ${authToken}`)
        .send(subscriptionData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.subscription_type).toBe('monthly');
      expect(response.body.data.status).toBe('active');
      
      testSubscriptionId = response.body.data.id;
    });

    test('Create yearly subscription', async () => {
      const subscriptionData = {
        vehicle_id: testVehicleId + 1,
        billing_title_id: testBillingTitleId,
        subscription_type: 'yearly',
        start_date: '2025-01-01',
        auto_renewal: false
      };

      const response = await request(app)
        .post('/api/billing/subscriptions')
        .set('Authorization', `Bearer ${authToken}`)
        .send(subscriptionData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.subscription_type).toBe('yearly');
    });

    test('Get subscriptions with pagination', async () => {
      const response = await request(app)
        .get('/api/billing/subscriptions?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('total');
      expect(response.body.data).toHaveProperty('subscriptions');
      expect(Array.isArray(response.body.data.subscriptions)).toBe(true);
    });

    test('Get expiring subscriptions', async () => {
      const response = await request(app)
        .get('/api/billing/subscriptions/expiring/list?days_ahead=30')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('Update subscription status', async () => {
      const response = await request(app)
        .patch(`/api/billing/subscriptions/${testSubscriptionId}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'cancelled' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('cancelled');
    });

    test('Renew subscription', async () => {
      // First, set status back to active
      await request(app)
        .patch(`/api/billing/subscriptions/${testSubscriptionId}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'active' });

      const response = await request(app)
        .post(`/api/billing/subscriptions/${testSubscriptionId}/renew`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('Payment Management', () => {
    test('Create payment for subscription', async () => {
      const paymentData = {
        subscription_id: testSubscriptionId,
        vehicle_id: testVehicleId,
        amount: 500.00,
        payment_method: 'cash',
        payment_date: '2025-01-01T10:00:00.000Z',
        notes: 'Test payment'
      };

      const response = await request(app)
        .post('/api/billing/payments')
        .set('Authorization', `Bearer ${authToken}`)
        .send(paymentData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.amount).toBe('500.00');
      expect(response.body.data.payment_method).toBe('cash');
      expect(response.body.data).toHaveProperty('payment_reference');
      
      testPaymentId = response.body.data.id;
    });

    test('Create online payment with transaction ID', async () => {
      const paymentData = {
        subscription_id: testSubscriptionId,
        vehicle_id: testVehicleId,
        amount: 1000.00,
        payment_method: 'online',
        transaction_id: 'TXN123456789',
        notes: 'Online payment test'
      };

      const response = await request(app)
        .post('/api/billing/payments')
        .set('Authorization', `Bearer ${authToken}`)
        .send(paymentData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.payment_method).toBe('online');
      expect(response.body.data.transaction_id).toBe('TXN123456789');
    });

    test('Get payments with filters', async () => {
      const response = await request(app)
        .get('/api/billing/payments?payment_method=cash&page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('payments');
      expect(Array.isArray(response.body.data.payments)).toBe(true);
    });

    test('Get payment by reference', async () => {
      // First get a payment to get its reference
      const paymentsResponse = await request(app)
        .get('/api/billing/payments?limit=1')
        .set('Authorization', `Bearer ${authToken}`);

      const paymentReference = paymentsResponse.body.data.payments[0].payment_reference;

      const response = await request(app)
        .get(`/api/billing/payments/reference/${paymentReference}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.payment_reference).toBe(paymentReference);
    });

    test('Update payment status', async () => {
      const response = await request(app)
        .patch(`/api/billing/payments/${testPaymentId}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ 
          status: 'completed',
          transaction_id: 'UPDATED_TXN123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.payment_status).toBe('completed');
    });

    test('Get payment statistics', async () => {
      const response = await request(app)
        .get('/api/billing/payments/statistics')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('Reports', () => {
    test('Get income report by billing title', async () => {
      const response = await request(app)
        .get('/api/billing/reports/income?group_by=monthly&date_from=2025-01-01&date_to=2025-12-31')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('Get daily income report', async () => {
      const response = await request(app)
        .get('/api/billing/reports/income?group_by=daily&date_from=2025-01-01&date_to=2025-01-31')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('Get expiry report', async () => {
      const response = await request(app)
        .get('/api/billing/reports/expiry?days_ahead=30')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('summary');
      expect(response.body.data).toHaveProperty('details');
      expect(response.body.data.summary).toHaveProperty('total_expired');
      expect(response.body.data.summary).toHaveProperty('expiring_this_week');
    });

    test('Get billing cycle report', async () => {
      const response = await request(app)
        .get('/api/billing/reports/billing-cycles')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('statistics');
      expect(response.body.data).toHaveProperty('billing_cycles');
    });

    test('Get financial dashboard', async () => {
      const response = await request(app)
        .get('/api/billing/reports/dashboard?date_from=2025-01-01&date_to=2025-01-31')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('income_summary');
      expect(response.body.data).toHaveProperty('expiry_summary');
      expect(response.body.data).toHaveProperty('billing_cycle_summary');
      expect(response.body.data).toHaveProperty('payment_method_stats');
    });
  });

  describe('Validation Tests', () => {
    test('Create subscription with invalid data', async () => {
      const invalidData = {
        vehicle_id: 'invalid',
        billing_title_id: 1,
        subscription_type: 'invalid_type',
        start_date: 'invalid_date'
      };

      const response = await request(app)
        .post('/api/billing/subscriptions')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('errors');
    });

    test('Create payment with invalid data', async () => {
      const invalidData = {
        vehicle_id: 'invalid',
        amount: -100,
        payment_method: 'invalid_method'
      };

      const response = await request(app)
        .post('/api/billing/payments')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('Error Handling', () => {
    test('Get non-existent subscription', async () => {
      const response = await request(app)
        .get('/api/billing/subscriptions/99999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    test('Get payment with non-existent reference', async () => {
      const response = await request(app)
        .get('/api/billing/payments/reference/NONEXISTENT')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    test('Unauthorized access', async () => {
      const response = await request(app)
        .get('/api/billing/subscriptions');

      expect(response.status).toBe(401);
    });
  });
});

// Helper function to clean up test data
afterAll(async () => {
  // Clean up test data
  await BillingCycle.destroy({ where: { created_by: 1 } });
  await Payment.destroy({ where: { created_by: 1 } });
  await Subscription.destroy({ where: { created_by: 1 } });
});