import { useRef, useState, forwardRef, useMemo } from "react";
import { FormComponentView } from "components/formcomponent";
import AppBar from "@material-ui/core/AppBar";
import { makeStyles } from "@material-ui/styles";
import GridWrapper from "components/dataTableStatic";
import { GridMetaDataType } from "components/dataTable/types";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { DetailsGridWithHeaderArguType } from "components/detailPopupGridData/GridDetailsWithHeader/type";
import { FilterFormMetaType } from "components/formcomponent/filterform";
import { Alert } from "components/common/alert";
import { LoaderPaperComponent } from "components/common/loaderPaper";
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
  TRN_TYPE: "",
  DAILY_AMT: "",
  WEEKLY_AMT: "",
  MONTHLY_AMT: "",
  MIN_AMT: "",
  MAX_AMT: "",
  CARD_MIN_AMT: "",
  MAX_DAY_CNT: "",
  MAX_MONTH_CNT: "",
  _isNewRow: true,
};

export const CustomerLimitDetailsUpdate = forwardRef<
  any,
  DetailsGridWithHeaderArguType
>(
  (
    {
      metadata,
      ClosedEventCall,
      data: initConfigData,
      HeaderMetaData,
      HeaderData,
      ClickEventManage,
      children,
      isLoading = false,
      isError = false,
      ErrorMessage = "",
      actions = [],
      mode = "view",
      isEditableForm = false,
      refID = {},
      onSubmit = () => {},
    },
    ref
  ) => {
    const [girdData, setGridData] = useState<any>(initConfigData);
    const classes = useDialogStyles();
    const myGridRef = useRef<any>(null);
    const [isLocalLogin, setLocalLoding] = useState(false);
    const [serverError, setServerError] = useState("");
    const handelCloseEvent = () => {
      //SetOpen(false);
      ClosedEventCall();
    };
    const metaData = useMemo(() => {
      let myColumns = metadata.columns;
      if (mode === "view") {
        myColumns = metadata.columns.filter(
          (one) => one.accessor !== "_hidden"
        );
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
                },
              ];
            } else {
              let srCount = old.length + 1;
              const myNewRowObj = {
                ...initialData,
                id: srCount,
              };
              return [...old, myNewRowObj];
            }
          });
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
        onSubmit({ data, mode, setServerError, setLocalLoding });
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
                {HeaderMetaData?.gridConfig?.title ?? ""}
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
            isLoading: isLocalLogin,
          })
        ) : (
          children
        )}
        <FormComponentView
          key={"DetailsHeadersView"}
          finalMetaData={HeaderMetaData as FilterFormMetaType}
          onAction={ClickEventManage}
          loading={isLoading || isLocalLogin}
          data={HeaderData ?? {}}
        ></FormComponentView>
        {isLoading ? (
          <LoaderPaperComponent />
        ) : (
          <GridWrapper
            key={"customerDetailsGrid"}
            finalMetaData={metaData as GridMetaDataType}
            data={girdData}
            setData={setGridData}
            loading={
              isLocalLogin ? true : isEditableForm ? mode === "view" : isLoading
            }
            actions={actions}
            setAction={handelActionEvent}
            refetchData={null}
            ref={myGridRef}
          />
        )}
      </div>
    );
  }
);
