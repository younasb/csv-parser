import { getAppConfig } from '@/helper/config';

const config = getAppConfig();

interface ApiResponseType {
	message: string;
}

export class CsvServices {
	private apiUrl: string = config.api.url;

	public csvUpload = async (formData: FormData) => {
		const response = await fetch(this.apiUrl + '/csv-upload', {
			method: 'POST',
			body: formData
		});

		const data: ApiResponseType = await response.json();

		return data;
	};
}
