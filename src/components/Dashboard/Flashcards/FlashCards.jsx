import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import FirebaseAPI from "../../../pages/api/firebaseAPI";
import { UserCredentialsCtx } from "../../../pages";
import Flashcard from "./Flashcard";

export default function FlashCards({ user, folder }) {
	const { auth, folderMaterialSystem, questionNAnswerSystem } = FirebaseAPI();
	const { handleOpenFlashCardEdit, handleOpenFlashCardStart } =
		useContext(UserCredentialsCtx);

	const [openDropDown, setOpenDropDown] = useState(false);
	const [flashCardTitle, setFlashCardTitle] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const handleOpenDropdown = () => {
		setOpenDropDown(!openDropDown);
	};

	const createMainMaterial = (e) => {
		e.preventDefault();

		if (flashCardTitle.length > 1 && flashCardTitle.length <= 100) {
			folderMaterialSystem.createMainMaterial(
				flashCardTitle,
				folder.name,
				0,
				folder.id,
				"flash-card"
			);

			setOpenDropDown(false);
			setFlashCardTitle("");
		}
	};

	useEffect(() => {
		const closeDropdown = (e) => {
			if (!e.target.closest(".create-flash-card-dropdown")) {
				setOpenDropDown(false);
			}
		};

		document.addEventListener("mousedown", closeDropdown);
		return () => document.removeEventListener("mousedown", closeDropdown);
	}, []);

	return (
		<>
			<div className="flex flex-col justify-center items-start gap-3 w-full">
				<div className="flex flex-col sm:flex-row justify-start sm:justify-between item-start sm:items-center gap-3 w-full z-10">
					<div className="relative w-full sm:w-fit">
						<button
							onClick={handleOpenDropdown}
							className="create-flash-card-dropdown btn flex justify-center items-center gap-1 w-full"
						>
							<p>Create Flash Card</p>
							<Image
								className={`object-contain ${openDropDown && "rotate-180"}`}
								src={"/icons/expand_more_white.svg"}
								alt="icon"
								width={25}
								height={25}
							/>
						</button>

						{openDropDown && (
							<form className="create-flash-card-dropdown w-full h-auto bg-white shadow-lg rounded-xl p-4 absolute top-10 left-0 flex justify-center items-center z-10">
								<div className="w-full flex flex-col justify-center items-center gap-3">
									<div className="flex flex-col justify-center items-start gap-1 w-full">
										<div className="flex justify-between items-center gap-2 w-full">
											<label htmlFor="Title">Title</label>
											<p
												className={`text-sm ${
													flashCardTitle.length > 100
														? "text-red-500"
														: "text-gray-400"
												}`}
											>
												{flashCardTitle.length}/100
											</p>
										</div>
										<input
											className="input-field w-full"
											placeholder="Flash Card Title"
											type="text"
											onChange={(e) => setFlashCardTitle(e.target.value)}
										/>
									</div>

									<button onClick={createMainMaterial} className="btn w-full">
										Create
									</button>
								</div>
							</form>
						)}
					</div>

					<div className="relative w-full sm:w-fit">
						<Image
							className="object-contain absolute top-1/2 -translate-y-1/2 left-3"
							src={"/icons/search.svg"}
							alt="icon"
							width={20}
							height={20}
						/>

						<input
							className="input-field !pl-10 w-full"
							placeholder="Search Flash Cards"
							type="text"
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
				</div>

				<p className="ml-auto pt-3">
					{folderMaterialSystem.allFolderMaterials
						?.filter(
							(folderMaterial) =>
								folderMaterial.uid === auth.currentUser.uid &&
								folderMaterial.materialType === "flash-card" &&
								folderMaterial.currentFolderID === folder.id
						)
						.map((folderMaterial) => folderMaterial).length === 1 ? (
						<span>
							{
								folderMaterialSystem.allFolderMaterials
									?.filter(
										(folderMaterial) =>
											folderMaterial.uid === auth.currentUser.uid &&
											folderMaterial.materialType === "flash-card" &&
											folderMaterial.currentFolderID === folder.id
									)
									.map((folderMaterial) => folderMaterial).length
							}{" "}
							Item
						</span>
					) : (
						<span>
							{
								folderMaterialSystem.allFolderMaterials
									?.filter(
										(folderMaterial) =>
											folderMaterial.uid === auth.currentUser.uid &&
											folderMaterial.materialType === "flash-card" &&
											folderMaterial.currentFolderID === folder.id
									)
									.map((folderMaterial) => folderMaterial).length
							}{" "}
							Items
						</span>
					)}
				</p>

				<div
					className={`w-full pb-7 grid gap-5 ${
						folderMaterialSystem.allFolderMaterials
							?.filter(
								(folderMaterial) =>
									folderMaterial.uid === auth.currentUser.uid &&
									folderMaterial.materialType === "flash-card" &&
									folderMaterial.currentFolderID === folder.id
							)
							.map((folderMaterial) => folderMaterial).length > 1
							? "grid-cols-1 xl:grid-cols-2"
							: "grid-cols-1"
					}`}
				>
					{folderMaterialSystem.allFolderMaterials
						?.filter(
							(folderMaterial) =>
								folderMaterial.uid === auth.currentUser.uid &&
								folderMaterial.materialType === "flash-card" &&
								folderMaterial.currentFolderID === folder.id
						)
						.map((folderMaterial) => {
							if (
								folderMaterial.title
									.normalize("NFD")
									.replace(/\p{Diacritic}/gu, "")
									.toLowerCase()
									.includes(searchQuery.toLowerCase())
							) {
								return (
									<Flashcard
										key={folderMaterial.id}
										user={user}
										folderMaterial={folderMaterial}
										questionNAnswerSystem={questionNAnswerSystem}
										folderMaterialSystem={folderMaterialSystem}
										handleOpenFlashCardEdit={handleOpenFlashCardEdit}
										handleOpenFlashCardStart={handleOpenFlashCardStart}
										folder={folder}
									/>
								);
							}
						})}

					{folderMaterialSystem.allFolderMaterials
						?.filter(
							(folderMaterial) =>
								folderMaterial.uid === auth.currentUser.uid &&
								folderMaterial.materialType === "flash-card" &&
								folderMaterial.currentFolderID === folder.id &&
								folderMaterial.title
									.normalize("NFD")
									.replace(/\p{Diacritic}/gu, "")
									.toLowerCase()
									.includes(searchQuery.toLowerCase())
						)
						.map((folderMaterial) => folderMaterial).length < 1 &&
						folderMaterialSystem.allFolderMaterials
							?.filter(
								(folderMaterial) =>
									folderMaterial.uid === auth.currentUser.uid &&
									folderMaterial.materialType === "flash-card" &&
									folderMaterial.currentFolderID === folder.id
							)
							.map((folderMaterial) => folderMaterial).length > 0 && (
							<>
								<div className="absolute top-0 left-0 w-full h-full flex justify-center items-center p-4 text-center">
									<p className="text-lg text-gray-400">
										<span>No flash cards named: </span>{" "}
										<span className="text-gray-500">{searchQuery}</span>
									</p>
								</div>
							</>
						)}
				</div>

				{folderMaterialSystem.allFolderMaterials
					?.filter(
						(folderMaterial) =>
							folderMaterial.uid === auth.currentUser.uid &&
							folderMaterial.materialType === "flash-card" &&
							folderMaterial.currentFolderID === folder.id
					)
					.map((folderMaterial) => folderMaterial).length < 1 && (
					<div
						className={`relative top-1/2 -translate-y-1/2 left-0 w-full h-full rounded-xl flex flex-col gap-2 justify-center items-center`}
					>
						<Image
							className="object-cover grayscale opacity-50"
							src={"/images/logo.png"}
							alt="logo"
							width={60}
							height={60}
							priority="true"
						/>
						<p className="text-lg text-gray-400">You have no flash cards</p>
					</div>
				)}
			</div>
		</>
	);
}
