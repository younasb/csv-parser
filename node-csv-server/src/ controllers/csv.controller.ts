import { type NextFunction, type Request, type Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { AppError } from '../core/custom.error';
import { HttpCode } from '../core/constants';
import csvtojson from 'csvtojson';
import { type UserData } from '../core/types';
import { Parser } from '@json2csv/plainjs';
import archiver from 'archiver';

interface UploadBody {
	chunkNumber: string;
	totalChunks: string;
	originalname: string;
}
interface RequestQuery {
	originalname?: string;
}

export class CsvController {
	readonly downloadFolderName = 'files-storage/download';
	readonly chunkDir: string = path.resolve(process.cwd(), 'files-storage/chunks');
	readonly mergedFilePath: string = path.resolve(process.cwd(), 'files-storage/merged');
	readonly filesDownloadPath: string = path.resolve(process.cwd(), this.downloadFolderName);

	readonly parserOpts = {};
	readonly parser = new Parser(this.parserOpts);

	public csvUpload = async (
		req: Request<unknown, unknown, UploadBody>,
		res: Response<{ message: string }>,
		next: NextFunction
	): Promise<void> => {
		try {
			const fileBuffer = req.file?.buffer;
			const chunkNumber = Number(req.body.chunkNumber);
			const totalChunks = Number(req.body.totalChunks);
			const fileName = req.body.originalname;

			let successMessage = 'Chunk uploaded successfully';

			if (!fileBuffer) {
				next(AppError.badRequest('No file buffer provided', 'EMPTY_BUFFER'));
				return;
			}

			const chunkFilePath = `${this.chunkDir}/${fileName}.part_${chunkNumber}`;

			// Save the chunk to disk
			await fs.promises.writeFile(chunkFilePath, fileBuffer);
			console.log(`Chunk ${chunkNumber}/${totalChunks} saved`);

			// Merge chunks if this is the last one
			if (chunkNumber === totalChunks - 1) {
				await this.mergeChunks(fileName, totalChunks);
				console.log('File merged successfully');
				successMessage = 'File upload successfully';
			}

			res.status(HttpCode.OK).json({ message: successMessage });
		} catch (error) {
			console.error('Error processing chunk:', error);
			next(AppError.badRequest('Error processing chunk', 'UPLOAD_ERROR'));
		}
	};

	public csvParser = async (
		req: Request<unknown, unknown, unknown, RequestQuery>,
		res: Response<{ message: string; paths: Array<{ gender: 'male' | 'female'; path: string }> }>,
		next: NextFunction
	): Promise<void> => {
		const { originalname } = req.query;
		if (!originalname) {
			next(AppError.badRequest('No file name provided', 'FILE_NAME_EMPTY'));
			return;
		}
		const csvFilePath = this.mergedFilePath + '/' + originalname;
		const extname = path.extname(csvFilePath);
		const basename = path.basename(csvFilePath, extname);

		const csvMaleFilePath = `${this.filesDownloadPath}/${basename}_male.csv`;
		const csvFemaleFilePath = `${this.filesDownloadPath}/${basename}_female.csv`;
		try {
			const maleData: UserData[] = [];
			const femaleData: UserData[] = [];
			const jsonArray: UserData[] = await csvtojson().fromFile(csvFilePath);

			jsonArray.forEach((data) => {
				if (data.gender === 'male') {
					maleData.push(data);
				} else if (data.gender === 'female') {
					femaleData.push(data);
				}
			});

			const maleCsv = this.jsonToCsv(maleData);
			fs.writeFileSync(csvMaleFilePath, maleCsv);

			const femaleCsv = this.jsonToCsv(femaleData);
			fs.writeFileSync(csvFemaleFilePath, femaleCsv);

			res.status(HttpCode.OK).json({
				message: `Parser success result :${jsonArray.length}`,
				paths: [
					{
						gender: 'male',
						path: `${basename}_male.csv`
					},
					{
						gender: 'female',
						path: `${basename}_female.csv`
					}
				]
			});
		} catch (error) {
			console.log('error: ', error);
			next(AppError.badRequest('error while parsing the file', 'PARSE_ERROR'));
		}
	};

	public csvDownload = (req: Request, res: Response, next: NextFunction): void => {
		const filePath = path.join(this.filesDownloadPath, req.params.filename);
		if (fs.existsSync(filePath)) {
			const zipFileName = `${req.params.filename.split('.')[0]}.zip`;
			console.log('zipFileName: ', zipFileName);

			res.setHeader('Content-Disposition', `attachment; filename="${zipFileName}"`);
			res.setHeader('Content-Type', 'application/zip');

			const archive = archiver('zip', { zlib: { level: 9 } }); // Compression level 9 (maximum)

			archive.on('error', (err) => {
				console.error('Error while creating the ZIP archive:', err);
				next(AppError.internalServer('Error while downloading the file', 'DOWNLOAD_ERROR'));
			});

			archive.pipe(res);
			archive.file(filePath, { name: req.params.filename });
			archive.finalize();
		} else {
			next(AppError.notFound('File not found'));
		}
	};

	private async mergeChunks(fileName: string, totalChunks: number): Promise<void> {
		const chunkDir = this.chunkDir;

		if (!fs.existsSync(this.mergedFilePath)) {
			fs.mkdirSync(this.mergedFilePath);
		}

		const writeStream = fs.createWriteStream(`${this.mergedFilePath}/${fileName}`);

		for (let i = 0; i < totalChunks; i++) {
			const chunkFilePath = `${chunkDir}/${fileName}.part_${i}`;
			const chunkBuffer = await fs.promises.readFile(chunkFilePath);
			writeStream.write(chunkBuffer);
			fs.unlinkSync(chunkFilePath);
		}

		writeStream.end();
		console.log('Chunks merged successfully');
	}

	private jsonToCsv(jsonData: UserData[]): string {
		const csv = this.parser.parse(jsonData);
		return csv;
	}
}
