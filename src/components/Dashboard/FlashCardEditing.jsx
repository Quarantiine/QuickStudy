import React, { useContext, useEffect, useState } from "react";
import FirebaseAPI from "../../pages/api/firebaseAPI";
import { UserCredentialsCtx } from "../../pages";
import Image from "next/image";

export default function FlashCardEditing({ folderMaterial }) {
	const { questionNAnswerSystem } = FirebaseAPI();
	const {
		user,
		folderID,
		flashCardID,
		openEditFlashCardDropdown,
		questionNAnswerID,
		setQuestionNAnswerID,
	} = useContext(UserCredentialsCtx);

	const [dropdown, setDropdown] = useState(false);
	const [questionTxt, setQuestionTxt] = useState("");
	const [answerTxt, setAnswerTxt] = useState("");
	const [questionEditTxt, setQuestionEditTxt] = useState("");
	const [answerEditTxt, setAnswerEditTxt] = useState("");
	const [edit, setEdit] = useState(false);

	const handleDropdown = () => {
		setDropdown(!dropdown);
	};

	useEffect(() => {
		const closeDropdown = (e) => {
			if (!e.target.closest(".question-n-answer-dropdown")) {
				setDropdown(false);
				setQuestionTxt("");
				setAnswerTxt("");
			}
		};

		document.addEventListener("mousedown", closeDropdown);
		return () => document.removeEventListener("mousedown", closeDropdown);
	}, []);

	const handleCreateQuestionNAnswer = (e) => {
		e.preventDefault();

		if (questionTxt && answerTxt) {
			setDropdown(false);

			questionNAnswerSystem.createQuestionNAnswer(
				questionTxt,
				answerTxt,
				folderID,
				flashCardID,
				folderMaterial.materialType
			);

			setQuestionTxt("");
			setAnswerTxt("");
		}
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

	return (
		<>
			<div className="flex flex-col justify-center items-center gap-5 w-full pb-5">
				<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 w-full">
					<h1 className="text-lg font-medium">Questions</h1>
					<div
						className={`relative ${
							openEditFlashCardDropdown === false && "z-10"
						}`}
					>
						<button
							onClick={handleDropdown}
							className="btn w-fit question-n-answer-dropdown"
						>
							Create Questions/Answers
						</button>

						{dropdown && (
							<>
								<form className="question-n-answer-dropdown flex flex-col justify-center items-start gap-2 absolute top-10 right-0 w-full p-3 rounded-xl bg-white shadow-lg z-10">
									<div className="flex flex-col justify-center items-start gap-1 w-full">
										<label htmlFor="question">Question</label>
										<input
											className="input-field w-full"
											placeholder="What is the color red?"
											type="text"
											onChange={(e) => setQuestionTxt(e.target.value)}
										/>
									</div>

									<div className="flex flex-col justify-center items-start gap-1 w-full">
										<label htmlFor="question">Answer</label>
										<input
											className="input-field w-full"
											placeholder="Red is the color at the long wavelength end of the visible spectrum of light."
											type="text"
											onChange={(e) => setAnswerTxt(e.target.value)}
										/>
									</div>

									<button
										onClick={handleCreateQuestionNAnswer}
										className="btn w-full mt-1"
									>
										Create
									</button>
								</form>
							</>
						)}
					</div>
				</div>

				<div className="flex justify-end items-center w-full">
					{questionNAnswerSystem.allQuestionsNAnswers
						.filter(
							(questionNAnswer) =>
								questionNAnswer.uid === user.uid &&
								questionNAnswer.currentFolderID === folderID &&
								questionNAnswer.currentMaterialID === flashCardID &&
								questionNAnswer.materialType === "flash-card"
						)
						.map((questionNAnswer) => questionNAnswer).length === 1 ? (
						<p>
							{
								questionNAnswerSystem.allQuestionsNAnswers
									.filter(
										(questionNAnswer) =>
											questionNAnswer.uid === user.uid &&
											questionNAnswer.currentFolderID === folderID &&
											questionNAnswer.currentMaterialID === flashCardID &&
											questionNAnswer.materialType === "flash-card"
									)
									.map((questionNAnswer) => questionNAnswer).length
							}{" "}
							Item
						</p>
					) : (
						<p>
							{
								questionNAnswerSystem.allQuestionsNAnswers
									.filter(
										(questionNAnswer) =>
											questionNAnswer.uid === user.uid &&
											questionNAnswer.currentFolderID === folderID &&
											questionNAnswer.currentMaterialID === flashCardID &&
											questionNAnswer.materialType === "flash-card"
									)
									.map((questionNAnswer) => questionNAnswer).length
							}{" "}
							Items
						</p>
					)}
				</div>

				<div className="flex flex-col justify-center items-start gap-5 w-full">
					{questionNAnswerSystem.allQuestionsNAnswers
						.filter(
							(questionNAnswer) =>
								questionNAnswer.uid === user.uid &&
								questionNAnswer.currentFolderID === folderID &&
								questionNAnswer.currentMaterialID === flashCardID &&
								questionNAnswer.materialType === "flash-card"
						)
						.map((questionNAnswer, index) => {
							return (
								<React.Fragment key={questionNAnswer.id}>
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
															onChange={(e) =>
																setQuestionEditTxt(e.target.value)
															}
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
												<>
													<button
														onClick={(e) =>
															handleDeletion(e, questionNAnswer.id)
														}
														className="btn !bg-red-500 h-full"
													>
														<Image
															className={`object-contain min-w-[20px] min-h-[20px]`}
															src={"/icons/delete.svg"}
															alt="icon"
															width={20}
															height={20}
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
												</>
											)}
										</div>
									</form>
								</React.Fragment>
							);
						})}

					{questionNAnswerSystem.allQuestionsNAnswers
						.filter(
							(questionNAnswer) =>
								questionNAnswer.uid === user.uid &&
								questionNAnswer.currentFolderID === folderID &&
								questionNAnswer.currentMaterialID === flashCardID &&
								questionNAnswer.materialType === "flash-card"
						)
						.map((questionNAnswer) => questionNAnswer).length < 1 && (
						<div
							className={`absolute top-1/2 -translate-y-1/2 left-0 w-full h-full rounded-xl flex flex-col gap-2 justify-center items-center text-center p-2 z-0`}
						>
							<Image
								className="object-cover grayscale opacity-50"
								src={"/images/logo.png"}
								alt="logo"
								width={60}
								height={60}
								priority="true"
							/>

							<p className="text-lg text-gray-400">
								You have no questions/answers
							</p>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
