import React from "react";
import FirebaseAPI from "../../pages/api/firebaseAPI";

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
					className={`grid grid-cols-[auto_auto_auto] gap-7 lg:gap-0 justify-start lg:justify-between items-center w-full h-fit overflow-no-height overflow-x-scroll overflow-y-hidden rounded-xl relative`}
				>
					<div
						className={`w-[280px] h-fit rounded-xl px-6 py-4 ${
							user.theme ? "bg-[#444]" : "bg-gray-100"
						}`}
					>
						Lorem ipsum, dolor sit amet consectetur adipisicing elit. Placeat
						deleniti maxime perspiciatis suscipit! Vel quasi commodi laboriosam
						est quas deleniti temporibus ipsum, odit modi? Consequatur sed eos
						blanditiis nam magni?
					</div>
					<div
						className={`w-[280px] h-fit rounded-xl px-6 py-4 ${
							user.theme ? "bg-[#444]" : "bg-gray-100"
						}`}
					>
						Lorem ipsum, dolor sit amet consectetur adipisicing elit. Placeat
						deleniti maxime perspiciatis suscipit! Vel quasi commodi laboriosam
						est quas deleniti temporibus ipsum, odit modi? Consequatur sed eos
						blanditiis nam magni?
					</div>
					<div
						className={`w-[280px] h-fit rounded-xl px-6 py-4 ${
							user.theme ? "bg-[#444]" : "bg-gray-100"
						}`}
					>
						Lorem ipsum, dolor sit amet consectetur adipisicing elit. Placeat
						deleniti maxime perspiciatis suscipit! Vel quasi commodi laboriosam
						est quas deleniti temporibus ipsum, odit modi? Consequatur sed eos
						blanditiis nam magni?
					</div>
				</div>
			</div>
		</>
	);
}
