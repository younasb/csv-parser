import { FC } from 'react';
import { ErrorIcon, SuccessIcon, WarningIcon } from './Icons';
import { AlertType } from '@/types';

interface AlertConfig {
	icon: React.ReactNode;
	bg: string;
	title: string;
	description: string;
}

export const Alert: FC<AlertType> = ({ severity, message, title }) => {
	const alertMap: Record<AlertType['severity'], AlertConfig> = {
		warning: {
			icon: <WarningIcon />,
			bg: 'warning',
			title: '#9D5425',
			description: '#D0915C'
		},
		error: {
			icon: <ErrorIcon />,
			bg: '[#F87171]',
			title: '#B45454',
			description: '#CD5D5D'
		},
		success: {
			icon: <SuccessIcon />,
			bg: '[#34D399]',
			title: '#34D399',
			description: '#64748b'
		}
	};

	const titleA = title || severity === 'success' ? 'Success' : 'Ops!';
	const alertStyle = alertMap[severity];
	return (
		<div className=" absolute w-[90%] h-29 bottom-0">
			<div
				className={`flex w-full border-l-6 border-${alertStyle.bg} bg-${alertStyle.bg} bg-opacity-[15%] px-7 py-8 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-9`}
			>
				<div className={`mr-5 flex h-9 w-9 items-center justify-center rounded-lg bg-${alertStyle.bg} bg-opacity-80`}>
					{alertStyle.icon}
				</div>
				<div className="w-full">
					<h5 className={`mb-3 text-lg font-semibold text-[${alertStyle.title}]`}>{titleA}</h5>
					<p className={`leading-relaxed text-[${alertStyle.description}]`}>{message}</p>
				</div>
			</div>
		</div>
	);
};
