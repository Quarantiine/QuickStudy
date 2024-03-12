import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { UserCredentialsCtx } from "../../../pages";
import FirebaseAPI from "../../../pages/api/firebaseAPI";
import NoteFolder from "./NoteFolder";

export default function NoteMain({ folder, user }) {
	const { auth, folderMaterialSystem } = FirebaseAPI();
	const { handleOpenFolderModal, handleOpenNoteFolder, folderID } =
		useContext(UserCredentialsCtx);
	const [openDropDown, setOpenDropDown] = useState(false);
	const [noteTitle, setNoteTitle] = useState("");
	const [searchQuery, setSearchQuery] = useState("");

	const handleOpenDropdown = () => {
		setOpenDropDown(!openDropDown);
	};

	const handleCreateNote = (e) => {
		e.preventDefault();
		if (noteTitle.length) {
			folderMaterialSystem.createMainMaterial(
				noteTitle,
				folder.name,
				0,
				folder.id,
				"note"
			);
			setOpenDropDown(false);
			setNoteTitle("");
		}
	};

	useEffect(() => {
		const closeDropdown = (e) => {
			if (!e.target.closest(".create-note-dropdown")) {
				setOpenDropDown(false);
			}
		};

		document.addEventListener("mousedown", closeDropdown);
		return () => document.removeEventListener("mousedown", closeDropdown);
	}, []);

	return (
		<>
			<div className="w-full h-auto flex flex-col justify-center items-start relative gap-3">
				<div className="flex flex-col justify-center items-start gap-3 w-full">
					<div className="flex w-full h-auto justify-between items-center gap-2">
						<div className="flex flex-col justify-start items-start">
							<h1 className="text-sm text-gray-500">{folder.name}</h1>
							<h1 className="title-h1">Note Folder Section</h1>
						</div>

						<button
							onClick={() => handleOpenFolderModal(folder.id)}
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

					<div className="flex flex-col sm:flex-row justify-start sm:justify-between item-start sm:items-center gap-3 w-full z-10">
						<div className="flex w-full sm:w-fit h-auto justify-start items-start gap-2 relative">
							<button
								onClick={handleOpenDropdown}
								className="create-note-dropdown btn flex justify-center items-center gap-1 w-full"
							>
								<p>Create Note Folders</p>
								<Image
									className={`object-contain ${openDropDown && "rotate-180"}`}
									src={"/icons/expand_more_white.svg"}
									alt="icon"
									width={25}
									height={25}
								/>
							</button>

							{openDropDown && (
								<form className="create-note-dropdown w-full h-auto bg-white shadow-lg rounded-xl p-4 absolute top-10 left-0 flex justify-center items-center z-10">
									<div className="w-full flex flex-col justify-center items-center gap-3">
										<div className="flex flex-col justify-center items-start gap-1 w-full">
											<div className="flex justify-between items-center gap-2 w-full">
												<label htmlFor="Title">Title</label>
											</div>
											<input
												className="input-field w-full"
												placeholder="Note Folder Title"
												type="text"
												onChange={(e) => setNoteTitle(e.target.value)}
											/>
										</div>

										<button
											onKeyDown={(e) =>
												e.key === "Enter" && handleCreateNote(e)
											}
											onClick={handleCreateNote}
											className="btn w-full"
										>
											Create
										</button>
									</div>
								</form>
							)}
						</div>

						<div className="relative w-full sm:w-fit flex justify-center items-center">
							<Image
								className="object-contain absolute left-3"
								src={"/icons/search.svg"}
								alt="icon"
								width={20}
								height={20}
							/>

							<input
								className="input-field !pl-10 w-full"
								placeholder="Search Note Folders"
								type="text"
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
					</div>
				</div>

				<div className="w-fit flex justify-center items-center gap-1 ml-auto">
					<p>Note Folders:</p>
					<p>
						{
							folderMaterialSystem.allFolderMaterials
								.filter(
									(noteFolder) =>
										noteFolder.uid === auth.currentUser.uid &&
										noteFolder.materialType === "note" &&
										noteFolder.currentFolderID === folderID
								)
								.map((noteFolder) => noteFolder).length
						}
					</p>
				</div>

				<div
					className={`grid w-full gap-5 ${
						folderMaterialSystem.allFolderMaterials
							?.filter(
								(noteFolder) =>
									noteFolder.uid === user.uid &&
									noteFolder.materialType === "note" &&
									noteFolder.currentFolderID === folder.id
							)
							.map((noteFolder) => noteFolder).length < 2
							? "grid-cols-1"
							: folderMaterialSystem.allFolderMaterials
									?.filter(
										(noteFolder) =>
											noteFolder.uid === user.uid &&
											noteFolder.materialType === "note" &&
											noteFolder.currentFolderID === folder.id
									)
									.map((noteFolder) => noteFolder).length < 3
							? "grid-cols-1 sm:grid-cols-2"
							: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
					}`}
				>
					{folderMaterialSystem.allFolderMaterials
						?.filter(
							(noteFolder) =>
								noteFolder.uid === user.uid &&
								noteFolder.materialType === "note" &&
								noteFolder.currentFolderID === folder.id
						)
						.map((noteFolder) => {
							if (
								noteFolder.title
									.normalize("NFD")
									.replace(/\p{Diacritic}/gu, "")
									.toLowerCase()
									.includes(searchQuery.toLowerCase())
							) {
								return (
									<NoteFolder
										key={noteFolder.id}
										noteFolder={noteFolder}
										folderMaterialSystem={folderMaterialSystem}
										handleOpenNoteFolder={handleOpenNoteFolder}
									/>
								);
							}
						})}
				</div>

				{folderMaterialSystem.allFolderMaterials
					?.filter(
						(noteFolder) =>
							noteFolder.uid === user.uid &&
							noteFolder.materialType === "note" &&
							noteFolder.currentFolderID === folder.id
					)
					.map((noteFolder) => noteFolder).length < 1 ? (
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
						<p className="text-lg text-gray-400">You have no note folders</p>
					</div>
				) : (
					folderMaterialSystem.allFolderMaterials
						?.filter(
							(noteFolder) =>
								noteFolder.uid === user.uid &&
								noteFolder.materialType === "note" &&
								noteFolder.currentFolderID === folder.id &&
								noteFolder.title
									.normalize("NFD")
									.replace(/\p{Diacritic}/gu, "")
									.toLowerCase()
									.includes(searchQuery.toLowerCase())
						)
						.map((noteFolder) => noteFolder).length < 1 && (
						<>
							<div className="relative mx-auto w-[80%] h-full flex justify-center items-center p-4 text-center">
								<p className="text-lg text-gray-400">
									<span>No Note Folders named: </span>{" "}
									<span className="text-gray-500">{searchQuery}</span>
								</p>
							</div>
						</>
					)
				)}
			</div>
		</>
	);
}
