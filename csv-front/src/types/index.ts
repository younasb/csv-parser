export type StatusType = {
	severity: 'warning' | 'success' | 'error';
	message: string;
	title?: string;
};

export type AlertType = StatusType;

export type CsvParserResponse = {
	message: string;
	paths: Array<{ gender: 'male' | 'female'; path: string }>;
};
