import React, { useContext, useEffect, useState } from "react";
import FlashCardStarting from "./FlashCardStarting";
import Image from "next/image";
import FirebaseAPI from "../../../pages/api/firebaseAPI";
import { UserCredentialsCtx } from "../../../pages";

export default function MainFlashcardStart({
	folder,
	folderMaterialSystem,
	mainMaterialID,
	startBackToFlashCardModal,
}) {
	const { auth, questionNAnswerSystem } = FirebaseAPI();
	const {
		handleResetFlashcards,
		resettingFlashcards,
		didntUnderstandFlashcardToggle,
		setDidntUnderstandFlashcardToggle,
	} = useContext(UserCredentialsCtx);

	return (
		<div className="flex justify-center items-center bg-[rgba(0,0,0,0.9)] w-full h-full top-0 left-0 fixed z-50 overflow-no-width overflow-x-hidden overflow-y-scroll">
			<div
				className={`flash-card-edit-modal w-[100%] h-[100%] flex flex-col justify-start items-start bg-white pt-7 px-5 relative overflow-with-width overflow-x-hidden overflow-y-scroll ${
					questionNAnswerSystem.allQuestionsNAnswers
						.filter(
							(questionNAnswer) =>
								questionNAnswer.uid === auth.currentUser.uid &&
								questionNAnswer.currentFolderID === folder.id &&
								questionNAnswer.currentMaterialID === mainMaterialID &&
								questionNAnswer.materialType === "flash-card"
						)
						.map((questionNAnswer) => questionNAnswer).length > 0 &&
					questionNAnswerSystem.allQuestionsNAnswers
						.filter(
							(questionNAnswer) =>
								questionNAnswer.uid === auth.currentUser.uid &&
								questionNAnswer.currentFolderID === folder.id &&
								questionNAnswer.currentMaterialID === mainMaterialID &&
								questionNAnswer.materialType === "flash-card" &&
								questionNAnswer.completed === false
						)
						.map((questionNAnswer) => questionNAnswer).length === 0 &&
					"border-8 border-green-500"
				}`}
			>
				<div className="flex flex-col justify-start items-start gap-3 w-full h-full">
					<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 w-full z-10 relative">
						<div className="flex flex-col justify-center items-start gap-5 z-10 w-full">
							<div className="flex flex-col justify-center items-start w-full">
								<div className="flex justify-between items-center gap-2 w-full">
									<p className="text-sm text-gray-500">
										{folder.name} - Studying Flash Cards
									</p>
									<button
										onClick={() => {
											startBackToFlashCardModal();
										}}
										className="btn !bg-transparent border border-[#2871FF] !text-[#2871FF] flex justify-center items-center gap-1"
									>
										<Image
											className="object-contain"
											src={"/icons/arrow_back_blue.svg"}
											alt="icon"
											width={17}
											height={17}
										/>
										<p>Back</p>
									</button>
								</div>

								<h1 className="title-h1">
									{folderMaterialSystem.allFolderMaterials
										.filter(
											(folderMaterial) =>
												folderMaterial.uid === auth.currentUser.uid &&
												folderMaterial.materialType === "flash-card" &&
												folderMaterial.currentFolderID === folder.id &&
												folderMaterial.id === mainMaterialID
										)
										.map((folderMaterial) => folderMaterial.title)
										.toString()}
								</h1>
							</div>

							<div className="flex flex-row justify-center items-center gap-2 w-fit">
								{questionNAnswerSystem.allQuestionsNAnswers
									.filter(
										(questionNAnswer) =>
											questionNAnswer.uid === auth.currentUser.uid &&
											questionNAnswer.currentFolderID === folder.id &&
											questionNAnswer.currentMaterialID === mainMaterialID &&
											questionNAnswer.materialType === "flash-card"
									)
									.map((questionNAnswer) => questionNAnswer.completed)
									.includes(true) ? (
									<button
										onClick={() => {
											!resettingFlashcards && handleResetFlashcards();
										}}
										className={`btn flex justify-center items-center gap-1 w-full sm:w-fit ${resettingFlashcards && "!bg-gray-500 cursor-not-allowed"}`}
									>
										<Image
											className="object-contain"
											src={"/icons/restart.svg"}
											alt="icon"
											width={20}
											height={20}
										/>
										<p>Reset Flashcards</p>
									</button>
								) : (
									<button className="btn !bg-gray-500 cursor-not-allowed flex justify-center items-center gap-1 w-full sm:w-fit">
										<Image
											className="object-contain"
											src={"/icons/restart.svg"}
											alt="icon"
											width={20}
											height={20}
										/>
										<p>Reset Flashcards</p>
									</button>
								)}

								{!questionNAnswerSystem.allQuestionsNAnswers
									.filter(
										(questionNAnswer) =>
											questionNAnswer.uid === auth.currentUser.uid &&
											questionNAnswer.currentFolderID === folder.id &&
											questionNAnswer.currentMaterialID === mainMaterialID &&
											questionNAnswer.materialType === "flash-card"
									)
									.map((questionNAnswer) => questionNAnswer.completed === true)
									.includes(false) &&
									questionNAnswerSystem.allQuestionsNAnswers
										.filter(
											(questionNAnswer) =>
												questionNAnswer.uid === auth.currentUser.uid &&
												questionNAnswer.currentFolderID === folder.id &&
												questionNAnswer.currentMaterialID === mainMaterialID &&
												questionNAnswer.materialType === "flash-card"
										)
										.map((questionNAnswer) => questionNAnswer).length > 0 &&
									questionNAnswerSystem.allQuestionsNAnswers
										.filter(
											(questionNAnswer) =>
												questionNAnswer.uid === auth.currentUser.uid &&
												questionNAnswer.currentFolderID === folder.id &&
												questionNAnswer.currentMaterialID === mainMaterialID &&
												questionNAnswer.materialType === "flash-card" &&
												questionNAnswer.didntUnderstand === true
										)
										.map(
											(questionNAnswer) => questionNAnswer.completed === true
										).length > 0 && (
										<button
											onClick={() => {
												setDidntUnderstandFlashcardToggle(
													!didntUnderstandFlashcardToggle
												);
											}}
											className={`btn flex justify-center items-center gap-1 w-full sm:w-fit ${
												didntUnderstandFlashcardToggle && "opacity-50"
											}`}
										>
											<p>Show Missed Flashcards</p>
										</button>
									)}
							</div>
						</div>
					</div>

					{folderMaterialSystem.allFolderMaterials
						.filter(
							(folderMaterial) =>
								folderMaterial.uid === auth.currentUser.uid &&
								folderMaterial.materialType === "flash-card" &&
								folderMaterial.currentFolderID === folder.id &&
								folderMaterial.id === mainMaterialID
						)
						.map((folderMaterial) => {
							return (
								<FlashCardStarting
									key={folderMaterial.id}
									folderMaterial={folderMaterial}
								/>
							);
						})}

					{resettingFlashcards && (
						<div className="flex justify-center items-center gap-1 w-full sm:w-fit absolute bottom-16 left-1/2 -translate-x-1/2">
							<p className="animate-pulse text-2xl">Resetting Flashcards</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
