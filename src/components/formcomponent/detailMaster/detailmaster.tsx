import {
  createContext,
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
import { FormContext, SubmitFnType, useField } from "packages/form";
import { AuthContext } from "pages_audit/auth";
import { AuthSDK } from "registry/fns/auth";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { Alert } from "components/common/alert";

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
      initialData = {},
      handelActionEvent = () => {},
      displayMode = null,
      containerstyle = { padding: "10px" },
      formName = "",
      formNameMaster = "",
      onFormButtonClickHandel = (id) => {},
      onClickActionEvent = () => {},
      reportID,
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
    const mutation: any = useMutation(GetdetailData, {
      onSuccess: (data) => {},
      onError: (error: any) => {},
    });
    const [, setGridLabel] = useState<any>();
    const masterMetadata: MetaDataType = useMemo(
      () => extractMetaData(metaData.masterForm, displayMode),
      [metaData, displayMode, formNameMaster]
    ) as MetaDataType;

    const detailsMetadata: GridMetaDataType = useMemo(() => {
      return extractGridMetaData(metaData.detailsGrid, displayMode);
    }, [metaData, displayMode, formName]) as GridMetaDataType;

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
        ACCT_CD: data?.ACCT_CD.padEnd(20, " "),
      };
      mutation.mutate({ reportID, otherAPIRequestPara });
    };
    const ClickEventManage = () => {
      let event: any = { preventDefault: () => {} };
      myMasterRef?.current?.handleSubmit(event, "BUTTON_CLICK");
    };
    console.log("<<<mutation11", mutation.data);

    useEffect(() => {
      console.log("<<<mutation12", mutation.data?.[0]?.ACCT_CD);
      detailsMetadatarep.gridConfig.gridLabel = mutation.data?.[0]?.ACCT_CD
        ? detailsMetadatarep?.gridConfig?.gridLabel +
          "Account NO. =" +
          mutation.data?.[0]?.ACCT_CD
        : detailsMetadatarep?.gridConfig?.gridLabel +
          " " +
          "Account N1O. = " +
          mutation.data?.[0]?.ACCT_CD;
    }, [mutation.data]);

    // let gridLabel = detailsMetadatarep.gridConfig.gridLabel;
    // if (mutation.data) {
    //   console.log("<<<length", mutation.data);
    //   gridLabel =
    //     mutation.data &&
    //     detailsMetadatarep?.gridConfig?.gridLabel +
    //       "Account NO. =" +
    //       mutation.data?.[0]?.ACCT_CD;
    //   detailsMetadatarep.gridConfig.gridLabel = gridLabel;
    //   // detailsMetadatarep.gridConfig.gridLabel = mutation.data
    //   //   ? detailsMetadatarep?.gridConfig?.gridLabel +
    //   //     "Account NO. =" +
    //   //     mutation.data?.[0]?.ACCT_CD
    //   //   : detailsMetadatarep?.gridConfig?.gridLabel;
    // }

    // console.log("<<<mutation.data?.ACCT_CD", mutation.data?.[0]?.ACCT_CD);
    // detailsMetadatarep.gridConfig.gridLabel = "sdadgj";
    return (
      <Fragment>
        <div
          style={{
            paddingBottom: "10px",
          }}
        >
          {mutation?.isError ? (
            <div style={{ paddingRight: "10px", paddingLeft: "10px" }}>
              <AppBar position="relative" color="primary">
                <Alert
                  severity="error"
                  errorMsg={mutation?.error?.error_msg ?? "Unknow Error"}
                  errorDetail={mutation?.error?.error_detail ?? ""}
                  color="error"
                />
              </AppBar>
            </div>
          ) : mutation?.data?.length < 1 && Boolean(mutation?.isSuccess) ? (
            <div style={{ paddingRight: "10px", paddingLeft: "10px" }}>
              <AppBar position="relative" color="primary">
                <Alert
                  errorMsg="No data found"
                  errorDetail="No any data found"
                  severity="error"
                />
              </AppBar>
            </div>
          ) : null}
          <div style={{ paddingRight: "10px", paddingLeft: "10px" }}>
            <GridWrapper
              key={
                "masterDetails-Detail" +
                mutation.data?.[0]?.ACCT_CD +
                mutation.data
                // ? formName + gridLabel
                // : gridLabel
              }
              finalMetaData={detailsMetadatarep as GridMetaDataType}
              data={mutation.data ? mutation.data : girdData}
              setData={setGridData}
              loading={mutation.isLoading}
              actions={detailsMetadatarep?.actions}
              setAction={handelActionEvent}
              refetchData={null}
              ref={myGridRef}
              onClickActionEvent={onClickActionEvent}
            />
          </div>
          <div
            onKeyDown={(e) => {
              console.log("<<<ee", e);
              if (e.key === "Tab") {
                let target: any = e?.target;
                if (
                  (target?.name ?? "") ===
                  masterMetadata.form.name + "/ACCT_CD"
                ) {
                  ClickEventManage();
                  // target.__reactProps$40b49qo315m.autofocus();
                }
              }
            }}
          >
            <FormWrapper
              key={
                "masterDetails-Master" + mutation?.data?.length &&
                Boolean(mutation?.isSuccess)
                  ? mutation?.data
                  : ""
              }
              metaData={masterMetadata}
              initialValues={mutation?.data?.[0]}
              formStyle={masterMetadata?.form?.formStyle}
              onSubmitHandler={onSubmitHandler}
              displayMode={displayMode}
              containerstyle={containerstyle}
              onFormButtonClickHandel={onFormButtonClickHandel}
              hideHeader={masterMetadata?.form?.hideHeader}
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

export const GetdetailData = async ({ reportID, otherAPIRequestPara }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher(reportID, {
      ...otherAPIRequestPara,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
