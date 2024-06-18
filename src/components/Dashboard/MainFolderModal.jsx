import React from "react";
import Image from "next/image";

export default function MainFolderModal({
	auth,
	folder,
	folderID,
	editFolderName,
	changedFolderNameRef,
	handleChangeFolderName,
	handleEditFolderName,
	handleFolderDeleteDropdown,
	folderDeleteDropdown,
	handleViewAllFolders,
	editFolderDescription,
	changedFolderDescriptionRef,
	handleChangeFolderDescription,
	handleEditFolderDescription,
	folderMaterialSystem,
	handleOpenFlashCardsModal,
	handleOpenQuizzesModal,
	handleDeleteFolder,
	handleOpenNoteModal,
}) {
	return (
		<>
			<form className="flex flex-col justify-center items-start gap-4 w-full">
				<div className="flex flex-col sm:flex-row justify-center sm:justify-between items-start gap-2 w-full">
					{editFolderName ? (
						<div className="flex flex-col justify-center items-center gap-2 w-full">
							<input
								className="folder-delete-dropdown input-field w-full"
								placeholder={folder.name}
								type="text"
								ref={changedFolderNameRef}
								onKeyDown={(e) =>
									e.key === "Enter" && handleChangeFolderName(e, folder.id)
								}
							/>

							<div className="flex justify-center items-center gap-2 w-full">
								<button
									onClick={(e) => handleChangeFolderName(e, folder.id)}
									className="folder-delete-dropdown btn text-sm sm:text-base flex justify-center items-center gap-1 w-full"
								>
									Change
								</button>
								<button
									onClick={handleEditFolderName}
									className="folder-delete-dropdown btn !text-[#2871FF] !bg-white border border-[#2871FF] text-sm sm:text-base flex justify-center items-center gap-1 w-full"
								>
									Cancel
								</button>
							</div>
						</div>
					) : (
						<h1
							onClick={handleEditFolderName}
							className="text-btn !text-2xl sm:!text-3xl font-semibold title-h1 text-center sm:text-start line-clamp-1"
						>
							{folder.name}
						</h1>
					)}

					<div className="w-full sm:w-fit h-fit flex justify-end items-center">
						{!editFolderName && (
							<div className="relative w-full">
								<button
									onClick={handleFolderDeleteDropdown}
									className="folder-delete-dropdown btn !bg-transparent !text-[#2871FF] border border-[#2871FF] text-sm flex justify-center items-center w-full sm:w-[130px] !py-1 relative top-0.5"
								>
									<p>Show More</p>
									<Image
										className={`object-contain relative ${
											folderDeleteDropdown && "rotate-180"
										}`}
										src={"/icons/expand_more_blue.svg"}
										alt="icon"
										width={27}
										height={27}
									/>
								</button>

								{folderDeleteDropdown && (
									<div className="folder-delete-dropdown absolute top-10 left-0 w-full h-fit shadow-xl rounded-xl z-10 bg-white p-2 flex flex-col justify-center items-start gap-2 text-sm">
										<button
											onClick={(e) => handleDeleteFolder(e, folder.id)}
											className="btn w-full !bg-red-500"
										>
											Delete Folder
										</button>
										<button
											onClick={handleViewAllFolders}
											className="btn !bg-transparent !text-[#2871FF] border border-[#2871FF] w-full folder-delete-dropdown"
										>
											View All Folders
										</button>
										<button
											onClick={handleFolderDeleteDropdown}
											className="btn w-full folder-delete-dropdown"
										>
											Cancel
										</button>
									</div>
								)}
							</div>
						)}
					</div>
				</div>

				{editFolderDescription ? (
					<div className="flex flex-col justify-center items-center gap-2 w-full">
						<input
							className="input-field w-full folder-delete-dropdown"
							placeholder={folder.description}
							type="text"
							ref={changedFolderDescriptionRef}
							onKeyDown={(e) =>
								e.key === "Enter" && handleChangeFolderDescription(e, folder.id)
							}
						/>
						<div className="flex justify-center items-center gap-2 w-full">
							<button
								onClick={(e) => handleChangeFolderDescription(e, folder.id)}
								className="folder-delete-dropdown btn text-sm sm:text-base flex justify-center items-center gap-1 w-full"
							>
								Change
							</button>
							<button
								onClick={handleEditFolderDescription}
								className="folder-delete-dropdown btn !text-[#2871FF] !bg-white border border-[#2871FF] text-sm sm:text-base flex justify-center items-center gap-1 folder-delete-dropdown w-full"
							>
								Cancel
							</button>
						</div>
					</div>
				) : (
					<div className="w-full h-fit max-h-[100px] overflow-with-width overflow-x-hidden overflow-y-scroll">
						<p
							onClick={handleEditFolderDescription}
							className="text-btn text-gray-500 text-center sm:text-start"
						>
							{folder.description}
						</p>
					</div>
				)}
			</form>

			<div
				className={`question-n-answers-container grid grid-cols-[auto_auto_auto] gap-7 justify-start items-center w-full h-fit overflow-no-height overflow-x-scroll overflow-y-hidden rounded-xl relative`}
			>
				<div className="question-n-answers-child w-[200px] h-[150px] rounded-xl bg-gray-100 p-4 flex flex-col justify-start items-start">
					<div className="flex justify-between items-center gap-2 w-full">
						<h1 className="text-xl font-semibold">Flash Cards</h1>
						<Image src={"/icons/notes.svg"} alt="icon" width={25} height={25} />
					</div>
					<p>
						{
							folderMaterialSystem.allFolderMaterials
								?.filter(
									(folderMaterial) =>
										folderMaterial.uid === auth.currentUser.uid &&
										folderMaterial.materialType === "flash-card" &&
										folderMaterial.currentFolderID === folderID
								)
								.map((folderMaterial) => folderMaterial).length
						}{" "}
						Items
					</p>
					<button
						onClick={handleOpenFlashCardsModal}
						className="btn w-full mt-auto"
					>
						Open
					</button>
				</div>

				<div className="question-n-answers-child w-[200px] h-[150px] rounded-xl bg-gray-100 p-4 flex flex-col justify-start items-start">
					<div className="flex justify-between items-center gap-2 w-full">
						<h1 className="text-xl font-semibold">Quizzes</h1>
						<Image src={"/icons/quiz.png"} alt="icon" width={25} height={25} />
					</div>

					<p>
						{
							folderMaterialSystem.allFolderMaterials
								?.filter(
									(folderMaterial) =>
										folderMaterial.uid === auth.currentUser.uid &&
										folderMaterial.materialType === "quiz" &&
										folderMaterial.currentFolderID === folderID
								)
								.map((folderMaterial) => folderMaterial).length
						}{" "}
						Items
					</p>
					<button
						onClick={handleOpenQuizzesModal}
						className="btn w-full mt-auto"
					>
						Open
					</button>
				</div>

				<div className="question-n-answers-child w-[200px] h-[150px] rounded-xl bg-gray-100 p-4 flex flex-col justify-start items-start">
					<div className="flex justify-between items-center gap-2 w-full">
						<h1 className="text-xl font-semibold">Notes</h1>
						<Image
							src={"/icons/flashcard_black.png"}
							alt="icon"
							width={25}
							height={25}
						/>
					</div>

					<p>
						{
							folderMaterialSystem.allFolderMaterials
								?.filter(
									(folderMaterial) =>
										folderMaterial.uid === auth.currentUser.uid &&
										folderMaterial.materialType === "note" &&
										folderMaterial.currentFolderID === folderID
								)
								.map((folderMaterial) => folderMaterial).length
						}{" "}
						Items
					</p>

					<button onClick={handleOpenNoteModal} className="btn w-full mt-auto">
						Open
					</button>
				</div>
			</div>
		</>
	);
}
