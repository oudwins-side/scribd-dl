const path = require('path');
const https = require('https');
const http = require('http');
const fs = require('fs');
const url = require('url');
const genNotClashingFileName = require('./utils/getNotClashingFname');

module.exports.download = function download({ url, pathToFile, fileName }) {
	return new Promise((resolve, reject) => {
		const downloadURL = new URL(url);
		// Figuring out the extension
		let extension = null;
		extension = path.basename(url).split('.')[1];
		if (!extension) return reject('Invalid URL. URL must have file extension');
		// Creating directory if it does not exist
		if (!fs.existsSync(pathToFile)) fs.mkdirSync(pathToFile);
		if (!fs.existsSync(pathToFile))
			throw 'Can only create 1 directory. Not more than one. Please do not provide path to file where more than 1 directory needs to be created';
		//Finding out what protocol to use
		const reqProtocol = 'https:' === downloadURL.protocol ? https : http;

		const req = reqProtocol.get(downloadURL.href, async (res) => {
			const fullPath = await genNotClashingFileName(
				pathToFile,
				fileName,
				'.' + extension
			);
			const fileStream = fs.createWriteStream(fullPath);
			res.pipe(fileStream);

			// Handle Stream Error
			fileStream.on('error', (err) => {
				reject({
					message: `Error wrtting to stream on file ${fileName} for url ${downloadURL.href}`,
					error: err,
				});
			});

			// Close Stream when download finishes
			fileStream.on('finish', () => {
				fileStream.close();
				resolve();
			});
		});
		req.on('error', (err) => {
			reject({
				message: `Error processing get request to download file ${fileName} from url ${downloadURL.href}`,
				error: err,
			});
		});
	});
};
