import React from "react";
import Image from "next/image";

export default function LoaderSymbol() {
	return (
		<>
			<div className="flex justify-center items-center gap-2">
				<h1 className="text-xl font-semibold w-full text-center">Loading</h1>
				<div className="min-w-[32px] max-w-[32px] min-h-[32px] max-h-[32px] border-4 border-t-transparent animate-spin border-blue-500 rounded-full" />
			</div>
		</>
	);
}
