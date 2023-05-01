import { FC, useRef } from "react";
import Dialog from "@material-ui/core/Dialog";
import { useDialogStyles } from "pages_audit/common/dialogStyles";
import { Transition } from "pages_audit/common/transition";
import {
  AppBar,
  Divider,
  Grid,
  ListItem,
  ListItemText,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { GradientButton } from "components/styledComponent/button";
import { useDrag } from "react-dnd";
import EmailEditor from "react-email-editor";

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

const EmailTemplate: FC<{
  isDataChangedRef: any;
  closeDialog?: any;
  onSaveData?: any;
  mailMsgContent: string;
  mailMsgJSON: any;
}> = ({
  isDataChangedRef,
  closeDialog,
  onSaveData,
  mailMsgContent,
  mailMsgJSON,
}) => {
  const headerClasses = useTypeStyles();
  const emailEditorRef = useRef<any>(null);
  const onLoad = () => {};

  const onReady = () => {
    // editor is ready
    let designJson = {};
    if (typeof mailMsgJSON === "object") {
      designJson = mailMsgJSON;
    } else {
      try {
        designJson = JSON.parse(mailMsgJSON);
      } catch (error) {}
    }

    if (
      JSON.stringify(designJson) !== "{}" &&
      Boolean(designJson) &&
      designJson !== '""'
    ) {
      emailEditorRef?.current?.editor?.loadDesign?.(designJson);
    }
  };

  return (
    <>
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
                Email Configuration
              </Typography>
              <GradientButton
                onClick={() => {
                  emailEditorRef?.current?.editor.exportHtml((data) => {
                    const { design, html } = data;

                    onSaveData(design, html);
                  });
                }}
              >
                Save
              </GradientButton>
              <GradientButton onClick={closeDialog}>Close</GradientButton>
            </Toolbar>
          </AppBar>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          style={{
            padding: "10px",
          }}
        >
          <EmailEditor ref={emailEditorRef} onLoad={onLoad} onReady={onReady} />
        </Grid>
      </Grid>
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
export const EmailTemplateWrapper = ({
  open,
  handleDialogClose,
  isDataChangedRef,
  onSaveData,
  reqdata,
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
            width: "100%",
          },
        }}
        maxWidth="lg"
        classes={{
          scrollPaper: classes.topScrollPaper,
          paperScrollBody: classes.topPaperScrollBody,
        }}
      >
        <EmailTemplate
          isDataChangedRef={isDataChangedRef}
          closeDialog={handleDialogClose}
          onSaveData={onSaveData}
          mailMsgContent={reqdata?.MAIL_MSG ?? ""}
          mailMsgJSON={reqdata?.MAIL_MSG_JSON ?? ""}
        />
      </Dialog>
    </>
  );
};
