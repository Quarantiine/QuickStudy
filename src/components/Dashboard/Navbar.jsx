import React, { useContext, useEffect, useRef, useState } from "react";
import FirebaseAPI from "../../pages/api/firebaseAPI";
import Image from "next/image";
import { createPortal } from "react-dom";
import { UserCredentialsCtx } from "../../pages";
import NavbarFolders from "./NavbarFolders";
import CreatingFolder from "./CreatingFolder";
import MainFolderModal from "./MainFolderModal";

export default function Navbar({ user, openShortNavbar, setOpenShortNavbar }) {
	const {
		auth,
		registration,
		folderSystem,
		folderMaterialSystem,
		questionNAnswerSystem,
		noteSectionSystem,
		noteSystem,
	} = FirebaseAPI();

	const {
		createFolderModal,
		setCreateFolderModal,
		openFolderModal,
		setOpenFolderModal,
		folderID,
		handleOpenFolderModal,
		libraryDropdown,
		setLibraryDropdown,
		setFolderID,
		handleOpenFlashCardsModal,
		handleOpenQuizzesModal,
		handleViewAllFolders,
		handleOpenNoteModal,
	} = useContext(UserCredentialsCtx);

	const [folderName, setFolderName] = useState("");
	const [folderDescription, setFolderDescription] = useState("");
	const [folderDeleteDropdown, setFolderDeleteDropdown] = useState(false);
	const [editFolderName, setEditFolderName] = useState(false);
	const [editFolderDescription, setEditFolderDescription] = useState(false);
	const changedFolderNameRef = useRef();
	const changedFolderDescriptionRef = useRef();

	const [msgError, setMsgError] = useState("");
	const msgErrorRef = useRef();

	const handleLogout = () => {
		setFolderID("");
		registration.logout();
	};

	const handleLibraryDropdown = () => {
		setLibraryDropdown(!libraryDropdown);
	};

	const handleOpenShortNavbar = () => {
		setOpenShortNavbar(!openShortNavbar);
	};

	useEffect(() => {
		const closeLibraryDropdown = (e) => {
			if (!e.target.closest(".library-dropdown")) {
				setLibraryDropdown(false);
			}
		};

		document.addEventListener("mousedown", closeLibraryDropdown);
		return () =>
			document.removeEventListener("mousedown", closeLibraryDropdown);
	}, []);

	useEffect(() => {
		const closeCreateFolderModal = (e) => {
			if (!e.target.closest(".create-folder-modal")) {
				setCreateFolderModal(false);
			}
		};

		document.addEventListener("mousedown", closeCreateFolderModal);
		return () =>
			document.removeEventListener("mousedown", closeCreateFolderModal);
	}, []);

	const handleCreateFolderModal = () => {
		setCreateFolderModal(!createFolderModal);
	};

	const handleCreateFolder = (e) => {
		e.preventDefault();
		clearTimeout(msgErrorRef.current);

		if (folderName.length <= 100 && folderName.length > 1) {
			folderSystem.addingFolder(
				folderName.trim(),
				folderDescription.trim(),
				auth.currentUser.uid
			);
			setCreateFolderModal(false);

			setFolderName("");
			setFolderDescription("");
		} else {
			setMsgError("Check Information");

			msgErrorRef.current = setTimeout(() => {
				setMsgError("");
			}, 4000);
		}
	};

	const handleFolderDeleteDropdown = (e) => {
		e.preventDefault();
		setFolderDeleteDropdown(!folderDeleteDropdown);
	};

	useEffect(() => {
		const closeFolderDeleteDropdown = (e) => {
			if (!e.target.closest(".folder-delete-dropdown")) {
				setFolderDeleteDropdown(false);
				setEditFolderName(false);
				setEditFolderDescription(false);
			}
		};

		document.addEventListener("mousedown", closeFolderDeleteDropdown);
		return () =>
			document.removeEventListener("mousedown", closeFolderDeleteDropdown);
	}, []);

	const handleDeleteFolder = (e, id) => {
		e.preventDefault();
		folderSystem.deletingFolder(id);
		setFolderDeleteDropdown(false);
		setOpenFolderModal(false);

		folderMaterialSystem.allFolderMaterials
			.filter(
				(folderMaterial) =>
					folderMaterial.uid === auth.currentUser.uid &&
					folderMaterial.materialType === "flash-card" &&
					folderMaterial.currentFolderID === id
			)
			.map((folderMaterial) =>
				folderMaterialSystem.deleteMainMaterial(folderMaterial.id)
			);

		questionNAnswerSystem.allQuestionsNAnswers
			.filter(
				(questionNAnswer) =>
					questionNAnswer.uid === auth.currentUser.uid &&
					questionNAnswer.currentFolderID === folderID &&
					questionNAnswer.materialType === "flash-card"
			)
			.map((questionNAnswer) =>
				questionNAnswerSystem.deleteQuestionNAnswer(questionNAnswer.id)
			);

		folderMaterialSystem.allFolderMaterials
			.filter(
				(folderMaterial) =>
					folderMaterial.uid === auth.currentUser.uid &&
					folderMaterial.materialType === "quiz" &&
					folderMaterial.currentFolderID === id
			)
			.map((folderMaterial) =>
				folderMaterialSystem.deleteMainMaterial(folderMaterial.id)
			);

		questionNAnswerSystem.allQuestionsNAnswers
			.filter(
				(questionNAnswer) =>
					questionNAnswer.uid === auth.currentUser.uid &&
					questionNAnswer.currentFolderID === folderID &&
					questionNAnswer.materialType === "quiz"
			)
			.map((questionNAnswer) =>
				questionNAnswerSystem.deleteQuestionNAnswer(questionNAnswer.id)
			);

		folderMaterialSystem.allFolderMaterials
			.filter(
				(folderMaterial) =>
					folderMaterial.uid === auth.currentUser.uid &&
					folderMaterial.materialType === "note" &&
					folderMaterial.currentFolderID === id
			)
			.map((folderMaterial) =>
				folderMaterialSystem.deleteMainMaterial(folderMaterial.id)
			);

		noteSectionSystem.allSectionNotes
			.filter(
				(sectionNote) =>
					sectionNote.uid === auth.currentUser.uid &&
					sectionNote.currentFolderID === id &&
					sectionNote.materialType === "note"
			)
			.map((sectionNote) =>
				noteSectionSystem.deletingSectionNote(sectionNote.id)
			);

		noteSystem.allNotes
			.filter(
				(note) =>
					note.uid === auth.currentUser.uid &&
					note.currentFolderID === id &&
					note.materialType === "note"
			)
			.map((note) => noteSystem.deleteNote(note.id));
	};

	const handleEditFolderName = (e) => {
		e.preventDefault();
		setEditFolderName(!editFolderName);
	};

	const handleEditFolderDescription = (e) => {
		e.preventDefault();
		setEditFolderDescription(!editFolderDescription);
	};

	const handleChangeFolderName = (e, id) => {
		e.preventDefault();

		if (changedFolderNameRef.current.value.length > 0) {
			setEditFolderName(false);
			folderSystem.updateFolderName(changedFolderNameRef.current.value, id);
		}
	};

	const handleChangeFolderDescription = (e, id) => {
		e.preventDefault();
		setEditFolderDescription(false);

		folderSystem.updateFolderDescription(
			changedFolderDescriptionRef.current.value,
			id
		);
	};

	return (
		<>
			{createFolderModal &&
				createPortal(
					<CreatingFolder
						msgError={msgError}
						folderName={folderName}
						setFolderName={setFolderName}
						setFolderDescription={setFolderDescription}
						handleCreateFolder={handleCreateFolder}
					/>,
					document.body
				)}

			<div
				className={`w-full h-fit flex sm:justify-start items-center bg-[#373f4e] px-7 py-7 z-50`}
			>
				<h1 className="text-white italic font-semibold text-2xl hidden sm:block">
					QuickStudy
				</h1>

				<div className="flex justify-center items-center gap-4 sm:gap-5 ml-auto text-white">
					<button onClick={handleOpenShortNavbar} className="text-btn">
						<Image
							className="object-contain block sm:hidden"
							src={openShortNavbar ? "/icons/close.svg" : "/icons/menu.svg"}
							alt="icon"
							width={25}
							height={25}
							draggable={false}
						/>
					</button>

					<div className="hidden sm:flex justify-center items-center gap-4">
						<button
							onClick={handleCreateFolderModal}
							className="flex justify-center items-center gap-1 text-btn"
						>
							<p>Create Folder</p>
							<Image
								className="object-contain"
								src={"/icons/add_circle.svg"}
								alt="icon"
								width={20}
								height={20}
							/>
						</button>

						<div className="relative">
							<button
								onClick={handleLibraryDropdown}
								className="flex justify-center items-center text-btn relative library-dropdown"
							>
								<p>Your Library</p>
								<Image
									className={`object-contain relative top-.5 ${
										libraryDropdown && "rotate-180"
									}`}
									src={"/icons/expand_more.svg"}
									alt="icon"
									width={27}
									height={27}
								/>
							</button>

							{openFolderModal &&
								createPortal(
									<div className="flex justify-center items-center bg-[rgba(0,0,0,0.7)] w-full h-full top-0 left-0 fixed z-50 px-4 overflow-no-width overflow-x-hidden overflow-y-scroll">
										<div className="folder-child-modal w-[240px] sm:w-[470px] h-fit flex flex-col justify-center items-start gap-5 rounded-xl bg-white p-5">
											<>
												{folderSystem.allFolders
													.filter(
														(folder) => folder.uid === auth.currentUser.uid
													)
													.map((folder) => {
														return (
															<React.Fragment key={folder.id}>
																{folderID === folder.id && (
																	<MainFolderModal
																		auth={auth}
																		folder={folder}
																		folderSystem={folderSystem}
																		folderID={folderID}
																		editFolderName={editFolderName}
																		changedFolderNameRef={changedFolderNameRef}
																		handleChangeFolderName={
																			handleChangeFolderName
																		}
																		handleEditFolderName={handleEditFolderName}
																		handleFolderDeleteDropdown={
																			handleFolderDeleteDropdown
																		}
																		folderDeleteDropdown={folderDeleteDropdown}
																		handleViewAllFolders={handleViewAllFolders}
																		editFolderDescription={
																			editFolderDescription
																		}
																		changedFolderDescriptionRef={
																			changedFolderDescriptionRef
																		}
																		handleChangeFolderDescription={
																			handleChangeFolderDescription
																		}
																		handleEditFolderDescription={
																			handleEditFolderDescription
																		}
																		folderMaterialSystem={folderMaterialSystem}
																		handleOpenFlashCardsModal={
																			handleOpenFlashCardsModal
																		}
																		handleOpenQuizzesModal={
																			handleOpenQuizzesModal
																		}
																		handleDeleteFolder={handleDeleteFolder}
																		handleOpenNoteModal={handleOpenNoteModal}
																	/>
																)}
															</React.Fragment>
														);
													})}
											</>
										</div>
									</div>,
									document.body
								)}

							{libraryDropdown &&
								(folderSystem.allFolders
									.filter((folder) => folder.uid === auth.currentUser.uid)
									.map((folder) => folder).length < 1 ? (
									<div className="library-dropdown flex flex-col justify-center items-center gap-2 w-[150px] h-fit rounded-xl absolute top-10 right-0 bg-white text-black shadow-md z-10 text-sm p-2 line-clamp-1 overflow-ellipsis">
										<p className="text-sm text-center text-gray-400">
											You have no folders
										</p>
									</div>
								) : (
									<>
										<div className="library-dropdown flex flex-col justify-center items-start gap-2 w-[150px] h-fit rounded-xl absolute top-10 right-0 bg-white text-black shadow-md z-10 text-sm p-2">
											<div className="flex flex-col justify-center items-start gap-1 w-full">
												{folderSystem.allFolders
													.filter(
														(folder) => folder.uid === auth.currentUser.uid
													)
													.slice(0, 5)
													.map((folder) => {
														return (
															<React.Fragment key={folder.id}>
																<NavbarFolders
																	folder={folder}
																	handleOpenFolderModal={handleOpenFolderModal}
																/>
															</React.Fragment>
														);
													})}
											</div>

											<button
												onClick={handleViewAllFolders}
												className="btn w-full text-sm"
											>
												View All
											</button>
										</div>
									</>
								))}
						</div>
					</div>

					<button
						onClick={handleLogout}
						className="flex justify-center items-center gap-1 btn w-fit ml-auto"
					>
						<p>Logout</p>
						<Image
							className="object-contain"
							src={"/icons/logout.svg"}
							alt="icon"
							width={20}
							height={20}
						/>
					</button>
				</div>
			</div>

			<ShortNavbar
				auth={auth}
				user={user}
				openShortNavbar={openShortNavbar}
				handleLibraryDropdown={handleLibraryDropdown}
				libraryDropdown={libraryDropdown}
				handleCreateFolderModal={handleCreateFolderModal}
				folderSystem={folderSystem}
				NavbarFolders={NavbarFolders}
				handleOpenFolderModal={handleOpenFolderModal}
				handleViewAllFolders={handleViewAllFolders}
			/>
		</>
	);
}

