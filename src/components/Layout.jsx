import { onAuthStateChanged } from "firebase/auth";
import Head from "next/head";
import React, { useEffect } from "react";
import FirebaseAPI from "../pages/api/firebaseAPI";
import { useRouter } from "next/navigation";

export default function Layout({ children }) {
	const { auth } = FirebaseAPI();
	const router = useRouter();

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				router.push("/");
			} else {
				router.push("/registration");
			}
		});
	}, []);

	return (
		<>
			<Head>
				<link rel="shortcut icon" href="/images/logo.png" type="image/x-icon" />
			</Head>
			<main>{children}</main>
		</>
	);
}
