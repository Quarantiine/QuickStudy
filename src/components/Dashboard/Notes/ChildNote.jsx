import React, { useEffect, useState } from "react";
import Image from "next/image";
import FirebaseAPI from "../../../pages/api/firebaseAPI";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ChildNote({ note }) {
  const { auth, noteSystem } = FirebaseAPI();
  const [fullscreen, setFullscreen] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editNoteTitle, setEditNoteTitle] = useState("");
  const router = useRouter();

  const handleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  const handleDeleteNote = () => {
    noteSystem.deleteNote(note.id);
  };

  const handleEditTitle = () => {
    setEditingTitle(!editingTitle);
  };

  const handleChangeTitle = () => {
    if (editNoteTitle) {
      noteSystem.editNote(editNoteTitle, note.id);
      setEditNoteTitle("");
      setEditingTitle(false);
    }
  };

  useEffect(() => {
    const closeEditing = (e) => {
      if (!e.target.closest(".note-input-field")) {
        setEditingTitle(false);
      }
    };

    document.addEventListener("mousedown", closeEditing);
    return () => document.removeEventListener("mousedown", closeEditing);
  }, [editingTitle]);

  return (
    <>
      {fullscreen && (
        <div className="fixed top-0 left-0 w-full h-full bg-[#222] z-10 flex justify-center items-center p-10">
          <button
            onClick={handleFullscreen}
            className="text-sm base-bg rounded-full p-1 text-btn z-10 absolute top-10 right-10 flex justify-center items-center"
          >
            <Image src={"/icons/close.svg"} alt="icon" width={25} height={25} />
          </button>

          <div className="flex flex-wrap w-full h-full absolute">
            {noteSystem.allNotes
              .filter(
                (note2) =>
                  auth.currentUser.uid === note2.uid &&
                  note2.currentSectionNoteID === note.currentSectionNoteID &&
                  note2.id === note.id
              )
              .map((note2) => {
                return (
                  <React.Fragment key={note2.id}>
                    <Image
                      className="object-contain rounded-lg"
                      src={note2.noteImage}
                      alt="img"
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />

                    <div className="flex flex-col justify-center items-center absolute bottom-10 gap-2 w-[90%] left-1/2 -translate-x-1/2">
                      <h1 className="title-h1 shadow-2xl bg-white rounded-lg px-3 py-1 text-center opacity-20 hover:opacity-100 transition-all">
                        {note2.title}
                      </h1>
                    </div>
                  </React.Fragment>
                );
              })}
          </div>
        </div>
      )}

      {noteSystem.allNotes
        .filter(
          (note2) =>
            auth.currentUser.uid === note2.uid &&
            note2.currentSectionNoteID === note.currentSectionNoteID &&
            note2.id === note.id
        )
        .map((note2) => !note2.linkNote)
        .includes(true) ? (
        <div className="w-full h-[200px] rounded-lg flex flex-col justify-start items-start relative">
          <div className="w-full h-full relative">
            <div className="w-full h-full rounded-lg flex justify-center items-center text-center relative">
              <Image
                className="object-cover rounded-lg"
                src={note.noteImage}
                alt="img"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>

            <div className="bg-gradient-to-b rounded-b-lg to-black from-transparent absolute top-0 left-0 w-full h-full flex flex-col justify-end items-start sm:flex-row sm:justify-between sm:items-end p-4 gap-2">
              {editingTitle ? (
                <input
                  className="note-input-field input-field w-full"
                  onChange={(e) => setEditNoteTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleChangeTitle()}
                  type="text"
                  placeholder={`${note.title}`}
                />
              ) : (
                <p
                  onDoubleClick={handleEditTitle}
                  className="hidden sm:block line-clamp-1 whitespace-nowrap text-xl font-bold text-white"
                >
                  {note.title}
                </p>
              )}

              <div className="w-fit flex justify-center items-center gap-1">
                <button
                  onClick={handleDeleteNote}
                  className="text-sm bg-red-500 rounded-lg p-2 text-btn"
                >
                  <Image
                    className="min-w-[15px] min-h-[15px] max-w-[15px] max-h-[15px]"
                    src={"/icons/delete.svg"}
                    alt="icon"
                    width={15}
                    height={15}
                  />
                </button>

                {noteSystem.allNotes
                  .filter(
                    (note2) =>
                      auth.currentUser.uid === note2.uid &&
                      note2.currentSectionNoteID ===
                        note.currentSectionNoteID &&
                      note2.id === note.id
                  )
                  .map((note2) => !note2.linkNote)
                  .includes(true) && (
                  <button
                    onClick={handleFullscreen}
                    className="text-sm bg-[#2871FF] rounded-lg p-2 text-btn"
                  >
                    <Image
                      className="min-w-[15px] min-h-[15px] max-w-[15px] max-h-[15px]"
                      src={"/icons/open_in_full.svg"}
                      alt="icon"
                      width={15}
                      height={15}
                    />
                  </button>
                )}

                <button
                  onClick={handleEditTitle}
                  className="text-sm bg-[white] rounded-lg p-2 text-btn"
                >
                  <Image
                    className="min-w-[15px] min-h-[15px] max-w-[15px] max-h-[15px]"
                    src={"/icons/edit.svg"}
                    alt="icon"
                    width={15}
                    height={15}
                  />
                </button>
              </div>

              <p className="block sm:hidden line-clamp-1 text-xl font-bold text-white whitespace-nowrap">
                {note.title}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-[50px] rounded-lg flex flex-col justify-start items-start relative">
          <div className="w-full h-full relative">
            <div className="bg-gray-100 border border-gray- rounded-lg absolute top-0 left-0 w-full h-full flex justify-between items-center p-2 gap-2">
              {editingTitle ? (
                <input
                  className="note-input-field input-field w-full"
                  onChange={(e) => setEditNoteTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleChangeTitle()}
                  type="text"
                  placeholder={`${note.title}`}
                />
              ) : (
                note.linkNote && (
                  <Link
                    className="flex justify-center items-center line-clamp-1 text-btn"
                    href={note.linkNote}
                    target="_blank"
                  >
                    <p className="line-clamp-1 whitespace-nowrap text-xl font-bold text-black">
                      {note.title}
                    </p>
                  </Link>
                )
              )}

              <div className="w-fit flex justify-center items-center gap-2">
                <button
                  onClick={handleDeleteNote}
                  className="text-sm bg-red-500 rounded-lg p-2 text-btn"
                >
                  <Image
                    className="min-w-[15px] min-h-[15px] max-w-[15px] max-h-[15px]"
                    src={"/icons/delete.svg"}
                    alt="icon"
                    width={15}
                    height={15}
                  />
                </button>

                {noteSystem.allNotes
                  .filter(
                    (note2) =>
                      auth.currentUser.uid === note2.uid &&
                      note2.currentSectionNoteID ===
                        note.currentSectionNoteID &&
                      note2.id === note.id
                  )
                  .map((note2) => !note2.linkNote)
                  .includes(true) && (
                  <button
                    onClick={handleFullscreen}
                    className="text-sm bg-[#2871FF] rounded-lg p-2 text-btn"
                  >
                    <Image
                      className="min-w-[15px] min-h-[15px] max-w-[15px] max-h-[15px]"
                      src={"/icons/open_in_full.svg"}
                      alt="icon"
                      width={15}
                      height={15}
                    />
                  </button>
                )}

                <button
                  onClick={handleEditTitle}
                  className="text-sm bg-[white] rounded-lg p-2 text-btn"
                >
                  <Image
                    className="min-w-[15px] min-h-[15px] max-w-[15px] max-h-[15px]"
                    src={"/icons/edit.svg"}
                    alt="icon"
                    width={15}
                    height={15}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
