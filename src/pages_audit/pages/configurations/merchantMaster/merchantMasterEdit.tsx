import { useRef, useState, useMemo } from "react";
import AppBar from "@material-ui/core/AppBar";
import { makeStyles } from "@material-ui/styles";
import GridWrapper from "components/dataTableStatic";
import { GridMetaDataType } from "components/dataTable/types";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Alert } from "components/common/alert";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { CreateDetailsRequestData, utilFunction } from "components/utils";
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

const initialData = {
  _isNewRow: true,
};

export const MerchantMasterGridUpdate = (
  {
    metadata,
    ClosedEventCall,
    data: initConfigData,
    children,
    isLoading = false,
    isError = false,
    ErrorMessage = "",
    actions = [],
    mode = "view",
    isEditableForm = false,
    refID = {},
    onSubmit = ({}: any) => {},
    refetch = () => {},
  },
  ref
) => {
  const [girdData, setGridData] = useState<any>(initConfigData);
  const classes = useDialogStyles();
  const myGridRef = useRef<any>(null);
  const [serverError, setServerError] = useState("");
  const handelCloseEvent = () => {
    //SetOpen(false);
    ClosedEventCall();
  };
  const metaData = useMemo(() => {
    let myColumns = metadata.columns;
    if (mode === "view") {
      myColumns = metadata.columns.filter((one) => one.accessor !== "_hidden");
    }
    return { ...metadata, columns: myColumns };
  }, [mode, metadata]);
  const handelActionEvent = async (data) => {
    if (data.name === "Add") {
      let { hasError, data: dataold } = await myGridRef.current?.validate();
      if (hasError === true) {
        if (dataold) {
          setGridData(dataold);
        }
        //setGridData(dataold);
      } else {
        setGridData((old) => {
          if (!Array.isArray(old)) {
            return [
              {
                ...initialData,
                id: 1,
                TRAN_CD: "",
                SR_CD: 1,
                SR_NO: 1,
              },
            ];
          } else {
            let srCount = utilFunction.GetMaxCdForDetails(old, "SR_CD");
            const myNewRowObj = {
              ...initialData,
              id: srCount,
              TRAN_CD: "",
              SR_CD: srCount,
              SR_NO: srCount,
            };
            return [...old, myNewRowObj];
          }
        });
      }
    } else if (data.name === "save") {
      handleSubmit();
    }
  };
  const handleSubmit = async () => {
    let { hasError, data } = await myGridRef.current?.validate(true);
    if (hasError === true) {
      if (data) {
        setGridData(data);
      }
    } else {
      let result = myGridRef?.current?.cleanData?.();
      let finalResult = result.filter((one) => !Boolean(one?._hidden));
      finalResult = CreateDetailsRequestData(finalResult);
      let data = {
        ...refID,
        ...finalResult,
      };
      onSubmit({ data, mode, setServerError });
    }
  };

  return (
    <div>
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
              hgf
            </Typography>
            <Button onClick={handelCloseEvent} color="primary">
              Close
            </Button>
          </Toolbar>
        </AppBar>
      ) : typeof children === "function" ? (
        children({
          handelCloseEvent,
          handleSubmit,
          classes,
          handelActionEvent,
        })
      ) : (
        children
      )}
      {isLoading ? (
        <LoaderPaperComponent />
      ) : (
        <GridWrapper
          key={"MerchantMasterDetailsGrid"}
          finalMetaData={metaData as GridMetaDataType}
          data={girdData}
          setData={setGridData}
          loading={isEditableForm ? mode === "view" : isLoading}
          actions={actions}
          setAction={handelActionEvent}
          refetchData={() => refetch()}
          ref={myGridRef}
        />
      )}
    </div>
  );
};
