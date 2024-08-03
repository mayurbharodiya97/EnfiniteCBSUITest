import React, { useCallback, useContext, useRef, useState } from "react";
import { Grid } from "@mui/material";
import { useMutation } from "react-query";
import * as API from "../../../acct_Inquiry/api";
import {
  AccountInquiryGridMetaData,
  AccountInquiryMetadata,
} from "pages_audit/acct_Inquiry/metaData";
import { Route, Routes, useNavigate } from "react-router-dom";
import { AuthContext } from "pages_audit/auth";
import { ViewDetail } from "pages_audit/acct_Inquiry/viewDetail";
import Dependencies from "pages_audit/acct_Inquiry/dependencies";
import { ViewStatement } from "pages_audit/acct_Inquiry/viewStatement";
import AcctModal from "./AcctModal";

import {
  GradientButton,
  Alert,
  GridWrapper,
  GridMetaDataType,
  ActionTypes,
  MetaDataType,
  FormWrapper,
  SubmitFnType,
} from "@acuteinfo/common-base";

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
const RetrieveAcct = () => {
  const formRef = useRef<any>(null);
  const formbtnRef = useRef<any>(null);
  const navigate = useNavigate();
  const { authState }: any = useContext(AuthContext);

  const [componentToShow, setComponentToShow] = useState("");
  const [showGridData, setShowGridData] = useState(false);
  const [acctOpen, setAcctOpen] = useState(false);
  const [rowsData, setRowsData] = useState([]);

  const mutation: any = useMutation(API.getAccountInquiry, {
    onSuccess: () => {},
    onError: () => {},
  });
  const ClickEventManage = () => {
    let event: any = { preventDefault: () => {} };
    formRef?.current?.handleSubmit(event, "BUTTON_CLICK");
  };
  const onSubmitHandler: SubmitFnType = (data: any, displayData, endSubmit) => {
    if (
      !Boolean(data?.MOBILE) &&
      !Boolean(data?.CUSTOMER) &&
      !Boolean(data?.ACCOUNT) &&
      !Boolean(data?.PAN) &&
      !Boolean(data?.NAME)
    ) {
      //@ts-ignore
      endSubmit(true, "Please enter any value");
      setShowGridData(true);
    } else {
      //@ts-ignore
      setShowGridData(false);
      endSubmit(true);
      const payload = { ...data, COMP_CD: authState?.companyID };
      mutation.mutate(payload);
    }
  };

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
                  // onClose();
                  navigate("new-account", {
                    state: {
                      isFormModalOpen: true,
                      // entityType: "I",
                      isFreshEntry: true,
                    },
                  });
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

      <Routes>
        <Route
          path="new-account/*"
          element={
            <AcctModal
              onClose={() => navigate(".")}
              formmode={"new"}
              from={"new-entry"}
            />
          }
        />
      </Routes>
    </Grid>
  );
};

export default RetrieveAcct;
