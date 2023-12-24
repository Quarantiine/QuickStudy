import React from "react";
import Image from "next/image";
import Bar from "./Bar";
import RecentActivities from "./RecentActivities";
import Folders from "./Folders";
import KhanAcademy from "./KhanAcademy";
import StudyTips from "./StudyTips";

export default function MainDashboard({ user }) {
	return (
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
	);
}
