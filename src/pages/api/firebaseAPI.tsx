import { FirebaseApp, initializeApp } from "firebase/app";
import {
	CollectionReference,
	Firestore,
	Query,
	addDoc,
	collection,
	doc,
	getFirestore,
	onSnapshot,
	orderBy,
	query,
	serverTimestamp,
	updateDoc,
} from "firebase/firestore";
import {
	Auth,
	GoogleAuthProvider,
	createUserWithEmailAndPassword,
	getAuth,
	sendEmailVerification,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut,
} from "firebase/auth";
import { Provider, useEffect, useRef, useState } from "react";

const firebaseConfig = {
	apiKey: "AIzaSyDsdXJq8CKygXeD3ERXS3-MzhIqk_DC0V0",
	authDomain: "quickstudy-91e92.firebaseapp.com",
	projectId: "quickstudy-91e92",
	storageBucket: "quickstudy-91e92.appspot.com",
	messagingSenderId: "161307530585",
	appId: "1:161307530585:web:0909d5d2bcca70e3db2848",
	measurementId: "G-XH2GJ5JVB4",
};

const app: FirebaseApp = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

const colRefRegistration: CollectionReference = collection(db, "registration");
const queryRegistration: Query = query(
	colRefRegistration,
	orderBy("createdTime")
);

export default function FirebaseAPI() {
	const [allUsers, setAllUsers] = useState<any[]>([]);
	const [registrationErrMsg, setRegistrationErrMsg] = useState<string>("");

	const registrationErrMsgRef = useRef<any>();
	const registrationErrMsgTime = 5000;

	useEffect(() => {
		onSnapshot(queryRegistration, (ss) => {
			const users = [];

			ss.docs.map((doc) => {
				users.push({
					...doc.data(),
					id: doc.id,
				});
			});

			setAllUsers(users);
		});
	}, []);

	class RegistrationSystem {
		constructor() {}

		addUser = async (email: string, password: string, username: string) => {
			const user = createUserWithEmailAndPassword(auth, email, password)
				.then(async (result) => {
					await sendEmailVerification(result.user);

					await addDoc(colRefRegistration, {
						username: username,
						email: email,
						createdTime: serverTimestamp(),
						theme: false,
						uid: result.user.uid,
					});
				})
				.catch(async (err) => {
					clearTimeout(registrationErrMsgRef.current);
					setRegistrationErrMsg(err.message);

					registrationErrMsgRef.current = setTimeout(() => {
						setRegistrationErrMsg("");
					}, registrationErrMsgTime);
				});
		};

		signIn = async (email: string, password: string) => {
			await signInWithEmailAndPassword(auth, email, password).catch((err) => {
				clearTimeout(registrationErrMsgRef.current);
				setRegistrationErrMsg(err.message);

				registrationErrMsgRef.current = setTimeout(() => {
					setRegistrationErrMsg("");
				}, registrationErrMsgTime);
			});
		};

		passwordReset = async (email: string) => {
			await sendPasswordResetEmail(auth, email).catch((err) => {
				clearTimeout(registrationErrMsgRef.current);
				setRegistrationErrMsg(err.message);

				registrationErrMsgRef.current = setTimeout(() => {
					setRegistrationErrMsg("");
				}, registrationErrMsgTime);
			});
		};

		googleSignIn = async () => {
			const provider = new GoogleAuthProvider();

			await signInWithPopup(auth, provider)
				.then((result) => {
					const user = result.user;

					user.email &&
					allUsers
						?.map((users: any) =>
							users.email.toString() === user.email ? true : false
						)
						.includes(true)
						? ""
						: addDoc(colRefRegistration, {
								displayName: user.displayName,
								email: user.email,
								createdTime: serverTimestamp(),
								theme: false,
								uid: user.uid,
						  });
				})
				.catch((err) => {
					clearTimeout(registrationErrMsgRef.current);
					setRegistrationErrMsg(err.message);

					registrationErrMsgRef.current = setTimeout(() => {
						setRegistrationErrMsg("");
					}, registrationErrMsgTime);
				});
		};

		logout = async () => {
			await signOut(auth).catch((err) => {
				clearTimeout(registrationErrMsgRef.current);
				setRegistrationErrMsg(err.message);

				registrationErrMsgRef.current = setTimeout(() => {
					setRegistrationErrMsg("");
				}, registrationErrMsgTime);
			});
		};

		themeChange = async (theme: boolean, id: string) => {
			const docRef = doc(colRefRegistration, id);

			await updateDoc(docRef, {
				theme: !theme,
			}).catch((err) => {
				clearTimeout(registrationErrMsgRef.current);
				setRegistrationErrMsg(err.message);

				registrationErrMsgRef.current = setTimeout(() => {
					setRegistrationErrMsg("");
				}, registrationErrMsgTime);
			});
		};
	}
	const RS = new RegistrationSystem();
	const addUser = RS.addUser;
	const googleSignIn = RS.googleSignIn;
	const passwordReset = RS.passwordReset;
	const signIn = RS.signIn;
	const logout = RS.logout;
	const themeChange = RS.themeChange;

	return {
		auth,
		registration: {
			allUsers,
			registrationErrMsg,
			addUser,
			signIn,
			googleSignIn,
			themeChange,
			passwordReset,
			logout,
		},
	};
}
