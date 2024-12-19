/* eslint-disable @next/next/no-img-element */
'use client';
import Progress from '@/components/progress';
import useHome from './hooks/useHome';
import Spinner from '@/components/spinner';
import { Alert } from '@/components/Alert';
import { getAppConfig } from '@/helper/config';

export default function Home() {
	const { handleFileChange, uploadFileInput, progress, status, parserStatus, parserResponse, resetSystem } = useHome();
	let spinnerMessage = '';
	switch (parserStatus) {
		case 'START':
			spinnerMessage = 'PARSING CSV FILE  ...';
			break;
		case 'DONE':
			spinnerMessage = 'PARSING DONE  ...';
			break;

		default:
			spinnerMessage = 'Uploading ...';
	}

	return (
		<>
			<header className="sticky top-0 z-999 flex w-full bg-wite ">
				<div className="flex flex-grow items-center justify-center  px-4 py-4 md:px-6 2xl:px-11 shadow-none">
					<div className="flex items-center gap-2 sm:gap-4  ">
						<a className="flex justify-center flex-col items-center w-[750px]">
							<img src="/images/logo/logo-icon.svg" alt="Logo" />
							<h1 className="mx-auto mb-4 w-full pt-2 font-heading text-3xl font-bold -tracking-[0.5px] text-black sm:text-title-3 xl:w-11/12 xl:text-title-2 2xl:text-[52px] 2xl:leading-[62px] text-center">
								CSV FILE PARSER
							</h1>
						</a>
					</div>
				</div>
			</header>
			<section className="px-4  sm:px-8 xl:px-12.5 relative min-h-150">
				<div className="relative z-10 overflow-hidden rounded-[32px] pt-10 pb-10">
					<div className="relative z-10 mx-auto max-w-222.5 px-4 sm:px-8 xl:px-0">
						{!parserResponse?.paths && (
							<div className="flex justify-center">
								<div className="rounded-sm border border-stroke bg-white bg-opacity-30 px-7.5 py-6 shadow-default  w-[555px] border-dashed flex justify-center  flex-col relative overflow-hidden">
									{progress > 0 && parserStatus !== 'DONE' && (
										<div className="bg-gray-700 bg-opacity-80 absolute w-full h-full top-0 left-0 flex justify-center items-center">
											<Spinner message={spinnerMessage} />
										</div>
									)}
									<>
										<h2 className="text-primary mx-auto mb-8 w-full max-w-[750px] font-heading text-3xl font-bold -tracking-[0.5px] dark:text-white sm:text-title-3 xl:w-11/12 xl:text-title-2 2xl:text-[52px] 2xl:leading-[62px] text-center">
											Please upload your large csv file
										</h2>
										<input type="file" onChange={handleFileChange} ref={uploadFileInput} className="hidden" />
										<a
											onClick={() => {
												if (!uploadFileInput.current) return;
												uploadFileInput.current.click();
											}}
											className="mb-3 inline-flex items-center justify-center gap-2.5 border border-primary px-10 py-4 text-center font-medium text-primary hover:bg-opacity-90 lg:px-8 xl:px-10"
										>
											<span>
												<svg
													className="fill-current"
													width="20"
													height="20"
													viewBox="0 0 20 20"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														d="M18.75 10.6875C18.375 10.6875 18.0625 11 18.0625 11.375V17C18.0625 17.3125 17.8125 17.5625 17.5 17.5625H2.5C2.1875 17.5625 1.9375 17.3125 1.9375 17V11.375C1.9375 11 1.625 10.6875 1.25 10.6875C0.875 10.6875 0.5625 11 0.5625 11.375V17C0.5625 18.0625 1.4375 18.9375 2.5 18.9375H17.5C18.5625 18.9375 19.4375 18.0625 19.4375 17V11.375C19.4375 11.0313 19.125 10.6875 18.75 10.6875Z"
														fill=""
													></path>
													<path
														d="M9.28125 12.9688C9.46875 13.1563 9.75 13.2813 10 13.2813C10.25 13.2813 10.5312 13.1875 10.7187 13L13.6875 10.0625C13.9687 9.78125 13.9687 9.34375 13.6875 9.0625C13.4062 8.78125 12.9687 8.78125 12.6875 9.0625L10.7187 11.0312V1.71875C10.7187 1.34375 10.4062 1.03125 10.0312 1.03125C9.65625 1.03125 9.34375 1.34375 9.34375 1.71875V11.0312L7.375 9.0625C7.09375 8.78125 6.65625 8.78125 6.375 9.0625C6.09375 9.34375 6.09375 9.78125 6.375 10.0625L9.28125 12.9688Z"
														fill=""
													></path>
												</svg>
											</span>
											UPLOAD CSV
										</a>
									</>
								</div>
							</div>
						)}
						{parserResponse?.paths && (
							<>
								<div className="flex justify-center">
									<div className="rounded-sm border border-stroke bg-white bg-opacity-30 px-7.5 py-6 shadow-default  w-[555px] border-dashed flex justify-center  flex-col relative overflow-hidden">
										<>
											<h2 className="text-primary mx-auto mb-8 w-full max-w-[750px] font-heading text-3xl font-bold -tracking-[0.5px] dark:text-white sm:text-title-3 xl:w-11/12 xl:text-title-2 2xl:text-[52px] 2xl:leading-[62px] text-center">
												Your files are ready
											</h2>
											<div>
												<div className="flex flex-wrap justify-center gap-3.5">
													{parserResponse.paths.map((item) => {
														return (
															<a
																key={item.gender}
																className="mt-8 inline-flex items-center gap-2 rounded-[30px] bg-primary px-7.5 py-3 font-heading text-base font-medium text-white duration-300 ease-in hover:bg-blue-dark cursor-pointer"
																//onClick={() => handleFileDownload(item.path)}
																href={`${getAppConfig().api.url}/download/${item.path}`}
															>
																Download {item.gender}
															</a>
														);
													})}
												</div>
											</div>
										</>
									</div>
								</div>
								<div className="my-8 flex justify-center">
									<a
										target="_blank"
										onClick={resetSystem}
										className="mt-8 inline-flex items-center gap-2 rounded-[30px] border border-gray-3 bg-white px-7.5 py-3 font-heading text-base font-medium text-black duration-300 ease-in hover:border-primary hover:text-primary cursor-pointer"
									>
										SYSTEM RESET
									</a>
								</div>
							</>
						)}
						{progress > 0 && <Progress value={progress} />}

						<p className="mt-20">This interface is created with tailwind css for test purposes</p>
					</div>

					<div className="absolute right-0 top-0 -z-1">
						<img
							alt="grid"
							loading="lazy"
							width={621}
							height={350}
							decoding="async"
							data-nimg={1}
							style={{ color: 'transparent' }}
							src="/images/grid-02.svg"
						/>
					</div>

					<div className="absolute left-0 top-0 -z-10 h-full w-full bg-[#F6F7FA]"></div>
				</div>
				{status && <Alert {...status} />}
			</section>
		</>
	);
}
