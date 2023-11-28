import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button, Grid, Dialog, CircularProgress } from "@mui/material";
import { AccountInquiryMetadata, AccountInquiryGridMetaData } from "./metaData";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { GridMetaDataType } from "components/dataTable/types";
import GridWrapper from "components/dataTableStatic";
import { ActionTypes } from "components/dataTable";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { ViewDetail } from "./viewDetail";
import { ViewStatement } from "./viewStatement";
import { ViewInterest } from "./viewInterest";
import * as API from "./api";
import { AuthContext } from "pages_audit/auth";
import { SubmitFnType } from "packages/form";
import { Alert } from "components/common/alert";
import { GradientButton } from "components/styledComponent/button";
import { queryClient } from "cache";
import Dependencies from "./dependencies";

// import { Dialog } from "@mui/material";
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
export const Accountinquiry = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [rowsData, setRowsData] = useState([]);
  const [acctOpen, setAcctOpen] = useState(false);
  const [componentToShow, setComponentToShow] = useState("");
  const [showGridData, setShowGridData] = useState(false);
  const { authState } = useContext(AuthContext);
  const formRef = useRef<any>(null);
  const formbtnRef = useRef<any>(null);
  // const { t } = useTranslation();
  interface InsertFormDataFnType {
    data: object;
    displayData?: object;
    endSubmit?: any;
    setFieldError?: any;
  }
  const insertFormDataFnWrapper =
    (insertFormData) =>
    async ({ data }: InsertFormDataFnType) => {
      return insertFormData(data);
    };
  const mutation: any = useMutation(API.getAccountInquiry, {
    onSuccess: (data) => {},
    onError: (error: any) => {},
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
  const onSubmitHandler: SubmitFnType = (
    data: any,
    displayData,
    endSubmit,
    setFieldError
  ) => {
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
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth={true}
        PaperProps={{
          style: {
            maxWidth: "1150px",
          },
        }}
      >
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
            {({ isSubmitting, handleSubmit }) => (
              <>
                <GradientButton
                  onClick={(event) => {
                    //   isSubmitEventRef.current = event;
                    // handleSubmit(event, "Save");
                    onClose();
                  }}
                  // disabled={isSubmitting}
                  // endIcon={
                  //   isSubmitting ? <CircularProgress size={20} /> : null
                  // }
                  color={"primary"}
                  ref={formbtnRef}
                  endicon="CancelOutlined"
                  rotateIcon="scale(1.4) rotate(360deg)"
                  sx={{
                    background: "transparent !important",
                    color: "var(--theme-color2) !important",
                    boxShadow: "none !important",
                    fontSize: "14px",
                    "&:hover": {
                      background: "rgba(235, 237, 238, 0.45) !important",
                      // color: "var(--theme-color2) !important",
                      // border: "1.5px solid var(--theme-color2)",
                      transition: "all 1s ease 0s",
                      "& .MuiSvgIcon-root": {
                        transform: "scale(1.4) rotateY(360deg)",
                        transition: "transform 2s ease-in-out",
                      },
                    },
                  }}
                >
                  close
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
      </Dialog>
    </>
  );
};
