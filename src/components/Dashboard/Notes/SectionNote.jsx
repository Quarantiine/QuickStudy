import React, { useCallback, useContext, useEffect, useState } from "react";
import Image from "next/image";
import FirebaseAPI from "../../../pages/api/firebaseAPI";
import { createPortal } from "react-dom";
import { UserCredentialsCtx } from "../../../pages";
import { useDropzone } from "react-dropzone";
import ChildNote from "./ChildNote";
import SectionNotePreview from "./SectionNotePreview";

export default function SectionNote({ folder, sectionNote }) {
	const { auth, noteSectionSystem, noteSystem } = FirebaseAPI();
	const { mainMaterialID } = useContext(UserCredentialsCtx);
	const [openDropdown, setOpenDropdown] = useState(false);
	const [editSectionTitle, setEditSectionTitle] = useState(false);
	const [sectionNoteTitle, setSectionNoteTitle] = useState("");
	const [openSectionNote, setOpenSectionNote] = useState(false);
	const [openAddImageDropdown, setOpenAddImageDropdown] = useState(false);
	const [image, setImage] = useState("");
	const [noteTitle, setNoteTitle] = useState("");
	const [closeImageWarning, setCloseImageWarning] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [notesDropdown, setNotesDropdown] = useState(false);
	const [openAddLinkDropdown, setOpenAddLinkDropdown] = useState(false);
	const [url, setUrl] = useState("");

	function isURL() {
		const urlRegex = /^(http|https):\/\/\S+/;
		return urlRegex.test(url);
	}

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
		noteSystem.updateSectionNoteCreatedDate(sectionNote.id);
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

	const handleOpenAddImageDropdown = () => {
		setOpenAddImageDropdown(!openAddImageDropdown);
	};

	useEffect(() => {
		const closeAddImageDropdown = (e) => {
			if (!e.target.closest(".create-note-dropdown-2")) {
				setOpenAddImageDropdown(false);
			}
		};

		document.addEventListener("mousedown", closeAddImageDropdown);
		return () =>
			document.removeEventListener("mousedown", closeAddImageDropdown);
	}, [openAddImageDropdown]);

	const onDrop = useCallback((acceptedFiles) => {
		const reader = new FileReader();

		reader.onload = () => {
			setImage(reader.result);
		};

		reader.readAsDataURL(acceptedFiles[0]);
	}, []);

	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
		maxSize: 1048487,
		maxFiles: 1,
	});

	const handleAddImageNote = () => {
		if (noteTitle && image) {
			noteSystem.createImageNote(
				noteTitle,
				image,
				folder.id,
				mainMaterialID,
				sectionNote.id,
				"note"
			);

			setOpenAddImageDropdown(false);
			setNoteTitle("");
			setImage("");
		}
	};

	const handleNotesDropdown = () => {
		setNotesDropdown(!notesDropdown);
		setOpenAddImageDropdown(false);
		setOpenAddLinkDropdown(false);
	};

	useEffect(() => {
		const closeNotesDropdown = (e) => {
			if (!e.target.closest(".create-note-dropdown-3")) {
				setNotesDropdown(false);
			}
		};

		document.addEventListener("mousedown", closeNotesDropdown);
		return () => document.removeEventListener("mousedown", closeNotesDropdown);
	}, [notesDropdown]);

	const handleOpenAddLinkDropdown = () => {
		setOpenAddLinkDropdown(!openAddLinkDropdown);
	};

	const handleAddLinkNote = () => {
		if (noteTitle && isURL()) {
			noteSystem.createLinkNote(
				noteTitle,
				url,
				folder.id,
				mainMaterialID,
				sectionNote.id,
				"note"
			);

			setOpenAddLinkDropdown(false);
			setNoteTitle("");
			setUrl("");
		}
	};

	useEffect(() => {
		const closeLinkDropdown = (e) => {
			if (!e.target.closest(".create-note-dropdown-4")) {
				setOpenAddLinkDropdown(false);
			}
		};

		document.addEventListener("mousedown", closeLinkDropdown);
		return () => document.removeEventListener("mousedown", closeLinkDropdown);
	}, [openAddLinkDropdown]);

	return (
		<>
			{openSectionNote &&
				createPortal(
					<>
						<div className="flex justify-center items-center bg-[rgba(0,0,0,0.9)] w-full h-full top-0 left-0 fixed z-50 overflow-no-width overflow-x-hidden overflow-y-scroll">
							<div
								className={`section-note-modal w-[70%] h-[70%] flex flex-col justify-start items-start bg-white p-4 relative overflow-with-width overflow-x-hidden overflow-y-scroll rounded-xl sm:gap-6`}
							>
								{!closeImageWarning && (
									<div className="flex flex-col sm:flex-row justify-start items-center sm:gap-5 w-full">
										<div className="w-full bg-yellow-500 px-2 py-1 rounded-md text-sm flex flex-row justify-center items-center gap-1 text-center">
											<Image
												className="min-w-[15px] min-h-[15px] max-w-[15px] max-h-[15px]"
												src={"/icons/warning.svg"}
												alt="icon"
												width={15}
												height={15}
											/>

											<p className="text-white">
												Images will disappear if the image are too big
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
									</div>
								)}

								<div className="flex flex-col sm:flex-row justify-center items-center sm:justify-between sm:items-start gap-1 sm:gap-2 w-full">
									<div className="flex flex-col justify-center items-start gap-2 relative w-full">
										<div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center w-full mx-auto sm:mx-0">
											<div className="flex flex-col justify-start item-start w-full gap-1">
												<h1 className="title-h1 line-clamp-1">
													{sectionNote.title}
												</h1>
												<p className="text-lg">
													Notes{" "}
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
											</div>

											<div className="flex flex-col sm:gap-2 justify-center items-center w-full sm:w-fit mt-2 sm:mt-0">
												<div className="flex justify-center items-center relative w-full">
													<button
														className="create-note-dropdown-3 !hidden sm:!block btn create-note-dropdown-2 w-full whitespace-nowrap"
														onClick={handleNotesDropdown}
													>
														Add Notes
													</button>

													{notesDropdown && (
														<div className="create-note-dropdown-3 flex flex-col justify-center items-center w-full absolute top-24 sm:top-10 left-0 bg-white px-3 py-1.5 rounded-lg gap-2 shadow-md z-10">
															<button
																className="text-btn text-blue-500 create-note-dropdown-2 w-full whitespace-nowrap"
																onClick={handleOpenAddImageDropdown}
															>
																Add Image
															</button>
															<button
																className="text-btn text-blue-500 create-note-dropdown-2 w-full whitespace-nowrap"
																onClick={handleOpenAddLinkDropdown}
															>
																Add Link
															</button>
														</div>
													)}
												</div>

												<input
													className="input-field w-full sm:w-fit"
													placeholder="Search Notes By Title"
													type="text"
													onChange={(e) => setSearchQuery(e.target.value)}
												/>
											</div>
										</div>

										{openAddImageDropdown && (
											<div className="create-note-dropdown-2 w-full sm:w-[250px] h-auto bg-white shadow-lg rounded-xl p-4 absolute top-40 sm:top-10 left-0 sm:right-0 sm:left-auto flex justify-center items-center z-10">
												<div className="w-full flex flex-col justify-center items-center gap-3">
													<div className="flex flex-col justify-center items-start gap-1 w-full">
														<input
															className="input-field w-full"
															type="text"
															placeholder="Image Caption"
															onChange={(e) => setNoteTitle(e.target.value)}
															onKeyDown={(e) =>
																e.key === "Enter" && handleAddImageNote()
															}
														/>
													</div>

													<div
														className="w-full h-[150px] flex justify-center items-center"
														{...getRootProps()}
													>
														<input {...getInputProps()} />
														{image ? (
															<div className="w-full h-full rounded-xl">
																<div className="w-full h-full rounded-lg flex justify-center items-center text-center text-btn relative">
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
																<div className="bg-gray-300 w-full h-full rounded-lg flex justify-center items-center text-sm text-gray-500 text-center text-btn p-1">
																	<p>Upload Image</p>
																</div>
															</>
														)}
													</div>

													<div className="flex flex-col justify-center items-center w-full gap-2">
														<button
															onClick={handleAddImageNote}
															className="btn w-full"
														>
															Add Image
														</button>
														<button
															onClick={handleOpenAddImageDropdown}
															className="btn !bg-red-500 w-full sm:hidden"
														>
															Cancel
														</button>
													</div>
												</div>
											</div>
										)}

										{openAddLinkDropdown && (
											<div className="create-note-dropdown-4 w-full sm:w-[250px] h-auto bg-white shadow-lg rounded-xl p-4 absolute top-40 sm:top-10 left-0 sm:right-0 sm:left-auto flex justify-center items-center z-10">
												<div className="w-full flex flex-col justify-center items-center gap-3">
													<div className="flex flex-col justify-center items-start gap-1 w-full">
														<input
															className="input-field w-full"
															type="text"
															placeholder="URL Caption"
															onChange={(e) => setNoteTitle(e.target.value)}
															onKeyDown={(e) =>
																e.key === "Enter" && handleAddLinkNote()
															}
														/>
													</div>

													<div className="flex flex-col justify-center items-start gap-1 w-full">
														<input
															className="input-field w-full"
															type="text"
															placeholder="Add URL"
															onChange={(e) => setUrl(e.target.value)}
															onKeyDown={(e) =>
																e.key === "Enter" && handleAddLinkNote()
															}
														/>
													</div>

													<div className="flex flex-col justify-center items-center w-full gap-2">
														<button
															onClick={handleAddLinkNote}
															className="btn w-full"
														>
															Add Link
														</button>
														<button
															onClick={handleOpenAddLinkDropdown}
															className="btn !bg-red-500 w-full sm:hidden"
														>
															Cancel
														</button>
													</div>
												</div>
											</div>
										)}
									</div>
								</div>

								<div className="flex flex-col w-full gap-5 sm:gap-3">
									<div className="create-note-dropdown-3 flex sm:hidden flex-col gap-1 justify-center item-center mt-3">
										<button
											className="btn w-full create-note-dropdown-2"
											onClick={handleNotesDropdown}
										>
											Add Notes
										</button>
									</div>

									<div className="flex flex-col justify-center items-center w-full h-auto gap-5">
										{noteSystem.allNotes
											.filter(
												(note) =>
													note.uid === auth.currentUser.uid &&
													note.materialType === "note" &&
													note.currentMaterialID === mainMaterialID &&
													note.currentFolderID === folder.id &&
													note.currentSectionNoteID === sectionNote.id &&
													note.linkNote
											)
											.map((linkNote) => linkNote).length > 0 && (
											<div className="flex flex-col gap-1 w-full">
												{noteSystem.allNotes
													.filter(
														(note) =>
															note.uid === auth.currentUser.uid &&
															note.materialType === "note" &&
															note.currentMaterialID === mainMaterialID &&
															note.currentFolderID === folder.id &&
															note.currentSectionNoteID === sectionNote.id &&
															!note.title
																.normalize("NFD")
																.replace(/\p{Diacritic}/gu, "")
																.toLowerCase()
																.includes(searchQuery.toLowerCase())
													)
													.map((note) => note).length < 1 && (
													<h1 className="text-lg text-gray-500 w-full text-start">
														Link Section
													</h1>
												)}

												<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-3 w-full">
													<>
														{noteSystem.allNotes
															.filter(
																(note) =>
																	note.uid === auth.currentUser.uid &&
																	note.materialType === "note" &&
																	note.currentMaterialID === mainMaterialID &&
																	note.currentFolderID === folder.id &&
																	note.currentSectionNoteID ===
																		sectionNote.id &&
																	note.linkNote
															)
															.map((note) => {
																if (
																	note.title
																		.normalize("NFD")
																		.replace(/\p{Diacritic}/gu, "")
																		.toLowerCase()
																		.includes(searchQuery.toLowerCase())
																) {
																	return (
																		<ChildNote key={note.id} note={note} />
																	);
																}
															})}
													</>
												</div>
											</div>
										)}

										{noteSystem.allNotes
											.filter(
												(note) =>
													note.uid === auth.currentUser.uid &&
													note.materialType === "note" &&
													note.currentMaterialID === mainMaterialID &&
													note.currentFolderID === folder.id &&
													note.currentSectionNoteID === sectionNote.id &&
													!note.linkNote
											)
											.map((linkNote) => linkNote).length > 0 && (
											<div className="flex flex-col gap-1 w-full">
												{noteSystem.allNotes
													.filter(
														(note) =>
															note.uid === auth.currentUser.uid &&
															note.materialType === "note" &&
															note.currentMaterialID === mainMaterialID &&
															note.currentFolderID === folder.id &&
															note.currentSectionNoteID === sectionNote.id &&
															!note.title
																.normalize("NFD")
																.replace(/\p{Diacritic}/gu, "")
																.toLowerCase()
																.includes(searchQuery.toLowerCase())
													)
													.map((note) => note).length < 1 && (
													<h1 className="text-lg text-gray-500 w-full text-start">
														Image Section
													</h1>
												)}
												<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 w-full">
													<>
														{noteSystem.allNotes
															.filter(
																(note) =>
																	note.uid === auth.currentUser.uid &&
																	note.materialType === "note" &&
																	note.currentMaterialID === mainMaterialID &&
																	note.currentFolderID === folder.id &&
																	note.currentSectionNoteID ===
																		sectionNote.id &&
																	!note.linkNote
															)
															.map((note) => {
																if (
																	note.title
																		.normalize("NFD")
																		.replace(/\p{Diacritic}/gu, "")
																		.toLowerCase()
																		.includes(searchQuery.toLowerCase())
																) {
																	return (
																		<ChildNote key={note.id} note={note} />
																	);
																}
															})}
													</>
												</div>
											</div>
										)}
									</div>

									{noteSystem.allNotes
										.filter(
											(note) =>
												note.uid === auth.currentUser.uid &&
												note.materialType === "note" &&
												note.currentMaterialID === mainMaterialID &&
												note.currentFolderID === folder.id &&
												note.currentSectionNoteID === sectionNote.id &&
												note.title
													.normalize("NFD")
													.replace(/\p{Diacritic}/gu, "")
													.toLowerCase()
													.includes(searchQuery.toLowerCase())
										)
										.map((note) => note).length < 1 && (
										<>
											<div className="flex flex-col justify-center items-center gap-1 text-gray-400 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
												<p>No Notes</p>
												<Image
													className="grayscale"
													src={"/images/logo.png"}
													alt="logo"
													width={50}
													height={50}
												/>
											</div>
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
					<>
						{
							<>
								<div
									className={`w-full flex flex-col justify-start items-center mt-2 gap-2`}
								>
									{noteSystem.allNotes
										.filter(
											(note) =>
												note.uid === auth.currentUser.uid &&
												note.materialType === "note" &&
												note.currentMaterialID === mainMaterialID &&
												note.currentFolderID === folder.id &&
												note.currentSectionNoteID === sectionNote.id &&
												note.linkNote
										)
										.slice(0, 2)
										.map((note) => {
											return (
												<SectionNotePreview
													key={note.id}
													note={note}
													folder={folder}
													sectionNote={sectionNote}
												/>
											);
										})}
								</div>

								<div
									className={`justify-center w-full ${
										noteSystem.allNotes
											.filter(
												(note) =>
													note.uid === auth.currentUser.uid &&
													note.materialType === "note" &&
													note.currentMaterialID === mainMaterialID &&
													note.currentFolderID === folder.id &&
													note.currentSectionNoteID === sectionNote.id &&
													!note.linkNote
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
												note.currentSectionNoteID === sectionNote.id &&
												!note.linkNote
										)
										.slice(0, 4)
										.map((note) => {
											return (
												<SectionNotePreview
													key={note.id}
													note={note}
													folder={folder}
													sectionNote={sectionNote}
												/>
											);
										})}
								</div>
							</>
						}
					</>
				) : (
					<p className="text-gray-500 pb-3 pt-2">No Notes</p>
				)}

				<div className="flex justify-center items-center gap-2 w-full">
					<button
						className="btn w-full"
						onClick={() => {
							handleOpenSectionNote(sectionNote.id);
						}}
					>
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
