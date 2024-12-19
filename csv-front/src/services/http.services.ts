import { getAppConfig } from '@/helper/config';
import axios, { AxiosResponse } from 'axios';

const config = getAppConfig();

const apiClient = axios.create({
	baseURL: config.api.url
});

export const apiRequest = async <T>(
	url: string,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE',
	data?: unknown
): Promise<T> => {
	const response: AxiosResponse<T> = await apiClient({
		method,
		url,
		data
	});

	return response.data;
};
