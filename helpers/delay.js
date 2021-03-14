module.exports = function delay({ time, min = 500, variation = 1000 } = {}) {
	time = time ? time : Math.random() * variation + min;
	return new Promise(function (resolve) {
		setTimeout(resolve, time);
	});
};
