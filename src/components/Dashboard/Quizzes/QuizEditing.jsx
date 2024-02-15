import React, { useContext, useEffect, useRef, useState } from "react";
import FirebaseAPI from "../../../pages/api/firebaseAPI";
import { UserCredentialsCtx } from "../../../pages";
import Image from "next/image";
import QuizEditingForm from "./QuizEditingForm";

export default function QuizEditing({ folderMaterial }) {
	const { auth, questionNAnswerSystem, folderMaterialSystem } = FirebaseAPI();
	const {
		user,
		folderID,
		mainMaterialID,
		openEditQuizDropdown,
		questionNAnswerID,
		setQuestionNAnswerID,
		handleOpenQuizStart,
		handleResetQuizzes,
	} = useContext(UserCredentialsCtx);

	const [dropdown, setDropdown] = useState(false);
	const [questionTxt, setQuestionTxt] = useState("");
	const [answerTxt, setAnswerTxt] = useState("");
	const [dropdown2, setDropdown2] = useState(false);
	const [deletingAllWarning, setDeletingAllWarning] = useState(false);
	const [transferIndicator, setTransferIndicator] = useState("");
	const [transferSearchText, setTransferSearchText] = useState("");
	const transferIndicatorRef = useRef();

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

	const handleDropdown = () => {
		setDropdown(!dropdown);
	};

	const handleDropdown2 = () => {
		setDropdown2(!dropdown2);
	};

	const handleCreateQuestionNAnswer = (e) => {
		e.preventDefault();

		if (questionTxt && answerTxt) {
			setDropdown(false);

			questionNAnswerSystem.createQuestionNAnswer(
				questionTxt,
				answerTxt,
				folderID,
				mainMaterialID,
				folderMaterial.materialType
			);

			setQuestionTxt("");
			setAnswerTxt("");
		}
	};

	const handleCreateQNA = (material) => {
		questionNAnswerSystem.allQuestionsNAnswers
			.filter(
				(value) =>
					value.uid === folderMaterial.uid &&
					value.currentMaterialID === material.id
			)
			.map((qna) =>
				questionNAnswerSystem.createQuestionNAnswer(
					qna.question,
					qna.answer,
					folderID,
					mainMaterialID,
					"quiz",
					qna.image
				)
			);

		setDropdown2(false);
		setTransferIndicator("Transferred Complete");
		transferIndicatorRef.current = setTimeout(() => {
			setTransferIndicator("");
		}, 3000);
	};

	useEffect(() => {
		const closeDropdown2 = (e) => {
			if (!e.target.closest(".create-quiz-dropdown-3")) {
				setDropdown2(false);
			}
		};

		document.addEventListener("mousedown", closeDropdown2);
		return () => document.removeEventListener("mousedown", closeDropdown2);
	}, []);

	const handleDeleteAllQNA = () => {
		if (
			questionNAnswerSystem.allQuestionsNAnswers
				.filter(
					(value) =>
						value.uid === folderMaterial.uid &&
						value.currentMaterialID === mainMaterialID
				)
				.map((qna) => qna).length > 0
		) {
			handleResetQuizzes();

			questionNAnswerSystem.allQuestionsNAnswers
				.filter(
					(value) =>
						value.uid === folderMaterial.uid &&
						value.currentMaterialID === mainMaterialID
				)
				.map((qna) => questionNAnswerSystem.deleteQuestionNAnswer(qna.id));

			setDeletingAllWarning(!deletingAllWarning);
		}
	};

	const handleDeletingAllWarning = () => {
		setDeletingAllWarning(!deletingAllWarning);
	};

	useEffect(() => {
		const closeWarningModal = (e) => {
			if (!e.target.closest(".deleting-all-qna-warning")) {
				setDeletingAllWarning(false);
			}
		};

		document.addEventListener("mousedown", closeWarningModal);
		return () => document.removeEventListener("mousedown", closeWarningModal);
	}, []);

	return (
		<>
			{transferIndicator && (
				<div className="absolute top-4 left-1/2 -translate-x-1/2 w-fit h-fit px-3 py-1 rounded-lg bg-green-500 text-white z-10">
					<p>{transferIndicator}</p>
				</div>
			)}

			{deletingAllWarning && (
				<>
					<div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-fit h-fit rounded-3xl text-white z-10 flex justify-center items-center shadow-lg">
						<div className="deleting-all-qna-warning flex flex-col justify-center items-center gap-3 bg-white p-5 text-center w-[250px] h-fit rounded-xl">
							<h1 className="text-black w-full">
								Are you sure you want to{" "}
								<span className="font-bold">delete all</span> of your Q&As?
							</h1>
							<button
								onClick={handleDeleteAllQNA}
								className="btn !bg-red-500 w-full question-n-answer-dropdown"
							>
								Delete All Q&A
							</button>

							<button
								onClick={handleDeletingAllWarning}
								className="btn w-full question-n-answer-dropdown"
							>
								Cancel
							</button>
						</div>
					</div>
				</>
			)}

			<div className="flex flex-col justify-center items-center gap-5 w-full pb-5">
				<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 w-full">
					<div
						className={`relative ${openEditQuizDropdown === false && "z-10"}`}
					>
						<div className="flex flex-col justify-center items-start gap-2">
							<button
								onClick={handleDropdown}
								className="btn w-full sm:w-fit question-n-answer-dropdown"
							>
								Create Q&A
							</button>
							<button
								onClick={handleDropdown2}
								className="btn w-full sm:w-fit question-n-answer-dropdown"
							>
								Create Q&A with Flash-cards
							</button>
						</div>

						{dropdown && (
							<>
								<form className="question-n-answer-dropdown flex flex-col justify-start items-center gap-2 absolute top-10 right-0 w-full p-4 rounded-xl bg-white shadow-lg">
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

						{dropdown2 && (
							<>
								<div className="create-quiz-dropdown-3 overflow-no-width w-full max-h-[200px] overflow-x-hidden overflow-y-scroll bg-white shadow-lg rounded-xl p-4 absolute top-20 left-0 flex flex-col justify-start items-start z-10 gap-5">
									<div className="flex flex-col justify-start items-start gap-1 w-full">
										<h1 className="text-base font-bold px-2">
											Create Quiz from Your Flash-cards Q&A
										</h1>
										<input
											onChange={(e) => setTransferSearchText(e.target.value)}
											className="px-2 py-1.5 rounded-lg bg-gray-100 outline-none text-black w-full text-sm"
											type="text"
											placeholder="Search Q&A"
										/>
									</div>

									<div className="flex flex-col justify-center items-start w-full text-sm">
										<p className="text-gray-400 px-2">Flash-cards Q&A Below</p>

										<div className="w-full flex flex-col justify-center items-start">
											{folderMaterialSystem.allFolderMaterials
												.filter(
													(value) =>
														value.uid === auth.currentUser.uid &&
														value.materialType === "flash-card"
												)
												.map((material) => {
													if (
														material.title
															.normalize("NFD")
															.replace(/\p{Diacritic}/gu, "")
															.toLowerCase()
															.includes(transferSearchText.toLowerCase())
													) {
														return (
															<React.Fragment key={material.id}>
																<>
																	<button
																		onClick={() => handleCreateQNA(material)}
																		className="hover:bg-[#2871FF] hover:text-white rounded-lg px-2 py-1 transition-all flex justify-between items-center gap-2 w-full text-sm"
																		title={material.title}
																	>
																		<p className="line-clamp-1 text-start">
																			{material.title}
																		</p>
																		<p className="text-end">
																			{material.completion}%
																		</p>
																	</button>
																</>
															</React.Fragment>
														);
													}
												})}
										</div>
									</div>
								</div>
							</>
						)}
					</div>

					<div className="flex flex-col justify-center items-end w-full sm:w-fit gap-2 mt-5 sm:mt-auto">
						<button
							onClick={() => {
								handleOpenQuizStart(folderMaterial.id);
							}}
							className="passive-btn w-full sm:w-fit question-n-answer-dropdown"
						>
							Take Quiz
						</button>

						<button
							onClick={() => setDeletingAllWarning(!deletingAllWarning)}
							className="btn !bg-red-500 w-full sm:w-fit question-n-answer-dropdown"
						>
							Delete All Q&A
						</button>
					</div>
				</div>

				<div className="flex justify-end items-center w-full">
					{questionNAnswerSystem.allQuestionsNAnswers
						.filter(
							(questionNAnswer) =>
								questionNAnswer.uid === user.uid &&
								questionNAnswer.currentFolderID === folderID &&
								questionNAnswer.currentMaterialID === mainMaterialID &&
								questionNAnswer.materialType === "quiz"
						)
						.map((questionNAnswer) => questionNAnswer).length === 1 ? (
						<div className="flex justify-between items-center gap-2 w-full">
							<h1 className="text-lg font-medium">Questions</h1>
							<p>
								{
									questionNAnswerSystem.allQuestionsNAnswers
										.filter(
											(questionNAnswer) =>
												questionNAnswer.uid === user.uid &&
												questionNAnswer.currentFolderID === folderID &&
												questionNAnswer.currentMaterialID === mainMaterialID &&
												questionNAnswer.materialType === "quiz"
										)
										.map((questionNAnswer) => questionNAnswer).length
								}{" "}
								Item
							</p>
						</div>
					) : (
						<div className="flex justify-between items-center gap-2 w-full">
							<h1 className="text-lg font-medium">Questions/Answers</h1>
							<p>
								{
									questionNAnswerSystem.allQuestionsNAnswers
										.filter(
											(questionNAnswer) =>
												questionNAnswer.uid === user.uid &&
												questionNAnswer.currentFolderID === folderID &&
												questionNAnswer.currentMaterialID === mainMaterialID &&
												questionNAnswer.materialType === "quiz"
										)
										.map((questionNAnswer) => questionNAnswer).length
								}{" "}
								Items
							</p>
						</div>
					)}
				</div>

				<div className="flex flex-col justify-center items-start gap-5 w-full">
					{questionNAnswerSystem.allQuestionsNAnswers
						.filter(
							(questionNAnswer) =>
								questionNAnswer.uid === user.uid &&
								questionNAnswer.currentFolderID === folderID &&
								questionNAnswer.currentMaterialID === mainMaterialID &&
								questionNAnswer.materialType === "quiz"
						)
						.map((questionNAnswer, index) => {
							return (
								<QuizEditingForm
									key={questionNAnswer.id}
									index={index}
									questionNAnswer={questionNAnswer}
									questionNAnswerID={questionNAnswerID}
									setQuestionNAnswerID={setQuestionNAnswerID}
									questionNAnswerSystem={questionNAnswerSystem}
								/>
							);
						})}

					<>
						{questionNAnswerSystem.allQuestionsNAnswers
							.filter(
								(questionNAnswer) =>
									questionNAnswer.uid === user.uid &&
									questionNAnswer.currentFolderID === folderID &&
									questionNAnswer.currentMaterialID === mainMaterialID &&
									questionNAnswer.materialType === "quiz"
							)
							.map((questionNAnswer) => questionNAnswer).length < 1 && (
							<div
								className={`relative top-1/2 left-0 w-full h-full rounded-xl flex flex-col gap-2 justify-center items-center text-center p-2 z-0`}
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
					</>
				</div>
			</div>
		</>
	);
}
