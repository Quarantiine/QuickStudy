import React, { useEffect, useState } from "react";
import FirebaseAPI from "../../pages/api/firebaseAPI";
import Image from "next/image";

export default function Navbar({ user, openShortNavbar, setOpenShortNavbar }) {
	const { registration } = FirebaseAPI();

	const [libraryDropdown, setLibraryDropdown] = useState(false);

	const handleLogout = () => {
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

	return (
		<>
			<div
				className={`w-full h-fit flex sm:justify-start items-center bg-[#373f4e] px-7 py-7 z-50`}
			>
				<div className="flex justify-center items-center gap-2 w-fit">
					<h1 className="text-white italic font-semibold text-2xl hidden sm:block">
						QuickStudy
					</h1>
					<Image
						className="object-contain"
						src={"/images/logo.png"}
						alt="logo"
						width={30}
						height={30}
						draggable={false}
					/>
				</div>

				<div className="flex justify-center items-center gap-4 sm:gap-5 ml-auto text-white">
					<button onClick={handleOpenShortNavbar} className="text-btn">
						<Image
							className="object-contain block sm:hidden"
							src={openShortNavbar ? "/icons/cancel.svg" : "/icons/menu.svg"}
							alt="icon"
							width={25}
							height={25}
							draggable={false}
						/>
					</button>

					<div className="hidden sm:flex justify-center items-center gap-4">
						<button
							onClick={null}
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

							{libraryDropdown && (
								<div className="library-dropdown w-full h-20 rounded-xl absolute top-10 right-0 bg-white shadow-md z-10"></div>
							)}
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
				user={user}
				openShortNavbar={openShortNavbar}
				handleLibraryDropdown={handleLibraryDropdown}
				libraryDropdown={libraryDropdown}
			/>
		</>
	);
}

const ShortNavbar = ({
	user,
	openShortNavbar,
	handleLibraryDropdown,
	libraryDropdown,
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
							onClick={null}
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
								<div className="library-dropdown w-full h-20 rounded-xl absolute top-10 right-0 bg-white shadow-md z-10"></div>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
};
