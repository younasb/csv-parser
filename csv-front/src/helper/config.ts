function generateConfig() {
	return {
		api: {
			url: process.env.NEXT_PUBLIC_API_URL ?? ''
		}
	};
}

export const getAppConfig = () => {
	return generateConfig();
};
