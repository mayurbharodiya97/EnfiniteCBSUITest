import {
  forwardRef,
  Fragment,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import { MasterDetailsMetaData } from "./types";
import { Alert } from "components/common/alert";
import {
  utilFunction,
  extractMetaData,
  extractGridMetaData,
} from "components/utils";
import { CreateDetailsRequestData } from "components/utils";
import { CSSProperties } from "@mui/styles";
import { AppBar } from "@mui/material";
export interface MasterDetailsArgumentType {
  metaData: MasterDetailsMetaData;
  children?: any;
  actions?: any[];
  initialData?: any;
  isError?: boolean;
  errorObj?: any;
  handelActionEvent?: any;
  formStyle?: any;
  isNewRow?: boolean | null;
  isLoading?: boolean;
  onSubmitData?: Function;
  displayMode?: string | null;
  containerstyle?: CSSProperties;
  formName?: string | null;
  formNameMaster?: string | null;
  onFormButtonClickHandel?: any;
  onClickActionEvent?: any;
  hideHeader?: boolean;
  formState?: any;
  setDataOnFieldChange?: any;
  isDetailRowRequire?: boolean;
  subHeaderLable?: any;
}
export const MasterDetailsForm = forwardRef<any, MasterDetailsArgumentType>(
  (
    {
      metaData,
      children = () => {},
      actions = [],
      initialData = {},
      isError = false,
      errorObj = {},
      handelActionEvent = () => {},
      formStyle = {
        background: "white",
        height: "calc(100vh - 650px)",
        overflowY: "auto",
        overflowX: "hidden",
      },
      isNewRow = null,
      isLoading = false,
      onSubmitData = () => {},
      displayMode = null,
      containerstyle = { padding: "10px" },
      formName = "",
      formNameMaster = "",
      onFormButtonClickHandel = (id) => {},
      onClickActionEvent = () => {},
      hideHeader = false,
      formState,
      setDataOnFieldChange,
      isDetailRowRequire = true,
      subHeaderLable,
    },
    ref
  ) => {
    //console.log(initialData);
    const intialValueDetails = useMemo(() => {
      const { DETAILS_DATA = [], ...other } = initialData;
      return DETAILS_DATA;
    }, [initialData]);
    const [girdData, setGridData] = useState<any>(intialValueDetails);

    const myGridRef = useRef<any>(null);
    const myMasterRef = useRef<any>(null);
    const [serverError, setServerError] = useState("");
    const masterMetadata: MetaDataType = useMemo(
      () => extractMetaData(metaData.masterForm, displayMode),
      [metaData, displayMode, formNameMaster]
    ) as MetaDataType;
    const detailsMetadata: GridMetaDataType = useMemo(() => {
      return extractGridMetaData(metaData.detailsGrid, displayMode);
    }, [metaData, displayMode, formName]) as GridMetaDataType;
    const GetKeyName = useMemo(
      () => metaData?.detailsGrid?.gridConfig?.rowIdColumn || "id",
      [metaData]
    );
    const intialValueMaster = useMemo(() => {
      const { DETAILS_DATA, ...other } = initialData;
      return other;
    }, [initialData]);
    const intialNewRowData = useMemo(() => {
      return detailsMetadata.columns.reduce((accu, item) => {
        if (item?.componentType === "deleteRowCell") {
          return accu;
        }
        accu[item?.accessor] = item?.defaultValue ?? "";
        return accu;
      }, {});
    }, [detailsMetadata]);
    const detailsMetadatarep = useMemo(() => {
      let myColumns = detailsMetadata.columns;
      if (displayMode === "view") {
        myColumns = detailsMetadata.columns.filter(
          (one) => one.accessor !== "_hidden"
        );
      }
      return { ...detailsMetadata, columns: myColumns };
    }, [displayMode, detailsMetadata]);
    // console.log(intialNewRowData);
    const AddNewRow = async (
      isValiate = false,
      initValue = intialNewRowData
    ) => {
      if (isLoading) {
        return;
      }
      if (Boolean(serverError)) {
        setServerError("");
      }
      if (isValiate) {
        let { hasError, data: dataold } = await myGridRef.current?.validate(
          true
        );
        //console.log(hasError, dataold);
        if (hasError === true) {
          if (dataold) {
            setGridData(dataold);
          }
          return;
        }
      }

      setGridData((old) => {
        if (!Array.isArray(old)) {
          return [
            {
              ...initValue,
              _isNewRow: true,
              [GetKeyName]: 1,
            },
          ];
        } else {
          let srCount = utilFunction.GetMaxCdForDetails(old, GetKeyName); //old.length + 1;
          const myNewRowObj = {
            ...initValue,
            _isNewRow: true,
            [GetKeyName]: srCount,
          };
          return [...old, myNewRowObj];
        }
      });
    };

    const handleSubmitDetails = async (
      resultValueObj,
      resultDisplayValueObj,
      endSubmit,
      setFieldErrors,
      actionFlag
    ) => {
      // console.log("handleSubmitDetails");
      let { hasError, data } = await myGridRef.current?.validate(true);
      // console.log(data);
      if (Boolean(serverError)) {
        setServerError("");
      }
      if (hasError === true) {
        endSubmit(true);
        if (data) {
          setGridData(data);
        }
      } else {
        let result = myGridRef?.current?.cleanData?.();
        if (!Array.isArray(result)) {
          result = [result];
        }
        if (result.length === 0 && isDetailRowRequire) {
          endSubmit(true);
          setServerError("Atleast one row must be in detail.");
        } else {
          let finalResult = result.filter(
            (one) => !(Boolean(one?._hidden) && Boolean(one?._isNewRow))
          );
          if (finalResult.length === 0 && isDetailRowRequire) {
            endSubmit(true);
            setServerError("Atleast one row must be in detail.");
          } else {
            finalResult = CreateDetailsRequestData(finalResult);
            //console.log(intialValueMaster, resultValueObj);
            let updateValue = utilFunction.transformDetailsData(
              resultValueObj,
              intialValueMaster
            );
            let data = {
              _isNewRow: Boolean(isNewRow),
              ...resultValueObj,
              DETAILS_DATA: finalResult,
              ...updateValue,
            };
            onSubmitData({
              data,
              resultValueObj,
              resultDisplayValueObj,
              endSubmit,
              setFieldErrors,
              actionFlag,
            });
          }
        }
      }
    };
    // const handleSubmit = async (
    //   resultValueObj,
    //   resultDisplayValueObj,
    //   endSubmit,
    //   setFieldErrors,
    //   actionFlag
    // ) => {
    //   await handleSubmitDetails(
    //     resultValueObj,
    //     resultDisplayValueObj,
    //     endSubmit,
    //     setFieldErrors,
    //     actionFlag
    //   );
    // };
    const resetMasterForm = () => {
      myMasterRef?.current?.handleFormReset({ preventDefault: () => {} });
      setGridData([]);
    };
    useImperativeHandle(ref, () => ({
      addNewRow: (ignoreTouch = false, initValue = intialNewRowData) =>
        AddNewRow(ignoreTouch, initValue),
      GetGirdData: () => myGridRef?.current?.cleanData?.(),
      onSubmitHandler: (e, actionFlag = "action", isValidate = true) => {
        myMasterRef.current?.handleSubmit(e, actionFlag, isValidate);
      },
      setGridData: setGridData,
      getFieldData: myMasterRef?.current?.getFieldData,
      handleFormReset: resetMasterForm,
    }));

    return (
      <Fragment>
        <div
          style={{
            paddingBottom: "10px",
          }}
        >
          {isError ? (
            <div style={{ paddingRight: "10px", paddingLeft: "10px" }}>
              <AppBar position="relative" color="primary">
                <Alert
                  severity="error"
                  errorMsg={errorObj?.error_msg ?? "Unknow Error"}
                  errorDetail={errorObj?.error_detail ?? ""}
                  color="error"
                />
              </AppBar>
            </div>
          ) : Boolean(serverError) ? (
            <div style={{ paddingRight: "10px", paddingLeft: "10px" }}>
              <AppBar position="relative" color="primary">
                <Alert errorMsg={serverError} errorDetail="" severity="error" />
              </AppBar>
            </div>
          ) : null}
          <FormWrapper
            key={
              "masterDetails-Master" + Boolean(formNameMaster)
                ? formNameMaster
                : Boolean(formName)
                ? formName
                : ""
            }
            metaData={masterMetadata}
            initialValues={intialValueMaster}
            formStyle={formStyle}
            onSubmitHandler={handleSubmitDetails}
            displayMode={displayMode}
            containerstyle={containerstyle}
            onFormButtonClickHandel={onFormButtonClickHandel}
            hideHeader={hideHeader}
            ref={myMasterRef}
            formState={formState}
            setDataOnFieldChange={setDataOnFieldChange}
            subHeaderLable={subHeaderLable}
          >
            {children}
          </FormWrapper>

          <div style={{ paddingRight: "10px", paddingLeft: "10px" }}>
            <GridWrapper
              key={"masterDetails-Detail" + Boolean(formName) ? formName : ""}
              finalMetaData={detailsMetadatarep as GridMetaDataType}
              data={girdData}
              setData={setGridData}
              loading={isLoading}
              actions={actions}
              setAction={handelActionEvent}
              refetchData={null}
              ref={myGridRef}
              onClickActionEvent={onClickActionEvent}
            />
          </div>
        </div>
      </Fragment>
    );
  }
);
