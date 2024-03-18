import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import FirebaseAPI from "../../../pages/api/firebaseAPI";
import { UserCredentialsCtx } from "../../../pages";

export default function FlashCardStarting({ folderMaterial }) {
	const { auth, questionNAnswerSystem } = FirebaseAPI();
	const {
		user,
		folderID,
		handleOpenFlashCardEdit,
		questionNAnswerContainerRef,
	} = useContext(UserCredentialsCtx);

	const completionPercentage = Math.round(
		(questionNAnswerSystem.allQuestionsNAnswers
			.filter(
				(questionNAnswer) =>
					questionNAnswer.uid === auth.currentUser.uid &&
					questionNAnswer.currentFolderID === folderID &&
					questionNAnswer.currentMaterialID === folderMaterial.id &&
					questionNAnswer.materialType === "flash-card" &&
					questionNAnswer.completed === true
			)
			.map((questionNAnswer) => questionNAnswer.understand).length /
			questionNAnswerSystem.allQuestionsNAnswers
				.filter(
					(questionNAnswer) =>
						questionNAnswer.uid === auth.currentUser.uid &&
						questionNAnswer.currentFolderID === folderID &&
						questionNAnswer.currentMaterialID === folderMaterial.id &&
						questionNAnswer.materialType === "flash-card"
				)
				.map((questionNAnswer) => questionNAnswer.understand).length) *
			100
	);

	const gradePercentage = Math.round(
		(questionNAnswerSystem.allQuestionsNAnswers
			.filter(
				(questionNAnswer) =>
					questionNAnswer.uid === auth.currentUser.uid &&
					questionNAnswer.currentFolderID === folderID &&
					questionNAnswer.currentMaterialID === folderMaterial.id &&
					questionNAnswer.materialType === "flash-card" &&
					questionNAnswer.completed === true &&
					questionNAnswer.understand
			)
			.map((questionNAnswer) => questionNAnswer.understand).length /
			questionNAnswerSystem.allQuestionsNAnswers
				.filter(
					(questionNAnswer) =>
						questionNAnswer.uid === auth.currentUser.uid &&
						questionNAnswer.currentFolderID === folderID &&
						questionNAnswer.currentMaterialID === folderMaterial.id &&
						questionNAnswer.materialType === "flash-card" &&
						questionNAnswer.completed === true
				)
				.map((questionNAnswer) => questionNAnswer.understand).length) *
			100
	);

	return (
		<>
			{questionNAnswerSystem.allQuestionsNAnswers
				.filter(
					(questionNAnswer) =>
						questionNAnswer.uid === auth.currentUser.uid &&
						questionNAnswer.currentFolderID === folderID &&
						questionNAnswer.currentMaterialID === folderMaterial.id &&
						questionNAnswer.materialType === "flash-card" &&
						questionNAnswer.completed === false
				)
				.map((questionNAnswer) => questionNAnswer).length !== 0 && (
				<p className="text-lg mr-auto sm:mx-auto">
					Completed: {completionPercentage}%
				</p>
			)}

			{questionNAnswerSystem.allQuestionsNAnswers
				.filter(
					(questionNAnswer) =>
						questionNAnswer.uid === auth.currentUser.uid &&
						questionNAnswer.currentFolderID === folderID &&
						questionNAnswer.currentMaterialID === folderMaterial.id &&
						questionNAnswer.materialType === "flash-card"
				)
				.map((questionNAnswer) => questionNAnswer).length > 0 &&
				questionNAnswerSystem.allQuestionsNAnswers
					.filter(
						(questionNAnswer) =>
							questionNAnswer.uid === auth.currentUser.uid &&
							questionNAnswer.currentFolderID === folderID &&
							questionNAnswer.currentMaterialID === folderMaterial.id &&
							questionNAnswer.materialType === "flash-card" &&
							questionNAnswer.completed === false
					)
					.map((questionNAnswer) => questionNAnswer).length === 0 && (
					<>
						<div className="flex flex-col justify-start items-start sm:flex-row sm:justify-center sm:items-center sm:gap-2 text-center w-full text-lg sm:text-xl">
							<div className="flex justify-center items-center gap-2 text-center">
								<h1 className="font-medium text-[#05da4c]">
									Completed Flashcard
								</h1>
								<Image
									className="object-cover"
									src={"/icons/task.svg"}
									alt="icon"
									width={25}
									height={25}
									priority="true"
								/>
							</div>
							<p>Grade: {gradePercentage}%</p>
						</div>
					</>
				)}

			<div
				className={`relative flex flex-col justify-start items-start w-full h-full`}
			>
				{questionNAnswerSystem.allQuestionsNAnswers
					.filter(
						(questionNAnswer) =>
							questionNAnswer.uid === auth.currentUser.uid &&
							questionNAnswer.currentFolderID === folderID &&
							questionNAnswer.currentMaterialID === folderMaterial.id &&
							questionNAnswer.materialType === "flash-card"
					)
					.map((questionNAnswer) => questionNAnswer).length > 0 ? (
					<>
						<div
							className={`rounded-xl absolute left-0 w-full flex flex-col justify-center items-center px-4 pb-4 h-[80%]`}
						>
							<div
								className={`question-n-answers-container flex gap-7 justify-start items-center w-[90%] overflow-with-height overflow-x-scroll overflow-y-hidden rounded-xl relative mx-auto h-full`}
								ref={questionNAnswerContainerRef}
							>
								{questionNAnswerSystem.allQuestionsNAnswers
									.filter(
										(questionNAnswer) =>
											questionNAnswer.uid === auth.currentUser.uid &&
											questionNAnswer.currentFolderID === folderID &&
											questionNAnswer.currentMaterialID === folderMaterial.id &&
											questionNAnswer.materialType === "flash-card"
									)
									.reverse()
									.map((questionNAnswer) => {
										return (
											<QuestionsNAnswers
												auth={auth}
												key={questionNAnswer.id}
												questionNAnswer={questionNAnswer}
												questionNAnswerSystem={questionNAnswerSystem}
												folderMaterial={folderMaterial}
												user={user}
												folderID={folderID}
											/>
										);
									})}
							</div>
						</div>
					</>
				) : (
					<div
						className={`relative -top-20 left-0 w-full h-full rounded-xl flex flex-col gap-2 justify-center items-center text-center p-2 z-0`}
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
						<button
							onClick={() => handleOpenFlashCardEdit(folderMaterial.id)}
							className="btn"
						>
							Add Questions/Answers
						</button>
					</div>
				)}
			</div>
		</>
	);
}

