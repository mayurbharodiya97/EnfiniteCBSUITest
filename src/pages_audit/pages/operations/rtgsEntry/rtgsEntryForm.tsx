import { ClearCacheProvider, queryClient } from "cache";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { GradientButton } from "components/styledComponent/button";
import { extractMetaData } from "components/utils";
import {
  FC,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  RtgsEntryFormMetaData,
  SlipJoinDetailGridMetaData,
  rtgsAccountDetailFormMetaData,
} from "./metaData";
import * as API from "./api";
import { useMutation, useQuery } from "react-query";
import { AuthContext } from "pages_audit/auth";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { Alert } from "components/common/alert";
import { AppBar, Collapse, Grid, IconButton, Typography } from "@mui/material";
import { InitialValuesType, SubmitFnType } from "packages/form";
import { ActionTypes } from "components/dataTable";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import { AddNewBankMasterForm } from "./addNewBank";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { useSnackbar } from "notistack";
// import { RetrieveClearingForm } from "./retrieveClearing";
import { usePopupContext } from "components/custom/popupContext";
import { format } from "date-fns";
import { RemarksAPIWrapper } from "components/custom/Remarks";

const actions: ActionTypes[] = [
  {
    actionName: "view-details",
    actionLabel: "Edit Detail",
    multiple: undefined,
    rowDoubleClick: true,
  },
  {
    actionName: "close",
    actionLabel: "cancel",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
];

const RtgsEntryForm: FC<{}> = () => {
  const { authState } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const { MessageBox } = usePopupContext();
  const [formMode, setFormMode] = useState("new");
  const [isJointDtlExpand, setJointDtlExpand] = useState(false);
  const [gridData, setGridData] = useState<any>([]);
  const myFormRef: any = useRef(null);
  const myChequeFormRef: any = useRef(null);
  const slipFormDataRef: any = useRef(null);
  const [chequeDetailData, setChequeDetailData] = useState<any>({
    chequeDetails: [
      { ECS_USER_NO: "", CHEQUE_DATE: authState?.workingDate ?? "" },
    ],
    SLIP_AMOUNT: "0",
  });

  useEffect(() => {
    const handleKeyDown = async (event) => {
      console.log("event.ctrlKey", event);
      if (event.ctrlKey && (event?.key === "J" || event?.key === "j")) {
        event.preventDefault();
        setJointDtlExpand(true);
      } else if (event && event?.key === "Escape") {
        setJointDtlExpand(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
  }, [formMode]);
  return (
    <Fragment>
      {/* {isLoading || getOutwardClearingData.isLoading ? (
        <div style={{ height: 100, paddingTop: 10 }}>
          <div style={{ padding: 10 }}>
            <LoaderPaperComponent />
          </div>
        </div>
      ) : isError ? (
        <>
          <div
            style={{
              paddingRight: "10px",
              paddingLeft: "10px",
              height: 100,
              paddingTop: 10,
            }}
          >
            <AppBar position="relative" color="primary">
              <Alert
                severity="error"
                errorMsg={error?.error_msg ?? "Unknow Error"}
                errorDetail={error?.error_detail ?? ""}
                color="error"
              />
            </AppBar>
          </div>
        </>
      ) : ( */}
      <>
        <FormWrapper
          key={"RtgsEntry" + formMode}
          metaData={
            extractMetaData(RtgsEntryFormMetaData, formMode) as MetaDataType
          }
          initialValues={
            formMode === "new"
              ? {
                  TRAN_DT: authState?.workingDate ?? "",
                }
              : {}
          }
          onSubmitHandler={async (
            data: any,
            displayData,
            endSubmit,
            setFieldError,
            action
          ) => {
            //@ts-ignore
            endSubmit(true);
            slipFormDataRef.current = data;
            if (action === "CHEQUEDTL") {
              let event: any = { preventDefault: () => {} };
              myChequeFormRef?.current?.handleSubmit(event, "FINAL");
            }
          }}
          setDataOnFieldChange={(action, payload) => {
            if (action === "JOINT_DETAIL") {
              console.log("payload", payload);
              // setJointDtlExpand(true);
              setGridData(payload);
            }
            // if (action === "API_REQ") {
            //   setChequeReqData(payload);
            // } else if (action === "ACCT_CD_VALID") {
            //   setJointDtlExpand(true);
            //   setGridData(payload?.ACCT_JOIN_DETAILS);
            //   setChequeDetailData((old) => {
            //     return {
            //       ...old,
            //       chequeDetails: [
            //         ...old.chequeDetails.map((item) => {
            //           return {
            //             ...item,
            //             ECS_USER_NO: payload?.ACCT_NAME ?? "",
            //             CHEQUE_DATE: authState?.workingDate ?? "",
            //           };
            //         }),
            //       ],
            //     };
            //   });
            //   setChequeDtlRefresh((old) => old + 1);
            // } else if (action === "ACCT_CD_BLANK") {
            //   setGridData([]);
            //   setChequeDetailData(() => ({
            //     chequeDetails: [
            //       {
            //         ECS_USER_NO: "",
            //         CHEQUE_DATE: authState?.workingDate ?? "",
            //       },
            //     ],
            //     SLIP_AMOUNT: "0",
            //   }));
            //   setChequeDtlRefresh((old) => old + 1);
            //   // setIsSlipJointDetail("");
            // } else if (action === "AMOUNT") {
            //   setChequeDetailData((old) => ({
            //     ...old,
            //     SLIP_AMOUNT: payload,
            //   }));
            //   setChequeDtlRefresh((old) => old + 1);
            //   let event: any = { preventDefault: () => {} };
            //   myFormRef?.current?.handleSubmit(event);
            // }
          }}
          //@ts-ignore
          displayMode={formMode}
          formStyle={{
            background: "white",
            width: "100%",
            padding: "05px",
            height: "19.2em",
            overflow: "auto",
          }}
          formState={{
            // ZONE_TRAN_TYPE: zoneTranType,
            MessageBox: MessageBox,
          }}
          ref={myFormRef}
        >
          {/* {({ isSubmitting, handleSubmit }) => (
            <>
              {formMode === "new" ? (
                <>
                  <GradientButton
                    onClick={() => {
                      // setIsOpenRetrieve(true);
                    }}
                  >
                    Retrieve
                  </GradientButton>
                </>
              ) : formMode === "view" ? (
                <>
                  <GradientButton
                    onClick={() => {
                      // setIsOpenRetrieve(true);
                    }}
                  >
                    Retrieve
                  </GradientButton>

                  <GradientButton
                    onClick={() => {
                      setFormMode("new");
                      // refetch();
                    }}
                  >
                    New
                  </GradientButton>

                  <GradientButton
                    onClick={async () => {
                      if (
                        retrieveDataRef.current?.CONFIRMED === "Y" &&
                        authState?.role < "2"
                      ) {
                        await MessageBox({
                          messageTitle: "Validation Failed..",
                          message: "Cannot Delete Confirmed Transaction",
                          buttonNames: ["Ok"],
                        });
                      } else if (
                        !(
                          format(
                            new Date(retrieveDataRef.current?.TRAN_DT),
                            "dd/MMM/yyyy"
                          ) >=
                          format(
                            new Date(authState?.workingDate),
                            "dd/MMM/yyyy"
                          )
                        )
                      ) {
                        await MessageBox({
                          messageTitle: "Validation Failed..",
                          message: "Cannot Delete Back Dated Entry",
                          buttonNames: ["Ok"],
                        });
                      } else {
                        // SetDeleteRemark(true);
                      }
                    }}
                  >
                    Remove
                  </GradientButton>
                </>
              ) : null}
            </>
          )} */}
        </FormWrapper>
        {formMode === "new" ? (
          <Grid
            sx={{
              backgroundColor: "var(--theme-color2)",
              margin: "0px 0px 0px 10px",
              padding:
                gridData && gridData?.length > 0
                  ? isJointDtlExpand
                    ? "10px"
                    : "0px"
                  : "0px",
              border: "1px solid rgba(0,0,0,0.12)",
              borderRadius: "20px",
            }}
            container
            item
            xs={11.8}
            direction={"column"}
          >
            <Grid
              container
              item
              sx={{ alignItems: "center", justifyContent: "space-between" }}
            >
              <Typography
                sx={{
                  color: "var(--theme-color3)",
                  marginLeft: "15px",
                  marginTop: "6px",
                }}
                gutterBottom={true}
                variant={"h6"}
              >
                Joint - Details
              </Typography>
              <IconButton onClick={() => setJointDtlExpand(!isJointDtlExpand)}>
                {!isJointDtlExpand ? <ExpandMoreIcon /> : <ExpandLessIcon />}
              </IconButton>
            </Grid>
            <Collapse in={isJointDtlExpand}>
              <Grid item>
                {gridData && gridData?.length > 0 ? (
                  <GridWrapper
                    key={"JoinDetailGridMetaData"}
                    finalMetaData={SlipJoinDetailGridMetaData}
                    data={gridData ?? []}
                    setData={() => null}
                    actions={actions}
                    setAction={{}}
                  />
                ) : null}
              </Grid>
            </Collapse>
          </Grid>
        ) : null}
        <FormWrapper
          key={`ChequeDetails` + formMode}
          metaData={
            extractMetaData(
              rtgsAccountDetailFormMetaData,
              formMode
            ) as MetaDataType
          }
          displayMode={formMode}
          onSubmitHandler={{}}
          initialValues={
            formMode === "new"
              ? {
                  ...chequeDetailData,
                }
              : {}
          }
          hideHeader={true}
          containerstyle={{ padding: "0px !important" }}
          setDataOnFieldChange={async (action, paylod) => {
            if (action === "MESSAGE") {
              if (paylod?.[0]?.ERROR_MSSAGE) {
                let res = await MessageBox({
                  messageTitle: "Confirmation..",
                  message: "Are You sure To Add Bank?",
                  buttonNames: ["Yes", "No"],
                });
                if (res === "Yes") {
                  // setOpenAddBankForm(true);
                }
              }
            }
          }}
          onFormButtonClickHandel={() => {
            let event: any = { preventDefault: () => {} };
            myChequeFormRef?.current?.handleSubmit(event);
          }}
          ref={myChequeFormRef}
          formStyle={
            {
              // height: "15%",
            }
          }
          formState={{
            MessageBox: MessageBox,
          }}
        />
      </>
      {/* )} */}
    </Fragment>
  );
};

export const RtgsEntryFormWrapper = () => {
  return (
    <ClearCacheProvider>
      <RtgsEntryForm key={"RtgsEntryForm"} />
    </ClearCacheProvider>
  );
};
