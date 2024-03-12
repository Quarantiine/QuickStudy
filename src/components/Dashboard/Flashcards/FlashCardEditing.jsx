import React, { useContext, useEffect, useState } from "react";
import FirebaseAPI from "../../../pages/api/firebaseAPI";
import { UserCredentialsCtx } from "../../../pages";
import Image from "next/image";
import FlashCardEditingForm from "./FlashCardEditingForm";

export default function FlashCardEditing({ folderMaterial }) {
	const { auth, questionNAnswerSystem } = FirebaseAPI();
	const {
		user,
		folderID,
		mainMaterialID,
		openEditFlashCardDropdown,
		questionNAnswerID,
		setQuestionNAnswerID,
		handleOpenFlashCardStart,
	} = useContext(UserCredentialsCtx);

	const [dropdown, setDropdown] = useState(false);
	const [questionTxt, setQuestionTxt] = useState("");
	const [answerTxt, setAnswerTxt] = useState("");

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

	return (
		<>
			<div className="flex flex-col justify-center items-center gap-5 w-full pb-5">
				<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 w-full z-0">
					<div
						className={`relative ${
							openEditFlashCardDropdown === false && "z-10"
						}`}
					>
						<button
							onClick={handleDropdown}
							className="btn w-full sm:w-fit question-n-answer-dropdown"
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

					<button
						onClick={() => {
							handleOpenFlashCardStart(folderMaterial.id);
						}}
						className="passive-btn w-full sm:w-fit question-n-answer-dropdown"
					>
						Start Studying
					</button>
				</div>

				<div className="flex justify-end items-center w-full">
					{questionNAnswerSystem.allQuestionsNAnswers
						.filter(
							(questionNAnswer) =>
								questionNAnswer.uid === auth.currentUser.uid &&
								questionNAnswer.currentFolderID === folderID &&
								questionNAnswer.currentMaterialID === mainMaterialID &&
								questionNAnswer.materialType === "flash-card"
						)
						.map((questionNAnswer) => questionNAnswer).length === 1 ? (
						<div className="flex justify-between items-center gap-2 w-full">
							<h1 className="text-lg font-medium">Questions</h1>
							<p>
								{
									questionNAnswerSystem.allQuestionsNAnswers
										.filter(
											(questionNAnswer) =>
												questionNAnswer.uid === auth.currentUser.uid &&
												questionNAnswer.currentFolderID === folderID &&
												questionNAnswer.currentMaterialID === mainMaterialID &&
												questionNAnswer.materialType === "flash-card"
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
												questionNAnswer.uid === auth.currentUser.uid &&
												questionNAnswer.currentFolderID === folderID &&
												questionNAnswer.currentMaterialID === mainMaterialID &&
												questionNAnswer.materialType === "flash-card"
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
								questionNAnswer.uid === auth.currentUser.uid &&
								questionNAnswer.currentFolderID === folderID &&
								questionNAnswer.currentMaterialID === mainMaterialID &&
								questionNAnswer.materialType === "flash-card"
						)
						.map((questionNAnswer, index) => {
							return (
								<FlashCardEditingForm
									key={questionNAnswer.id}
									index={index}
									questionNAnswer={questionNAnswer}
									questionNAnswerID={questionNAnswerID}
									setQuestionNAnswerID={setQuestionNAnswerID}
									questionNAnswerSystem={questionNAnswerSystem}
								/>
							);
						})}

					{!dropdown && (
						<>
							{questionNAnswerSystem.allQuestionsNAnswers
								.filter(
									(questionNAnswer) =>
										questionNAnswer.uid === auth.currentUser.uid &&
										questionNAnswer.currentFolderID === folderID &&
										questionNAnswer.currentMaterialID === mainMaterialID &&
										questionNAnswer.materialType === "flash-card"
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
					)}
				</div>
			</div>
		</>
	);
}
