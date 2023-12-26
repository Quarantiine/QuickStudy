import Head from "next/head";
import React, { createContext, useEffect, useRef, useState } from "react";
import Navbar from "../components/Dashboard/Navbar";
import FirebaseAPI from "../pages/api/firebaseAPI";
import Image from "next/image";
import LoaderSymbol from "../components/LoaderSymbol";
import { createPortal } from "react-dom";
import FlashCards from "../components/Dashboard/FlashCards";
import Quizzes from "../components/Dashboard/Quizzes";
import Tests from "../components/Dashboard/Tests";
import MainFlashcardEditing from "../components/Dashboard/MainFlashcardEditing";
import MainFlashcardStart from "../components/Dashboard/MainFlashcardStart";
import AllFolders from "../components/Dashboard/AllFolders";
import MainDashboard from "../components/Dashboard/MainDashboard";

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
	const [openFlashCardModal, setOpenFlashCardModal] = useState(false);
	const [openQuizzesModal, setOpenQuizzesModal] = useState(false);
	const [openTestsModal, setOpenTestsModal] = useState(false);
	const [openFlashCardEdit, setOpenFlashCardEdit] = useState(false);
	const [flashCardID, setFlashCardID] = useState("");
	const [openEditFlashCardDropdown, setOpenEditFlashCardDropdown] =
		useState(false);
	const [flashcardQNATitle, setFlashcardQNATitle] = useState("");
	const [questionNAnswerID, setQuestionNAnswerID] = useState("");
	const [openFlashCardStart, setOpenFlashCardStart] = useState(false);
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
		setOpenQuizzesModal(false);
		setOpenTestsModal(false);
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

	const handleOpenQuizzesModal = () => {
		setOpenQuizzesModal(!openQuizzesModal);
		setOpenFolderModal(false);
	};

	useEffect(() => {
		const closeQuizzesModal = (e) => {
			if (!e.target.closest(".quizzes-modal")) {
				setOpenQuizzesModal(false);
			}
		};

		document.addEventListener("mousedown", closeQuizzesModal);
		return () => document.removeEventListener("mousedown", closeQuizzesModal);
	}, []);

	const handleOpenTestsModal = () => {
		setOpenTestsModal(!openTestsModal);
		setOpenFolderModal(false);
	};

	useEffect(() => {
		const closeTestModal = (e) => {
			if (!e.target.closest(".test-modal")) {
				setOpenTestsModal(false);
			}
		};

		document.addEventListener("mousedown", closeTestModal);
		return () => document.removeEventListener("mousedown", closeTestModal);
	}, []);

	const handleViewAllFolders = (e) => {
		e.preventDefault();
		setViewAllFolders(!viewAllFolders);
		setOpenFolderModal(false);
		setLibraryDropdown(false);
	};

	const handleOpenFlashCardEdit = (id) => {
		folderMaterialSystem.updateFlashCardCreatedTime(id);
		setFlashCardID(id);
		setOpenFlashCardEdit(!openFlashCardEdit);
		setOpenFlashCardModal(false);
		setOpenFlashCardStart(false);
	};

	const handleOpenFlashCardStart = (id) => {
		folderMaterialSystem.updateFlashCardCreatedTime(id);
		setFlashCardID(id);
		setOpenFlashCardStart(!openFlashCardStart);
		setOpenFlashCardModal(false);
		setOpenFlashCardEdit(false);
	};

	useEffect(() => {
		const closeFlashCardEdit = (e) => {
			if (!e.target.closest(".flash-card-edit-modal")) {
				setOpenFlashCardEdit(false);
			}
		};

		document.addEventListener("mousedown", closeFlashCardEdit);
		return () => document.removeEventListener("mousedown", closeFlashCardEdit);
	}, []);

	const editBackToFlashCardModal = () => {
		setOpenFlashCardModal(true);
		setOpenFlashCardEdit(false);
		setFlashCardID("");
	};

	const startBackToFlashCardModal = () => {
		setOpenFlashCardModal(true);
		setOpenFlashCardStart(false);
		setFlashCardID("");
	};

	const handleEditFlashCardTitle = (e) => {
		e.preventDefault();
		setOpenEditFlashCardDropdown(!openEditFlashCardDropdown);
	};

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

	const handleChangeFlashcardTitle = (e, id) => {
		e.preventDefault();
		if (flashcardQNATitle.length > 0 && flashcardQNATitle.length <= 32) {
			folderMaterialSystem.updateFlashCardTitle(flashcardQNATitle, id);
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
					questionNAnswer.currentMaterialID === flashCardID &&
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
					questionNAnswer.currentMaterialID === flashCardID &&
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
					questionNAnswer.currentMaterialID === flashCardID &&
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
					folderMaterial.id === flashCardID
			)
			.map((folderMaterial) =>
				folderMaterialSystem.updateFlashcardCompletion(0, folderMaterial.id)
			);
	};

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
									user,
									createFolderModal,
									setCreateFolderModal,
									openFolderModal,
									setOpenFolderModal,
									folderID,
									setFolderID,
									handleOpenFolderModal,
									libraryDropdown,
									setLibraryDropdown,
									viewAllFolders,
									setViewAllFolders,
									openFlashCardModal,
									setOpenFlashCardModal,
									handleOpenFlashCardsModal,
									handleOpenQuizzesModal,
									handleOpenTestsModal,
									handleViewAllFolders,
									handleOpenFlashCardEdit,
									handleOpenFlashCardStart,
									flashCardID,
									setFlashCardID,
									openEditFlashCardDropdown,
									setOpenEditFlashCardDropdown,
									setOpenFlashCardEdit,
									questionNAnswerID,
									setQuestionNAnswerID,
									handleResetFlashcards,
									questionNAnswerContainerRef,
								}}
							>
								<>
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
														flashCardID={flashCardID}
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
														flashCardID={flashCardID}
														startBackToFlashCardModal={
															startBackToFlashCardModal
														}
													/>
												);
											})}
								</>

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
															<div className="flex justify-center items-center bg-[rgba(0,0,0,0.9)] w-full h-full top-0 left-0 fixed z-50 px-4 overflow-no-width overflow-x-hidden overflow-y-scroll">
																<div
																	className={`flash-card-modal w-[95%] h-[90%] flex flex-col justify-start items-start rounded-xl bg-white pt-7 px-5 relative overflow-with-width overflow-x-hidden overflow-y-scroll`}
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

									{openQuizzesModal &&
										createPortal(
											folderSystem.allFolders
												.filter(
													(folder) =>
														folder.uid === user.uid && folder.id === folderID
												)
												.map((folder) => {
													return (
														<React.Fragment key={folder.id}>
															<div className="flex justify-center items-center bg-[rgba(0,0,0,0.9)] w-full h-full top-0 left-0 fixed z-50 px-4 overflow-no-width overflow-x-hidden overflow-y-scroll">
																<div
																	className={`quizzes-modal w-[90%] h-[90%] flex flex-col justify-start items-start rounded-xl bg-white p-5`}
																>
																	<div className="flex flex-col justify-center items-start gap-3 w-full">
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

																		<Quizzes />
																	</div>
																</div>
															</div>
														</React.Fragment>
													);
												}),
											document.body
										)}

									{openTestsModal &&
										createPortal(
											folderSystem.allFolders
												.filter(
													(folder) =>
														folder.uid === user.uid && folder.id === folderID
												)
												.map((folder) => {
													return (
														<React.Fragment key={folder.id}>
															<div className="flex justify-center items-center bg-[rgba(0,0,0,0.9)] w-full h-full top-0 left-0 fixed z-50 px-4 overflow-no-width overflow-x-hidden overflow-y-scroll">
																<div
																	className={`test-modal w-[90%] h-[90%] flex flex-col justify-start items-start rounded-xl bg-white p-5`}
																>
																	<div className="flex flex-col justify-center items-start gap-3 w-full">
																		<div className="flex justify-between items-start gap-2 w-full z-10">
																			<div className="flex flex-col justify-center items-start">
																				<p className="text-sm text-gray-500">
																					{folder.name}
																				</p>
																				<h1 className="title-h1">Tests</h1>
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

																		<Tests />
																	</div>
																</div>
															</div>
														</React.Fragment>
													);
												}),
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
