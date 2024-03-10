import Head from "next/head";
import React, { createContext, useEffect, useRef, useState } from "react";
import Navbar from "../components/Dashboard/Navbar";
import FirebaseAPI from "../pages/api/firebaseAPI";
import Image from "next/image";
import LoaderSymbol from "../components/LoaderSymbol";
import { createPortal } from "react-dom";
import FlashCards from "../components/Dashboard/Flashcards/FlashCards";
import Quizzes from "../components/Dashboard/Quizzes/Quizzes";
import MainFlashcardEditing from "../components/Dashboard/Flashcards/MainFlashcardEditing";
import MainFlashcardStart from "../components/Dashboard/Flashcards/MainFlashcardStart";
import AllFolders from "../components/Dashboard/AllFolders";
import MainDashboard from "../components/Dashboard/MainDashboard";
import MainQuizEditing from "../components/Dashboard/Quizzes/MainQuizEditing";
import MainQuizStart from "../components/Dashboard/Quizzes/MainQuizStart";

export const UserCredentialsCtx = createContext();

export default function Home() {
	const {
		auth,
		registration,
		folderSystem,
		folderMaterialSystem,
		questionNAnswerSystem,
	} = FirebaseAPI();
	const [openShortNavbar, setOpenShortNavbar] = useState(false);
	const [createFolderModal, setCreateFolderModal] = useState(false);
	const [openFolderModal, setOpenFolderModal] = useState(false);
	const [folderID, setFolderID] = useState("");
	const [libraryDropdown, setLibraryDropdown] = useState(false);
	const [viewAllFolders, setViewAllFolders] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	// MAIN MODAL SECTIONS
	const [openFlashCardModal, setOpenFlashCardModal] = useState(false);
	const [openQuizModal, setOpenQuizModal] = useState(false);
	const [openNoteModal, setOpenNoteModal] = useState(false);

	// ID SECTIONS
	const [mainMaterialID, setMainMaterialID] = useState("");
	const [questionNAnswerID, setQuestionNAnswerID] = useState("");

	// FLASHCARD SECTIONS
	const [openFlashCardEdit, setOpenFlashCardEdit] = useState(false);
	const [openFlashCardStart, setOpenFlashCardStart] = useState(false);
	const [openEditFlashCardDropdown, setOpenEditFlashCardDropdown] =
		useState(false);
	const [flashcardQNATitle, setFlashcardQNATitle] = useState("");

	// NOTE SECTION
	const [NoteTitle, setNoteTitle] = useState("");

	// QUIZ SECTIONS
	const [openQuizEdit, setOpenQuizEdit] = useState(false);
	const [openQuizStart, setOpenQuizStart] = useState(false);
	const [openEditQuizDropdown, setOpenEditQuizDropdown] = useState(false);
	const [quizQNATitle, setQuizQNATitle] = useState("");

	const questionNAnswerContainerRef = useRef(null);

	const handleChangeTheme = (theme, id) => {
		registration.themeChange(theme, id);
	};

	useEffect(() => {
		const closeModal = (e) => {
			if (!e.target.closest(".folder-child-modal")) {
				setOpenFolderModal(false);
			}
		};

		document.addEventListener("mousedown", closeModal);
		return () => document.removeEventListener("mousedown", closeModal);
	}, []);

	const handleOpenFolderModal = (id) => {
		folderSystem.updateCreatedTime(id);
		setFolderID(id);
		setOpenFolderModal(!openFolderModal);
		setLibraryDropdown(false);
		setCreateFolderModal(false);
		setViewAllFolders(false);
		setOpenFlashCardModal(false);
		setOpenQuizModal(false);
	};

	useEffect(() => {
		const closeViewAllFolders = (e) => {
			if (!e.target.closest(".all-folders-modal")) {
				setViewAllFolders(false);
				setSearchQuery("");
			}
		};

		document.addEventListener("mousedown", closeViewAllFolders);
		return () => document.removeEventListener("mousedown", closeViewAllFolders);
	}, []);

	const handleViewAllFolders = (e) => {
		e.preventDefault();
		setViewAllFolders(!viewAllFolders);
		setOpenFolderModal(false);
		setLibraryDropdown(false);
	};

	{
		/* FLASH CARD SECTION */
	}

	const handleOpenFlashCardsModal = () => {
		setOpenFlashCardModal(!openFlashCardModal);
		setOpenFolderModal(false);
	};

	useEffect(() => {
		const closeFlashCardModal = (e) => {
			if (!e.target.closest(".flash-card-modal")) {
				setOpenFlashCardModal(false);
			}
		};

		document.addEventListener("mousedown", closeFlashCardModal);
		return () => document.removeEventListener("mousedown", closeFlashCardModal);
	}, []);

	useEffect(() => {
		const closeFlashCardEdit = (e) => {
			if (!e.target.closest(".flash-card-edit-modal")) {
				setOpenFlashCardEdit(false);
			}
		};

		document.addEventListener("mousedown", closeFlashCardEdit);
		return () => document.removeEventListener("mousedown", closeFlashCardEdit);
	}, []);

	useEffect(() => {
		const closeFlashCardEditDropdown = (e) => {
			if (!e.target.closest(".flash-card-edit-dropdown")) {
				setOpenEditFlashCardDropdown(false);
			}
		};

		document.addEventListener("mousedown", closeFlashCardEditDropdown);
		return () =>
			document.removeEventListener("mousedown", closeFlashCardEditDropdown);
	}, []);

	const handleOpenFlashCardEdit = (id) => {
		folderMaterialSystem.updateMainMaterialCreatedTime(id);
		setMainMaterialID(id);
		setOpenFlashCardEdit(!openFlashCardEdit);
		setOpenFlashCardModal(false);
		setOpenFlashCardStart(false);
	};

	const handleOpenFlashCardStart = (id) => {
		folderMaterialSystem.updateMainMaterialCreatedTime(id);
		setMainMaterialID(id);
		setOpenFlashCardStart(!openFlashCardStart);
		setOpenFlashCardModal(false);
		setOpenFlashCardEdit(false);
	};

	const editBackToFlashCardModal = () => {
		setOpenFlashCardModal(true);
		setOpenFlashCardEdit(false);
		setMainMaterialID("");
	};

	const startBackToFlashCardModal = () => {
		setOpenFlashCardModal(true);
		setOpenFlashCardStart(false);
		setMainMaterialID("");
	};

	const handleEditFlashCardTitle = (e) => {
		e.preventDefault();
		setOpenEditFlashCardDropdown(!openEditFlashCardDropdown);
	};

	const handleChangeFlashcardTitle = (e, id) => {
		e.preventDefault();
		if (flashcardQNATitle.length > 0 && flashcardQNATitle.length <= 100) {
			folderMaterialSystem.updateMainMaterialTitle(flashcardQNATitle, id);
			setOpenEditFlashCardDropdown(false);
			setFlashcardQNATitle("");
		}
	};

	const handleResetFlashcards = () => {
		questionNAnswerContainerRef.current?.scrollTo(0, 0);

		questionNAnswerSystem.allQuestionsNAnswers
			.filter(
				(questionNAnswer) =>
					questionNAnswer.uid === auth.currentUser.uid &&
					questionNAnswer.currentFolderID === folderID &&
					questionNAnswer.currentMaterialID === mainMaterialID &&
					questionNAnswer.materialType === "flash-card"
			)
			.map((questionNAnswer) =>
				questionNAnswerSystem.updateUnderstand(false, questionNAnswer.id)
			);

		questionNAnswerSystem.allQuestionsNAnswers
			.filter(
				(questionNAnswer) =>
					questionNAnswer.uid === auth.currentUser.uid &&
					questionNAnswer.currentFolderID === folderID &&
					questionNAnswer.currentMaterialID === mainMaterialID &&
					questionNAnswer.materialType === "flash-card"
			)
			.map((questionNAnswer) =>
				questionNAnswerSystem.updateDidntUnderstand(false, questionNAnswer.id)
			);

		questionNAnswerSystem.allQuestionsNAnswers
			.filter(
				(questionNAnswer) =>
					questionNAnswer.uid === auth.currentUser.uid &&
					questionNAnswer.currentFolderID === folderID &&
					questionNAnswer.currentMaterialID === mainMaterialID &&
					questionNAnswer.materialType === "flash-card"
			)
			.map((questionNAnswer) =>
				questionNAnswerSystem.updateCompleted(false, questionNAnswer.id)
			);

		folderMaterialSystem.allFolderMaterials
			.filter(
				(folderMaterial) =>
					folderMaterial.uid === auth.currentUser.uid &&
					folderMaterial.materialType === "flash-card" &&
					folderMaterial.currentFolderID === folderID &&
					folderMaterial.id === mainMaterialID
			)
			.map((folderMaterial) =>
				folderMaterialSystem.updateMainMaterialCompletion(0, folderMaterial.id)
			);
	};

	{
		/* QUIZZES SECTION */
	}

	const handleOpenQuizzesModal = () => {
		setOpenQuizModal(!openQuizModal);
		setOpenFolderModal(false);
	};

	useEffect(() => {
		const closeQuizzesModal = (e) => {
			if (!e.target.closest(".quiz-modal")) {
				setOpenQuizModal(false);
			}
		};

		document.addEventListener("mousedown", closeQuizzesModal);
		return () => document.removeEventListener("mousedown", closeQuizzesModal);
	}, []);

	useEffect(() => {
		const closeQuizEdit = (e) => {
			if (!e.target.closest(".quiz-edit-modal")) {
				setOpenQuizEdit(false);
			}
		};

		document.addEventListener("mousedown", closeQuizEdit);
		return () => document.removeEventListener("mousedown", closeQuizEdit);
	}, []);

	useEffect(() => {
		const closeQuizEditDropdown = (e) => {
			if (!e.target.closest(".quiz-edit-dropdown")) {
				setOpenEditQuizDropdown(false);
			}
		};

		document.addEventListener("mousedown", closeQuizEditDropdown);
		return () =>
			document.removeEventListener("mousedown", closeQuizEditDropdown);
	}, []);

	const handleOpenQuizEdit = (id) => {
		folderMaterialSystem.updateMainMaterialCreatedTime(id);
		setMainMaterialID(id);
		setOpenQuizEdit(!openFlashCardEdit);
		setOpenQuizModal(false);
		setOpenQuizStart(false);
	};

	const handleOpenQuizStart = (id) => {
		const list = [
			...questionNAnswerSystem.allQuestionsNAnswers
				.filter(
					(questionNAnswer) =>
						questionNAnswer.uid === auth.currentUser.uid &&
						questionNAnswer.currentFolderID === folderID &&
						questionNAnswer.currentMaterialID === id &&
						questionNAnswer.materialType === "quiz"
				)
				.map((questionNAnswer) => questionNAnswer.answer),
		];

		questionNAnswerSystem.allQuestionsNAnswers
			.filter(
				(questionNAnswer) =>
					questionNAnswer.uid === auth.currentUser.uid &&
					questionNAnswer.currentFolderID === folderID &&
					questionNAnswer.currentMaterialID === id &&
					questionNAnswer.materialType === "quiz"
			)
			.map((questionNAnswer) =>
				questionNAnswerSystem.updateDummyAnswers(
					JSON.stringify(list),
					questionNAnswer.id
				)
			);

		folderMaterialSystem.updateMainMaterialCreatedTime(id);
		setMainMaterialID(id);
		setOpenQuizStart(!openFlashCardStart);
		setOpenQuizModal(false);
		setOpenQuizEdit(false);
	};

	const editBackToQuizModal = () => {
		setOpenQuizModal(true);
		setOpenQuizEdit(false);
		setMainMaterialID("");
	};

	const startBackToQuizModal = () => {
		setOpenQuizModal(true);
		setOpenQuizStart(false);
		setMainMaterialID("");
	};

	const handleEditQuizTitle = (e) => {
		e.preventDefault();
		setOpenEditQuizDropdown(!openEditQuizDropdown);
	};

	const handleChangeQuizTitle = (e, id) => {
		e.preventDefault();
		if (quizQNATitle.length > 0 && quizQNATitle.length <= 100) {
			folderMaterialSystem.updateMainMaterialTitle(quizQNATitle, id);
			setOpenEditQuizDropdown(false);
			setQuizQNATitle("");
		}
	};

	const handleResetQuizzes = () => {
		questionNAnswerContainerRef.current?.scrollTo(0, 0);

		questionNAnswerSystem.allQuestionsNAnswers
			.filter(
				(questionNAnswer) =>
					questionNAnswer.uid === auth.currentUser.uid &&
					questionNAnswer.currentFolderID === folderID &&
					questionNAnswer.currentMaterialID === mainMaterialID &&
					questionNAnswer.materialType === "quiz"
			)
			.map((questionNAnswer) =>
				questionNAnswerSystem.updateUnderstand(false, questionNAnswer.id)
			);

		questionNAnswerSystem.allQuestionsNAnswers
			.filter(
				(questionNAnswer) =>
					questionNAnswer.uid === auth.currentUser.uid &&
					questionNAnswer.currentFolderID === folderID &&
					questionNAnswer.currentMaterialID === mainMaterialID &&
					questionNAnswer.materialType === "quiz"
			)
			.map((questionNAnswer) =>
				questionNAnswerSystem.updateDidntUnderstand(false, questionNAnswer.id)
			);

		questionNAnswerSystem.allQuestionsNAnswers
			.filter(
				(questionNAnswer) =>
					questionNAnswer.uid === auth.currentUser.uid &&
					questionNAnswer.currentFolderID === folderID &&
					questionNAnswer.currentMaterialID === mainMaterialID &&
					questionNAnswer.materialType === "quiz"
			)
			.map((questionNAnswer) =>
				questionNAnswerSystem.updateCompleted(false, questionNAnswer.id)
			);

		folderMaterialSystem.allFolderMaterials
			.filter(
				(folderMaterial) =>
					folderMaterial.uid === auth.currentUser.uid &&
					folderMaterial.materialType === "quiz" &&
					folderMaterial.currentFolderID === folderID &&
					folderMaterial.id === mainMaterialID
			)
			.map((folderMaterial) =>
				folderMaterialSystem.updateMainMaterialCompletion(0, folderMaterial.id)
			);
	};

	{
		/* NOTE SECTION */
	}

	const handleOpenNoteModal = () => {
		setOpenNoteModal(!openNoteModal);
		setOpenFolderModal(false);
	};

	useEffect(() => {
		const closeNoteModal = (e) => {
			if (!e.target.closest(".note-modal")) {
				setOpenNoteModal(false);
			}
		};

		document.addEventListener("mousedown", closeNoteModal);
		return () => document.removeEventListener("mousedown", closeNoteModal);
	}, []);

	return (
		<>
			<Head>
				<title>Dashboard</title>
			</Head>

			{registration.dashboardErrMsg && (
				<div className="fixed top-6 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg h-fit w-[90%] sm:w-fit text-center z-[60] overflow-y-hidden overflow-x-scroll overflow-no-height">
					{registration.dashboardErrMsg}
				</div>
			)}

			<LoaderSymbol />

			{registration.allUsers
				.filter((user) => user.uid === auth.currentUser.uid)
				.map((user) => {
					return (
						<React.Fragment key={user.id}>
							<UserCredentialsCtx.Provider
								value={{
									// MISC SECTION
									user,
									createFolderModal,
									questionNAnswerID,
									openFolderModal,
									folderID,
									libraryDropdown,
									viewAllFolders,
									mainMaterialID,
									questionNAnswerContainerRef,
									setCreateFolderModal,
									setOpenFolderModal,
									setFolderID,
									handleOpenFolderModal,
									setLibraryDropdown,
									setViewAllFolders,
									setMainMaterialID,
									setQuestionNAnswerID,
									handleViewAllFolders,

									// FLASHCARD SECTION
									openFlashCardModal,
									openEditFlashCardDropdown,
									setOpenFlashCardModal,
									handleOpenFlashCardsModal,
									handleOpenFlashCardEdit,
									handleOpenFlashCardStart,
									setOpenEditFlashCardDropdown,
									setOpenFlashCardEdit,
									handleResetFlashcards,

									// QUIZ SECTION
									openQuizModal,
									openEditQuizDropdown,
									setOpenQuizModal,
									handleOpenQuizzesModal,
									handleOpenQuizEdit,
									handleOpenQuizStart,
									setOpenEditQuizDropdown,
									setOpenQuizEdit,
									handleResetQuizzes,

									// NOTE SECTION
									handleOpenNoteModal,
								}}
							>
								{/* FLASH CARD SECTION */}
								<>
									{openFlashCardModal &&
										createPortal(
											folderSystem.allFolders
												.filter(
													(folder) =>
														folder.uid === user.uid && folder.id === folderID
												)
												.map((folder) => {
													return (
														<React.Fragment key={folder.id}>
															<div className="flex justify-center items-center bg-[rgba(0,0,0,0.9)] w-full h-full top-0 left-0 fixed z-50 overflow-no-width overflow-x-hidden overflow-y-scroll">
																<div
																	className={`flash-card-modal w-[100%] h-[100%] flex flex-col justify-start items-start bg-white pt-7 px-5 relative overflow-with-width overflow-x-hidden overflow-y-scroll`}
																>
																	<div className="flex flex-col justify-start items-start gap-3 w-full h-full">
																		<div className="flex justify-between items-start gap-2 w-full z-10">
																			<div className="flex flex-col justify-center items-start">
																				<p className="text-sm text-gray-500">
																					{folder.name}
																				</p>
																				<h1 className="title-h1">
																					Flash Cards
																				</h1>
																			</div>
																			<button
																				onClick={() =>
																					handleOpenFolderModal(folder.id)
																				}
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

																		<FlashCards folder={folder} user={user} />
																	</div>
																</div>
															</div>
														</React.Fragment>
													);
												}),
											document.body
										)}

									{openFlashCardEdit &&
										folderSystem.allFolders
											.filter(
												(folder) =>
													folder.uid === user.uid && folder.id === folderID
											)
											.map((folder) => {
												return (
													<MainFlashcardEditing
														key={folder.id}
														folder={folder}
														user={user}
														handleEditFlashCardTitle={handleEditFlashCardTitle}
														folderMaterialSystem={folderMaterialSystem}
														openEditFlashCardDropdown={
															openEditFlashCardDropdown
														}
														flashcardQNATitle={flashcardQNATitle}
														setFlashcardQNATitle={setFlashcardQNATitle}
														handleChangeFlashcardTitle={
															handleChangeFlashcardTitle
														}
														editBackToFlashCardModal={editBackToFlashCardModal}
														mainMaterialID={mainMaterialID}
													/>
												);
											})}

									{openFlashCardStart &&
										folderSystem.allFolders
											.filter(
												(folder) =>
													folder.uid === user.uid && folder.id === folderID
											)
											.map((folder) => {
												return (
													<MainFlashcardStart
														key={folder.id}
														folder={folder}
														user={user}
														folderMaterialSystem={folderMaterialSystem}
														mainMaterialID={mainMaterialID}
														startBackToFlashCardModal={
															startBackToFlashCardModal
														}
													/>
												);
											})}
								</>

								{/* QUIZ SECTION */}
								<>
									{openQuizModal &&
										createPortal(
											folderSystem.allFolders
												.filter(
													(folder) =>
														folder.uid === user.uid && folder.id === folderID
												)
												.map((folder) => {
													return (
														<React.Fragment key={folder.id}>
															<div className="flex justify-center items-center bg-[rgba(0,0,0,0.9)] w-full h-full top-0 left-0 fixed z-50 overflow-no-width overflow-x-hidden overflow-y-scroll">
																<div
																	className={`quiz-modal w-[100%] h-[100%] flex flex-col justify-start items-start bg-white pt-7 px-5 relative overflow-with-width overflow-x-hidden overflow-y-scroll`}
																>
																	<div className="flex flex-col justify-start items-start gap-3 w-full h-full">
																		<div className="flex justify-between items-start gap-2 w-full z-10">
																			<div className="flex flex-col justify-center items-start">
																				<p className="text-sm text-gray-500">
																					{folder.name}
																				</p>
																				<h1 className="title-h1">Quizzes</h1>
																			</div>
																			<button
																				onClick={() =>
																					handleOpenFolderModal(folder.id)
																				}
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

																		<Quizzes folder={folder} user={user} />
																	</div>
																</div>
															</div>
														</React.Fragment>
													);
												}),
											document.body
										)}

									{openQuizEdit &&
										folderSystem.allFolders
											.filter(
												(folder) =>
													folder.uid === user.uid && folder.id === folderID
											)
											.map((folder) => {
												return (
													<MainQuizEditing
														key={folder.id}
														folder={folder}
														user={user}
														handleEditQuizTitle={handleEditQuizTitle}
														folderMaterialSystem={folderMaterialSystem}
														openEditQuizDropdown={openEditQuizDropdown}
														quizQNATitle={quizQNATitle}
														setQuizQNATitle={setQuizQNATitle}
														handleChangeQuizTitle={handleChangeQuizTitle}
														editBackToQuizModal={editBackToQuizModal}
														mainMaterialID={mainMaterialID}
													/>
												);
											})}

									{openQuizStart &&
										folderSystem.allFolders
											.filter(
												(folder) =>
													folder.uid === user.uid && folder.id === folderID
											)
											.map((folder) => {
												return (
													<MainQuizStart
														key={folder.id}
														folder={folder}
														user={user}
														folderMaterialSystem={folderMaterialSystem}
														mainMaterialID={mainMaterialID}
														startBackToQuizModal={startBackToQuizModal}
													/>
												);
											})}
								</>

								{/* NOTE SECTION */}
								<>
									{openNoteModal &&
										createPortal(
											<>
												<div className="flex justify-center items-center bg-[rgba(0,0,0,0.9)] w-full h-full top-0 left-0 fixed z-50 overflow-no-width overflow-x-hidden overflow-y-scroll">
													<div
														className={`note-modal w-[100%] h-[100%] flex flex-col justify-start items-start bg-white pt-7 px-5 relative overflow-with-width overflow-x-hidden overflow-y-scroll`}
													></div>
												</div>
											</>,
											document.body
										)}
								</>

								{viewAllFolders &&
									createPortal(
										<AllFolders
											user={user}
											searchQuery={searchQuery}
											folderSystem={folderSystem}
											setSearchQuery={setSearchQuery}
											handleOpenFolderModal={handleOpenFolderModal}
										/>,
										document.body
									)}

								<main
									className={`fixed top-0 left-0 w-full h-full overflow-no-width overflow-y-scroll overflow-x-hidden ${
										user.theme ? "bg-[#222]" : "bg-white"
									}`}
								>
									<div className="w-full h-auto z-50">
										<Navbar
											user={user}
											openShortNavbar={openShortNavbar}
											setOpenShortNavbar={setOpenShortNavbar}
										/>
									</div>

									{!createFolderModal && (
										<>
											{!openShortNavbar && (
												<ThemeChange
													user={user}
													handleChangeTheme={handleChangeTheme}
												/>
											)}

											<MainDashboard user={user} />
										</>
									)}
								</main>
							</UserCredentialsCtx.Provider>
						</React.Fragment>
					);
				})}
		</>
	);
}

const ThemeChange = ({ user, handleChangeTheme }) => {
	return (
		<>
			<button
				onClick={() => handleChangeTheme(user.theme, user.id)}
				className="flex justify-center items-center w-fit text-btn sticky ml-auto top-0 right-5 z-50 base-bg p-2 rounded-b-full"
			>
				<Image
					className="object-contain"
					src={user.theme ? "/icons/dark_mode.svg" : "/icons/light_mode.svg"}
					alt="icon"
					width={25}
					height={25}
					draggable={false}
				/>
			</button>
		</>
	);
};
