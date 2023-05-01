import { useRef, useState, forwardRef, useMemo } from "react";
import { Transition } from "pages_audit/common";
import { FormComponentView } from "components/formcomponent";
import GridWrapper from "components/dataTableStatic";
import { GridMetaDataType } from "components/dataTable/types";
import { DetailsGridWithHeaderArguType } from "./type";
import { FilterFormMetaType } from "components/formcomponent/filterform";
import { Alert } from "components/common/alert";
import { AppBar, Button, Dialog, Toolbar, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
export const useDialogStyles = makeStyles({
  topScrollPaper: {
    alignItems: "center",
  },
  topPaperScrollBody: {
    verticalAlign: "top",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--white)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
  },
});
export const DetailsGridWithHeader = ({
  metadata,
  ClosedEventCall,
  data,
  HeaderMetaData,
  HeaderData,
  ClickEventManage,
  children,
  isLoading = false,
  isError = false,
  ErrorMessage = "",
  actions = [],
  setData = (data) => {},
  setCurrentAction = (data) => {},
  mode = "view",
  isEditableForm = false,
  refID = {},
  onSubmit = () => {},
  submitSecondAction = {},
  submitSecondButtonName = "",
  submitSecondButtonHide = true,
  submitSecondLoading = false,
}: DetailsGridWithHeaderArguType) => {
  const classes = useDialogStyles();
  const myGridRef = useRef<any>(null);
  const [serverError, setServerError] = useState("");
  const handelCloseEvent = () => {
    //SetOpen(false);
    ClosedEventCall();
  };
  //console.log("children", children, children === undefined);
  const metaData = useMemo(() => {
    let myColumns = metadata.columns;
    if (mode === "view") {
      myColumns = metadata.columns.filter((one) => one.accessor !== "_hidden");
    }
    return { ...metadata, columns: myColumns };
  }, [mode, metadata]);
  //console.log(mode, metaData);
  const handelActionEvent = async (data) => {
    await setCurrentAction(data);
  };
  const handleSubmit = async () => {
    let { hasError, data } = await myGridRef.current?.validate();
    if (hasError === true) {
      setData(data);
    } else {
      let result = myGridRef?.current?.cleanData?.();
      let finalResult = result.filter(
        (one) => !(Boolean(one?._hidden) && !Boolean(one?.lineNo))
      );
      let data = {
        ...refID,
        config: finalResult,
      };
      onSubmit({ data, mode, setServerError });
    }
  };
  return (
    <Dialog
      open={true}
      //@ts-ignore
      TransitionComponent={Transition}
      PaperProps={{
        style: {
          width: "100%",
          minHeight: "20vh",
        },
      }}
      maxWidth="lg"
      classes={{
        scrollPaper: classes.topScrollPaper,
        paperScrollBody: classes.topPaperScrollBody,
      }}
    >
      <div style={{ padding: "10px" }}>
        {isError ? (
          <Alert
            severity="error"
            errorMsg={ErrorMessage}
            errorDetail={""}
            color="error"
          />
        ) : Boolean(serverError) ? (
          <Alert errorMsg={serverError} errorDetail="" severity="error" />
        ) : null}

        {!Boolean(children) ? (
          <AppBar
            position="relative"
            color="secondary"
            style={{ marginBottom: "10px" }}
          >
            <Toolbar variant="dense">
              <Typography
                className={classes.title}
                color="inherit"
                variant={"h6"}
                component="div"
              >
                {HeaderMetaData?.gridConfig?.title ?? ""}
              </Typography>
              <Button onClick={handelCloseEvent} color="primary">
                Close
              </Button>
            </Toolbar>
          </AppBar>
        ) : typeof children === "function" ? (
          children({ handelCloseEvent, handleSubmit, classes })
        ) : (
          children
        )}
        <FormComponentView
          key={"DetailsHeadersView"}
          finalMetaData={HeaderMetaData as FilterFormMetaType}
          onAction={ClickEventManage}
          loading={isLoading}
          data={HeaderData ?? {}}
          submitSecondAction={submitSecondAction}
          submitSecondButtonName={submitSecondButtonName}
          submitSecondButtonHide={submitSecondButtonHide}
          submitSecondLoading={submitSecondLoading}
        ></FormComponentView>
        <GridWrapper
          key={"customerDetailsGrid"}
          finalMetaData={metaData as GridMetaDataType}
          data={data}
          setData={setData}
          loading={isEditableForm ? mode === "view" : isLoading}
          actions={actions}
          setAction={handelActionEvent}
          refetchData={null}
          ref={myGridRef}
        />
      </div>
    </Dialog>
  );
};
