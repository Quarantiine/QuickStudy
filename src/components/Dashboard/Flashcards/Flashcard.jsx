import React, { useEffect, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import FirebaseAPI from "../../../pages/api/firebaseAPI";

export default function Flashcard({
	user,
	folderMaterial,
	questionNAnswerSystem,
	folderMaterialSystem,
	handleOpenFlashCardEdit,
	handleOpenFlashCardStart,
	folder,
}) {
	const { auth } = FirebaseAPI();
	const [openDeletionWarningDropdown, setOpenDeletionWarningDropdown] =
		useState(false);

	const gradePercentage = Math.round(
		(questionNAnswerSystem.allQuestionsNAnswers
			.filter(
				(questionNAnswer) =>
					questionNAnswer.uid === auth.currentUser.uid &&
					questionNAnswer.currentFolderID === folder.id &&
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
						questionNAnswer.currentFolderID === folder.id &&
						questionNAnswer.currentMaterialID === folderMaterial.id &&
						questionNAnswer.materialType === "flash-card" &&
						questionNAnswer.completed === true
				)
				.map((questionNAnswer) => questionNAnswer.understand).length) *
			100
	);

	useEffect(() => {
		const closeDropdown = (e) => {
			if (!e.target.closest(".deletion-warning")) {
				setOpenDeletionWarningDropdown(false);
			}
		};

		document.addEventListener("mousedown", closeDropdown);
		return () => document.removeEventListener("mousedown", closeDropdown);
	}, []);

	const handleDeleteMainMaterial = (id) => {
		folderMaterialSystem.deleteMainMaterial(id);

		questionNAnswerSystem.allQuestionsNAnswers
			.filter(
				(questionNAnswer) =>
					questionNAnswer.uid === auth.currentUser.uid &&
					questionNAnswer.currentFolderID === folder.id &&
					questionNAnswer.currentMaterialID === folderMaterial.id &&
					questionNAnswer.materialType === "flash-card"
			)
			.map((questionNAnswer) =>
				questionNAnswerSystem.deleteQuestionNAnswer(questionNAnswer.id)
			);

		setOpenDeletionWarningDropdown(false);
	};

	const handleWarningDeletion = () => {
		setOpenDeletionWarningDropdown(!openDeletionWarningDropdown);
	};

	return (
		<div className="flex flex-col justify-center items-start bg-gray-100 px-4 py-2 rounded-xl w-full h-fit modified-overflow-with-height sm:overflow-x-scroll overflow-y-hidden">
			<div className="flex justify-between items-center w-full gap-5">
				<div className="flex flex-col justify-center items-start w-full">
					{questionNAnswerSystem.allQuestionsNAnswers
						.filter(
							(questionNAnswer) =>
								questionNAnswer.uid === auth.currentUser.uid &&
								questionNAnswer.currentFolderID === folder.id &&
								questionNAnswer.currentMaterialID === folderMaterial.id &&
								questionNAnswer.materialType === "flash-card"
						)
						.map((questionNAnswer) => questionNAnswer).length < 1 ? (
						<p className="text-sm text-gray-500 w-[165px]">
							Questions/Answers: --
						</p>
					) : (
						<p className="text-sm text-gray-500 w-[165px]">
							Questions/Answers:{" "}
							{
								questionNAnswerSystem.allQuestionsNAnswers
									.filter(
										(questionNAnswer) =>
											questionNAnswer.uid === auth.currentUser.uid &&
											questionNAnswer.currentFolderID === folder.id &&
											questionNAnswer.currentMaterialID === folderMaterial.id &&
											questionNAnswer.materialType === "flash-card"
									)
									.map((questionNAnswer) => questionNAnswer).length
							}
						</p>
					)}

					<p className="font-medium text-lg line-clamp-1">
						{folderMaterial.title}
					</p>
				</div>

				<div className="flex flex-col sm:flex-row justify-center sm:justify-end items-end sm:items-center gap-2 w-fit">
					<div className="flex flex-col sm:flex-row justify-center items-center gap-2">
						{gradePercentage > -0.01 && (
							<p
								className={`py-1 px-3 rounded-xl text-center min-w-full sm:min-w-[150px] text-sm ${
									gradePercentage < 70
										? "bg-red-200 text-red-800"
										: gradePercentage >= 70 && gradePercentage < 91
										? "bg-yellow-200 text-yellow-800"
										: gradePercentage >= 91 && "bg-green-200 text-green-800"
								}`}
							>
								Grade: {gradePercentage}%
							</p>
						)}

						{folderMaterial.completion < 0.1 ? (
							<p
								className={`bg-gray-500 py-1 px-3 rounded-xl text-white text-center min-w-full sm:min-w-[140px] text-sm`}
							>
								Completion: --%
							</p>
						) : (
							<p
								className={`py-1 px-3 rounded-xl text-center min-w-full sm:min-w-[150px] text-sm ${
									folderMaterial.completion < 70
										? "bg-red-200 text-red-800"
										: folderMaterial.completion >= 70 &&
										  folderMaterial.completion < 100
										? "bg-yellow-200 text-yellow-800"
										: folderMaterial.completion === 100 &&
										  "bg-green-200 text-green-800"
								}`}
							>
								Completion: {folderMaterial.completion}%
							</p>
						)}
					</div>

					<div className="flex justify-center items-center gap-2 w-fit text-sm relative">
						<div className="relative">
							<button
								onClick={() => {
									handleWarningDeletion();
								}}
								className="btn !bg-red-500 w-full"
							>
								<Image
									className={`object-contain min-w-[20px] min-h-[20px]`}
									src={"/icons/delete.svg"}
									alt="icon"
									width={20}
									height={20}
								/>
							</button>

							{openDeletionWarningDropdown &&
								createPortal(
									<div className="deletion-warning flash-card-modal absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-xl bg-white w-[70%] sm:w-[300px] h-fit p-5 shadow-[3px_3px_10px_0px_rgba(0,0,0,0.1)] z-50 flex flex-col gap-5 justify-center items-center text-center">
										<h1>
											<span>Are you sure you want to delete </span>
											<span className="font-semibold">{`'${folderMaterial.title}'`}</span>
											<span> flashcard?</span>
										</h1>

										<div className="flex flex-col justify-center items-center gap-1 w-full">
											<button
												onClick={() =>
													handleDeleteMainMaterial(folderMaterial.id)
												}
												className="btn !bg-red-500 w-full"
											>
												Delete
											</button>
											<button
												onClick={handleWarningDeletion}
												className="btn w-full"
											>
												Cancel
											</button>
										</div>
									</div>,
									document.body
								)}
						</div>
						<button
							onClick={() => handleOpenFlashCardEdit(folderMaterial.id)}
							className="btn !text-[#2871FF] !bg-transparent border border-[#2871FF] w-full"
						>
							Edit
						</button>

						<button
							onClick={() => {
								handleOpenFlashCardStart(folderMaterial.id);
							}}
							className="btn w-full"
						>
							Start
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
