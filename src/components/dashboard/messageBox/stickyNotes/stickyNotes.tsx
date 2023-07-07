import { Dialog, Paper } from "@mui/material";
import "./stickyNotes.css";
import Draggable from "react-draggable";
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Search from "./components/Search";
import NotesList from "./components/NotesList";
import { nanoid } from "nanoid";
import { Modal } from "reactstrap";

function PaperComponent(props: any) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

const StickyNotes = ({ closeDialog, dialogLabel }) => {
  const [searchText, setSearchText] = useState<any>("");
  const [darkMode, setDarkMode] = useState<any>(false);
  const dialogLabels = dialogLabel.map((item, _index) => item?.label);
  const initialNotes = dialogLabels.map((label, index) => ({
    id: index,
    text: label,
  }));
  const [notes, setNotes] = useState<any>(initialNotes);

  useEffect(() => {
    if (notes !== null) {
      localStorage.setItem("react-notes-app-data", JSON.stringify(notes));
    }
  }, [notes]);

  useEffect(() => {
    localStorage.setItem("react-notes-app-data", JSON.stringify(notes));
  }, [notes]);
  const addNote = (text) => {
    const date = new Date();
    const newNote = {
      id: nanoid(),
      text: text,
      date: date.toLocaleDateString(),
    };

    const newNotes = [...notes, newNote];
    setNotes(newNotes);
  };

  const deleteNote = (id) => {
    const newNotes = notes.filter((note) => note.id !== id);
    setNotes(newNotes);
  };

  return (
    <>
      {/* <Draggable handle=".dialog-handle">
        <Dialog
          fullWidth
          maxWidth="lg"
          open={true}
          PaperProps={{
            style: {
              width: "100%",
              height: "100%",
              position: "relative",
            },
          }}
          key="filepreviewDialog"
        >
          <div className={`${darkMode && "dark-mode"}`}>
            <div className="container">
              <Header
                handleToggleDarkMode={setDarkMode}
                closeDialog={closeDialog}
              />
              <Search handleSearchNote={setSearchText} />
              <NotesList
                // notes={notes}
                notes={notes.filter((note) =>
                  note.text.toLowerCase().includes(searchText)
                )}
                handleAddNote={addNote}
                handleDeleteNote={deleteNote}
              />
            </div>
          </div>
        </Dialog>
      </Draggable> */}
      {/* <Modal
        open={true}
        container={document.body}
        BackdropComponent="div"
        BackdropProps={{
          style: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
        }}
      > */}
      <Dialog
        fullWidth
        maxWidth="lg"
        open={true}
        PaperProps={{
          style: {
            width: "100%",
            height: "100%",
            backgroundColor: "none",
          },
        }}
        aria-labelledby="draggable-dialog-title"
        PaperComponent={PaperComponent}
        key="filepreviewDialog"
      >
        <div className={`${darkMode && "dark-mode"}`}>
          <div
            className="container"
            style={{ cursor: "move" }}
            id="draggable-dialog-title"
          >
            <Header
              handleToggleDarkMode={setDarkMode}
              closeDialog={closeDialog}
            />
            <Search handleSearchNote={setSearchText} />
            <NotesList
              // notes={notes}
              notes={notes.filter((note) =>
                note.text.toLowerCase().includes(searchText)
              )}
              handleAddNote={addNote}
              handleDeleteNote={deleteNote}
            />
          </div>
        </div>
      </Dialog>
      {/* </Modal> */}
    </>
  );
};
export default StickyNotes;
