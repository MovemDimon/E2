/// <reference types="cypress" />

describe('Full front‑to‑back flow', () => {
  before(() => {
    // فرض: npm start صفحه شما را در localhost:3000 لود می‌کند
    cy.visit('/');
  });

  it('loads initial stats and coin button', () => {
    // بررسی وجود DOM اولیه
    cy.get('#coin').should('exist');
    cy.get('h1').invoke('text').should('match', /^\d+$/);
  });

  it('increments coin count and sends backend request', () => {
    // آماده‌سازی یک mock برای endpoint پرداخت
    cy.intercept('POST', '/data', (req) => {
      // لاگ دقیق بدنهٔ درخواست
      cy.log('REQUEST BODY:', JSON.stringify(req.body));
      // تست می‌کنیم که JSON درست ارسال شده
      expect(req.body).to.have.property('type', 'payment');
      expect(req.body.data).to.include.all.keys('userId','coins','usdPrice');
      // برمی‌گردانیم یک پاسخ موفق
      req.reply({
        statusCode: 200,
        body: { success: true, type: 'payment' }
      });
    }).as('postData');

    // شبیه‌سازی کلیک روی سکه
    cy.get('#coin').click();

    // منتظرِ XHR بمان و لاگ دقیق بگیر
    cy.wait('@postData').then(({ response }) => {
      cy.log('RESPONSE:', JSON.stringify(response.body));
      expect(response.body.success).to.be.true;
    });

    // حالا DOM یا localStorage را بررسی کن که به‌درستی آپدیت شده
    cy.get('#balance').invoke('text').then(txt => {
      const bal = parseInt(txt.replace(/,/g,''), 10);
      expect(bal).to.be.greaterThan(0);
      cy.log('New balance:', bal);
    });
  });
});
