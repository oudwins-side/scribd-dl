const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');
require('dotenv').config({ path: path.resolve(__dirname, 'config.env') });
const downloader = require('./helpers/downloader');
// helpers
const delay = require('./helpers/delay');
const loadJson = require('./helpers/loadJson');
const waitForNetworkIdle = require('./puppeteer_helpers/networkIdle');
const handleReqIntercept = require('./puppeteer_helpers/handleReqIntercept');
// Steps
const scridbLogin = require('./puppeteer_helpers/scribdLogin');
const scribdLogin = require('./puppeteer_helpers/scribdLogin');
const { promises } = require('dns');
const networkIdle = require('./puppeteer_helpers/networkIdle');

const baseURL = 'https://www.scribd.com';
const downloadURL = path.resolve(__dirname, 'downloads');

(async () => {
	const downloads = await loadJson(__dirname, 'scribd_urls.json');
	// ! Puppeteer start
	const browser = await puppeteer.launch({
		headless: false,
		ignoreDefaultArgs: ['--enable-automation'],
	});
	const page = await browser.newPage();
	// Page settings
	await page.setViewport({
		width: 1920,
		height: 1080,
		deviceScaleFactor: 1,
	});
	// Configure the navigation timeout
	await page.setDefaultNavigationTimeout(0);
	// LOGIN
	await scribdLogin(page, delay, waitForNetworkIdle);
	networkIdle(page);
	await delay({ min: 5000, variation: 5000 });

	// LOOP THROUGH AUDIOBOOKS TO DOWNLOAD
	for (const download of downloads) {
		// Message:
		console.log('------------');
		console.log(`Started gathering URLs for ${download.name}`);
		console.log('------------');
		// Code
		if (!download.url.startsWith(baseURL)) continue;
		// getting listen link
		await page.goto(download.url, { waitUntil: 'networkidle2' });
		await delay({ min: 5000, variation: 5000 });
		let listenURL = await page.$eval('.main_actions .start_reading_btn', (el) =>
			el.getAttribute('href')
		);
		// Count (n of clips of audiobook)
		let count = 0;
		// Here we will store the download URLs for the files.
		const urls = [];
		let tempUrls = [];
		// Starting request interceptions
		await page.setRequestInterception(true);
		// used to break out of loop
		let is_disabled = null;
		do {
			is_disabled = (await page.$('.control_disabled')) !== null;
			// loop through down action until '.control_disabled' returns not null
			// need to select '.icon-ic_audiobook_forward'
			page.on('request', handleReqIntercept(count, tempUrls));
			// first call
			if (listenURL) {
				await page.goto(listenURL, { waitUntil: 'networkidle2' });
				listenURL = null;
			} else if (!is_disabled) {
				await page.click('.icon-ic_audiobook_forward');
			} else {
				await waitForNetworkIdle(page);
				await delay({ min: 15000, variation: 5000 });
				urls.push([...tempUrls]);
				page.removeAllListeners('request');
				break;
			}
			await waitForNetworkIdle(page);
			await delay({ min: 15000, variation: 5000 });
			urls.push([...tempUrls]);
			tempUrls = [];
			page.removeAllListeners('request');
			count += 1;
			console.log(`Part ${count}...`);
		} while (!is_disabled);
		// Message:
		console.log('------------');
		console.log(`Finished gathering URLs for ${download.name}`);
		// end message
		await waitForNetworkIdle(page);
		await delay({ min: 5000, variation: 5000 });
		try {
			for (const [i, urlsToDl] of urls.entries()) {
				for (const url of urlsToDl) {
					await downloader.download({
						url,
						fileName: i,
						pathToFile: path.resolve(downloadURL, download.name),
					});
				}
			}
		} catch (e) {
			console.log(e);
		}
		// log finished downloading
		console.log('------------');
		console.log(`Finished downloading ${download.name}`);
		await page.setRequestInterception(false);
	}

	await browser.close();
})();
