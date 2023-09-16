import {
  forwardRef,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
//   import { MasterDetailsMetaData } from "./types";
import {
  utilFunction,
  extractMetaData,
  extractGridMetaData,
  DefaultErrorObject,
} from "components/utils";
import { CSSProperties } from "@mui/styles";
import { useMutation, useQuery } from "react-query";
import { SubmitFnType } from "packages/form";
import { AuthContext } from "pages_audit/auth";
import { AuthSDK } from "registry/fns/auth";

export interface MasterDetailsArgumentType {
  metaData;
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
  reportID?: any;
  dataFetcher?: any;
  otherAPIRequestPara?: any;
  autoFetch?: any;
}
export const DetailMaster = forwardRef<any, MasterDetailsArgumentType>(
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
        height: "calc(100vh - 390px)",
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
      reportID,
      dataFetcher = () => {
        return [];
      },
      otherAPIRequestPara,
      autoFetch = true,
    },
    ref
  ) => {
    const intialValueDetails = useMemo(() => {
      const { DETAILS_DATA = [], ...other } = initialData;
      return DETAILS_DATA;
    }, [initialData]);
    const [girdData, setGridData] = useState<any>(intialValueDetails);
    const myGridRef = useRef<any>(null);
    const myMasterRef = useRef<any>(null);
    const { authState } = useContext(AuthContext);

    const mutation: any = useMutation(getdetailData, {
      onSuccess: (data) => {},
      onError: (error: any) => {},
    });
    console.log("<<<mutation", mutation);

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

    const detailsMetadatarep = useMemo(() => {
      let myColumns = detailsMetadata.columns;
      if (displayMode === "view") {
        myColumns = detailsMetadata.columns.filter(
          (one) => one.accessor !== "_hidden"
        );
      }
      return { ...detailsMetadata, columns: myColumns };
    }, [displayMode, detailsMetadata]);

    const onSubmitHandler: SubmitFnType = (
      data: any,
      displayData,
      endSubmit,
      setFieldError
    ) => {
      //@ts-ignore
      endSubmit(true);

      console.log("<<<dtf", data);

      let ApiKey = masterMetadata?.form?.apiKey;
      let response = {};
      for (const key in ApiKey) {
        if (ApiKey.hasOwnProperty(key)) {
          const mappedKey = ApiKey[key];
          response[key] = data[mappedKey];
        }
      }
      let otherAPIRequestPara = {
        COMP_CD: authState?.companyID,
        ...response,
      };
      mutation.mutate({ reportID, otherAPIRequestPara });
    };
    const ClickEventManage = () => {
      let event: any = { preventDefault: () => {} };
      myMasterRef?.current?.handleSubmit(event, "BUTTON_CLICK");
    };
    return (
      <Fragment>
        <div
          style={{
            paddingBottom: "10px",
          }}
        >
          <div style={{ paddingRight: "10px", paddingLeft: "10px" }}>
            <GridWrapper
              key={"masterDetails-Detail" + Boolean(formName) ? formName : ""}
              finalMetaData={detailsMetadatarep as GridMetaDataType}
              data={mutation.data ? mutation.data : girdData}
              setData={setGridData}
              loading={mutation.isLoading}
              actions={actions}
              setAction={handelActionEvent}
              refetchData={null}
              ref={myGridRef}
              onClickActionEvent={onClickActionEvent}
            />
          </div>
          <div
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                ClickEventManage();
              }
            }}
          >
            <FormWrapper
              key={
                "masterDetails-Master" + Boolean(mutation?.data)
                  ? mutation?.data
                  : Boolean(formName)
                  ? formName
                  : ""
              }
              metaData={masterMetadata}
              initialValues={mutation?.data?.[0]}
              formStyle={formStyle}
              onSubmitHandler={onSubmitHandler}
              displayMode={displayMode}
              containerstyle={containerstyle}
              onFormButtonClickHandel={onFormButtonClickHandel}
              hideHeader={hideHeader}
              ref={myMasterRef}
            >
              {children}
            </FormWrapper>
          </div>
        </div>
      </Fragment>
    );
  }
);
export const getdetailData = async ({ reportID, otherAPIRequestPara }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher(reportID, {
      ...otherAPIRequestPara,
    });
  if (status === "0") {
    // return setNewData(data);
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
