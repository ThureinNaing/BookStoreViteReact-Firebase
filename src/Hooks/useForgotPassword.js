import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { useState } from "react";

export default function useForgotPassword() {
	let [error, setError] = useState(null);
	let [loading, setLoading] = useState(false);

	const ResetPassword = async (auth, email) => {
		try {
			setLoading(true);
			let res = await sendPasswordResetEmail(auth, email);
			setLoading(false);
		} catch (e) {
			setLoading(false);
			setError(e.message);
		}
	};

	return { error, loading, ResetPassword };
}
