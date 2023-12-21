import React from "react";
import Image from "next/image";

export default function LoaderSymbol() {
	return (
		<>
			<div className="flex justify-center items-center absolute top-0 left-0 w-full h-full">
				<div className="relative">
					<Image
						className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
						src={"/images/logo.png"}
						alt="logo"
						width={70}
						height={70}
						priority="true"
					/>

					<p className="absolute -bottom-1 left-1/2 -translate-x-1/2 font-semibold text-sm">
						Loading
					</p>
					<iframe
						className="w-fit"
						src="https://lottie.host/embed/9c96f4b8-4021-4903-9d43-cc4b0931ae40/hzk6ZAMzJ2.json"
					/>
				</div>
			</div>
		</>
	);
}
