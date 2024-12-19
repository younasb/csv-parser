import express, { type Router, type Request, type Response } from 'express';
import compression from 'compression';

import { HttpCode } from './core/constants';
import { ErrorMiddleware } from './middlewares/error.middleware';

interface ServerOptions {
	port: number;
	routes: Router;
	apiPrefix: string;
}

export class Server {
	private readonly app = express();
	private readonly port: number;
	private readonly routes: Router;
	private readonly apiPrefix: string;

	constructor(options: ServerOptions) {
		const { port, routes, apiPrefix } = options;
		this.port = port;
		this.routes = routes;
		this.apiPrefix = apiPrefix;
	}

	async start(): Promise<void> {
		//* Middlewares
		this.app.use(express.json()); // parse json in request body (allow raw)
		this.app.use(express.urlencoded({ extended: false }));
		this.app.use(compression());

		// CORS
		this.app.use((req, res, next) => {
			const allowedOrigins = ['http://localhost:3000'];
			const origin = req.headers.origin;
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			if (allowedOrigins.includes(origin!)) {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				res.setHeader('Access-Control-Allow-Origin', origin!);
			}
			res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
			next();
		});

		this.routes.use(ErrorMiddleware.handleError);

		// Routes
		this.app.use(this.apiPrefix, this.routes);

		// Test rest api
		this.app.get('/', (_req: Request, res: Response) => {
			return res.status(HttpCode.OK).send({
				message: 'Welcome to CSV API!'
			});
		});

		this.app.listen(this.port, () => {
			console.log(`Server running on port ${this.port}...`);
		});
	}
}
