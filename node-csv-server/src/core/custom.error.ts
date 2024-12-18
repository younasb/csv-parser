import { HttpCode } from './constants';
import { type ValidationType } from './types';

interface AppErrorArgs {
	name?: string;
	errorCode?: string;
	statusCode: HttpCode;
	message: string;
	isOperational?: boolean;
	validationErrors?: ValidationType[];
}

export class AppError extends Error {
	public readonly name: string;
	public readonly statusCode: HttpCode;
	public readonly errorCode?: string;
	public readonly isOperational: boolean = true;
	public readonly validationErrors?: ValidationType[];

	constructor(args: AppErrorArgs) {
		const { message, name, statusCode, isOperational, validationErrors, errorCode } = args;
		super(message);
		Object.setPrototypeOf(this, new.target.prototype);
		this.name = name ?? 'Application Error';
		this.statusCode = statusCode;
		this.errorCode = errorCode;
		if (isOperational !== undefined) this.isOperational = isOperational;
		this.validationErrors = validationErrors;
		Error.captureStackTrace(this);
	}

	static badRequest(message: string, errorCode?: string, validationErrors?: ValidationType[]): AppError {
		return new AppError({
			name: 'BadRequestError',
			message,
			statusCode: HttpCode.BAD_REQUEST,
			validationErrors,
			errorCode
		});
	}

	static forbidden(message: string): AppError {
		return new AppError({ name: 'ForbiddenError', message, statusCode: HttpCode.FORBIDDEN });
	}

	static notFound(message: string): AppError {
		return new AppError({ name: 'NotFoundError', message, statusCode: HttpCode.NOT_FOUND });
	}

	static internalServer(message: string, errorCode?: string): AppError {
		return new AppError({
			name: 'InternalServerError',
			message,
			statusCode: HttpCode.INTERNAL_SERVER_ERROR,
			errorCode
		});
	}
}
