import { FC, useState, useRef } from "react";
import { useQuery } from "react-query";
import Dialog from "@material-ui/core/Dialog";
import { useDialogStyles } from "pages_audit/common/dialogStyles";
import { Transition } from "pages_audit/common/transition";
import * as API from "../api";
import LinearProgress from "@material-ui/core/LinearProgress";
import {
  AppBar,
  Box,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { GradientButton } from "components/styledComponent/button";
import { useDrag, useDrop } from "react-dnd";

const useTypeStyles = makeStyles((theme) => ({
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

const TranParticulars: FC<{
  isDataChangedRef: any;
  closeDialog?: any;
  onSaveData?: any;
  description: string;
  rows: any;
  buttonName: string;
  defaultMode: string;
}> = ({
  isDataChangedRef,
  closeDialog,
  onSaveData,
  description,
  rows,
  buttonName,
  defaultMode,
}) => {
  const headerClasses = useTypeStyles();
  const [tranParticulars, SetTranParticulars] = useState(
    buttonName === "TRAN_PARTICULARS_BTN_0"
      ? {
          finacle1: rows?.TRN_PERTICULERS_0,
          finacle2: rows?.TRN_PERTICULERS2_0,
          ababil1: rows?.ABABIL_TRN_PERTICULERS_0,
          ababil2: rows?.ABABIL_TRN_PERTICULERS2_0,
          tranzware1: rows?.TRANZWARE_TRN_PERTICULERS_0,
          tranzware2: rows?.TRANZWARE_TRN_PERTICULERS2_0,
        }
      : buttonName === "TRAN_PARTICULARS_BTN_1"
      ? {
          finacle1: rows?.TRN_PERTICULERS_1,
          finacle2: rows?.TRN_PERTICULERS2_1,
          ababil1: rows?.ABABIL_TRN_PERTICULERS_1,
          ababil2: rows?.ABABIL_TRN_PERTICULERS2_1,
          tranzware1: rows?.TRANZWARE_TRN_PERTICULERS_1,
          tranzware2: rows?.TRANZWARE_TRN_PERTICULERS2_1,
        }
      : buttonName === "TRAN_PARTICULARS_BTN_2"
      ? {
          finacle1: rows?.TRN_PERTICULERS_2,
          finacle2: rows?.TRN_PERTICULERS2_2,
          ababil1: rows?.ABABIL_TRN_PERTICULERS_2,
          ababil2: rows?.ABABIL_TRN_PERTICULERS2_2,
          tranzware1: rows?.TRANZWARE_TRN_PERTICULERS_2,
          tranzware2: rows?.TRANZWARE_TRN_PERTICULERS2_2,
        }
      : {}
  );
  const myTextFieldPositionRef = useRef<any>(-1);
  const result = useQuery(["getTranParticularKeys"], () =>
    API.getTranParticularKeys()
  );

  const doubleClickEventHandel = (text) => {
    if (myTextFieldPositionRef.current !== null && Boolean(text)) {
      let name = myTextFieldPositionRef.current?.name;
      let smsText = tranParticulars[name];
      if (!Boolean(smsText)) {
        smsText = "";
      }
      let position = myTextFieldPositionRef.current?.selectionStart ?? 0;
      let startText = smsText.substring(0, position);
      let endText = smsText.substring(position);
      SetTranParticulars((values) => ({
        ...values,
        [name]: startText + text + endText,
      }));
      myTextFieldPositionRef.current?.focus?.();
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
                  {buttonName === "TRAN_PARTICULARS_BTN_0"
                    ? "Finacle"
                    : buttonName === "TRAN_PARTICULARS_BTN_1"
                    ? "Ababil"
                    : buttonName === "TRAN_PARTICULARS_BTN_2"
                    ? "Tranzware"
                    : ""}{" "}
                  Transaction Particulars for {description}
                </Typography>
                {defaultMode === "edit" ? (
                  <GradientButton
                    onClick={() => {
                      onSaveData(tranParticulars);
                    }}
                  >
                    Save
                  </GradientButton>
                ) : null}
                <GradientButton onClick={closeDialog}>Close</GradientButton>
              </Toolbar>
            </AppBar>
          </Grid>
          <Grid item xs={10} sm={6} md={10} style={{ padding: "10px" }}>
            <div>
              <TextFieldTranParticular
                label={"Finacle Transaction Particulars"}
                name={"finacle1"}
                value={tranParticulars.finacle1}
                myTextFieldPositionRef={myTextFieldPositionRef}
                SetTranParticulars={SetTranParticulars}
                defaultMode={defaultMode}
              />
              <TextFieldTranParticular
                label={"Finacle Transaction Particulars2"}
                name={"finacle2"}
                value={tranParticulars.finacle2}
                myTextFieldPositionRef={myTextFieldPositionRef}
                SetTranParticulars={SetTranParticulars}
                defaultMode={defaultMode}
              />
              <TextFieldTranParticular
                label={"Ababil Transaction Particulars"}
                name={"ababil1"}
                value={tranParticulars.ababil1}
                myTextFieldPositionRef={myTextFieldPositionRef}
                SetTranParticulars={SetTranParticulars}
                defaultMode={defaultMode}
              />
              <TextFieldTranParticular
                label={"Ababil Transaction Particulars2"}
                name={"ababil2"}
                value={tranParticulars.ababil2}
                myTextFieldPositionRef={myTextFieldPositionRef}
                SetTranParticulars={SetTranParticulars}
                defaultMode={defaultMode}
              />
              <TextFieldTranParticular
                label={"Tranzware Transaction Particulars"}
                name={"tranzware1"}
                value={tranParticulars.tranzware1}
                myTextFieldPositionRef={myTextFieldPositionRef}
                SetTranParticulars={SetTranParticulars}
                defaultMode={defaultMode}
              />
              <TextFieldTranParticular
                label={"Tranzware Transaction Particulars2"}
                name={"tranzware2"}
                value={tranParticulars.tranzware2}
                myTextFieldPositionRef={myTextFieldPositionRef}
                SetTranParticulars={SetTranParticulars}
                defaultMode={defaultMode}
              />
            </div>
          </Grid>
          <Grid item xs={2} sm={6} md={2} style={{ paddingRight: "10px" }}>
            <Box
              sx={{
                width: "100%",
                maxWidth: 360,
                bgcolor: "background.paper",
                height: "46vh",
                overflow: "auto",
                border: "ridge",
                borderRadius: "3",
              }}
            >
              <nav aria-label="main mailbox folders">
                <List style={{ paddingTop: "0px", paddingBottom: "0px" }}>
                  {result?.data.map((item) => (
                    <ListItemData
                      key={"ListItem" + item?.value}
                      name={item?.label}
                      value={item?.value}
                      doubleClickEventHandel={doubleClickEventHandel}
                      defaultMode={defaultMode}
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

export const TextFieldTranParticular = ({
  label,
  name,
  value,
  SetTranParticulars,
  myTextFieldPositionRef,
  defaultMode,
}) => {
  const myTextFieldRef = useRef<any>(null);
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "string",
    drop: (item, monitor: any) => {
      let data = String(monitor.getItem()?.value ?? "");
      let smsText = value;
      if (!Boolean(smsText)) {
        smsText = "";
      }
      let position = myTextFieldRef.current?.selectionStart ?? 0;
      let startText = smsText.substring(0, position);
      let endText = smsText.substring(position);
      SetTranParticulars((values) => ({
        ...values,
        [name]: startText + data + endText,
      }));
      myTextFieldRef.current?.focus?.();
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  return (
    <TextField
      name={name}
      label={label}
      multiline
      minRows={3}
      value={value}
      disabled={defaultMode === "view" ? true : false}
      variant="outlined"
      color="secondary"
      style={{
        width: "50%",
        paddingBottom: "10px",
        paddingRight: "10px",
      }}
      InputLabelProps={{
        shrink: true,
      }}
      inputProps={{ ref: myTextFieldRef }}
      onChange={(event) => {
        SetTranParticulars((values) => ({
          ...values,
          [name]: event.target.value,
        }));
      }}
      onBlur={(event) => {
        myTextFieldPositionRef.current = event.target;
      }}
      ref={drop}
    />
  );
};
export const ListItemData = ({
  name,
  value,
  doubleClickEventHandel,
  defaultMode,
}: {
  name: string;
  value: string;
  doubleClickEventHandel: any;
  defaultMode: string;
}) => {
  //@ts-ignore
  const [{ isDragging }, dragRef] = useDrag({
    item: { type: "string", id: name, value },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  return (
    <>
      {defaultMode === "view" ? (
        <div>
          <ListItem
            button
            style={{
              paddingTop: "4px",
              paddingBottom: "4px",
              paddingLeft: "10px",
              paddingRight: "10px",
            }}
            disabled={true}
            onDoubleClick={() => {
              doubleClickEventHandel(value);
            }}
          >
            <ListItemText primary={name} />
          </ListItem>
          <Divider />
        </div>
      ) : (
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
              doubleClickEventHandel(value);
            }}
          >
            <ListItemText primary={name} />
          </ListItem>
          <Divider />
        </div>
      )}
    </>
  );
};
export const TranParticularsWrapper = ({
  open,
  handleDialogClose,
  isDataChangedRef,
  onSaveData,
  description,
  rowsdata,
  buttonName,
  defaultMode,
}) => {
  const classes = useDialogStyles();
  return (
    <>
      <Dialog
        open={open}
        //@ts-ignore
        TransitionComponent={Transition}
        PaperProps={{
          style: {
            width: "90%",
            minHeight: "35vh",
            height: "58vh",
          },
        }}
        maxWidth="lg"
        classes={{
          scrollPaper: classes.topScrollPaper,
          paperScrollBody: classes.topPaperScrollBody,
        }}
      >
        <TranParticulars
          isDataChangedRef={isDataChangedRef}
          closeDialog={handleDialogClose}
          onSaveData={onSaveData}
          description={description}
          rows={rowsdata}
          buttonName={buttonName}
          defaultMode={defaultMode}
        />
      </Dialog>
    </>
  );
};
