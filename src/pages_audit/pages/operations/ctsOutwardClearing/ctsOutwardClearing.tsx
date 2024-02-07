import {
  FC,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useMutation, useQueries, useQuery } from "react-query";
import {
  ChequeDetailFormMetaData,
  CtsOutwardClearingMetadata,
  SlipJoinDetailGridMetaData,
  ViewCtsOutwardClearingMetadata,
} from "./metaData";
import { Alert } from "components/common/alert";
import { ClearCacheProvider, queryClient } from "cache";
import * as API from "./api";
import { FormWrapper } from "components/dyanmicForm/formWrapper";
import { useContext } from "react";
import { SubmitFnType } from "packages/form";
import {
  Theme,
  Tabs,
  Tab,
  AppBar,
  Collapse,
  IconButton,
  Typography,
  Grid,
  Toolbar,
} from "@mui/material";
import { AuthContext } from "pages_audit/auth";
import { makeStyles } from "@mui/styles";
import { ChequeDetailForm } from "./chequeDetail";
import { GradientButton } from "components/styledComponent/button";
import { RetrieveClearingForm } from "./retrieveClearingData";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { extractMetaData } from "components/utils";
import { MetaDataType } from "components/dyanmicForm";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import {
  PopupMessageAPIWrapper,
  PopupRequestWrapper,
} from "components/custom/popupMessage";
import { useSnackbar } from "notistack";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import { ActionTypes } from "components/dataTable";
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
const CtsOutwardClearing: FC<{
  zoneTranType: any;
  defaultView?: any;
  tranCD?: any;
}> = ({ zoneTranType, defaultView, tranCD }) => {
  const { authState } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const myRef = useRef<any>(null);
  const [gridData, setGridData] = useState<any>();
  const [formData, setFormData] = useState<any>();
  const [message, setMessage] = useState<any>();
  const [isOpenSave, setIsOpenSave] = useState(false);
  const [isOpenRetrieve, setIsOpenRetrieve] = useState(false);
  const [isDelete, SetDelete] = useState(false);
  const [isOpenProcced, setIsOpenProcced] = useState(false);
  const [formMode, setFormMode] = useState(defaultView);
  const isErrorFuncRef = useRef<any>(null);
  const [isSlipJointDetail, setIsSlipJointDetail] = useState("");
  const [totalAmountSlip, setTotalAmountSlip] = useState("0");
  const [initValues, setInitValues] = useState<any>({
    chequeDetails: [
      {
        CHEQUE_DATE: new Date(),
        // isRemoveButton: true,
      },
    ],
  });

  const [isPDExpanded, setIsPDExpanded] = useState(true);
  const handlePDExpand = () => {
    setIsPDExpanded(!isPDExpanded);
  };
  const setCurrentAction = useCallback((data) => {
    if (data.name === "view-details") {
      setIsSlipJointDetail(data?.rows?.[0]?.data?.REF_PERSON_NAME);
    }
  }, []);
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getOutwardClearingConfigData", tranCD, formMode], () =>
    API.getOutwardClearingConfigData({
      COMP_CD: authState?.companyID ?? "",
      BRANCH_CD: authState?.user?.branchCode ?? "",
      TRAN_CD: tranCD,
    })
  );

  const result = useQueries([
    {
      queryKey: ["getBussinessDate"],
      queryFn: () =>
        API.getBussinessDate({
          companyID: authState?.companyID ?? "",
          branchID: authState?.user?.branchCode ?? "",
        }),
    },
  ]);
  const mutationOutward = useMutation(API.outwardClearingConfigDML, {
    onError: (error: any) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      if (isErrorFuncRef.current == null) {
        enqueueSnackbar(errorMsg, {
          variant: "error",
        });
      } else {
        isErrorFuncRef.current?.endSubmit(
          false,
          errorMsg,
          error?.error_detail ?? ""
        );
      }
      setIsOpenProcced(false);
    },
    onSuccess: (data) => {
      enqueueSnackbar(data, {
        variant: "success",
      });
      setFormData({});
      setGridData({});
      setInitValues(() => ({
        chequeDetails: [],
      }));
      setIsOpenProcced(false);
    },
  });
  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    value,
    event
  ) => {
    //@ts-ignore
    endSubmit(true);
    // setFieldError({
    //   AMOUNT: "Please enter a correct ROWID_COLUMN",
    // });
  };
  const deleteMutation = useMutation(API.outwardClearingConfigDML, {
    onError: (error: any) => {},
    onSuccess: (data) => {
      // isDataChangedRef.current = true;
      enqueueSnackbar("Records successfully deleted", {
        variant: "success",
      });

      SetDelete(false);
      setFormMode("new");
    },
  });

  const onAcceptDelete = (rows) => {
    deleteMutation.mutate({
      DAILY_CLEARING: {
        TRAN_CD: tranCD,
        ENTERED_COMP_CD: authState.companyID,
        ENTERED_BRANCH_CD: authState.user.branchCode,
      },
      DETAILS_DATA: {
        isNewRow: [],
        isDeleteRow: [
          {
            ENTERED_COMP_CD: authState.companyID,
            ENTERED_BRANCH_CD: authState.user.branchCode,
            TRAN_CD: tranCD,
          },
        ],
        isUpdatedRow: [],
      },
      _isDeleteRow: true,
    });
  };

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getBussinessDate"]);
      queryClient.removeQueries(["getOutwardClearingConfigData", formMode]);
    };
  }, []);

  if (CtsOutwardClearingMetadata?.fields?.[1]) {
    CtsOutwardClearingMetadata.fields[1].requestProps = zoneTranType ?? "";
  }
  const updatedMetaData = {
    ...CtsOutwardClearingMetadata,
    fields: CtsOutwardClearingMetadata.fields?.map((field) => {
      if (field.name === "BRANCH_CD") {
        return {
          ...field,
          defaultValue: authState?.user?.branchCode ?? "",
        };
      }
      return field;
    }),
  };
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && (event.key === "R" || event.key === "r")) {
        event.preventDefault();
        setIsOpenRetrieve(true);
      }

      if (formMode === "view") {
        if (event.ctrlKey && (event.key === "D" || event.key === "d")) {
          event.preventDefault();
          SetDelete(true);
        }
      }
      // if (event.key === "N" && event.ctrlKey) {
      //   console.log("Ctrl + N pressed");
      //   event.preventDefault();
      //   // setFormMode("new");
      // }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [formMode]);
  useEffect(() => {
    // Open the PopupRequestWrapper when message is set
    if (message && message.length > 0) {
      console.log("message.length", message.length, message);
      setIsOpenSave(true);
    }
  }, [message, message?.length]);

  let cheueTotalAmount = 0;
  data?.[0]?.CHEQUE_DETAIL?.forEach((element) => {
    if (
      element.AMOUNT !== undefined &&
      element.AMOUNT !== "" &&
      element.AMOUNT
    ) {
      cheueTotalAmount += Number(element.AMOUNT);
    }
  });

  return (
    <>
      <div
        onKeyDown={(e) => {
          if (e.key === "Tab") {
            let target: any = e?.target;
            if (
              (target?.name ?? "") ===
              updatedMetaData.form.name + "/AMOUNT"
            ) {
              myRef?.current?.getFieldData().then((res) => {
                setFormData(res);
              });
              CtsOutwardClearingMetadata.fields[4].isFieldFocused = false;
              // // ChequeDetailFormMetaData.fields[0]._fields[0].isFieldFocused =
              // true;
            }
          }
        }}
      >
        {formMode === "new" ? (
          <>
            <FormWrapper
              key={
                "CtsoutwardForm" +
                formMode +
                mutationOutward.isSuccess +
                formData +
                result?.[0]?.data
              }
              // metaData={CtsOutwardClearingMetadata}
              metaData={
                extractMetaData(updatedMetaData, formMode) as MetaDataType
              }
              initialValues={
                mutationOutward.isSuccess
                  ? {
                      TRAN_DT: new Date(
                        result?.[0]?.data?.[0]?.DATE ?? new Date()
                      ),
                    }
                  : {
                      ...formData,
                      TRAN_DT: new Date(
                        result?.[0]?.data?.[0]?.DATE ?? new Date()
                      ),
                    }
              }
              ref={myRef}
              onSubmitHandler={onSubmitHandler}
              setDataOnFieldChange={(action, paylod) => {
                if (
                  paylod?.ACCT_JOIN_DETAILS &&
                  paylod?.ACCT_JOIN_DETAILS.length
                ) {
                  setGridData(paylod);
                  // setIsPDExpanded(true);
                }
                if (paylod.RESTRICT_MESSAGE || paylod.MESSAGE1) {
                  let accountMessage =
                    paylod.RESTRICT_MESSAGE || paylod.MESSAGE1;
                  setMessage(accountMessage);
                  // setIsOpenSave(true);
                }
                if (action === "AMOUNT") {
                  setTotalAmountSlip(paylod);
                  console.log("payload", paylod);
                }
              }}
              // hideHeader={true}
              //@ts-ignore
              displayMode={formMode}
              formStyle={{
                background: "white",
                width: "100%",
                padding: "05px",
              }}
            >
              {({ isSubmitting, handleSubmit }) => (
                <>
                  <GradientButton
                    onClick={() => {
                      setIsOpenRetrieve(true);
                    }}
                    // onClick={() => {
                    //   navigate(location.pathname + "/retrieve");
                    //   setFormMode("view");
                    // }}
                  >
                    Retrieve
                  </GradientButton>
                </>
              )}
            </FormWrapper>
          </>
        ) : formMode === "view" ? (
          <>
            {isLoading || isFetching ? (
              <LoaderPaperComponent />
            ) : isError ? (
              <Alert
                severity="error"
                errorMsg={error?.error_msg ?? "Error"}
                errorDetail={error?.error_detail ?? ""}
                color="error"
              />
            ) : (
              <FormWrapper
                key={"CtsoutwardForm" + formMode}
                // metaData={CtsOutwardClearingMetadata}
                metaData={
                  extractMetaData(
                    ViewCtsOutwardClearingMetadata,
                    formMode
                  ) as MetaDataType
                }
                initialValues={{
                  ...(data?.[0]?.SLIP_DETAIL || {}),
                  ...(data?.[0] || {}),
                }}
                ref={myRef}
                // onSubmitHandler={onSubmitHandler}
                // hideHeader={true}
                //@ts-ignore
                displayMode={formMode}
                formStyle={{
                  background: "white",
                  width: "100%",
                  padding: "05px",
                }}
              >
                {({ isSubmitting, handleSubmit }) => (
                  <>
                    <>
                      <GradientButton
                        // onClick={() => {
                        //   navigate(location.pathname + "/retrieve");
                        // }}
                        onClick={() => {
                          setIsOpenRetrieve(true);
                        }}
                      >
                        Retrieve
                      </GradientButton>
                    </>
                    <>
                      <GradientButton
                        onClick={() => {
                          setFormMode("new");
                        }}
                      >
                        new
                      </GradientButton>
                    </>
                    <>
                      <GradientButton
                        onClick={() => {
                          SetDelete(true);
                        }}
                      >
                        Delete
                      </GradientButton>
                    </>
                  </>
                )}
              </FormWrapper>
            )}
          </>
        ) : null}
        <>
          {formMode === "new" ? (
            <Grid
              sx={{
                backgroundColor: "var(--theme-color2)",
                // padding: (theme) => theme.spacing(1),
                margin: "0px 0px 0px 10px",
                padding: gridData?.ACCT_JOIN_DETAILS
                  ? isPDExpanded
                    ? "10px"
                    : "0px"
                  : "0px",
                // padding: !isPDExpanded ? "6px" : "2px",
                // padding: "10px",
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
                {/* <div
                  style={{
                    display: "flex",
                    justifyContent: "end",
                    margin: "0 auto ",
                    marginRight: "10px",
                    width: "45%",
                  }}
                >
                  <Toolbar
                    sx={{
                      background: "var(--theme-color5)",
                      fontSize: "16px",
                      color: "white",
                      border: "1px solid #BABABA",
                      borderRadius: "5px",
                      width: "50%",
                      minHeight: "30px !important ",
                    }}
                  >
                    {`Slip Amount: ${totalAmountSlip ?? ""} `}
                  </Toolbar>
                  <Toolbar
                    sx={{
                      background: "var(--theme-color5)",
                      fontSize: "16px",
                      color: "white",
                      border: "1px solid #BABABA",
                      borderRadius: "5px",
                      width: "50%",
                      minHeight: "30px !important ",
                    }}
                  >
                    {`Cheque Amount: ${totalAmountCheque ?? "0.00"} `}
                  </Toolbar>
                  <Toolbar
                    sx={{
                      background: "var(--theme-color5)",
                      fontSize: "16px",
                      color: "white",
                      border: "1px solid #BABABA",
                      borderRadius: "5px",
                      width: "50%",
                      minHeight: "30px !important ",
                    }}
                  >
                    {totalAmountCheque !== undefined &&
                      totalAmountSlip !== undefined && (
                        <span style={{ marginLeft: "10px" }}>
                          {`Cheque Difference: ${(
                            totalAmountSlip - totalAmountCheque
                          ).toFixed(2)}`}
                        </span>
                      )}
                  </Toolbar>
                </div> */}
                <IconButton onClick={handlePDExpand}>
                  {!isPDExpanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                </IconButton>
              </Grid>
              <Collapse in={isPDExpanded}>
                <Grid item>
                  {gridData?.ACCT_JOIN_DETAILS &&
                  gridData?.ACCT_JOIN_DETAILS.length ? (
                    <GridWrapper
                      key={"SlipJoinDetailGridMetaData" + gridData}
                      finalMetaData={SlipJoinDetailGridMetaData}
                      data={gridData?.ACCT_JOIN_DETAILS ?? []}
                      setData={() => null}
                      // loading={isLoading || isFetching}
                      actions={actions}
                      setAction={setCurrentAction}
                      // refetchData={() => refetch()}
                      // ref={myGridRef}
                      // defaultSortOrder={[{ id: "TRAN_CD", desc: false }]}
                    />
                  ) : null}
                </Grid>
              </Collapse>
            </Grid>
          ) : null}
        </>
        <>
          <ChequeDetailForm
            formData={formData}
            setFormData={setFormData}
            myRef={myRef}
            formMode={formMode}
            retrievData={data?.[0]}
            loading={isLoading || isFetching}
            error={isError}
            zoneTranType={zoneTranType}
            mutationOutward={mutationOutward}
            setIsOpenProcced={setIsOpenProcced}
            isOpenProcced={isOpenProcced}
            initValues={initValues}
            gridData={gridData}
            setInitValues={setInitValues}
            isSlipJointDetail={isSlipJointDetail}
            totalAmountSlip={totalAmountSlip}
          />
        </>
      </div>

      {isOpenRetrieve ? (
        <RetrieveClearingForm
          zoneTranType={zoneTranType}
          onClose={() => setIsOpenRetrieve(false)}
          setFormMode={setFormMode}
          tranDate={result?.[0]?.data}
        />
      ) : null}
      {isOpenSave ? (
        <PopupRequestWrapper
          MessageTitle="Account Description"
          Message={message}
          onClickButton={(rows, buttonName) => setIsOpenSave(false)}
          buttonNames={["Ok"]}
          rows={[]}
          open={isOpenSave}
        />
      ) : null}
      {isDelete ? (
        <PopupMessageAPIWrapper
          MessageTitle="Confirmation"
          Message="Do You Want to delete this row?"
          onActionYes={(rows) => onAcceptDelete(rows)}
          onActionNo={() => SetDelete(false)}
          rows={{}}
          open={isDelete}
          loading={deleteMutation.isLoading}
        />
      ) : null}
    </>
  );
};
export const CtsOutwardClearingForm = ({ zoneTranType }) => {
  const { state: rows }: any = useLocation();

  return (
    <ClearCacheProvider>
      <CtsOutwardClearing
        zoneTranType={zoneTranType}
        defaultView={"new" ? "new" : rows?.formMode}
        tranCD={rows?.rows?.[0]?.data?.TRAN_CD ?? ""}
      />
    </ClearCacheProvider>
  );
};
