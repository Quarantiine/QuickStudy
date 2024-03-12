import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { UserCredentialsCtx } from "../../../pages";
import FirebaseAPI from "../../../pages/api/firebaseAPI";

export default function Notes({ folder, user }) {
	const { auth, noteSystem, folderMaterialSystem } = FirebaseAPI();
	const { handleBackToNoteModal, mainMaterialID } =
		useContext(UserCredentialsCtx);
	const [openDropDown, setOpenDropDown] = useState(false);
	const [noteTitle, setNoteTitle] = useState("");
	const [searchQuery, setSearchQuery] = useState("");

	const handleOpenDropdown = () => {
		setOpenDropDown(!openDropDown);
	};

	useEffect(() => {
		const closeDropdown = (e) => {
			if (!e.target.closest(".create-note-dropdown-2")) {
				setOpenDropDown(false);
			}
		};

		document.addEventListener("mousedown", closeDropdown);
		return () => document.removeEventListener("mousedown", closeDropdown);
	}, []);

	return (
		<>
			<div className="flex justify-center items-center bg-[rgba(0,0,0,0.9)] w-full h-full top-0 left-0 fixed z-50 overflow-no-width overflow-x-hidden overflow-y-scroll">
				<div
					className={`note-modal w-[100%] h-[100%] flex flex-col justify-start items-start gap-10 bg-white py-7 px-5 relative overflow-with-width overflow-x-hidden overflow-y-scroll`}
				>
					<div className="flex flex-col justify-center items-start gap-3 w-full">
						<div className="flex w-full h-auto justify-between items-center gap-2">
							<div className="flex flex-col justify-start items-start w-[89%] line-clamp-1">
								<h1 className="text-sm text-gray-500">Note Section</h1>
								<h1 className="title-h1 line-clamp-1 w-full">
									{folderMaterialSystem.allFolderMaterials
										.filter(
											(noteFolder) =>
												auth.currentUser.uid === noteFolder.uid &&
												noteFolder.id === mainMaterialID
										)
										.map((noteFolder) => noteFolder.title)
										.toString()}
								</h1>
							</div>

							<button
								onClick={handleBackToNoteModal}
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
									className="create-note-dropdown-2 btn flex justify-center items-center gap-1 w-full"
								>
									<p>Create Note Sections</p>
									<Image
										className={`object-contain ${openDropDown && "rotate-180"}`}
										src={"/icons/expand_more_white.svg"}
										alt="icon"
										width={25}
										height={25}
									/>
								</button>

								{openDropDown && (
									<form className="create-note-dropdown-2 w-full h-auto bg-white shadow-lg rounded-xl p-4 absolute top-10 left-0 flex justify-center items-center z-10">
										<div className="w-full flex flex-col justify-center items-center gap-3">
											<div className="flex flex-col justify-center items-start gap-1 w-full">
												<div className="flex justify-between items-center gap-2 w-full">
													<label htmlFor="Title">Title</label>
												</div>
												<input
													className="input-field w-full"
													placeholder="Note Section Title"
													type="text"
													onChange={(e) => setNoteTitle(e.target.value)}
												/>
											</div>

											<button
												onKeyDown={(e) =>
													e.key === "Enter" && e.preventDefault()
												}
												onClick={(e) => e.preventDefault()}
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
									placeholder="Search Note Sections"
									type="text"
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
							</div>
						</div>
					</div>

					{noteSystem.allNotes
						?.filter(
							(note) =>
								note.uid === user.uid &&
								note.materialType === "note" &&
								note.currentFolderID === folder.id
						)
						.map((note) => note).length < 1 ? (
						<div
							className={`relative w-full h-[60%] rounded-xl flex flex-col gap-2 justify-center items-center`}
						>
							<Image
								className="object-cover grayscale opacity-50"
								src={"/images/logo.png"}
								alt="logo"
								width={60}
								height={60}
								priority="true"
							/>
							<p className="text-lg text-gray-400">You have no notes</p>
						</div>
					) : (
						noteSystem.allNotes
							?.filter(
								(note) =>
									note.uid === user.uid &&
									note.materialType === "note" &&
									note.currentFolderID === folder.id &&
									note.title
										.normalize("NFD")
										.replace(/\p{Diacritic}/gu, "")
										.toLowerCase()
										.includes(searchQuery.toLowerCase())
							)
							.map((note) => note).length < 1 && (
							<>
								<div className="relative mx-auto w-[80%] h-full flex justify-center items-center p-4 text-center">
									<p className="text-lg text-gray-400">
										<span>No Notes named: </span>{" "}
										<span className="text-gray-500">{searchQuery}</span>
									</p>
								</div>
							</>
						)
					)}
				</div>
			</div>
		</>
	);
}
