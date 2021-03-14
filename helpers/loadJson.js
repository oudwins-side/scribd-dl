const fs = require('fs/promises');
const path = require('path');

module.exports = async (directory, fileName) => {
	const obj = JSON.parse(
		await fs.readFile(path.resolve(directory, fileName), {
			encoding: 'utf-8',
		})
	);
	return obj;
};
