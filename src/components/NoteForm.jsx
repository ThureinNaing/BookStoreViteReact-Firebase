import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useFirestore from "../Hooks/useFirestore";
import { ThemeContext } from "../contexts/ThemeContext";

export default function NoteForm({ type = "create", setEditNote, editNote }) {
	let { id } = useParams();
	let [body, setBody] = useState("");
	let { addCollection, updateDocument } = useFirestore();
	let { isDark } = useContext(ThemeContext);
	// add note
	let submitNote = async (e) => {
		if (type === "create") {
			e.preventDefault();
			let data = {
				body,
				bookUid: id,
			};
			await addCollection("notes", data);
			setBody("");
		} else {
			e.preventDefault();
			editNote.body = body;
			await updateDocument("notes", editNote.id, editNote, false);
			setEditNote(null);
		}
	};
	// edit note
	useEffect(() => {
		if (type === "update") {
			setBody(editNote.body);
		}
	}, [type]);

	return (
		<form onSubmit={submitNote}>
			<textarea
				value={body}
				onChange={(e) => setBody(e.target.value)}
				name=""
				className={`p-3 w-full shadow-lg border-3 ${
					isDark ? "bg-indigo-200" : "bg-gray-200"
				}`}
				cols="30"
				rows="5"
				id=""
			></textarea>

			<div className="flex space-x-3">
				<button className=" bg-indigo-600 rounded-lg px-3 py-2 flex items-center gap-1 text-sm my-3">
					<span className=" text-white">
						{type === "create" ? "Add" : "Update"} Notes
					</span>
				</button>

				{type === "update" && (
					<button
						onClick={() => setEditNote(null)}
						type="button"
						className=" border-indigo-600 border-2 rounded-lg px-3 py-2 flex items-center gap-1 text-sm my-3"
					>
						<span className=" text-indigo-500">Cancel</span>
					</button>
				)}
			</div>
		</form>
	);
}
