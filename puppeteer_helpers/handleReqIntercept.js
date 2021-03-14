module.exports = (count, urls) => {
	return (interceptedRequest) => {
		if (
			interceptedRequest.resourceType() === 'media' &&
			interceptedRequest.url().endsWith('.mp3')
		) {
			urls.push(interceptedRequest.url());
		}
		interceptedRequest.continue();
	};
};
