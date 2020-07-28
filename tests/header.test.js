const Page = require('./helpers/page');

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto('http://localhost:3000');
});

afterEach(async () => {
  await page.close();
});

test('the header has the correct text', async () => {
  await page.waitFor('a.brand-logo');
  const text = await page.getContentOf('a.brand-logo');
  expect(text).toEqual('Blogster');
});

test('clicking login starts oauth flow', async () => {
  await page.click('.right a');
  const url = await page.url();
  expect(url).toContain('accounts.google.com');
});

test.only('you can login into the page', async () => {
  await page.login();
  const text = await page.getContentOf('a[href="/auth/logout"]');
  expect(text).toEqual('Logout');
});