const QuestionsNAnswers = ({
	auth,
	questionNAnswer,
	questionNAnswerSystem,
	folderMaterial,
	user,
	folderID,
}) => {
	const [showAnswer, setShowAnswer] = useState(false);
	const { folderMaterialSystem } = FirebaseAPI();
	const [openFullscreenModal, setOpenFullscreenModal] = useState(false);

	const completionPercentage = Math.round(
		(questionNAnswerSystem.allQuestionsNAnswers
			.filter(
				(questionNAnswer) =>
					questionNAnswer.uid === auth.currentUser.uid &&
					questionNAnswer.currentFolderID === folderID &&
					questionNAnswer.currentMaterialID === folderMaterial.id &&
					questionNAnswer.materialType === "flash-card" &&
					questionNAnswer.completed === true
			)
			.map((questionNAnswer) => questionNAnswer.understand).length /
			questionNAnswerSystem.allQuestionsNAnswers
				.filter(
					(questionNAnswer) =>
						questionNAnswer.uid === auth.currentUser.uid &&
						questionNAnswer.currentFolderID === folderID &&
						questionNAnswer.currentMaterialID === folderMaterial.id &&
						questionNAnswer.materialType === "flash-card"
				)
				.map((questionNAnswer) => questionNAnswer.understand).length) *
			100
	);

	const handleShowAnswer = () => {
		setShowAnswer(true);
	};

	const handleCompletion = () => {};

	const handleUnderstandQuestion = () => {
		questionNAnswerSystem.updateUnderstand(
			!questionNAnswer.understand,
			questionNAnswer.id
		);

		questionNAnswerSystem.updateCompleted(
			!questionNAnswer.completed,
			questionNAnswer.id
		);
	};

	const handleDidntUnderstandQuestion = () => {
		questionNAnswerSystem.updateDidntUnderstand(true, questionNAnswer.id);
		questionNAnswerSystem.updateCompleted(
			!questionNAnswer.completed,
			questionNAnswer.id
		);
	};

	useEffect(() => {
		folderMaterialSystem.updateMainMaterialCompletion(
			completionPercentage,
			folderMaterial.id
		);
	}, [questionNAnswer.understand, questionNAnswer.didntUnderstand]);

	const handleOpenFullscreen = (e) => {
		e.preventDefault();
		setOpenFullscreenModal(!openFullscreenModal);
	};

	return (
		<div
			className={`question-n-answers-child flex flex-col justify-start items-center text-center gap-4 min-w-[100%] max-w-[100%] h-full mx-auto px-3 py-1 overflow-no-width overflow-y-scroll overflow-x-hidden ${
				questionNAnswer.image ? "pt-0" : "pt-20"
			} ${
				questionNAnswer.didntUnderstand === true &&
				questionNAnswer.understand === false
					? "bg-[rgba(255,64,64,0.2)]"
					: questionNAnswer.didntUnderstand === false &&
					  questionNAnswer.understand === true &&
					  "bg-[rgba(98,255,140,0.2)]"
			}`}
		>
			{openFullscreenModal && (
				<>
					<div className="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.7)] flex justify-center items-center z-50">
						<div className="flex justify-center items-center w-[90%] h-[90%] bg-transparent relative">
							<div
								onClick={handleOpenFullscreen}
								className="p-1 rounded-full absolute top-5 left-5 base-bg z-10 text-btn"
							>
								<Image
									src={"/icons/cancel.svg"}
									alt="icon"
									width={30}
									height={30}
								/>
							</div>
							<Image
								className="object-contain rounded-lg"
								src={questionNAnswer.image}
								alt="icon"
								fill
								sizes="(max-width: 768px) 100vw, 33vw"
							/>
						</div>
					</div>
				</>
			)}

			{questionNAnswer.image && (
				<div className="w-[70%] h-[200px] relative rounded-lg">
					<Image
						className="object-contain"
						src={questionNAnswer.image}
						alt="icon"
						fill
						sizes="(max-width: 768px) 100vw, 33vw"
					/>
				</div>
			)}

			{questionNAnswer.image && (
				<>
					<button
						onClick={handleOpenFullscreen}
						className="text-sm w-fit bg-[#2871FF] text-white rounded-lg p-2 text-btn flex"
					>
						<Image
							src={"/icons/open_in_full.svg"}
							alt="icon"
							width={15}
							height={15}
						/>
					</button>
				</>
			)}

			<p className="flex justify-center items-start gap-2">
				<span className="font-semibold">Q:</span>{" "}
				<span>{questionNAnswer.question}</span>
			</p>
			{!showAnswer &&
				questionNAnswer.understand !== true &&
				questionNAnswer.didntUnderstand !== true && (
					<button onClick={handleShowAnswer} className="btn">
						Show?
					</button>
				)}
			{questionNAnswer.understand === true && (
				<p className="flex justify-center items-start gap-2">
					<span className="font-semibold">A:</span>{" "}
					<span>{questionNAnswer.answer}</span>
				</p>
			)}
			{questionNAnswer.didntUnderstand === true && (
				<p className="flex justify-center items-start gap-2">
					<span className="font-semibold">A:</span>{" "}
					<span>{questionNAnswer.answer}</span>
				</p>
			)}
			{showAnswer && (
				<p className="flex justify-center items-start gap-2">
					<span className="font-semibold">A:</span>{" "}
					<span>{questionNAnswer.answer}</span>
				</p>
			)}
			{showAnswer && (
				<div className="flex flex-col sm:flex-row justify-center items-center gap-2 w-full">
					<button
						onClick={() => {
							setShowAnswer(false);
							handleUnderstandQuestion();
							handleCompletion();
						}}
						className="btn !bg-green-500 w-full sm:w-fit"
					>
						Understand
					</button>
					<button
						onClick={() => {
							setShowAnswer(false);
							handleDidntUnderstandQuestion();
							handleCompletion();
						}}
						className="btn !bg-red-500 w-full sm:w-fit"
					>
						{"Didn't Understand"}
					</button>
				</div>
			)}
		</div>
	);
};
