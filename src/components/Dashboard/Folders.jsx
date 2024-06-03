import React, { useContext, useEffect } from "react";
import FirebaseAPI from "../../pages/api/firebaseAPI";
import Image from "next/image";
import { UserCredentialsCtx } from "../../pages";

export default function Folders({ user }) {
	const { auth, registration, folderSystem } = FirebaseAPI();
	const { handleOpenFolderModal, handleViewAllFolders } =
		useContext(UserCredentialsCtx);

	const handleHideFolder = () => {
		registration.hidingSection2(user.hideSection2, user.id);
	};

	return (
		<>
			<div className="flex flex-col justify-center items-center relative w-full h-auto gap-5">
				<div className="flex justify-between items-center gap-2 w-full">
					<h1 className="title-h1">Folders</h1>
					<div className="flex justify-center items-center gap-4 ml-auto">
						<button onClick={handleHideFolder} className="text-btn text-sm">
							Hide
						</button>

						<button
							onClick={handleViewAllFolders}
							className="btn text-sm border border-[#2871FF] !bg-transparent !text-[#2871FF]"
						>
							View More
						</button>
					</div>
				</div>

				<div
					className={`grid grid-cols-[auto_auto_auto_auto] gap-7 justify-start items-center w-full h-fit overflow-no-height overflow-x-scroll overflow-y-hidden rounded-xl relative`}
				>
					{folderSystem.allFolders
						.filter((value) => value.uid === auth.currentUser.uid)
						.slice(0, 4)
						.map((folder) => {
							return (
								<ChildFolders
									key={folder.id}
									folder={folder}
									user={user}
									handleOpenFolderModal={handleOpenFolderModal}
								/>
							);
						})}
				</div>

				{folderSystem.allFolders
					.filter((folder) => folder.uid === auth.currentUser.uid)
					.map((folder) => folder).length < 1 && (
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
						<p className="text-lg">You have no folders</p>
					</div>
				)}
			</div>
		</>
	);
}

const ChildFolders = ({ folder, user, handleOpenFolderModal }) => {
	const { auth, folderMaterialSystem } = FirebaseAPI();

	const flashcards = folderMaterialSystem.allFolderMaterials
		.filter(
			(folderMaterial) =>
				folderMaterial.uid === auth.currentUser.uid &&
				folderMaterial.currentFolderID === folder.id &&
				folderMaterial.materialType === "flash-card"
		)
		.map((folderMaterial) => folderMaterial).length;
	const quizzes = folderMaterialSystem.allFolderMaterials
		.filter(
			(folderMaterial) =>
				folderMaterial.uid === auth.currentUser.uid &&
				folderMaterial.currentFolderID === folder.id &&
				folderMaterial.materialType === "quiz"
		)
		.map((folderMaterial) => folderMaterial).length;
	const notes = folderMaterialSystem.allFolderMaterials
		.filter(
			(folderMaterial) =>
				folderMaterial.uid === auth.currentUser.uid &&
				folderMaterial.currentFolderID === folder.id &&
				folderMaterial.materialType === "note"
		)
		.map((folderMaterial) => folderMaterial).length;

	return (
		<button
			onClick={() => handleOpenFolderModal(folder.id)}
			className={`flex flex-col justify-start items-start text-start text-btn gap-4 w-[316px] h-full rounded-xl px-6 py-4 ${
				user.theme ? "bg-[#444]" : "bg-gray-100"
			}`}
		>
			<div className="w-full flex flex-col gap-1">
				<div className="flex justify-between items-start gap-1.5 w-full">
					<h1 className="text-xl font-semibold line-clamp-1">{folder.name}</h1>
					<Image
						className="object-contain relative top-0.5"
						src={"/icons/folder.svg"}
						alt="icon"
						width={23}
						height={23}
					/>
				</div>

				<p
					className={`line-clamp-2 ${
						user.theme
							? folder.description === "No Description" && "text-[#777]"
							: folder.description === "No Description" && "text-gray-400"
					}`}
				>
					{folder.description}
				</p>
			</div>

			<div className="flex flex-wrap justify-start items-center gap-2 w-full">
				<p
					className={`flash-card-bg w-fit px-2 py-1 rounded-lg text-white ${
						user.theme ? "flash-card-bg-opacity" : "flash-card-bg"
					}`}
				>
					{flashcards} Flash-cards
				</p>
				<p
					className={`quiz-bg w-fit px-2 py-1 rounded-lg text-white ${
						user.theme ? "quiz-bg-opacity" : "quiz-bg"
					}`}
				>
					{quizzes} Quiz
				</p>
				<p
					className={`note-bg w-fit px-2 py-1 rounded-lg text-white ${
						user.theme ? "note-bg-opacity" : "note-bg"
					}`}
				>
					{notes} Notes
				</p>
			</div>
		</button>
	);
};
