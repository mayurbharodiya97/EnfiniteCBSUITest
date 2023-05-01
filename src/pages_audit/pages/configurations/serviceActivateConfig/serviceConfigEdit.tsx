import { useRef, useState, forwardRef, useMemo } from "react";
import { FormComponentView } from "components/formcomponent";
import GridWrapper from "components/dataTableStatic";
import { GridMetaDataType } from "components/dataTable/types";
import { DetailsGridWithHeaderArguType } from "components/detailPopupGridData/GridDetailsWithHeader/type";
import { FilterFormMetaType } from "components/formcomponent/filterform";
import { Alert } from "components/common/alert";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import {
  CreateDetailsRequestData,
  CreateLanguageRequestData,
  utilFunction,
} from "components/utils";
import { useSnackbar } from "notistack";
import { EngLocalMsgAPIWrapper } from "../validationMessages/engLocalMsg/engLocalMsg";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ServiceActiveConfigDetail } from "./serviceConfigDetail";
import { ActionTypes } from "components/dataTable";
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
  _isNewRow: true,
};
const initlanguageData: { isOpen: boolean; rowdata: any; isLoading: boolean } =
  {
    isOpen: false,
    isLoading: false,
    rowdata: [],
  };

export const ServiceConfigGridUpdate = (
  {
    metadata,
    ClosedEventCall,
    data: initConfigData,
    isLoading = false,
    isError = false,
    ErrorMessage = "",
    actions = [],
    mode = "view",
    isEditableForm = false,
    refID = {},
    SetMode,
    onSubmit = ({}: any) => {},
  },
  ref
) => {
  const [girdData, setGridData] = useState<any>(initConfigData);
  const myGridRef = useRef<any>(null);
  const myLanguageRef = useRef<any>({});
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [languageData, setLanguageData] = useState(initlanguageData);

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
    } else if (data.name === "save") {
      handleSubmit();
    } else if (data.name === "edit") {
      SetMode("edit");
    } else if (data.name === "cancel") {
      SetMode("view");
    } else if (data.name === "messages") {
      //console.log(data?.rows, girdData);
      let msgdata = girdData.filter((item, index) => {
        if (item?.TRN_TYPE === data?.rows?.[0]?.data?.TRN_TYPE) {
          return true;
        }
        return false;
      });
      if (msgdata.length > 0) {
        let trntype = msgdata[0].TRN_TYPE;
        if (Boolean(trntype) && Boolean(myLanguageRef.current[trntype])) {
          msgdata[0]["DISPLAY_MSG"] =
            myLanguageRef.current[trntype].DISPLAY_MSG;
          msgdata[0]["DISPLAY_MSG_BN"] =
            myLanguageRef.current[trntype].DISPLAY_MSG_BN;
        }
      }
      setLanguageData({
        isLoading: false,
        isOpen: true,
        rowdata: msgdata,
      });
    } else if (data.name === "view-details") {
      navigate(data?.name, {
        state: data?.rows,
      });
    }
  };
  const handleSubmit = async () => {
    let { hasError, data } = await myGridRef.current?.validate(true);
    //console.log(hasError, data);
    if (hasError === true) {
      if (data) {
        setGridData(data);
      }
    } else {
      let result = myGridRef?.current?.cleanData?.();
      let finalResult = result.filter((one) => !Boolean(one?._hidden));
      finalResult = CreateLanguageRequestData(
        finalResult,
        myLanguageRef.current
      );
      finalResult = CreateDetailsRequestData(finalResult);
      if (
        Array.isArray(finalResult.isUpdatedRow) &&
        finalResult?.isUpdatedRow?.length === 0
      ) {
        SetMode("view");
      } else {
        let data = {
          ...refID,
          DETAILS_DATA: finalResult,
        };
        //console.log(data);
        onSubmit({ data, mode, setServerError });
      }
    }
  };
  const onSubmitSetMessages = (engMsg, localMsg, rows) => {
    console.log(engMsg, localMsg, rows);
    let _trnType = rows?.[0]?.TRN_TYPE;
    if (Boolean(_trnType)) {
      myLanguageRef.current = {
        ...myLanguageRef.current,
        [_trnType]: { DISPLAY_MSG: engMsg, DISPLAY_MSG_BN: localMsg },
      };
    }
    setLanguageData({
      isLoading: false,
      isOpen: false,
      rowdata: [],
    });
  };
  const onActionCancel = () => {
    setLanguageData({ isOpen: false, rowdata: [], isLoading: false });
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
      {isLoading ? (
        <LoaderPaperComponent />
      ) : (
        <GridWrapper
          key={"ServiceConfigDetailsGrid"}
          finalMetaData={metaData as GridMetaDataType}
          data={girdData}
          setData={setGridData}
          loading={isLoading}
          actions={actions}
          setAction={handelActionEvent}
          refetchData={null}
          ref={myGridRef}
        />
      )}
      {languageData.isOpen ? (
        <EngLocalMsgAPIWrapper
          TitleText={"Messages"}
          onActionNo={onActionCancel}
          onActionYes={onSubmitSetMessages}
          isLoading={languageData.isLoading}
          AcceptbuttonLabelText="Save"
          CanceltbuttonLabelText="Cancel"
          EngValue={languageData.rowdata[0]?.DISPLAY_MSG}
          LocalValue={languageData.rowdata[0]?.DISPLAY_MSG_BN}
          isOpen={languageData.isOpen}
          rows={languageData.rowdata}
          isEditable={mode === "view" ? false : true}
        />
      ) : null}

      <Routes>
        <Route
          path="view-details"
          element={
            <ServiceActiveConfigDetail ClosedEventCall={handelCloseEvent} />
          }
        />
      </Routes>
    </div>
  );
};
