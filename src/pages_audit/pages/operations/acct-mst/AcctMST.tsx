import { useCallback, useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Typograhpy from "components/common/typograhpy";
import { ActionTypes } from "components/dataTable";
import GridWrapper from "components/dataTableStatic";
import * as API from "../../../acct_Inquiry/api";
import { GridMetaDataType } from "components/dataTable/types";
import { useMutation } from "react-query";
import { SubmitFnType } from "packages/form";
import { Grid } from "@mui/material";
import { Alert } from "components/common/alert";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { GradientButton } from "components/styledComponent/button";
import { AccountInquiryGridMetaData, AccountInquiryMetadata } from "pages_audit/acct_Inquiry/metaData";
import { ViewDetail } from "pages_audit/acct_Inquiry/viewDetail";
import Dependencies from "pages_audit/acct_Inquiry/dependencies";
import { ViewStatement } from "pages_audit/acct_Inquiry/viewStatement";
const actions: ActionTypes[] = [
  {
    actionName: "view-detail",
    actionLabel: "View Detail",
    multiple: false,
    rowDoubleClick: true,
  },
  {
    actionName: "dependencies",
    actionLabel: "Dependencies",
    multiple: false,
    rowDoubleClick: false,
  },
  {
    actionName: "view-statement",
    actionLabel: "View Statement",
    multiple: false,
    rowDoubleClick: false,
  },
  {
    actionName: "view-interest",
    actionLabel: "View Interest",
    multiple: false,
    rowDoubleClick: false,
  },
];

const AcctMST = () => {
  const [open, setOpen] = useState(true);
  const onClose = () => {
    setOpen(false);
  };
  const navigate = useNavigate();
  const [rowsData, setRowsData] = useState([]);
  const [acctOpen, setAcctOpen] = useState(false);
  const [componentToShow, setComponentToShow] = useState("");
  const [showGridData, setShowGridData] = useState(false);
  const formRef = useRef<any>(null);
  const formbtnRef = useRef<any>(null);
  interface InsertFormDataFnType {
    data: object;
    displayData?: object;
    endSubmit?: any;
    setFieldError?: any;
  }
  const mutation: any = useMutation(API.getAccountInquiry, {
    onSuccess: () => {},
    onError: () => {},
  });

  const setCurrentAction = useCallback(
    (data) => {
      if (data.name === "view-detail") {
        setComponentToShow("ViewDetail");
        setAcctOpen(true);
        setRowsData(data?.rows);
      } else if (data.name === "dependencies") {
        setComponentToShow("Dependencies");
        setAcctOpen(true);
        setRowsData(data?.rows);
      } else if (data.name === "view-statement") {
        setComponentToShow("ViewStatement");
        setAcctOpen(true);
        setRowsData(data?.rows);
      } else if (data.name === "view-interest") {
        setComponentToShow("ViewInterest");
        setAcctOpen(true);
      } else {
        navigate(data?.name, {
          state: data?.rows,
        });
      }
    },
    [navigate]
  );
  const onSubmitHandler: SubmitFnType = (data: any, displayData, endSubmit) => {
    if (
      !Boolean(data?.MOBILE) &&
      !Boolean(data?.CUSTOMER) &&
      !Boolean(data?.ACCOUNT) &&
      !Boolean(data?.PAN)
    ) {
      //@ts-ignore
      endSubmit(true, "Please enter any value");
      setShowGridData(true);
    } else {
      //@ts-ignore
      setShowGridData(false);
      endSubmit(true);
      mutation.mutate(data);
    }
  };
  const ClickEventManage = () => {
    let event: any = { preventDefault: () => {} };
    formRef?.current?.handleSubmit(event, "BUTTON_CLICK");
  };
  return (
    <Grid>
        {mutation.isError && (
          <Alert
            severity={mutation.error?.severity ?? "error"}
            errorMsg={mutation.error?.error_msg ?? "Something went to wrong.."}
            errorDetail={mutation.error?.error_detail}
            color="error"
          />
        )}
        <div
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              let target: any = e?.target;
              if (target?.value) {
                ClickEventManage();
              }
            }
          }}
        >
          <FormWrapper
            key={`MerchantOnboardConfig`}
            metaData={AccountInquiryMetadata as MetaDataType}
            initialValues={[]}
            onSubmitHandler={onSubmitHandler}
            formStyle={{
              background: "white",
            }}
            onFormButtonClickHandel={() => {
              let event: any = { preventDefault: () => {} };
              formRef?.current?.handleSubmit(event, "BUTTON_CLICK");
            }}
            // onFormButtonCicular={mutation.isLoading}
            ref={formRef}
          >
            {() => (
              <>
                <GradientButton
                  onClick={() => {
                    onClose();
                  }}
                  // disabled={isSubmitting}
                  color={"primary"}
                  ref={formbtnRef}
                >
                  NEW ACCOUNT
                </GradientButton>
              </>
            )}
          </FormWrapper>
        </div>
        <GridWrapper
          key={`customerSearchingGrid`}
          finalMetaData={AccountInquiryGridMetaData as GridMetaDataType}
          data={showGridData ? [] : mutation.data ?? []}
          setData={() => null}
          loading={mutation.isLoading}
          actions={actions}
          setAction={setCurrentAction}
          headerToolbarStyle={{
            fontSize: "1.20rem",
          }}
          // refetchData={() => {}}
          // ref={myGridRef}
        />

        {componentToShow === "ViewDetail" ? (
          <ViewDetail
            rowsData={rowsData}
            open={acctOpen}
            onClose={() => setAcctOpen(false)}
          />
        ) : componentToShow === "Dependencies" ? (
          <Dependencies
            rowsData={rowsData}
            open={acctOpen}
            onClose={() => setAcctOpen(false)}
          />
        ) : componentToShow === "ViewStatement" ? (
          <ViewStatement
            rowsData={rowsData}
            open={acctOpen}
            onClose={() => setAcctOpen(false)}
            screenFlag={"ACCT_INQ"}
          />
        ) : //   componentToShow === "ViewInterest" ? (
        // <ViewInterest open={acctOpen} onClose={() => setAcctOpen(false)} />
        // ) :
        null}
    </Grid>
  );
};

export default AcctMST;
