const path = require('path');
const https = require('https');
const http = require('http');
const fs = require('fs');
const url = require('url');

function download({ url, filePath, fileName }) {
	return new Promise((resolve, reject) => {
		const downloadURL = new URL(url);
		const extension = '.' + path.basename(url).split('.')[1];
		const reqProtocol = 'https:' === downloadURL.protocol ? https : http;

		const req = reqProtocol.get(downloadURL.href, (res) => {
			const fileStream = fs.createWriteStream(
				path.resolve(filePath, fileName + extension)
			);
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
}

(async () => {
	await download({
		url: 'https://images.pexels.com/photos/5624248/pexels-photo-5624248.jpeg',
		filePath: path.resolve(__dirname, '..'),
		fileName: 'image',
	});
	console.log('done');
})();
