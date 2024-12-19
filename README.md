# CSV PARSER Project

This project  is split into two folders: `csv-front` (frontend) and `node-csv-server` (backend). Below are the instructions to set up, run, and build the project for both parts.

---

## Backend: `node-csv-server`

### Prerequisites
- [Node.js](https://nodejs.org/) installed (v20 or higher recommended).

### Steps to Run the Backend

1. **Navigate to the Backend Folder**
   ```bash
   cd node-csv-server
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Development Server**
   ```bash
   npm run dev
   ```
   - This will start the server with `ts-node-dev` for hot-reloading during development.

4. **Build for Production**
   ```bash
   npm run build
   ```
   - This compiles TypeScript to JavaScript and outputs files to the `dist` folder.

5. **Run in Production**
   ```bash
   npm start
   ```
   - This runs the server using the compiled files from the `dist` folder.

### Scripts Overview
- **`dev`**: Starts the server in development mode with hot-reloading.
- **`build`**: Cleans the `dist` folder and compiles TypeScript files.
- **`start`**: Starts the server in production mode.

---

## Frontend: `csv-front`

### Prerequisites
- [Node.js](https://nodejs.org/) installed (v20 or higher recommended).
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/).

### Steps to Run the Frontend

1. **Navigate to the Frontend Folder**
   ```bash
   cd csv-front
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Development Server**
   ```bash
   npm run dev
   ```
   - This will start the Next.js development server.

4. **Build for Production**
   ```bash
   npm run build
   ```
   - This creates an optimized production build in the `.next` folder.

5. **Run in Production**
   ```bash
   npm start
   ```
   - This runs the optimized production build.

### Scripts Overview
- **`dev`**: Starts the development server with hot-reloading.
- **`build`**: Creates an optimized production build.
- **`start`**: Runs the production build.

---

## Running Both Frontend and Backend

1. Open two terminal windows or tabs.
2. Navigate to the backend folder in one terminal and start the backend:
   ```bash
   cd node-csv-server
   npm run dev
   ```
3. Navigate to the frontend folder in the other terminal and start the frontend:
   ```bash
   cd csv-front
   npm run dev
   ```
4. Access the frontend at:
   ```
   http://localhost:3000
   ```
5. The backend will run on:
   ```
   http://localhost:3001
   ```

---

## Notes
- Ensure the backend is running before interacting with APIs from the frontend.

## TODOS
- Split the main page in the front-end to multiple component
- Clean unused code 
