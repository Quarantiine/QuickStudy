import React, { useContext } from "react";
import FirebaseAPI from "../../pages/api/firebaseAPI";
import Image from "next/image";
import { UserCredentialsCtx } from "../../pages";

export default function Folders({ user }) {
	const { registration, folderSystem } = FirebaseAPI();
	const { handleOpenFolderModal, viewAllFolders, setViewAllFolders } =
		useContext(UserCredentialsCtx);

	const handleHideFolder = () => {
		registration.hidingSection2(user.hideSection2, user.id);
	};

	const handleViewAllFolders = () => {
		setViewAllFolders(!viewAllFolders);
	};

	return (
		<>
			<div className="flex flex-col justify-center items-center relative w-full h-auto gap-5">
				<div className="flex justify-between items-center gap-2 w-full">
					<h1 className="title-h1">Folders</h1>
					<div className="flex justify-center items-center gap-4 ml-auto">
						<button onClick={handleHideFolder} className="text-btn text-sm">
							Hide
						</button>

						<button
							onClick={handleViewAllFolders}
							className="btn text-sm border border-[#2871FF] !bg-transparent !text-[#2871FF]"
						>
							View More
						</button>
					</div>
				</div>

				<div
					className={`grid grid-cols-[auto_auto_auto] gap-7 lg:gap-0 justify-start lg:justify-between items-center w-full h-fit overflow-no-height overflow-x-scroll overflow-y-hidden rounded-xl relative`}
				>
					{folderSystem.allFolders
						.filter((value) => value.uid === user.uid)
						.slice(0, 3)
						.map((folder) => {
							return (
								<ChildFolders
									key={folder.id}
									folder={folder}
									user={user}
									handleOpenFolderModal={handleOpenFolderModal}
								/>
							);
						})}
				</div>

				{folderSystem.allFolders
					.filter((folder) => folder.uid === user.uid)
					.map((folder) => folder).length < 1 && (
					<div
						className={`w-full h-[250px] rounded-xl flex flex-col gap-2 justify-center items-center ${
							user.theme ? "bg-[#333] text-[#555]" : "bg-gray-200 text-gray-400"
						}`}
					>
						<Image
							className="object-cover grayscale opacity-50"
							src={"/images/logo.png"}
							alt="logo"
							width={60}
							height={60}
							priority="true"
						/>
						<p className="text-lg">You have no folders</p>
					</div>
				)}
			</div>
		</>
	);
}

const ChildFolders = ({ folder, user, handleOpenFolderModal }) => {
	return (
		<>
			<button
				onClick={() => handleOpenFolderModal(folder.id)}
				className={`flex flex-col justify-start items-start text-start text-btn gap-1 w-[280px] h-full rounded-xl px-6 py-4 ${
					user.theme ? "bg-[#444]" : "bg-gray-100"
				}`}
			>
				<div className="flex justify-between items-center gap-1 w-full">
					<h1 className="text-xl font-semibold">{folder.name}</h1>
					<Image
						className="object-contain"
						src={"/icons/folder.svg"}
						alt="icon"
						width={23}
						height={23}
					/>
				</div>
				<p
					className={`${
						user.theme
							? folder.description === "No Description" && "text-[#777]"
							: folder.description === "No Description" && "text-gray-400"
					}`}
				>
					{folder.description}
				</p>
			</button>
		</>
	);
};
