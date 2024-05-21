import React, { useContext } from "react";
import Image from "next/image";
import FirebaseAPI from "../../../pages/api/firebaseAPI";
import { UserCredentialsCtx } from "../../../pages";

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
        <div className="relative flex justify-center items-center w-full h-full">
          <Image
            className="object-cover rounded-lg w-full h-full"
            src={note.noteImage}
            alt={`img`}
            width={100}
            height={100}
          />
        </div>
      ) : (
        <>
          <Image
            className="object-cover rounded-lg w-full h-full"
            src={note.noteImage}
            alt={"img"}
            width={100}
            height={100}
          />
        </>
      )}
    </>
  );
}
