import { FC } from 'react';

const Progress: FC<{ value: number }> = ({ value }) => {
	return (
		<div className="relative h-3 mt-10 w-full rounded-full bg-stroke dark:bg-strokedark">
			<div
				className="absolute left-0 h-full rounded-full bg-primary animated"
				style={{
					width: `${value}%`
				}}
			/>
		</div>
	);
};

export default Progress;
