import { useRef, useState, forwardRef, useMemo } from "react";
import { FormComponentView } from "components/formcomponent";
import AppBar from "@mui/material/AppBar";
import GridWrapper from "components/dataTableStatic";
import { GridMetaDataType } from "components/dataTable/types";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { DetailsGridWithHeaderArguType } from "components/detailPopupGridData/GridDetailsWithHeader/type";
import { FilterFormMetaType } from "components/formcomponent/filterform";
import { Alert } from "components/common/alert";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { utilFunction } from "components/utils";
import { useSnackbar } from "notistack";
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

const initialData = {
  AMOUNT: "",
  _isNewRow: true,
};

export const AmountLabelDetailsUpdate = (
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
  },
  ref
) => {
  const [girdData, setGridData] = useState<any>(initConfigData);
  const classes = useDialogStyles();
  const myGridRef = useRef<any>(null);
  const { enqueueSnackbar } = useSnackbar();
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
        let TotalRowData = girdData.reduce((accu, item) => {
          if (Boolean(item._hidden)) {
            return accu;
          }
          return accu + 1;
        }, 0);
        if (TotalRowData >= 6) {
          enqueueSnackbar("Up to six rows are allowed to be added.", {
            variant: "warning",
          });
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
      }
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
      let finalResult = result.filter(
        (one) => !(Boolean(one?._hidden) && !Boolean(one?.TRN_TYPE))
      );
      let data = {
        ...refID,
        reqData: finalResult,
      };
      // onSubmit({ data, mode, setServerError });
    }
  };
  return (
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
              Ok
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
      {/* <FormComponentView
          key={"DetailsHeadersView"}
          finalMetaData={HeaderMetaData as FilterFormMetaType}
          onAction={ClickEventManage}
          loading={isLoading}
          data={HeaderData ?? {}}
        ></FormComponentView> */}
      {isLoading ? (
        <LoaderPaperComponent />
      ) : (
        <GridWrapper
          key={"customerDetailsGrid"}
          finalMetaData={metaData as GridMetaDataType}
          data={girdData}
          setData={setGridData}
          loading={isEditableForm ? mode === "view" : isLoading}
          actions={actions}
          setAction={handelActionEvent}
          refetchData={null}
          ref={myGridRef}
        />
      )}
    </div>
  );
};
