import { Dialog, LinearProgress, Paper } from "@mui/material";
import "./stickyNotes.css";
import Draggable from "react-draggable";
import React, { useState, useEffect, useContext } from "react";
import NotesList from "./noteComponents/NotesList";
import { nanoid } from "nanoid";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Grid, Tooltip } from "@mui/material";
import { GradientButton } from "components/styledComponent/button";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import AddNote from "./noteComponents/AddNote";
import { useQuery } from "react-query";
import * as API from "../../api";
import { AuthContext } from "pages_audit/auth";
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

const StickyNotes = ({ closeDialog, reqdata, open }) => {
  const [searchText, setSearchText] = useState<any>("");
  const [darkMode, setDarkMode] = useState<any>(false);
  const colors = [
    "#DAE23A",
    "#b693fd",
    "#fe9b72",
    "#fec971",
    "#00d4fe",
    "#b693fd",
    "#e4ee91",
  ];

  const { authState } = useContext(AuthContext);

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery(
    [
      "getDashboardMessageBoxData",
      {
        screenFlag: "Notes",
        userID: authState?.user?.id ?? "",
        // transactionID,
      },
    ],
    () =>
      API.getDashboardMessageBoxData({
        screenFlag: "Notes",
        userID: authState?.user?.id ?? "",
        transactionID: "",
      })
  );
  let dialogLabels = [{ title: "", DESCRIPTION: "", TRAN_CD: "", FLAG: "" }];

  if (!isLoading) {
    dialogLabels = data.map((item: any, _index: any) => item);
  }
  const initialNotes = dialogLabels.map((item, index: any) => ({
    id: index,
    title: item?.title || "",
    text: item?.DESCRIPTION,
    tranCD: item?.TRAN_CD,
    flag: item?.FLAG,
    color: colors[index % colors.length],
  }));
  const [notes, setNotes] = useState<any>(initialNotes);
  const [isCreateNote, setIsCreateNote] = useState(false);
  useEffect(() => {
    if (notes !== null) {
      localStorage.setItem("react-notes-app-data", JSON.stringify(notes));
    }
  }, [notes]);

  useEffect(() => {
    localStorage.setItem("react-notes-app-data", JSON.stringify(notes));
  }, [notes]);
  const addNote = (
    text: any,
    title: any,
    color: any,
    tranCD: any,
    id,
    flag
  ) => {
    const date = new Date();
    const newNote = {
      id: id || nanoid(),
      title: title,
      text: text,
      color: color,
      tranCD: tranCD,
      flag: flag,
      date: date.toLocaleDateString(),
    };
    console.log("newNote", newNote);
    const newNotes = [newNote, ...notes];

    setNotes(newNotes);
  };

  const deleteNote = (id) => {
    const newNotes = notes.filter((note) => note.id !== id);
    setNotes(newNotes);
  };
  const handleDialogClose = () => {
    setIsCreateNote(false);
  };
  return (
    <>
      <Dialog
        fullWidth
        maxWidth="lg"
        open={open}
        PaperProps={{
          style: {
            width: "100%",
            height: "100%",
            backgroundColor: "none",
          },
        }}
        // aria-labelledby="draggable-dialog-title"
        // PaperComponent={PaperComponent}
        key="filepreviewDialog"
      >
        <div className={`${darkMode && "dark-mode"}`}>
          <div
            className="container"
            // style={{ cursor: "move" }}
            // id="draggable-dialog-title"
          >
            <Grid style={{ display: "flex", marginBottom: "5px" }}>
              <div className="sidebar">
                <Tooltip title="New Note">
                  <AddIcon
                    style={{ fontSize: "45px", cursor: "pointer" }}
                    onClick={(e) => {
                      setIsCreateNote(true);
                    }}
                  />
                </Tooltip>
              </div>
              <h1 style={{ marginRight: "auto" }}>Notes</h1>
              <div className="header" style={{ display: "flex" }}>
                <GradientButton
                  className="save"
                  style={{ color: "var(--theme-color2)" }}
                >
                  View all
                </GradientButton>
                <Tooltip title="Close">
                  <GradientButton
                    onClick={closeDialog}
                    style={{
                      color: "var(--theme-color3)",
                      margin: "5px",
                      minWidth: "0px",
                      // maxWidth: "0px",
                      borderRadius: "10px",
                      background: "none",
                    }}
                  >
                    <CloseIcon style={{ fontSize: "2.5em" }} />
                  </GradientButton>
                </Tooltip>
              </div>
            </Grid>
            <div className="search">
              <SearchIcon />
              <input
                onChange={(event) => setSearchText(event.target.value)}
                type="text"
                placeholder="type to search..."
              />
            </div>
            {isLoading ? (
              <LinearProgress variant={"indeterminate"} />
            ) : (
              <>
                <NotesList
                  data={data}
                  handleAddNote={addNote}
                  notes={notes.filter((note) =>
                    note.text.toLowerCase().includes(searchText)
                  )}
                  refetch={refetch}
                  // handleAddNote={addNote}
                  // handleDeleteNote={deleteNote}
                />
                {isCreateNote ? (
                  <AddNote
                    handleAddNote={addNote}
                    closeDialog={handleDialogClose}
                    defualtView={"add"}
                    data={undefined}
                  />
                ) : null}
              </>
            )}
          </div>
        </div>
      </Dialog>
    </>
  );
};
export default StickyNotes;
