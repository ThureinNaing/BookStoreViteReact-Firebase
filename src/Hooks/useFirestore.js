import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import {
	collection,
	onSnapshot,
	query,
	orderBy,
	doc,
	deleteDoc,
	updateDoc,
	addDoc,
	serverTimestamp,
	where,
} from "firebase/firestore";

export default function useFirestore() {
	let getCollection = (colName, _q, search) => {
		let qRef = useRef(_q).current; // [], {}
		let [error, setError] = useState("");
		let [loading, setLoading] = useState(false);
		let [data, setData] = useState([]);
		// fetch from firebase
		useEffect(
			function () {
				setLoading(true);
				let ref = collection(db, colName);
				let qureires = [];
				if (qRef) {
					qureires.push(where(...qRef));
				}
				qureires.push(orderBy("date", "desc"));
				let q = query(ref, ...qureires); // query order
				onSnapshot(q, (docs) => {
					if (docs.empty) {
						setError("Cannot fetch");
						setLoading(false);
						setData([]); //minor bug fix
					} else {
						let collectionData = [];
						docs.forEach((doc) => {
							let document = { id: doc.id, ...doc.data() };
							collectionData.push(document);
						});
						// for search
						if (search?.field) {
							let searchDatas = collectionData.filter((doc) => {
								return doc[search?.field]
									.toLowerCase()
									.includes(search?.value.toLowerCase());
							});
							setData(searchDatas);
						} else {
							setData(collectionData);
						}

						setLoading(false);
						setError("");
					}
				});
			},
			[qRef, search?.field, search?.value]
		);
		return { error, data, loading };
	};

	let getDocument = (colName, id) => {
		let [error, setError] = useState("");
		let [loading, setLoading] = useState(false);
		let [data, setData] = useState(null);
		useEffect(() => {
			setLoading(true);
			let ref = doc(db, colName, id);
			onSnapshot(ref, (doc) => {
				if (doc.exists()) {
					let document = { id: doc.id, ...doc.data() };
					setData(document);
					setLoading(false);
					setError("");
				} else {
					setError("No document found!");
					setLoading(false);
				}
			});
		}, [id]);
		return { error, data, loading };
	};

	let addCollection = (colName, data) => {
		data.date = serverTimestamp();
		let ref = collection(db, colName);
		return addDoc(ref, data);
	};

	let deleteDocument = async (colName, id) => {
		let ref = doc(db, colName, id);
		return deleteDoc(ref);
	};

	let updateDocument = async (colName, id, data, updateDate = true) => {
		if (updateDate) {
			data.date = serverTimestamp();
		}
		let ref = doc(db, colName, id);
		return updateDoc(ref, data);
	};

	return {
		getCollection,
		addCollection,
		getDocument,
		deleteDocument,
		updateDocument,
	};
}
