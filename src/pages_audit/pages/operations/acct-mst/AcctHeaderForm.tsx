import React, { useContext, useEffect, useMemo, useRef } from "react";
import { AppBar, LinearProgress } from "@mui/material";
import { useQuery } from "react-query";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { acctMSTHeaderFormMetadata } from "./metadata/acctHeaderMetadata";
import { AuthContext } from "pages_audit/auth";
import * as API from "./api";
import { AcctMSTContext } from "./AcctMSTContext";

const AcctHeaderForm = React.memo(function HeaderForm() {
  const {
    AcctMSTState,
    handleHeaderFormSubmit,
    handleApiRes,
    handleFormLoading
  } = useContext(AcctMSTContext);
  const { authState } = useContext(AuthContext);
  const formRef = useRef<any | null>(null);

  const onSubmitHandler = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag,
    hasError
  ) => {
    // if(data && !hasError) {
      // console.log("hwefiuhwieuhfiwhef", data, hasError);
      handleHeaderFormSubmit({acctType: data?.ACCT_TYPE, acctMode: data?.ACCT_MODE});
      endSubmit(true)
    // }
  };

  // const initialVal = useMemo(() => {
  //   return AcctMSTState?.isFreshEntryctx
  //     ? AcctMSTState?.formDatactx["PERSONAL_DETAIL"]
  //       ? AcctMSTState?.formDatactx["PERSONAL_DETAIL"]
  //       : {}
  //     : AcctMSTState?.retrieveFormDataApiRes
  //     ? AcctMSTState?.retrieveFormDataApiRes["PERSONAL_DETAIL"]
  //     : {};
  // }, [AcctMSTState?.isFreshEntryctx, AcctMSTState?.retrieveFormDataApiRes]);

  // const initialVal = {
  //   ACCT_TYPE: "0001",
  //   ACCT_MODE: "04  ",
  // }
  const initialVal = useMemo(() => {
    // console.log("wedqwqwq", AcctMSTState?.accTypeValuectx, AcctMSTState?.acctModectx)
    return {
      ACCT_TYPE: AcctMSTState?.accTypeValuectx,
      ACCT_MODE: AcctMSTState?.acctModectx,
      CUST_ID: AcctMSTState?.customerIDctx,
      REQ_ID: AcctMSTState?.req_cd_ctx,
    }
  }, [AcctMSTState?.accTypeValuectx, AcctMSTState?.acctModectx, AcctMSTState?.customerIDctx, AcctMSTState?.req_cd_ctx])

  // const loader = useMemo(() => (AcctMSTState?.currentFormctx.isLoading || AcctMSTState?.isLoading) ? <LinearProgress color="secondary" /> : null, [AcctMSTState?.currentFormctx.isLoading, AcctMSTState?.isLoading])
  const loader = useMemo(() => AcctMSTState?.isLoading ? <LinearProgress color="secondary" /> : null, [AcctMSTState?.isLoading])

  const {
    data: TabsData,
    isSuccess,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery(
    [
      "getTabsDetail", AcctMSTState?.accTypeValuectx
    ],
    () =>
      API.getTabsDetail({
        COMP_CD: authState?.companyID ?? "",
        BRANCH_CD: authState?.user?.branchCode ?? "",
        ACCT_TYPE: AcctMSTState?.accTypeValuectx,
        ACCT_MODE: AcctMSTState?.acctModectx,
        ALLOW_EDIT: "NEW",
        // isFreshEntry: state?.isFreshEntryctx,
      })
  );

  useEffect(() => {
    // if() {
    // console.log("ResultResult", TabsData)
    // setTabsApiRes(data)
    if(!isLoading && TabsData && TabsData.length>0) {
      let newData:any[] = []
        TabsData.forEach((element:{[k: string]: any}) => {
        let subtitleinfo = {
            SUB_TITLE_NAME : element?.SUB_TITLE_NAME,
            SUB_TITLE_DESC : element?.SUB_TITLE_DESC,
            SUB_ICON : element?.SUB_ICON,
        }
            let index = newData.findIndex((el:any) => el?.TAB_NAME == element?.TAB_NAME)
            if(index != -1) {
            // duplicate tab element
            let subtitles = newData[index].subtitles
            subtitles.push(subtitleinfo)
            } else {
            // new tab element
            newData.push({...element, subtitles: [subtitleinfo], isVisible: true})
            }
        // console.log("filled newdata -aft", element.TAB_NAME , newData)
        });
        // setTabsApiRes(newData)
        handleApiRes(newData)
    }
    // }
  }, [TabsData, isLoading])
  useEffect(() => {
    if(isLoading || isFetching) {
      handleFormLoading(true)
    } else {
      handleFormLoading(false)
    }
  }, [isLoading, isFetching, TabsData])

  // useEffect(() => {
  //   console.log("AcctMSTState?.isLoading iauhfuiahef", AcctMSTState?.isLoading)
  // }, [AcctMSTState?.isLoading])


  return (
    <AppBar position="sticky" style={{ marginBottom: "10px", top: "113px" }}>
        <FormWrapper
          key={"acct-header-form" + initialVal}
          ref={formRef}
          onSubmitHandler={onSubmitHandler}
          initialValues={initialVal}
          metaData={acctMSTHeaderFormMetadata as MetaDataType}
          formStyle={{}}
          hideHeader={true}
          displayMode={AcctMSTState?.formmodectx}
          controlsAtBottom={false}
          onFormButtonClickHandel={() => {
            let event: any = { preventDefault: () => {} };
            formRef?.current?.handleSubmit(event, "BUTTON_CLICK");
          }}
        ></FormWrapper>
        {loader}
    </AppBar>
  );
});

export default AcctHeaderForm;
