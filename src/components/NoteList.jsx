import React, { useContext, useState } from "react";
import profileIcon from "../assets/profileIcon.svg";
import trash from "../assets/trash.svg";
import pencil from "../assets/pencil.svg";
import { useParams } from "react-router-dom";
import useFirestore from "../Hooks/useFirestore";
import moment from "moment";
import NoteForm from "./NoteForm";
import { AuthContext } from "../contexts/AuthContext";

export default function NoteList() {
	let { id } = useParams();
	let [editNote, setEditNote] = useState(null);
	let { getCollection, deleteDocument } = useFirestore();
	let { user } = useContext(AuthContext);
	// add note
	let {
		error,
		data: notes,
		loading,
	} = getCollection("notes", ["bookUid", "==", id]);
	// edit note

	// delete note
	let DeleteNote = async (id) => {
		await deleteDocument("notes", id);
	};

	return (
		!!notes.length &&
		notes.map((note) => (
			<div key={note.id} className="border-3 shadow-md p-3 my-3">
				<div className="flex justify-between   space-x-3">
					<div>
						<img
							src={profileIcon}
							alt=""
							className="w-12 h-12 rounded-full"
						/>
						<div>
							<h3>{user.email}</h3>
							<div className="text-gray-400">
								{moment(note?.date?.seconds * 1000).fromNow()}
							</div>
						</div>
					</div>
					{/* pencil and trash i */}
					<div className="space-y-5 my-auto cursor-pointer">
						<div onClick={() => setEditNote(note)}>
							<img src={pencil} alt="" />
						</div>
						<div
							onClick={() => DeleteNote(note.id)}
							className="cursor-pointer"
						>
							<img src={trash} alt="" />
						</div>
					</div>
				</div>
				{/* note form */}
				<div className="mt-3">
					{editNote?.id !== note.id && note.body}
					{editNote?.id === note.id && (
						<NoteForm
							type="update"
							setEditNote={setEditNote}
							editNote={editNote}
						/>
					)}
				</div>
			</div>
		))
	);
}
