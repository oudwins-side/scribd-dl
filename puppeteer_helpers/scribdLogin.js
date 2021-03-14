module.exports = async (page, delay, waitForNetworkIdle) => {
	const url = 'https://www.scribd.com/';
	// !Loggin in
	await page.goto(url, { waitUntil: 'networkidle2' });
	await delay();
	// Login popup
	await page.click('.header_login_btn');
	await delay();
	// Login with email
	await page.click('a[data-e2e="email-button"]');
	await delay();
	// fill credentials SOMETHING HERE NOT WORKING

	await page.type('#login_or_email', process.env.SCRIBD_USERNAME, {
		delay: 50,
	});
	await delay({ min: 100, variation: 700 });
	await page.type('#login_password', process.env.SCRIBD_PASSWORD, {
		delay: 45,
	});
	await page.click('button[type="submit"]');
	await waitForNetworkIdle(page);
	await delay({ min: 500, variation: 900 });
};
