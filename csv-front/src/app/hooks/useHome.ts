import { CsvServices } from '@/services/csv.services';
import { CsvParserResponse, StatusType } from '@/types';
import { useEffect, useRef, useState } from 'react';

const useHome = () => {
	const [status, setStatus] = useState<StatusType | null>();
	const [parserStatus, setParserStatus] = useState<'START' | 'DONE' | 'ERROR' | null>();
	const [parserResponse, setParserResponse] = useState<CsvParserResponse | null>();
	const [progress, setProgress] = useState<number>(0);

	useEffect(() => {
		if (status?.message) {
			setTimeout(() => {
				setStatus(null); // AUTO HIDE ALERT
			}, 5000);
		}
	}, [status]);

	const uploadFileInput = useRef<HTMLInputElement>(null);

	const csvServices = new CsvServices();

	const resetSystem = () => {
		setParserStatus(null);
		setStatus(null);
		setParserResponse(null);
	};
	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const file = event.target.files?.[0];

		handleFileUpload(file);
	};

	const handleFileUpload = (selectedFile: File | undefined): void => {
		if (!selectedFile) {
			setStatus({ message: 'Please select a file to upload.', severity: 'warning' });
			return;
		}
		setStatus(null);

		const chunkSize = 50 * 1024 * 1024; // 50MB (adjust as needed)
		const totalChunks = Math.ceil(selectedFile.size / chunkSize);
		const chunkProgress = 100 / totalChunks;
		let chunkNumber = 0;
		let start = 0;
		let end = chunkSize;

		const uploadNextChunk = async (): Promise<void> => {
			if (start < selectedFile.size) {
				const chunk = selectedFile.slice(start, end);
				const formData = new FormData();
				formData.append('file', chunk);
				formData.append('chunkNumber', chunkNumber.toString());
				formData.append('totalChunks', totalChunks.toString());
				formData.append('originalname', selectedFile.name);

				try {
					const data = await csvServices.csvUpload(formData);
					console.log({ data });

					const tempStatus = `Chunk ${chunkNumber + 1}/${totalChunks} uploaded successfully`;
					setStatus({ message: tempStatus, severity: 'success' });
					setProgress(Number((chunkNumber + 1) * chunkProgress));
					console.log(tempStatus);

					chunkNumber++;
					start = end;
					end = start + chunkSize;

					// Continue uploading the next chunk
					await uploadNextChunk();
				} catch (error) {
					setProgress(0);
					console.log('Error uploading chunk:', error);
					if (typeof error === 'object' && error !== null && 'message' in error) {
						return setStatus({ message: error.message as string, severity: 'error' });
					}
					setStatus({ message: 'Error uploading chunk', severity: 'error' });
				}
			} else {
				setProgress(100);
				setStatus({ message: 'File upload completed', severity: 'success' });
				// star parsing file
				setParserStatus('START');
				try {
					setProgress(100);
					const parsedCsv = await csvServices.csvParse(selectedFile.name);
					setParserResponse(parsedCsv);
					setProgress(0);
					setParserStatus('DONE');
					console.log('parsedCsv: ', parsedCsv);
				} catch (error) {
					console.log('[ERROR_PARSER] ', error);
					if (typeof error === 'object' && error !== null && 'message' in error) {
						return setStatus({ message: error.message as string, severity: 'error' });
					}
					setStatus({ message: 'Error while parsing file', severity: 'error' });
				}
			}
		};

		uploadNextChunk();
	};

	return {
		handleFileUpload,
		handleFileChange,
		status,
		progress,
		uploadFileInput,
		parserStatus,
		parserResponse,
		resetSystem
	};
};

export default useHome;
