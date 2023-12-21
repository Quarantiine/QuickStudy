import Head from "next/head";
import React, { createContext, useEffect, useState } from "react";
import Navbar from "../components/Dashboard/Navbar";
import FirebaseAPI from "../pages/api/firebaseAPI";
import Bar from "../components/Dashboard/Bar";
import Image from "next/image";
import RecentActivities from "../components/Dashboard/RecentActivities";
import Folders from "../components/Dashboard/Folders";
import KhanAcademy from "../components/Dashboard/KhanAcademy";
import LoaderSymbol from "../components/LoaderSymbol";
import StudyTips from "../components/Dashboard/StudyTips";

export const UserCredentialsCtx = createContext();

export default function Home() {
	const { auth, registration } = FirebaseAPI();
	const [openShortNavbar, setOpenShortNavbar] = useState(false);

	const handleChangeTheme = (theme, id) => {
		registration.themeChange(theme, id);
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
							<UserCredentialsCtx.Provider value={{ user }}>
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
