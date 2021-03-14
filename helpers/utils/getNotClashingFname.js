const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

module.exports = async function getNotClashing(
	pathToFile,
	fileName,
	extension
) {
	// Count number of tries
	let counter = 0;
	let testFullPath = '';
	let stringToAdd = '';
	let testing = true;
	const stat = promisify(fs.stat);
	while (testing) {
		testFullPath = path.resolve(pathToFile, fileName + stringToAdd + extension);

		try {
			const stats = await stat(testFullPath);
			if (counter >= 10) testing = false;
			stringToAdd = stringToAdd + '-copy';
			counter += 1;
		} catch (e) {
			testing = false;
		}
	}
	if (counter >= 5) throw 'TOO MANY FILES WITH SAME NAME';
	return testFullPath;
};
