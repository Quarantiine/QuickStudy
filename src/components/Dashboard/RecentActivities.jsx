import React from "react";
import FirebaseAPI from "../../pages/api/firebaseAPI";
import Image from "next/image";

export default function RecentActivities({ user }) {
	const { registration } = FirebaseAPI();

	const handleHideFolder = () => {
		registration.hidingSection1(user.hideSection1, user.id);
	};

	return (
		<>
			<div className="flex flex-col justify-center items-center relative w-full h-auto gap-5">
				<div className="flex justify-between items-center gap-2 w-full">
					<h1 className="title-h1">Recent Activity</h1>
					<button
						onClick={handleHideFolder}
						className="text-btn text-sm ml-auto"
					>
						Hide
					</button>
				</div>

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
					<p className="text-lg">You have no recent activities</p>
				</div>
			</div>
		</>
	);
}
