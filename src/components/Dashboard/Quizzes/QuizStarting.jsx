import React, { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import FirebaseAPI from "../../../pages/api/firebaseAPI";
import { UserCredentialsCtx } from "../../../pages";

export default function QuizStarting({ folderMaterial }) {
	const { auth, questionNAnswerSystem } = FirebaseAPI();
	const { user, folderID, handleOpenQuizEdit, questionNAnswerContainerRef } =
		useContext(UserCredentialsCtx);

	const completionPercentage = Math.round(
		(questionNAnswerSystem.allQuestionsNAnswers
			.filter(
				(questionNAnswer) =>
					questionNAnswer.uid === auth.currentUser.uid &&
					questionNAnswer.currentFolderID === folderID &&
					questionNAnswer.currentMaterialID === folderMaterial.id &&
					questionNAnswer.materialType === "quiz" &&
					questionNAnswer.completed === true
			)
			.map((questionNAnswer) => questionNAnswer.understand).length /
			questionNAnswerSystem.allQuestionsNAnswers
				.filter(
					(questionNAnswer) =>
						questionNAnswer.uid === auth.currentUser.uid &&
						questionNAnswer.currentFolderID === folderID &&
						questionNAnswer.currentMaterialID === folderMaterial.id &&
						questionNAnswer.materialType === "quiz"
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
					questionNAnswer.materialType === "quiz" &&
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
						questionNAnswer.materialType === "quiz" &&
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
						questionNAnswer.materialType === "quiz" &&
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
						questionNAnswer.materialType === "quiz"
				)
				.map((questionNAnswer) => questionNAnswer).length > 0 &&
				questionNAnswerSystem.allQuestionsNAnswers
					.filter(
						(questionNAnswer) =>
							questionNAnswer.uid === auth.currentUser.uid &&
							questionNAnswer.currentFolderID === folderID &&
							questionNAnswer.currentMaterialID === folderMaterial.id &&
							questionNAnswer.materialType === "quiz" &&
							questionNAnswer.completed === false
					)
					.map((questionNAnswer) => questionNAnswer).length === 0 && (
					<>
						<div className="flex flex-col justify-start items-start sm:flex-row sm:justify-center sm:items-center sm:gap-2 text-center w-full text-lg sm:text-xl">
							<div className="flex justify-center items-center gap-2 text-center">
								<h1 className="font-medium text-[#05da4c]">Completed Quiz</h1>
								<Image
									className="object-cover"
									src={"/icons/task.svg"}
									alt="logo"
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
							questionNAnswer.materialType === "quiz"
					)
					.reverse()
					.map((questionNAnswer) => questionNAnswer).length > 4 ? (
					<>
						<div
							className={`rounded-xl absolute left-0 w-full flex flex-col justify-center items-center px-4 pb-4 h-[100%]`}
						>
							<div
								className={`question-n-answers-quiz-container flex flex-col gap-7 justify-start items-start w-[100%] overflow-with-width overflow-y-scroll overflow-x-hidden rounded-xl relative mx-auto h-full`}
								ref={questionNAnswerContainerRef}
							>
								{questionNAnswerSystem.allQuestionsNAnswers
									.filter(
										(questionNAnswer) =>
											questionNAnswer.uid === auth.currentUser.uid &&
											questionNAnswer.currentFolderID === folderID &&
											questionNAnswer.currentMaterialID === folderMaterial.id &&
											questionNAnswer.materialType === "quiz"
									)
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
							{"You have < 5 questions/answers"}
						</p>
						<button
							onClick={() => handleOpenQuizEdit(folderMaterial.id)}
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
	const { folderMaterialSystem } = FirebaseAPI();
	const dummyAnswers = JSON.parse(questionNAnswer.dummyAnswers);
	const shuffleAnswer = useRef(Math.round(Math.random() * 3));
	const [openFullscreenModal, setOpenFullscreenModal] = useState(false);

	const completionPercentage = Math.round(
		(questionNAnswerSystem.allQuestionsNAnswers
			.filter(
				(questionNAnswer) =>
					questionNAnswer.uid === auth.currentUser.uid &&
					questionNAnswer.currentFolderID === folderID &&
					questionNAnswer.currentMaterialID === folderMaterial.id &&
					questionNAnswer.materialType === "quiz" &&
					questionNAnswer.completed === true
			)
			.map((questionNAnswer) => questionNAnswer.understand).length /
			questionNAnswerSystem.allQuestionsNAnswers
				.filter(
					(questionNAnswer) =>
						questionNAnswer.uid === auth.currentUser.uid &&
						questionNAnswer.currentFolderID === folderID &&
						questionNAnswer.currentMaterialID === folderMaterial.id &&
						questionNAnswer.materialType === "quiz"
				)
				.map((questionNAnswer) => questionNAnswer.understand).length) *
			100
	);

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
			className={`question-n-answers-quiz-child flex flex-col justify-start items-center text-center gap-4 w-[100%] min-h-[100%] max-h-[100%] h-full mx-auto px-3 py-10 overflow-with-width-secondary overflow-x-hidden overflow-y-scroll rounded-2xl`}
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
									alt="close"
									width={30}
									height={30}
								/>
							</div>
							<Image
								className="object-contain rounded-lg"
								src={questionNAnswer.image}
								alt="image"
								fill
								sizes="(max-width: 768px) 100vw, 33vw"
							/>
						</div>
					</div>
				</>
			)}

			{questionNAnswer.image && (
				<div className="w-[70%] min-h-[200px] relative">
					<Image
						className="object-contain"
						src={questionNAnswer.image}
						alt="image"
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
							alt="fullscreen"
							width={15}
							height={15}
						/>
					</button>
				</>
			)}

			<div className="flex flex-col justify-center items-start w-fit mx-auto gap-5">
				<p className="flex justify-start items-center gap-2 px-2">
					<span className="font-semibold">Q:</span>
					<span className="text-start">{questionNAnswer.question}</span>
				</p>

				<div className="flex flex-col justify-center items-start gap-2">
					{shuffleAnswer.current === 0
						? dummyAnswers
								.filter((l) => l == questionNAnswer.answer)
								.map((dummyAnswer, index) => {
									return (
										<React.Fragment key={index}>
											<button
												onClick={
													questionNAnswer.completed
														? null
														: handleUnderstandQuestion
												}
												className={`text-btn rounded-xl px-3 text-start py-2 ${
													questionNAnswer.didntUnderstand === false &&
													questionNAnswer.understand === true &&
													"bg-[rgba(98,255,140,0.2)] text-green-700"
												}`}
											>
												<span className="font-semibold">A:</span> {dummyAnswer}
											</button>
										</React.Fragment>
									);
								})
						: dummyAnswers
								.filter((l) => l != questionNAnswer.answer)
								.slice(0, 1)
								.map((dummyAnswer, index) => {
									return (
										<React.Fragment key={index}>
											<button
												onClick={
													questionNAnswer.completed
														? null
														: handleDidntUnderstandQuestion
												}
												className={`text-btn rounded-xl px-3 text-start py-2 ${
													questionNAnswer.didntUnderstand === true &&
													questionNAnswer.understand === false &&
													"bg-[rgba(255,64,64,0.2)] text-red-700"
												}`}
											>
												<span className="font-semibold">A:</span> {dummyAnswer}
											</button>
										</React.Fragment>
									);
								})}

					{shuffleAnswer.current === 1
						? dummyAnswers
								.filter((l) => l == questionNAnswer.answer)
								.map((dummyAnswer, index) => {
									return (
										<React.Fragment key={index}>
											<button
												onClick={
													questionNAnswer.completed
														? null
														: handleUnderstandQuestion
												}
												className={`text-btn rounded-xl px-3 text-start py-2 ${
													questionNAnswer.didntUnderstand === false &&
													questionNAnswer.understand === true &&
													"bg-[rgba(98,255,140,0.2)] text-green-700"
												}`}
											>
												<span className="font-semibold">B:</span> {dummyAnswer}
											</button>
										</React.Fragment>
									);
								})
						: dummyAnswers
								.filter((l) => l != questionNAnswer.answer)
								.slice(1, 2)
								.map((dummyAnswer, index) => {
									return (
										<React.Fragment key={index}>
											<button
												onClick={
													questionNAnswer.completed
														? null
														: handleDidntUnderstandQuestion
												}
												className={`text-btn rounded-xl px-3 text-start py-2 ${
													questionNAnswer.didntUnderstand === true &&
													questionNAnswer.understand === false &&
													"bg-[rgba(255,64,64,0.2)] text-red-700"
												}`}
											>
												<span className="font-semibold">B:</span> {dummyAnswer}
											</button>
										</React.Fragment>
									);
								})}

					{shuffleAnswer.current === 2
						? dummyAnswers
								.filter((l) => l == questionNAnswer.answer)
								.map((dummyAnswer, index) => {
									return (
										<React.Fragment key={index}>
											<button
												onClick={
													questionNAnswer.completed
														? null
														: handleUnderstandQuestion
												}
												className={`text-btn rounded-xl px-3 text-start py-2 ${
													questionNAnswer.didntUnderstand === false &&
													questionNAnswer.understand === true &&
													"bg-[rgba(98,255,140,0.2)] text-green-700"
												}`}
											>
												<span className="font-semibold">C:</span> {dummyAnswer}
											</button>
										</React.Fragment>
									);
								})
						: dummyAnswers
								.filter((l) => l != questionNAnswer.answer)
								.slice(2, 3)
								.map((dummyAnswer, index) => {
									return (
										<React.Fragment key={index}>
											<button
												onClick={
													questionNAnswer.completed
														? null
														: handleDidntUnderstandQuestion
												}
												className={`text-btn rounded-xl px-3 text-start py-2 ${
													questionNAnswer.didntUnderstand === true &&
													questionNAnswer.understand === false &&
													"bg-[rgba(255,64,64,0.2)] text-red-700"
												}`}
											>
												<span className="font-semibold">C:</span> {dummyAnswer}
											</button>
										</React.Fragment>
									);
								})}

					{shuffleAnswer.current === 3
						? dummyAnswers
								.filter((l) => l == questionNAnswer.answer)
								.map((dummyAnswer, index) => {
									return (
										<React.Fragment key={index}>
											<button
												onClick={
													questionNAnswer.completed
														? null
														: handleUnderstandQuestion
												}
												className={`text-btn rounded-xl px-3 text-start py-2 ${
													questionNAnswer.didntUnderstand === false &&
													questionNAnswer.understand === true &&
													"bg-[rgba(98,255,140,0.2)] text-green-700"
												}`}
											>
												<span className="font-semibold">D:</span> {dummyAnswer}
											</button>
										</React.Fragment>
									);
								})
						: dummyAnswers
								.filter((l) => l != questionNAnswer.answer)
								.slice(3, 4)
								.map((dummyAnswer, index) => {
									return (
										<React.Fragment key={index}>
											<button
												onClick={
													questionNAnswer.completed
														? null
														: handleDidntUnderstandQuestion
												}
												className={`text-btn rounded-xl px-3 text-start py-2 ${
													questionNAnswer.didntUnderstand === true &&
													questionNAnswer.understand === false &&
													"bg-[rgba(255,64,64,0.2)] text-red-700"
												}`}
											>
												<span className="font-semibold">D:</span> {dummyAnswer}
											</button>
										</React.Fragment>
									);
								})}
				</div>
			</div>
		</div>
	);
};
