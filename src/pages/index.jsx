import Head from "next/head";
import React, { createContext, useEffect, useRef, useState } from "react";
import Navbar from "../components/Dashboard/Navbar";
import FirebaseAPI from "../pages/api/firebaseAPI";
import Bar from "../components/Dashboard/Bar";
import Image from "next/image";
import RecentActivities from "../components/Dashboard/RecentActivities";
import Folders from "../components/Dashboard/Folders";
import KhanAcademy from "../components/Dashboard/KhanAcademy";
import LoaderSymbol from "../components/LoaderSymbol";
import StudyTips from "../components/Dashboard/StudyTips";
import { createPortal } from "react-dom";

export const UserCredentialsCtx = createContext();

export default function Home() {
	const { auth, registration, folderSystem } = FirebaseAPI();
	const [openShortNavbar, setOpenShortNavbar] = useState(false);
	const [createFolderModal, setCreateFolderModal] = useState(false);
	const [openFolderModal, setOpenFolderModal] = useState(false);
	const [folderID, setFolderID] = useState("");
	const [libraryDropdown, setLibraryDropdown] = useState(false);
	const [viewAllFolders, setViewAllFolders] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

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
								}}
							>
								{viewAllFolders &&
									createPortal(
										<>
											<div className="flex justify-center items-center bg-[rgba(0,0,0,0.7)] w-full h-full top-0 left-0 fixed z-50 px-4 overflow-no-width overflow-x-hidden overflow-y-scroll">
												<div
													className={`all-folders-modal w-[80%] sm:w-[45%] h-fit flex flex-col justify-center items-center rounded-xl bg-white p-5 ${
														searchQuery.length < 1 ? "gap-4" : "gap-2"
													}`}
												>
													{folderSystem.allFolders
														.filter((folder) => folder.uid === user.uid)
														.map((folder) => folder).length < 1 ? (
														<div
															className={`w-full h-fit rounded-xl flex flex-col gap-2 justify-center items-center`}
														>
															<Image
																className="object-cover grayscale opacity-50"
																src={"/images/logo.png"}
																alt="logo"
																width={60}
																height={60}
																priority="true"
															/>
															<p className="text-lg text-gray-400">
																You have no folders
															</p>
														</div>
													) : (
														<>
															<h1 className="title-h1">Your Folders</h1>
															<input
																className="input-field w-full"
																type="text"
																placeholder="Search Folder"
																onChange={(e) => setSearchQuery(e.target.value)}
															/>

															<div className="flex flex-col justify-start items-center gap-1 w-full min-h-[fit-content] max-h-[250px] overflow-no-width overflow-x-hidden overflow-y-scroll">
																{folderSystem.allFolders
																	.filter((folder) => folder.uid === user.uid)
																	.map((folder) => {
																		if (
																			folder.name
																				.normalize("NFD")
																				.replace(/\p{Diacritic}/gu, "")
																				.toLowerCase()
																				.includes(searchQuery.toLowerCase())
																		) {
																			return (
																				<React.Fragment key={folder.id}>
																					<button
																						onClick={() =>
																							handleOpenFolderModal(folder.id)
																						}
																						className="flex justify-between items-center gap-2 w-full text-btn"
																					>
																						<h1 className="text-xl line-clamp-1">
																							{folder.name}
																						</h1>
																						<Image
																							className="object-contain"
																							src={"/icons/folder.svg"}
																							alt="icon"
																							width={23}
																							height={23}
																						/>
																					</button>
																				</React.Fragment>
																			);
																		}
																	})}
															</div>
														</>
													)}

													{folderSystem.allFolders
														.filter(
															(folder) =>
																folder.uid === user.uid &&
																folder.name
																	.normalize("NFD")
																	.replace(/\p{Diacritic}/gu, "")
																	.toLowerCase()
																	.includes(searchQuery.toLowerCase())
														)
														.map((folder) => folder).length < 1 && (
														<div className="flex flex-col justify-center items-center text-lg">
															<p className="text-gray-400">No Folder Named:</p>
															<p className="font-medium">{searchQuery}</p>
														</div>
													)}
												</div>
											</div>
										</>,
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

											<div
												className={`w-[90%] sm:w-[80%] lg:w-[900px] mx-auto h-auto flex flex-col justify-center items-center gap-16 pt-16 pb-20 ${
													user.theme ? "text-[#bbb]" : "text-black"
												}`}
											>
												<Bar user={user} />
												{!user.hideSection1 &&
													!user.hideSection2 &&
													!user.hideSection3 &&
													!user.hideSection4 && (
														<div className="flex flex-col justify-center items-center gap-4 opacity-50">
															<Image
																className="object-contain grayscale"
																src={"/images/logo.png"}
																alt="logo"
																width={70}
																height={70}
																draggable={false}
															/>
															<h1 className="text-lg">
																<span>All Sections Are Hidden, </span>
																<span>{user.username || user.displayName}</span>
															</h1>
														</div>
													)}
												{user.hideSection1 && <RecentActivities user={user} />}
												{user.hideSection2 && <Folders user={user} />}
												{user.hideSection3 && <KhanAcademy user={user} />}
												{user.hideSection4 && <StudyTips user={user} />}
											</div>
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
