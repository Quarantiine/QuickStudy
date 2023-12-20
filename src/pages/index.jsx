import Head from "next/head";
import React, { useEffect, useState } from "react";
import FirebaseAPI from "../pages/api/firebaseAPI";

export default function Home() {
	const { registration } = FirebaseAPI();

	const handleLogout = () => {
		registration.logout();
	};

	return (
		<>
			<Head>
				<title>Dashboard</title>
			</Head>

			<main className="w-full h-full">
				<button onClick={handleLogout} className="btn w-fit m-5">
					Logout
				</button>
			</main>
		</>
	);
}
