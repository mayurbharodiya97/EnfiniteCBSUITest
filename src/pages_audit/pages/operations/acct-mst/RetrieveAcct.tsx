import React, { useCallback, useContext, useRef, useState } from "react";
import { Grid } from "@mui/material";
import { useMutation } from "react-query";
import { Alert } from "components/common/alert";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { SubmitFnType } from "packages/form";
import * as API from "./api";
import { GradientButton } from "components/styledComponent/button";
import { retrieveAcctFormMetaData, retrieveAcctGridMetaData } from "./metadata/retrieveAcctMetadata";
import { Route, Routes, useNavigate } from "react-router-dom";
import { AuthContext } from "pages_audit/auth";
import GridWrapper from "components/dataTableStatic";
import { GridMetaDataType } from "components/dataTable/types";
import { ActionTypes } from "components/dataTable";
import AcctModal from "./AcctModal";
import { usePopupContext } from "components/custom/popupContext";
import { utilFunction } from "components/utils";

const actions: ActionTypes[] = [
    {
      actionName: "view-detail",
      actionLabel: "View Detail",
      multiple: false,
      rowDoubleClick: true,
    },
];

const RetrieveAcct = () => {
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);
  const [rowsData, setRowsData] = useState<any[]>([]);
  const { MessageBox } = usePopupContext();

  const formRef = useRef<any>(null);
  const [formMode, setFormMode] = useState("edit");

  const setCurrentAction = useCallback(
    (data) => {
      const confirmed = data?.rows?.[0]?.data?.CONFIRMED ?? "";
      const maker = data?.rows?.[0]?.data?.MAKER ?? "";
      const loggedinUser = authState?.user?.id;

      if(Boolean(confirmed)) {
        // P=SENT TO CONFIRMATION
        if(confirmed.includes("P")) {
          if(maker === loggedinUser) {
            setFormMode("edit")
          } else {
            setFormMode("view")
          }
        } else if(confirmed.includes("M")) {
          // M=SENT TO MODIFICATION
          setFormMode("edit")
        } else if(confirmed.includes("Y") || confirmed.includes("R")) {
          setFormMode("edit")
        } else {
          setFormMode("view")
        }
      }
      setRowsData(data?.rows);

      if (data.name === "view-detail") {
        navigate(data?.name, {
          state: data?.rows,
        })
        // setComponentToShow("ViewDetail");
        // setAcctOpen(true);
        // setRowsData(data?.rows);
      } else {
        navigate(data?.name, {
          state: data?.rows,
        });
      }
    },
    [navigate]
);

  const mutation: any = useMutation(API.getAccountList, {
    onSuccess: () => {},
    onError: () => {},
  });

  const onFormSubmit: SubmitFnType = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag,
  ) => {
      if (
        !Boolean(data?.BRANCH_CD) &&
        !Boolean(data?.ACCT_TYPE) &&
        !Boolean(data?.ACCT_CD) &&
        !Boolean(data?.CONTACT2) &&
        !Boolean(data?.CUSTOMER_ID) &&
        !Boolean(data?.PAN_NO)
      ) {
        //@ts-ignore
        endSubmit(true, "Please enter any value");
      } else {
        if(
          ((Boolean(data?.BRANCH_CD) ||
          Boolean(data?.ACCT_TYPE) ||
          Boolean(data?.ACCT_CD)) && (
          !Boolean(data?.BRANCH_CD) ||
          !Boolean(data?.ACCT_TYPE) ||
          !Boolean(data?.ACCT_CD)
          ))
        ) {
          endSubmit(true, "Please enter Branch Code, Account Type and Account Code");
        } else {
          endSubmit(true)
          let payload = {SELECT_COLUMN: {}};
          let {PID_DESCRIPTION, ...others} = data;
          Object.keys(others)?.forEach(key => {
            if(Boolean(data[key])) {
              if(key === "ACCT_CD") {
                payload["SELECT_COLUMN"]["ACCT_CD"] = utilFunction.getPadAccountNumber(
                  data?.ACCT_CD,
                  null
                )
              } else {
                payload["SELECT_COLUMN"][key] = data?.[key];
              }
            }
          });
          mutation.mutate(payload)
        }
      }
  };

  return (
    <Grid>
      <FormWrapper
        key={"retrieveAcctForm"}
        metaData={retrieveAcctFormMetaData as MetaDataType}
        initialValues={{}}
        onSubmitHandler={onFormSubmit}
        formState={{
          MessageBox: MessageBox,
          docCD: "MST/002"
        }}
        formStyle={{
          background: "white",
          height: "200px",
          overflowY: "auto",
          overflowX: "hidden",
        }}
        ref={formRef}
        setDataOnFieldChange={(action, payload) => {
          if (action === "BUTTON_CLICK_ACCTCD") {
            const {ACCT_TYPE, BRANCH_CD, ACCT_CD} = payload;
            mutation.mutate({SELECT_COLUMN: {
              ACCT_TYPE: ACCT_TYPE, 
              BRANCH_CD: BRANCH_CD,
              ACCT_CD: utilFunction.getPadAccountNumber(
                ACCT_CD,
                null
              )
            }})
          }
        }}
        onFormButtonClickHandel={() => {
          let event: any = { preventDefault: () => {} };
          formRef?.current?.handleSubmit(event, "BUTTON_CLICK");
        }}
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
                  }
                })
              }}
              // disabled={isSubmitting}
              color={"primary"}
            >
              NEW ACCOUNT
            </GradientButton>
          </>
        )}
      </FormWrapper>
      {mutation.isError && (
        <Alert
          severity={mutation.error?.severity ?? "error"}
          errorMsg={mutation.error?.error_msg ?? "Something went to wrong.."}
          errorDetail={mutation.error?.error_detail}
          color="error"
        />
      )}
      <GridWrapper
          key={`retrieveAcctGrid`}
          finalMetaData={retrieveAcctGridMetaData as GridMetaDataType}
          data={mutation.data ?? []}
          setData={() => null}
          loading={mutation.isLoading}
          actions={actions}
          setAction={setCurrentAction}
          headerToolbarStyle={{
            fontSize: "1.20rem",
          }}
        />

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
          <Route
            path="view-detail/*"
            element={
              <AcctModal
                onClose={() => navigate(".")}
                formmode={formMode ?? "edit"}
                from={"acct-retrieve"}
              />
            }
          />
        </Routes>
    </Grid>
  )
}

export default RetrieveAcct;