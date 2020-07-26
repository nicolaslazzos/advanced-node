const mongoose = require('mongoose');
const puppeteer = require('puppeteer');
const sessionFactory = require('./factories/sessionFactory');
const userFactory = require('./factories/userFactory');

let browser, page;

beforeEach(async () => {
  browser = await puppeteer.launch({ headless: false });
  const pages = await browser.pages();
  page = pages[0];

  await page.goto('localhost:3000');
});

afterEach(async () => {
  await browser.close();
});

afterAll(async () => {
  await mongoose.disconnect();
});

test('the header has the correct text', async () => {
  await page.waitFor('a.brand-logo');
  const text = await page.$eval('a.brand-logo', el => el.innerHTML);
  expect(text).toEqual('Blogster');
});

test('clicking login starts oauth flow', async () => {
  await page.click('.right a');
  const url = await page.url();
  expect(url).toMatch(/accounts\.google\.com/);
});

test('when signed in, show logout button', async () => {
  const user = await userFactory();
  const { session, sig } = sessionFactory(user);

  await page.setCookie({ name: 'session', value: session });
  await page.setCookie({ name: 'session.sig', value: sig });

  await page.goto('localhost:3000');
  await page.waitFor('a[href="/auth/logout"]');

  const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);
  expect(text).toEqual('Logout');
});
