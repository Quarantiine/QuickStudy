import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";

export default function FlashCardEditingForm({
	index,
	questionNAnswer,
	questionNAnswerID,
	setQuestionNAnswerID,
	questionNAnswerSystem,
}) {
	const [questionEditTxt, setQuestionEditTxt] = useState("");
	const [answerEditTxt, setAnswerEditTxt] = useState("");
	const [edit, setEdit] = useState(false);
	const [openUploadDropdown, setOpenUploadDropdown] = useState(false);
	const fileRejectionSystemRef = useRef();

	const onDrop = useCallback((acceptedFiles) => {
		clearTimeout(fileRejectionSystemRef.current);
		const reader = new FileReader();

		reader.onload = () => {
			questionNAnswerSystem.updateImage(reader.result, questionNAnswer.id);
		};

		reader.readAsDataURL(acceptedFiles[0]);
	}, []);

	const { getRootProps, fileRejections } = useDropzone({
		onDrop,
		maxSize: 1048487,
		maxFiles: 1,
	});

	const fileRejectionSystem = () => {
		if (fileRejections.length > 0) {
			return true;
		}

		return false;
	};

	const handleEditQuestionNAnswer = (e, id) => {
		e.preventDefault();
		setEdit(!edit);
		setQuestionNAnswerID(id);
	};

	const handleDeletion = (e, id) => {
		e.preventDefault();
		questionNAnswerSystem.deleteQuestionNAnswer(id);
	};

	const handleEditing = (e, questionNAnswer) => {
		e.preventDefault();
		setEdit(false);

		questionNAnswerSystem.editQuestionNAnswer(
			questionEditTxt || questionNAnswer.question,
			answerEditTxt || questionNAnswer.answer,
			questionNAnswer.id
		);
	};

	const handleUploadDropdown = (e) => {
		e.preventDefault();
		setOpenUploadDropdown(!openUploadDropdown);
	};

	useEffect(() => {
		const closeUploadDropdown = (e) => {
			if (!e.target.closest(".upload-dropdown")) {
				setOpenUploadDropdown(false);
			}
		};

		document.addEventListener("mousedown", closeUploadDropdown);
		return () => document.removeEventListener("mousedown", closeUploadDropdown);
	}, []);

	const handleRemoveImage = (e) => {
		e.preventDefault();
		questionNAnswerSystem.updateImage("", questionNAnswer.id);
	};

	return (
		<>
			<form className="flex flex-col justify-center items-start gap-2 bg-white border-2 rounded-xl p-3 w-full hover:bg-gray-200 transition-colors">
				<div className="flex justify-center items-start gap-2 w-full">
					<p className="font-semibold text-gray-400">{index + 1}</p>

					<div className="flex flex-col justify-center items-center gap-1 w-full">
						<div className="flex justify-start items-start gap-2 w-full">
							<p className="font-semibold">Q</p>
							{questionNAnswerID === questionNAnswer.id && edit ? (
								<input
									className="input-field w-full"
									placeholder={questionNAnswer.question}
									type="text"
									onChange={(e) => setQuestionEditTxt(e.target.value)}
								/>
							) : (
								<p>{questionNAnswer.question}</p>
							)}
						</div>
						<div className="flex justify-start items-start gap-2 w-full">
							<p className="font-semibold">A</p>
							{questionNAnswerID === questionNAnswer.id && edit ? (
								<input
									className="input-field w-full"
									placeholder={questionNAnswer.answer}
									type="text"
									onChange={(e) => setAnswerEditTxt(e.target.value)}
								/>
							) : (
								<p>{questionNAnswer.answer}</p>
							)}
						</div>
					</div>
				</div>

				<div className="flex justify-center items-center gap-2 ml-auto">
					{questionNAnswerID === questionNAnswer.id && edit ? (
						<>
							<button
								onClick={(e) => handleEditing(e, questionNAnswer)}
								className="btn ml-auto"
							>
								Change
							</button>
							<button
								onClick={(e) =>
									handleEditQuestionNAnswer(e, questionNAnswer.id)
								}
								className="btn passive-btn ml-auto"
							>
								Cancel
							</button>
						</>
					) : (
						<div className="flex justify-between items-center gap-2">
							<div className="hidden sm:flex justify-center items-center relative">
								<button
									onClick={(e) => {
										handleUploadDropdown(e);
									}}
									className="text-gray-400 text-btn upload-dropdown"
								>
									{questionNAnswer.image ? "Image" : "No Image"}
								</button>

								{openUploadDropdown && (
									<div className="upload-dropdown w-[100px] h-[100px] absolute bottom-7 right-0 bg-white p-1 rounded-xl shadow-lg">
										{fileRejectionSystem() && (
											<>
												<p className="absolute top-2 left-1/2 -translate-x-1/2 bg-red-500 rounded-xl p-1 text-white z-50 text-[11px] w-[90%] text-center">
													Image Too Big
												</p>
											</>
										)}

										{questionNAnswer.image ? (
											<div className="w-full h-full">
												<div
													{...getRootProps()}
													className="w-full h-full rounded-lg flex justify-center items-center text-center text-btn relative"
												>
													<Image
														className="object-cover rounded-lg"
														src={questionNAnswer.image}
														alt="image"
														fill
														sizes="(max-width: 768px) 100vw, 33vw"
													/>
												</div>
												<button
													onClick={handleRemoveImage}
													className="absolute -top-7 left-1/2 -translate-x-1/2 text-sm w-[120px] bg-[#2871FF] text-white rounded-lg px-2"
												>
													Remove Image
												</button>
											</div>
										) : (
											<div
												{...getRootProps()}
												className="bg-gray-300 w-full h-full rounded-lg flex justify-center items-center text-sm text-gray-500 text-center text-btn p-1"
											>
												<p>Upload Image</p>
											</div>
										)}
									</div>
								)}
							</div>

							<div className="flex justify-center items-center gap-2">
								<button
									onClick={(e) => handleDeletion(e, questionNAnswer.id)}
									className="btn !bg-red-500"
								>
									<Image
										className={`object-contain`}
										src={"/icons/delete.svg"}
										alt="icon"
										width={24}
										height={24}
									/>
								</button>

								<button
									onClick={(e) =>
										handleEditQuestionNAnswer(e, questionNAnswer.id)
									}
									className="btn"
								>
									Edit
								</button>
							</div>
						</div>
					)}
				</div>
			</form>
		</>
	);
}