const ShortNavbar = ({
	auth,
	user,
	openShortNavbar,
	handleLibraryDropdown,
	libraryDropdown,
	handleCreateFolderModal,
	folderSystem,
	handleOpenFolderModal,
	handleViewAllFolders,
}) => {
	return (
		<>
			{openShortNavbar && (
				<div
					className={`w-full h-fit z-50 sm:hidden px-3 py-6 border-b-4 sticky top-0 left-0 bg-[#333a46] text-white flex justify-center items-center ${
						user.theme ? "border-gray-800" : "border-gray-400"
					}`}
				>
					<div className="flex flex-col justify-center items-start gap-4">
						<button
							onClick={handleCreateFolderModal}
							className="flex justify-center items-center gap-1 text-btn"
						>
							<p>Create Folder</p>
							<Image
								className="object-contain"
								src={"/icons/add_circle.svg"}
								alt="icon"
								width={20}
								height={20}
							/>
						</button>

						<div className="relative">
							<button
								onClick={handleLibraryDropdown}
								className="flex justify-center items-center text-btn relative library-dropdown"
							>
								<p>Your Library</p>
								<Image
									className={`object-contain relative top-.5 ${
										libraryDropdown && "rotate-180"
									}`}
									src={"/icons/expand_more_white.svg"}
									alt="icon"
									width={27}
									height={27}
								/>
							</button>

							{libraryDropdown && (
								<>
									<div className="library-dropdown flex flex-col justify-center items-start gap-1 w-[150px] h-fit rounded-xl absolute top-10 right-0 bg-white text-black shadow-md z-10 text-sm p-2 line-clamp-1 overflow-ellipsis">
										{folderSystem.allFolders
											.filter((folder) => folder.uid === auth.currentUser.uid)
											.slice(0, 5)
											.map((folder) => {
												return (
													<NavbarFolders
														key={folder.id}
														folder={folder}
														handleOpenFolderModal={handleOpenFolderModal}
													/>
												);
											})}

										<button
											onClick={handleViewAllFolders}
											className="btn w-full text-sm"
										>
											View All
										</button>
									</div>
								</>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
};
