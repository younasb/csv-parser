import { Router } from 'express';
import { CsvController } from '../ controllers/csv.controller';
import multer from 'multer';
import { asyncHandler } from '../middlewares/async-handler.middleware';

export class AppRoutes {
	static get routes(): Router {
		const router = Router();
		const storage = multer.memoryStorage();
		const upload = multer({ storage });

		const controller = new CsvController();

		router.post('/csv-upload', upload.single('file'), asyncHandler(controller.csvUpload));
		router.get('/csv-parser', asyncHandler(controller.csvParser));
		router.get('/download/:filename', controller.csvDownload);

		return router;
	}
}
