import { getAppConfig } from '@/helper/config';
import { apiRequest } from './http.services';
import { CsvParserResponse } from '@/types';

const config = getAppConfig();

interface ApiResponseType {
	message: string;
}

export class CsvServices {
	private apiUrl: string = config.api.url;

	public csvUpload = async (formData: FormData) => {
		return apiRequest<ApiResponseType>(this.apiUrl + '/csv-upload', 'POST', formData);
	};
	public csvParse = async (originalname: string) => {
		return apiRequest<CsvParserResponse>(`${this.apiUrl}/csv-parser?originalname=${originalname}`, 'GET');
	};
	public csvDownload = async (fileName: string) => {
		return apiRequest<CsvParserResponse>(`${this.apiUrl}/download/${fileName}`, 'GET');
	};
}
