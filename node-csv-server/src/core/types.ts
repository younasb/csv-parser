export interface ValidationType {
	constraint: string;
}

export interface SuccessResponse<T> {
	data?: T;
}

export interface ErrorResponse {
	name: string;
	message: string;
	validationErrors?: ValidationType[];
	stack?: string;
	errorCode?: string;
}

export interface UserData {
	uid: string;
	firstName: string;
	lastName: string;
	gender: 'female' | 'male';
	date: string;
	randomString1: string;
	randomString2: string;
	randomString3: string;
	randomString4: string;
	randomString5: string;
	randomString6: string;
	randomString7: string;
}
