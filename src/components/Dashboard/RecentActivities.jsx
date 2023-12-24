import React, { useContext, useEffect } from "react";
import FirebaseAPI from "../../pages/api/firebaseAPI";
import Image from "next/image";
import { UserCredentialsCtx } from "../../pages";

export default function Folders({ user }) {
	const { registration, folderSystem, folderMaterialSystem } = FirebaseAPI();
	const { setFolderID, setFlashCardID, setOpenFlashCardEdit } =
		useContext(UserCredentialsCtx);

	const handleHideFolder = () => {
		registration.hidingSection1(user.hideSection1, user.id);
	};

	const handleOpenFlashCardEdit = (folderID, id) => {
		folderSystem.updateCreatedTime(folderID);
		folderMaterialSystem.updateFlashCardCreatedTime(id);
		setFolderID(folderID);
		setFlashCardID(id);
		setOpenFlashCardEdit(true);
	};

	return (
		<>
			<div className="flex flex-col justify-center items-center relative w-full h-auto gap-5">
				<div className="flex justify-between items-center gap-2 w-full">
					<h1 className="title-h1">Recent Activities</h1>
					<button onClick={handleHideFolder} className="text-btn text-sm">
						Hide
					</button>
				</div>

				<div
					className={`grid grid-cols-[auto_auto_auto] gap-7 justify-start items-center w-full h-fit overflow-no-height overflow-x-scroll overflow-y-hidden rounded-xl relative`}
				>
					{folderMaterialSystem.allFolderMaterials
						.filter((folderMaterial) => folderMaterial.uid === user.uid)
						.slice(0, 3)
						.map((folderMaterial) => {
							return (
								<ChildRecent
									key={folderMaterial.id}
									folderMaterial={folderMaterial}
									user={user}
									handleOpenFlashCardEdit={handleOpenFlashCardEdit}
								/>
							);
						})}
				</div>

				{folderMaterialSystem.allFolderMaterials
					.filter((folderMaterial) => folderMaterial.uid === user.uid)
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
						<p className="text-lg">You have no folders</p>
					</div>
				)}
			</div>
		</>
	);
}

const ChildRecent = ({ folderMaterial, user, handleOpenFlashCardEdit }) => {
	return (
		<>
			<button
				onClick={() =>
					handleOpenFlashCardEdit(
						folderMaterial.currentFolderID,
						folderMaterial.id
					)
				}
				className={`flex flex-col justify-start items-start text-start text-btn w-[280px] h-full rounded-xl px-6 py-4 ${
					user.theme ? "bg-[#444]" : "bg-gray-100"
				}`}
			>
				<p
					className={`line-clamp-1 ${
						user.theme ? "text-[#777]" : "text-gray-400"
					}`}
				>
					{folderMaterial.currentFolderName}
				</p>

				<div className="flex justify-between items-center gap-1 w-full">
					<h1 className="text-xl font-semibold line-clamp-1">
						{folderMaterial.title}
					</h1>
					<Image
						className="object-contain"
						src={
							user.theme ? "/icons/flashcard.png" : "/icons/flashcard_black.png"
						}
						alt="icon"
						width={25}
						height={25}
					/>
				</div>
			</button>
		</>
	);
};
