import React, { useContext } from "react";
import Image from "next/image";
import FirebaseAPI from "../../../pages/api/firebaseAPI";
import { UserCredentialsCtx } from "../../../pages";
import Link from "next/link";

export default function SectionNotePreview({ note, folder, sectionNote }) {
  const { auth, noteSystem } = FirebaseAPI();
  const { mainMaterialID } = useContext(UserCredentialsCtx);

  return (
    <>
      {noteSystem.allNotes
        .filter(
          (note) =>
            note.uid === auth.currentUser.uid &&
            note.materialType === "note" &&
            note.currentMaterialID === mainMaterialID &&
            note.currentFolderID === folder.id &&
            note.currentSectionNoteID === sectionNote.id
        )
        .map((note) => note).length < 2 ? (
        note.linkNote ? (
          <Link
            href={note.linkNote && note.linkNote}
            target="_blank"
            className="relative flex justify-between items-center text-btn w-full bg-white rounded-lg px-1"
            title={note.title}
          >
            <p className="line-clamp-1 px-2 py-1 rounded-md">{note.title}</p>
            <Image src={"/icons/link.svg"} alt="link" width={20} height={20} />
          </Link>
        ) : (
          <div className="relative flex justify-center items-center w-full h-full">
            <Image
              className="object-cover rounded-lg w-full h-full"
              src={note.noteImage}
              alt={`img`}
              width={100}
              height={100}
            />
          </div>
        )
      ) : note.linkNote ? (
        <Link
          href={note.linkNote && note.linkNote}
          target="_blank"
          className="relative flex justify-between items-center text-btn w-full bg-white rounded-lg px-1"
          title={note.title}
        >
          <p className="line-clamp-1 px-2 py-1 round-md">{note.title}</p>
          <Image src={"/icons/link.svg"} alt="link" width={20} height={20} />
        </Link>
      ) : (
        <Image
          className="object-cover rounded-lg w-full h-full"
          src={note.noteImage}
          alt={"img"}
          width={100}
          height={100}
        />
      )}
    </>
  );
}
