import React, { useContext } from "react";
import Image from "next/image";
import FirebaseAPI from "../../../pages/api/firebaseAPI";
import { UserCredentialsCtx } from "../../../pages";
import QuizStarting from "./QuizStarting";

export default function MainQuizStart({
	folder,
	user,
	folderMaterialSystem,
	mainMaterialID,
	startBackToQuizModal,
}) {
	const { questionNAnswerSystem } = FirebaseAPI();
	const { handleResetQuizzes } = useContext(UserCredentialsCtx);

	return (
		<div className="flex justify-center items-center bg-[rgba(0,0,0,0.9)] w-full h-full top-0 left-0 fixed z-50 overflow-no-width overflow-x-hidden overflow-y-scroll">
			<div
				className={`quiz-edit-modal w-[100%] h-[100%] flex flex-col justify-start items-start bg-white pt-7 px-5 relative overflow-with-width overflow-x-hidden overflow-y-scroll ${
					questionNAnswerSystem.allQuestionsNAnswers
						.filter(
							(questionNAnswer) =>
								questionNAnswer.uid === user.uid &&
								questionNAnswer.currentFolderID === folder.id &&
								questionNAnswer.currentMaterialID === mainMaterialID &&
								questionNAnswer.materialType === "quiz"
						)
						.map((questionNAnswer) => questionNAnswer).length > 0 &&
					questionNAnswerSystem.allQuestionsNAnswers
						.filter(
							(questionNAnswer) =>
								questionNAnswer.uid === user.uid &&
								questionNAnswer.currentFolderID === folder.id &&
								questionNAnswer.currentMaterialID === mainMaterialID &&
								questionNAnswer.materialType === "quiz" &&
								questionNAnswer.completed === false
						)
						.map((questionNAnswer) => questionNAnswer).length === 0 &&
					"border-8 border-green-500"
				}`}
			>
				<div className="flex flex-col justify-start items-start gap-3 w-full h-full">
					<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 w-full z-10 relative">
						<div className="flex flex-col justify-center items-start gap-5 z-10">
							<div className="flex flex-col justify-center items-start">
								<p className="text-sm text-gray-500">
									{folder.name} - Taking Quiz
								</p>
								<h1 className="title-h1">
									{folderMaterialSystem.allFolderMaterials
										.filter(
											(folderMaterial) =>
												folderMaterial.uid === user.uid &&
												folderMaterial.materialType === "quiz" &&
												folderMaterial.currentFolderID === folder.id &&
												folderMaterial.id === mainMaterialID
										)
										.map((folderMaterial) => folderMaterial.title)
										.toString()}
								</h1>
							</div>

							<button
								onClick={() => {
									handleResetQuizzes();
								}}
								className="btn flex justify-center items-center gap-1 w-full sm:w-fit"
							>
								<Image
									className="object-contain"
									src={"/icons/restart.svg"}
									alt="icon"
									width={20}
									height={20}
								/>
								<p>Reset Quiz</p>
							</button>
						</div>

						<button
							onClick={() => {
								startBackToQuizModal();
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

					{folderMaterialSystem.allFolderMaterials
						.filter(
							(folderMaterial) =>
								folderMaterial.uid === user.uid &&
								folderMaterial.materialType === "quiz" &&
								folderMaterial.currentFolderID === folder.id &&
								folderMaterial.id === mainMaterialID
						)
						.map((folderMaterial) => {
							return (
								<QuizStarting
									key={folderMaterial.id}
									folderMaterial={folderMaterial}
								/>
							);
						})}
				</div>
			</div>
		</div>
	);
}
