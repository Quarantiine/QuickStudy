import React, { useCallback, useContext, useEffect, useState } from "react";
import Image from "next/image";
import FirebaseAPI from "../../../pages/api/firebaseAPI";
import { createPortal } from "react-dom";
import { UserCredentialsCtx } from "../../../pages";
import { useDropzone } from "react-dropzone";
import ChildNote from "./ChildNote";

export default function SectionNote({ folder, sectionNote }) {
	const { auth, noteSectionSystem, noteSystem } = FirebaseAPI();
	const { mainMaterialID } = useContext(UserCredentialsCtx);
	const [openDropdown, setOpenDropdown] = useState(false);
	const [editSectionTitle, setEditSectionTitle] = useState(false);
	const [sectionNoteTitle, setSectionNoteTitle] = useState("");
	const [openSectionNote, setOpenSectionNote] = useState(false);
	const [openCreateDropdown, setOpenCreateDropdown] = useState(false);
	const [noteTitle, setNoteTitle] = useState("");
	const [image, setImage] = useState("");
	const [closeImageWarning, setCloseImageWarning] = useState(false);

	const handleCloseImageWarning = () => {
		setCloseImageWarning(!closeImageWarning);
	};

	const handleOpenDropdown = () => {
		setOpenDropdown(!openDropdown);
	};

	useEffect(() => {
		const closeDropdown = (e) => {
			if (!e.target.closest(".section-note-dropdown")) {
				setOpenDropdown(false);
			}
		};

		document.addEventListener("mousedown", closeDropdown);
		return () => document.removeEventListener("mousedown", closeDropdown);
	}, [openDropdown]);

	const handleEditSectionNoteTitle = () => {
		if (sectionNoteTitle) {
			noteSectionSystem.editingSectionNote(sectionNoteTitle, sectionNote.id);
			setSectionNoteTitle("");
			setEditSectionTitle(false);
			setOpenDropdown(false);
		}
	};

	const handleDeleteSectionNote = () => {
		noteSectionSystem.deletingSectionNote(sectionNote.id);

		noteSystem.allNotes
			.filter(
				(note) =>
					note.uid === auth.currentUser.uid &&
					note.currentFolderID === folder.id &&
					note.materialType === "note" &&
					note.currentMaterialID === mainMaterialID &&
					note.currentSectionNoteID === sectionNote.id
			)
			.map((note) => noteSystem.deleteNote(note.id));
		setOpenDropdown(false);
	};

	const handleOpenEditing = () => {
		setEditSectionTitle(!editSectionTitle);
		setOpenDropdown(false);
	};

	useEffect(() => {
		const closeEditing = (e) => {
			if (!e.target.closest(".section-note-editing-input")) {
				setEditSectionTitle(false);
			}
		};

		document.addEventListener("mousedown", closeEditing);
		return () => document.removeEventListener("mousedown", closeEditing);
	}, [editSectionTitle]);

	const handleOpenSectionNote = () => {
		setOpenSectionNote(!openSectionNote);
	};

	useEffect(() => {
		const closeSectionModal = (e) => {
			if (!e.target.closest(".section-note-modal")) {
				setOpenSectionNote(false);
			}
		};

		document.addEventListener("mousedown", closeSectionModal);
		return () => document.removeEventListener("mousedown", closeSectionModal);
	}, [openSectionNote]);

	const handleOpenChangeDropdown = () => {
		setOpenCreateDropdown(!openCreateDropdown);
	};

	useEffect(() => {
		const closeNoteDropdown = (e) => {
			if (!e.target.closest(".create-note-dropdown-2")) {
				setOpenCreateDropdown(false);
			}
		};

		document.addEventListener("mousedown", closeNoteDropdown);
		return () => document.removeEventListener("mousedown", closeNoteDropdown);
	}, [openCreateDropdown]);

	const onDrop = useCallback((acceptedFiles) => {
		const reader = new FileReader();

		reader.onload = () => {
			setImage(reader.result);
		};

		reader.readAsDataURL(acceptedFiles[0]);
	}, []);

	const { getRootProps } = useDropzone({
		onDrop,
		maxSize: 1048487,
		maxFiles: 1,
	});

	const handleCreateNote = (e) => {
		e.preventDefault();

		if (noteTitle && image) {
			noteSystem.createNote(
				noteTitle,
				image,
				folder.id,
				mainMaterialID,
				sectionNote.id,
				"note"
			);

			setOpenCreateDropdown(false);
			setNoteTitle("");
			setImage("");
		}
	};

	return (
		<>
			{openSectionNote &&
				createPortal(
					<>
						<div className="flex justify-center items-center bg-[rgba(0,0,0,0.9)] w-full h-full top-0 left-0 fixed z-50 overflow-no-width overflow-x-hidden overflow-y-scroll">
							<div
								className={`section-note-modal w-[70%] h-[70%] flex flex-col justify-start items-start bg-white p-4 relative overflow-with-width overflow-x-hidden overflow-y-scroll rounded-xl gap-6`}
							>
								<div className="flex flex-col sm:flex-row justify-center items-center sm:justify-between sm:items-start gap-1 sm:gap-2 w-full">
									<div className="flex flex-col justify-center items-start gap-2 relative w-full">
										<div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center w-fit sm:w-full mx-auto sm:mx-0">
											<h1 className="title-h1 line-clamp-1">
												{sectionNote.title}
											</h1>
											<button
												className="!hidden sm:!block btn w-fit create-note-dropdown-2"
												onClick={handleOpenChangeDropdown}
											>
												Create Note
											</button>
										</div>

										{openCreateDropdown && (
											<form className="create-note-dropdown-2 w-full sm:w-[250px] h-auto bg-white shadow-lg rounded-xl p-4 absolute top-40 sm:top-10 left-0 sm:right-0 sm:left-auto flex justify-center items-center z-10">
												<div className="w-full flex flex-col justify-center items-center gap-3">
													<div className="flex flex-col justify-center items-start gap-1 w-full">
														<input
															className="input-field w-full"
															type="text"
															placeholder="Image Caption"
															onChange={(e) => setNoteTitle(e.target.value)}
															onKeyDown={(e) =>
																e.key === "Enter" && handleCreateNote(e)
															}
														/>
													</div>

													{image ? (
														<div className="w-full h-[150px] rounded-xl">
															<div
																{...getRootProps()}
																className="w-full h-full rounded-lg flex justify-center items-center text-center text-btn relative"
															>
																<Image
																	className="object-cover rounded-lg"
																	src={image}
																	alt="img"
																	fill
																	sizes="(max-width: 768px) 100vw, 33vw"
																/>
															</div>
														</div>
													) : (
														<>
															<div
																{...getRootProps()}
																className="bg-gray-300 w-full h-[150px] rounded-lg flex justify-center items-center text-sm text-gray-500 text-center text-btn p-1"
															>
																<p>Upload Image</p>
															</div>
														</>
													)}

													<div className="flex flex-col justify-center items-center w-full gap-2">
														<button
															onClick={handleCreateNote}
															className="btn w-full"
														>
															Create
														</button>
														<button
															onClick={handleOpenChangeDropdown}
															className="btn !bg-red-500 w-full sm:hidden"
														>
															Cancel
														</button>
													</div>
												</div>
											</form>
										)}
									</div>
								</div>

								<div className="flex flex-col w-full gap-5 sm:gap-3">
									<div className="flex flex-col sm:flex-row justify-start items-center sm:gap-5 w-full">
										<p className="text-lg">
											Notes:{" "}
											{noteSystem.allNotes
												.filter(
													(note) =>
														note.uid === auth.currentUser.uid &&
														note.materialType === "note" &&
														note.currentMaterialID === mainMaterialID &&
														note.currentFolderID === folder.id &&
														note.currentSectionNoteID === sectionNote.id
												)
												.map((note) => note).length
												? noteSystem.allNotes
														.filter(
															(note) =>
																note.uid === auth.currentUser.uid &&
																note.materialType === "note" &&
																note.currentMaterialID === mainMaterialID &&
																note.currentFolderID === folder.id &&
																note.currentSectionNoteID === sectionNote.id
														)
														.map((note) => note).length
												: "0"}
										</p>

										{!closeImageWarning && (
											<div className="bg-yellow-500 px-2 py-1 rounded-md text-sm flex flex-row justify-center items-center gap-1 text-center">
												<Image
													className="min-w-[15px] min-h-[15px] max-w-[15px] max-h-[15px]"
													src={"/icons/warning.svg"}
													alt="icon"
													width={15}
													height={15}
												/>

												<p className="text-white">
													Images will disappear if the images are too big
												</p>

												<button
													className="text-btn flex justify-center items-center w-fit"
													onClick={handleCloseImageWarning}
												>
													<Image
														className="min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px] ml-2"
														src={"/icons/close.svg"}
														alt="icon"
														width={20}
														height={20}
													/>
												</button>
											</div>
										)}
									</div>

									<button
										className="!block sm:!hidden btn w-full create-note-dropdown-2"
										onClick={handleOpenChangeDropdown}
									>
										Create Note
									</button>

									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 w-full">
										<>
											{noteSystem.allNotes
												.filter(
													(note) =>
														note.uid === auth.currentUser.uid &&
														note.materialType === "note" &&
														note.currentMaterialID === mainMaterialID &&
														note.currentFolderID === folder.id &&
														note.currentSectionNoteID === sectionNote.id
												)
												.map((note) => {
													return (
														<ChildNote
															key={note.id}
															note={note}
															mainMaterialID={mainMaterialID}
														/>
													);
												})}
										</>
									</div>

									{noteSystem.allNotes
										.filter(
											(note) =>
												note.uid === auth.currentUser.uid &&
												note.materialType === "note" &&
												note.currentMaterialID === mainMaterialID &&
												note.currentFolderID === folder.id &&
												note.currentSectionNoteID === sectionNote.id
										)
										.map((note) => note).length < 1 && (
										<>
											<p className="text-gray-400">No Notes</p>
										</>
									)}
								</div>
							</div>
						</div>
					</>,
					document.body
				)}

			<div className="relative w-[200px] h-auto bg-gray-200 rounded-lg text-sm p-4 flex items-start justify-between flex-col mx-auto">
				<>
					{editSectionTitle ? (
						<input
							className="input-field w-full section-note-editing-input"
							type="text"
							placeholder={sectionNote.title}
							onChange={(e) => setSectionNoteTitle(e.target.value)}
							onKeyDown={(e) =>
								e.key === "Enter" && handleEditSectionNoteTitle()
							}
						/>
					) : (
						<h1
							onDoubleClick={handleOpenEditing}
							className="text-lg font-bold line-clamp-1 w-full select-none"
						>
							{sectionNote.title}
						</h1>
					)}
				</>

				{noteSystem.allNotes
					.filter(
						(note) =>
							note.uid === auth.currentUser.uid &&
							note.materialType === "note" &&
							note.currentMaterialID === mainMaterialID &&
							note.currentFolderID === folder.id &&
							note.currentSectionNoteID === sectionNote.id
					)
					.map((note) => note).length > 0 ? (
					<div
						className={`justify-center w-full ${
							noteSystem.allNotes
								.filter(
									(note) =>
										note.uid === auth.currentUser.uid &&
										note.materialType === "note" &&
										note.currentMaterialID === mainMaterialID &&
										note.currentFolderID === folder.id &&
										note.currentSectionNoteID === sectionNote.id
								)
								.map((note) => note).length < 2
								? "grid-cols-1 py-3 flex relative items-start"
								: "grid-cols-2 py-3 gap-1 grid items-center"
						}`}
					>
						{noteSystem.allNotes
							.filter(
								(note) =>
									note.uid === auth.currentUser.uid &&
									note.materialType === "note" &&
									note.currentMaterialID === mainMaterialID &&
									note.currentFolderID === folder.id &&
									note.currentSectionNoteID === sectionNote.id
							)
							.slice(0, 4)
							.map((note) => {
								return (
									<React.Fragment key={note.id}>
										{noteSystem.allNotes
											.filter(
												(note) =>
													note.uid === auth.currentUser.uid &&
													note.materialType === "note" &&
													note.currentMaterialID === mainMaterialID &&
													note.currentFolderID === folder.id &&
													note.currentSectionNoteID === sectionNote.id
											)
											.map((note) => note).length < 2 ? (
											<div className="relative w-full h-[150px]">
												<Image
													className="object-cover rounded-lg w-full h-full"
													src={note.image}
													alt={`img`}
													fill
													sizes="(max-width: 768px) 100vw, 33vw"
												/>
											</div>
										) : (
											<Image
												className="object-cover rounded-lg w-full h-full"
												src={note.image}
												alt={`img`}
												width={100}
												height={100}
											/>
										)}
									</React.Fragment>
								);
							})}
					</div>
				) : (
					<p className="text-gray-500 pb-3 pt-2">No Notes</p>
				)}

				<div className="flex justify-center items-center gap-2 w-full">
					<button className="btn w-full" onClick={handleOpenSectionNote}>
						Open
					</button>
					<button className="text-btn" onClick={handleOpenDropdown}>
						<Image
							className="object-cover"
							src={"/icons/more_vert_black.svg"}
							alt="icon"
							width={30}
							height={30}
							priority="true"
						/>
					</button>

					{openDropdown && (
						<>
							<div className="section-note-dropdown absolute -bottom-10 right-0 w-fit h-fit px-3 py-1 flex flex-col gap-1 justify-center items-start bg-white rounded-lg shadow-lg z-10">
								<button
									className="text-btn base-text"
									onClick={handleOpenEditing}
								>
									Edit
								</button>
								<button
									className="text-btn text-red-500"
									onClick={handleDeleteSectionNote}
								>
									Delete
								</button>
							</div>
						</>
					)}
				</div>
			</div>
		</>
	);
}
