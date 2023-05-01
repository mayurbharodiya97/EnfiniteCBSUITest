import { FC, useEffect, useState, useContext, useRef } from "react";
import { useQuery } from "react-query";
import { ClearCacheContext, queryClient } from "cache";
import Dialog from "@mui/material/Dialog";
import { useLocation } from "react-router-dom";
import { useDialogStyles } from "pages_audit/common/dialogStyles";
import { Transition } from "pages_audit/common/transition";
import * as API from "../api";
import LinearProgress from "@mui/material/LinearProgress";
import {
  AppBar,
  Box,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { GradientButton } from "components/styledComponent/button";
import { useDrag, useDrop } from "react-dnd";
import { makeStyles } from "@mui/styles";

const useTypeStyles = makeStyles((theme: any) => ({
  root: {
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    background: "var(--theme-color1)",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--white)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
  },
  refreshiconhover: {},
}));

const SMSTemplate: FC<{
  isDataChangedRef: any;
  closeDialog?: any;
  onSaveData?: any;
  tranCode: string;
  userMsgText: string;
}> = ({ isDataChangedRef, closeDialog, onSaveData, tranCode, userMsgText }) => {
  const headerClasses = useTypeStyles();
  const [smsText, SetSmsText] = useState(userMsgText);
  const myTextFieldRef = useRef<any>(null);
  const myTextFieldPositionRef = useRef<any>(-1);
  const result = useQuery(["getEmailSMSConfigDtlList", tranCode], () =>
    API.getEmailSMSConfigDtlList(tranCode)
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getEmailSMSConfigDtlList", tranCode]);
    };
  }, [tranCode]);

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "string",
    drop: (item, monitor) => {
      let data = String((monitor as any).getItem()?.id ?? "");
      if (myTextFieldPositionRef.current >= 0 && Boolean(data)) {
        let startText = smsText.substring(0, myTextFieldPositionRef.current);
        let endText = smsText.substring(myTextFieldPositionRef.current);
        myTextFieldPositionRef.current =
          myTextFieldPositionRef.current + data.length;
        SetSmsText(startText + "" + data + "" + endText);
      } else if (Boolean(data)) {
        SetSmsText(smsText + "" + data + "");
        //console.log("smsText + + data  =>", smsText + "" + data + "");
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  const doubleClickEventHandel = (text) => {
    if (myTextFieldPositionRef.current >= 0 && Boolean(text)) {
      let startText = smsText.substring(0, myTextFieldPositionRef.current);
      let endText = smsText.substring(myTextFieldPositionRef.current);
      myTextFieldPositionRef.current =
        myTextFieldPositionRef.current + text.length;
      SetSmsText(startText + "" + text + "" + endText);
    } else if (Boolean(text)) {
      SetSmsText(smsText + "" + text + "");
    }
  };
  return (
    <>
      {result.isLoading || result.isFetching ? (
        <LinearProgress color="secondary" />
      ) : (
        <Grid container>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            style={{
              paddingTop: "10px",
              paddingLeft: "10px",
              paddingRight: "10px",
            }}
          >
            <AppBar
              position="relative"
              color="secondary"
              style={{ marginBottom: "5px" }}
            >
              <Toolbar className={headerClasses.root} variant={"dense"}>
                <Typography
                  className={headerClasses.title}
                  color="inherit"
                  variant={"h6"}
                  component="div"
                >
                  SMS Configuration
                </Typography>
                <GradientButton
                  onClick={() => {
                    onSaveData(smsText);
                  }}
                >
                  Save
                </GradientButton>
                <GradientButton onClick={closeDialog}>Close</GradientButton>
              </Toolbar>
            </AppBar>
          </Grid>
          <Grid item xs={8} sm={6} md={8} style={{ padding: "10px" }}>
            <div ref={drop}>
              <TextField
                id="outlined-multiline-static"
                label="SMS Text"
                multiline
                minRows={8}
                value={smsText}
                variant="outlined"
                color="secondary"
                style={{ width: "100%" }}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(event) => {
                  SetSmsText(event.target.value);
                }}
                onBlur={(event) => {
                  myTextFieldPositionRef.current = event.target?.selectionStart;
                }}
                ref={myTextFieldRef}
              />
            </div>
          </Grid>
          <Grid item xs={4} sm={6} md={4} style={{ paddingRight: "10px" }}>
            <Box
              sx={{
                width: "100%",
                maxWidth: 360,
                bgcolor: "background.paper",
                height: "29vh",
                overflow: "auto",
                border: "ridge",
                borderRadius: "3",
              }}
            >
              <nav aria-label="main mailbox folders">
                <List style={{ paddingTop: "0px", paddingBottom: "0px" }}>
                  {result?.data.map((item) => (
                    <ListItemData
                      key={"ListItem" + item?.SR_CD}
                      name={item?.KEY_VALUE}
                      doubleClickEventHandel={doubleClickEventHandel}
                    />
                  ))}
                </List>
              </nav>
            </Box>
          </Grid>
        </Grid>
      )}
    </>
  );
};
export const ListItemData = ({
  name,
  doubleClickEventHandel,
}: {
  name: string;
  doubleClickEventHandel: any;
}) => {
  //@ts-ignore
  const [{ isDragging }, dragRef] = useDrag({
    item: { type: "string", id: name },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  return (
    <div ref={dragRef} style={{ opacity: isDragging ? "0.5" : "1" }}>
      <ListItem
        button
        style={{
          paddingTop: "4px",
          paddingBottom: "4px",
          paddingLeft: "10px",
          paddingRight: "10px",
        }}
        onDoubleClick={() => {
          doubleClickEventHandel(name);
        }}
      >
        <ListItemText primary={name} />
      </ListItem>
      <Divider />
    </div>
  );
};
export const SMSTemplateWrapper = ({
  open,
  handleDialogClose,
  isDataChangedRef,
  onSaveData,
  smsText,
  trnCode,
}) => {
  const classes = useDialogStyles();
  const { getEntries } = useContext(ClearCacheContext);
  useEffect(() => {
    return () => {
      let entries = getEntries() as any[];
      entries.forEach((one) => {
        queryClient.removeQueries(one);
      });
    };
  }, [getEntries]);
  return (
    <>
      <Dialog
        open={open}
        //@ts-ignore
        TransitionComponent={Transition}
        PaperProps={{
          style: {
            width: "60%",
            minHeight: "35vh",
            height: "42vh",
          },
        }}
        maxWidth="md"
        classes={{
          scrollPaper: classes.topScrollPaper,
          paperScrollBody: classes.topPaperScrollBody,
        }}
      >
        <SMSTemplate
          tranCode={trnCode || ""}
          isDataChangedRef={isDataChangedRef}
          closeDialog={handleDialogClose}
          onSaveData={onSaveData}
          userMsgText={smsText || ""}
        />
      </Dialog>
    </>
  );
};
