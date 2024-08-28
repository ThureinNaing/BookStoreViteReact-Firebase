import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function useSignup() {
	let [error, setError] = useState(null);
	let [loading, setLoading] = useState(false);

	const singUP = async (email, password) => {
		try {
			setLoading(true);
			let res = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			setError(false);
			setLoading(false);
			return res.user;
		} catch (e) {
			setLoading(false);
			setError(e.message);
		}
	};

	return { error, loading, singUP };
}
