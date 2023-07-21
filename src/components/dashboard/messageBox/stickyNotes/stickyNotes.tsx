import { Dialog, LinearProgress, Paper } from "@mui/material";
import "./stickyNotes.css";
import Draggable from "react-draggable";
import { useState, useEffect, useContext, useRef, Fragment } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Grid, Tooltip } from "@mui/material";
import { GradientButton } from "components/styledComponent/button";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { nanoid } from "nanoid";
import { useQuery } from "react-query";
import * as API from "../../api";
import { AuthContext } from "pages_audit/auth";
import { queryClient } from "cache";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import AddNote from "./addNote";
import { Alert } from "components/common/alert";

const StickyNotes = ({ closeDialog, open }) => {
  const { authState } = useContext(AuthContext);
  const [isOpenNote, setIsOpenNote] = useState(false);
  const [isCreateNote, setIsCreateNote] = useState(false);
  const refData = useRef(null);
  const [filter, setFilter] = useState<any>("");
  const [flag, setflag] = useState<any>("P");
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(
    [
      "getNoteDetailsData",
      {
        userID: authState?.user?.id ?? "",
        flag: flag,
      },
    ],
    () =>
      API.getNoteDetailsData({
        userID: authState?.user?.id ?? "",
        flag: flag,
      })
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries([
        "getNoteDetailsData",
        {
          userID: authState?.user?.id ?? "",
          flag: flag,
        },
      ]);
    };
  }, [flag]);

  const handleDialogClose = () => {
    setIsOpenNote(false);
    setIsCreateNote(false);
  };
  const colors: any = [
    "#DAE23A",
    "#b693fd",
    "#fe9b72",
    "#fec971",
    "#00d4fe",
    "#b693fd",
    "#e4ee91",
  ];
  const handleNoteClick = (item, colors) => {
    if (item.ACTIVE === "N") {
      setIsOpenNote(false);
    } else {
      const itemWithColor = { ...item, colors };
      refData.current = itemWithColor;
      setIsOpenNote(true);
    }

    // refData.current = item;
    // setIsOpenNote(true);
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
        key="filepreviewDialog"
      >
        <div className="container">
          <Grid style={{ display: "flex", marginBottom: "5px" }}>
            <div className="sidebar">
              <Tooltip title="New Note">
                <AddIcon
                  style={{ fontSize: "45px", cursor: "pointer" }}
                  onClick={() => {
                    setIsCreateNote(true);
                  }}
                />
              </Tooltip>
            </div>
            <h1 style={{ marginRight: "auto" }}>Notes</h1>
            <div className="header" style={{ display: "flex" }}>
              <GradientButton
                className="save"
                style={{ color: "var(--theme-color2)", margin: "5px" }}
                onClick={() => {
                  setflag(flag === "ALL" ? "P" : "ALL");
                }}
              >
                {flag === "ALL" ? "Back" : "View all"}
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
              type="text"
              placeholder="type to search..."
              onChange={(event) => setFilter(event.target.value)}
            />
          </div>

          {isLoading || isFetching ? (
            <LoaderPaperComponent />
          ) : isError ? (
            <Fragment>
              <div style={{ width: "100%", paddingTop: "10px" }}>
                <Alert
                  severity={error?.severity ?? "error"}
                  errorMsg={error?.error_msg ?? "Error"}
                  errorDetail={error?.error_detail ?? ""}
                />
              </div>
            </Fragment>
          ) : (
            <>
              <div className="notes-list">
                {data
                  .filter(
                    (item) =>
                      item.TITLE.toLowerCase().includes(filter.toLowerCase()) ||
                      item.NOTES_DETAIL.toLowerCase().includes(
                        filter.toLowerCase()
                      )
                  )
                  .sort((a, b) => a.CREATED_DT - b.CREATED_DT)
                  .map((item, index) => (
                    <div
                      className="note"
                      onClick={() => {
                        handleNoteClick(item, colors[index % colors.length]);
                      }}
                      key={index}
                      style={{ backgroundColor: colors[index % colors.length] }}
                    >
                      {/* <div>{logo}</div> */}
                      <div
                        style={{
                          marginBottom: "20px",
                          fontSize: "20px",
                          fontWeight: "bold",
                          width: "100%",
                          // height: "15%",
                          textDecoration:
                            item?.ACTIVE === "N" ? "line-through" : "none",
                        }}
                      >
                        {item?.TITLE ?? ""}
                      </div>
                      <div
                        style={{
                          marginBottom: "12px",
                          fontSize: "15px",
                          width: "100%",
                          height: "50%",
                          overflow: "auto",
                          textDecoration:
                            item?.ACTIVE === "N" ? "line-through" : "none",
                        }}
                      >
                        {item?.NOTES_DETAIL ?? ""}
                      </div>
                      <div className="note-footer">
                        <small>{item?.CREATED_DT ?? new Date()}</small>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>

        {isOpenNote ? (
          <AddNote
            defualtView={"edit"}
            closeDialog={handleDialogClose}
            data={refData.current}
            refetch={refetch}
          />
        ) : null}
        {isCreateNote ? (
          <AddNote
            defualtView={"add"}
            closeDialog={handleDialogClose}
            data={undefined}
            refetch={refetch}
          />
        ) : null}
      </Dialog>
    </>
  );
};
export default StickyNotes;
