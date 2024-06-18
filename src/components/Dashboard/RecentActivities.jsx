import React, { useContext, useEffect } from "react";
import FirebaseAPI from "../../pages/api/firebaseAPI";
import Image from "next/image";
import { UserCredentialsCtx } from "../../pages";

export default function Folders({ user }) {
	const { auth, registration, folderSystem, folderMaterialSystem } =
		FirebaseAPI();
	const {
		setFolderID,
		setMainMaterialID,
		setOpenFlashCardEdit,
		setOpenQuizEdit,
		setOpenNoteFolder,
	} = useContext(UserCredentialsCtx);

	const handleHideFolder = () => {
		registration.hidingSection1(user.hideSection1, user.id);
	};

	const handleOpenMaterialEdit = (folderID, id, materialType) => {
		folderSystem.updateCreatedTime(folderID);
		folderMaterialSystem.updateMainMaterialCreatedTime(id);
		setFolderID(folderID);
		setMainMaterialID(id);

		if (materialType === "flash-card") {
			setOpenFlashCardEdit(true);
		}

		if (materialType === "quiz") {
			setOpenQuizEdit(true);
		}

		if (materialType === "note") {
			setOpenNoteFolder(true);
		}
	};

	return (
		<>
			<div className="flex flex-col justify-center items-center relative w-full h-auto gap-2">
				<div className="flex justify-between items-center gap-2 w-full">
					<h1 className="title-h1">Recent Activities</h1>
					<button onClick={handleHideFolder} className="text-btn text-sm">
						Hide
					</button>
				</div>

				<div
					className={`grid grid-cols-[auto_auto_auto_auto] gap-7 justify-start items-center w-full h-fit overflow-no-height overflow-x-scroll overflow-y-hidden rounded-xl relative`}
				>
					{folderMaterialSystem.allFolderMaterials
						.filter(
							(folderMaterial) => folderMaterial.uid === auth.currentUser.uid
						)
						.slice(0, 4)
						.map((folderMaterial) => {
							return (
								<ChildRecent
									key={folderMaterial.id}
									folderMaterial={folderMaterial}
									user={user}
									handleOpenMaterialEdit={handleOpenMaterialEdit}
								/>
							);
						})}
				</div>

				{folderMaterialSystem.allFolderMaterials
					.filter(
						(folderMaterial) => folderMaterial.uid === auth.currentUser.uid
					)
					.map((folderMaterial) => folderMaterial).length < 1 && (
					<div
						className={`w-full h-[250px] rounded-xl flex flex-col gap-2 justify-center items-center ${
							user.theme ? "bg-[#333] text-[#555]" : "bg-gray-200 text-gray-400"
						}`}
					>
						<Image
							className="object-cover grayscale opacity-50"
							src={"/images/logo.png"}
							alt="logo"
							width={60}
							height={60}
							priority="true"
						/>
						<p className="text-lg">You have no recent activities</p>
					</div>
				)}
			</div>
		</>
	);
}

const ChildRecent = ({ folderMaterial, user, handleOpenMaterialEdit }) => {
	const { auth, folderSystem } = FirebaseAPI();

	return (
		<>
			<button
				onClick={() =>
					handleOpenMaterialEdit(
						folderMaterial.currentFolderID,
						folderMaterial.id,
						folderMaterial.materialType
					)
				}
				className={`flex flex-col justify-start items-start text-start text-btn w-[280px] h-full rounded-xl px-6 py-4 gap-3 ${
					user.theme ? "bg-[#444]" : "bg-gray-100"
				}`}
			>
				<div className="flex flex-col justify-center items-start w-full">
					<p
						className={`line-clamp-1 ${
							user.theme ? "text-[#777]" : "text-gray-400"
						}`}
					>
						{folderSystem.allFolders
							.filter(
								(folder) =>
									folder.uid === auth.currentUser.uid &&
									folder.id === folderMaterial.currentFolderID
							)
							.map((folder) => folder.name)
							.toString()}
					</p>

					<div className="flex justify-between items-center gap-5 w-full">
						<h1 className="text-xl font-semibold line-clamp-1">
							{folderMaterial.title}
						</h1>

						{folderMaterial.materialType === "flash-card" && (
							<Image
								className="object-contain"
								src={user.theme ? "/icons/notes_white.svg" : "/icons/notes.svg"}
								alt="icon"
								width={25}
								height={25}
							/>
						)}

						{folderMaterial.materialType === "quiz" && (
							<Image
								className="object-contain"
								src={user.theme ? "/icons/quiz_white.png" : "/icons/quiz.png"}
								alt="icon"
								width={25}
								height={25}
							/>
						)}

						{folderMaterial.materialType === "note" && (
							<Image
								className="object-contain"
								src={
									user.theme
										? "/icons/flashcard.png"
										: "/icons/flashcard_black.png"
								}
								alt="icon"
								width={25}
								height={25}
							/>
						)}
					</div>
				</div>

				<div className="flex flex-wrap justify-start items-center gap-2 w-full">
					{folderMaterial.materialType === "flash-card" && (
						<p
							className={`w-fit px-2 py-1 rounded-lg text-white ${
								user.theme ? "flash-card-bg-opacity" : "flash-card-bg"
							}`}
						>
							Flashcard
						</p>
					)}

					{folderMaterial.materialType === "quiz" && (
						<p
							className={`w-fit px-2 py-1 rounded-lg text-white ${
								user.theme ? "quiz-bg-opacity" : "quiz-bg"
							}`}
						>
							Quiz
						</p>
					)}

					{folderMaterial.materialType === "note" && (
						<p
							className={`w-fit px-2 py-1 rounded-lg text-white ${
								user.theme ? "note-bg-opacity" : "note-bg"
							}`}
						>
							Note
						</p>
					)}
				</div>
			</button>
		</>
	);
};
