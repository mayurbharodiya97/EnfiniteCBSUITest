import {
  Button,
  CircularProgress,
  Dialog,
  Grid,
  Paper,
  Tooltip,
} from "@mui/material";
import { useState, useRef, useEffect, useContext } from "react";
import logo from "assets/images/easy_bankcore_Logo.png";
import { GradientButton } from "components/styledComponent/button";
import Draggable from "react-draggable";
import CloseIcon from "@mui/icons-material/Close";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import { useMutation, useQuery } from "react-query";
import * as API from "../../api";
import { useSnackbar } from "notistack";
import { AuthContext } from "pages_audit/auth";
import { utilFunction } from "components/utils";
import { queryClient } from "cache";
import { format } from "date-fns";
function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

const AddNote = ({ closeDialog, data, defualtView, refetch }) => {
  const [noteTitle, setNoteTitle] = useState(data?.TITLE ?? "");
  const [noteText, setNoteText] = useState(data?.NOTES_DETAIL ?? "");
  const [noteDate, setNoteDate] = useState(
    data?.CREATED_DT ?? format(new Date(), "dd/MMM/yyyy")
  );
  const characterLimit = 2000;
  const [fullWidth, setFullWidth] = useState<any>(true);
  const [maxWidth, setMaxWidth] = useState<any>("xs");
  const { enqueueSnackbar } = useSnackbar();
  const { authState } = useContext(AuthContext);
  const isErrorFuncRef = useRef<any>(null);

  const mutation = useMutation(API.updateNoteDetailsData, {
    onError: (error) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        // errorMsg = error?.error_msg ?? errorMsg;
      }
      // endSubmit(false, errorMsg, error?.error_detail ?? "");
      if (isErrorFuncRef.current == null) {
        enqueueSnackbar(errorMsg, {
          variant: "error",
        });
      } else {
        isErrorFuncRef.current?.endSubmit(
          false,
          errorMsg
          // error?.error_detail ?? ""
        );
      }
    },
    onSuccess: (data) => {
      enqueueSnackbar(data, {
        variant: "success",
      });
      refetch();
      closeDialog();
    },
  });

  const handleChange = (event) => {
    if (characterLimit - event.target.value.length >= 0) {
      setNoteText(event.target.value);
    }
  };
  const handleChangeTitle = (event) => {
    if (characterLimit - event.target.value.length >= 0) {
      setNoteTitle(event.target.value);
    }
  };
  const handleMaxWidthChange = () => {
    if (maxWidth === "xs") {
      setMaxWidth(false);
      setFullWidth(true);
    } else {
      setMaxWidth("xs");
    }
  };

  const handleSaveClick = async () => {
    if (noteTitle.trim().length > 0 || noteText.trim().length > 0) {
      let reqData = {
        NOTES_DETAIL: noteText ?? "",
        TITLE: noteTitle ?? "",
        FLAG: "U",
        CREATED_DT: noteDate ?? "",
      };

      let oldData = {
        NOTES_DETAIL: data?.NOTES_DETAIL ?? "",
        TITLE: data?.TITLE ?? "",
        FLAG: data?.FLAG ?? "",
        CREATED_DT: data?.CREATED_DT ?? "",
      };

      let upd = utilFunction.transformDetailsData(reqData, oldData);

      mutation.mutate({
        data: {
          ...reqData,
          ...upd,
          USER_NAME: authState?.user?.id ?? "",
          TRAN_CD: data?.TRAN_CD ?? "",
          _isNewRow: defualtView === "add" ? true : false,
        },
      });
    }
  };

  return (
    <>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={true}
        PaperProps={{
          style: {
            width: "49%",
            height: "49%",
            backgroundColor: data?.colors,
          },
        }}
        key="noteaddwDialog"
        aria-labelledby="draggable-dialog-title"
        PaperComponent={PaperComponent}
      >
        <div
          className="note new"
          style={{ cursor: "move", backgroundColor: data?.colors }}
          // id="draggable-dialog-title"
        >
          <Grid
            container
            direction="row"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            // padding={"31px"}
            id="draggable-dialog-title"
          >
            <img src={logo} alt="Logo" style={{ width: "115px" }} />

            <div style={{ display: "flex" }}>
              <GradientButton
                onClick={handleMaxWidthChange}
                style={{
                  minWidth: "0px",
                  borderRadius: "10px",
                  // color: data?.color || "#67d7cc",
                  color: "var(--theme-color2)",
                  background: "none",
                }}
              >
                {maxWidth === "xs" ? (
                  <CloseFullscreenIcon style={{ fontSize: "2em" }} />
                ) : (
                  <OpenInFullIcon style={{ fontSize: "2em" }} />
                )}
              </GradientButton>
              <Tooltip title="Close Note">
                <GradientButton
                  onClick={closeDialog}
                  style={{
                    minWidth: "0px",
                    borderRadius: "10px",
                    // color: data?.color || "#67d7cc",
                    color: "var(--theme-color2)",
                    background: "none",
                  }}
                >
                  <CloseIcon style={{ fontSize: "2.5em" }} />
                </GradientButton>
              </Tooltip>
            </div>
          </Grid>
          <textarea
            placeholder="Title"
            value={noteTitle}
            onChange={handleChangeTitle}
            // ref={titleTextareaRef}
            style={{
              marginTop: "20px",
              fontSize: "20px",
              fontWeight: "bold",
              width: "100%",
              backgroundColor: data?.colors,
              height: "15%",
            }}
          ></textarea>

          <textarea
            // rows="8"
            // cols="10"
            placeholder="Type to add a note..."
            value={noteText}
            onChange={handleChange}
            style={{
              marginBottom: "05px",
              fontSize: "18px",
              width: "100%",
              height: "100px",
              backgroundColor: data?.colors,
            }}
          ></textarea>
          <div className="note-footer">
            <small>{characterLimit - noteText.length} Remaining</small>
            <GradientButton
              className="save"
              onClick={handleSaveClick}
              style={{
                // color: data?.colors || "black",
                color: "black",
                backgroundColor: "var(--theme-color2)",
              }}
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? (
                <CircularProgress
                  size={22}
                  style={{ color: "black" }}
                  thickness={4.6}
                />
              ) : (
                "Save"
                // t("Save")
              )}
            </GradientButton>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default AddNote;