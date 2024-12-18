import { getAppConfig } from '@/helper/config';
import { CsvServices } from '@/services/csv.services';
import { StatusType } from '@/types';
import { useRef, useState } from 'react';

const useHome = () => {
	const config = getAppConfig();
	const [status, setStatus] = useState<StatusType | null>();
	const [progress, setProgress] = useState<number>(0);

	const uploadFileInput = useRef<HTMLInputElement>(null);

	const csvServices = new CsvServices();

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const file = event.target.files?.[0];
		console.log('config.api.url: ', config.api.url);

		handleFileUpload(file);
	};

	const handleFileUpload = (selectedFile: File | undefined): void => {
		if (!selectedFile) {
			alert('Please select a file to upload.');
			return;
		}

		const chunkSize = 5 * 1024 * 1024; // 5MB (adjust as needed)
		const totalChunks = Math.ceil(selectedFile.size / chunkSize);
		const chunkProgress = 100 / totalChunks;
		let chunkNumber = 0;
		let start = 0;
		let end = chunkSize;
		console.log('chunkNumber: ', chunkNumber);
		console.log('totalChunks: ', totalChunks);

		const uploadNextChunk = async (): Promise<void> => {
			if (start < selectedFile.size) {
				const chunk = selectedFile.slice(start, end);
				const formData = new FormData();
				formData.append('file', chunk);
				formData.append('chunkNumber', chunkNumber.toString());
				formData.append('totalChunks', totalChunks.toString());
				formData.append('originalname', selectedFile.name);

				try {
					const data = csvServices.csvUpload(formData);
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
					console.error('Error uploading chunk:', error);
					if (typeof error === 'object' && error !== null && 'message' in error) {
						return setStatus({ message: error.message as string, severity: 'error' });
					}
					setStatus({ message: 'Error uploading chunk' as string, severity: 'error' });
				}
			} else {
				setProgress(100);
				setStatus({ message: 'File upload completed', severity: 'success' });
			}
		};

		uploadNextChunk();
	};

	return { handleFileUpload, handleFileChange, status, progress, uploadFileInput };
};

export default useHome;
