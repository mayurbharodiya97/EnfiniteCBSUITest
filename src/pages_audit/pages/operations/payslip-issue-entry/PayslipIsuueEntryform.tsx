import { useContext, useEffect, useRef, useState } from 'react';
import { AppBar, Chip, CircularProgress, Dialog, Paper, Toolbar, Typography } from '@mui/material';
import { Theme } from '@mui/system';
import { makeStyles } from "@mui/styles";
import { GradientButton } from 'components/styledComponent/button';
import { extractMetaData, utilFunction } from 'components/utils';
import FormWrapper, { MetaDataType } from 'components/dyanmicForm';
import {
  AccdetailsFormMetaData,
  DraftdetailsFormMetaData,
  PayslipdetailsFormMetaData,
  TotaldetailsFormMetaData,
  regionMasterMetaData,
} from './paySlipMetadata';
import { AuthContext } from 'pages_audit/auth';
import { usePopupContext } from 'components/custom/popupContext';
import { useMutation, useQuery } from 'react-query';
import { commonDataRetrive, headerDataRetrive, getRegionDDData2, getSlipTransCd, getSlipNo, validatePayslipData, addRegionData, savePayslipEntry, getJointDetailsList, getVoucherList } from './api';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoadingTextAnimation } from 'components/common/loader';
import { ClearCacheProvider, queryClient } from 'cache';
import { SubmitFnType } from 'packages/form';
import { API } from 'pages_audit/common';
import { MasterDetailsForm } from 'components/formcomponent';
import { enqueueSnackbar } from 'notistack';
import GridWrapper, { ActionTypes, GridMetaDataType } from 'components/dataTable';
import JointDetails from './JointDetails';
import { format } from 'date-fns';
import { ImageViewer } from 'components/fileUpload/preView';
import { DeleteDialog } from './deleteDialog';


const useTypeStyles: any = makeStyles((theme: Theme) => ({
  root: {
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    background: "var(--theme-color5)",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--white)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
  },
}));
const actions: ActionTypes[] = [
  {
    actionName: "add",
    actionLabel: "Add",
    multiple: undefined,
    alwaysAvailable: true,
  },

];
const PayslipIsuueEntryform = ({ defaultView, closeDialog, slipdataRefetch }) => {

  const { state: rows } = useLocation();
  const myChequeFormRef = useRef<any>(null);
  const isErrorFuncRef = useRef<any>(null);
  const formDataRef = useRef<any>(null);
  const billType = useRef<any>(null);
  const headerClasses = useTypeStyles();
  const { authState } = useContext(AuthContext);
  const [formMode, setFormMode] = useState(defaultView);
  const [regionDialouge, setregionDialouge] = useState(false);
  const [jointDtl, setjointDtl] = useState(false);
  const [OpenSignature, setOpenSignature] = useState(false);
  const [jointDtlData, setjointDtlData] = useState([]);
  const [openForm, setopenForm] = useState(true);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const [mstState, setMstState] = useState<any>({
    PAYSLIP_MST_DTL: [{ CHEQUE_DATE: authState?.workingDate ?? "", PENDING_FLAG: "Y" }],
  });

  const [signBlob, setSignBlob] = useState<any>(null)
  const [openDltDialogue, setopenDltDialogue] = useState(false);
  const [refetchRegion, setregionRefetch] = useState(0);
  const [draftState, setDraftState] = useState<any>({
    PAYSLIP_DRAFT_DTL: [{ PENDING_FLAG: "Y", ENTERED_COMP_CD: authState?.companyID }]
  });

  const requestData = {
    COMP_CD: authState?.companyID,
    BRANCH_CD: authState.user.branchCode,
    TRAN_CD: (rows)?.[0]?.data.TRAN_CD
  };

  const { data: slipnoData, isLoading: isslipnoDataLoading } = useQuery(["getSlipNo", requestData], () => getSlipNo({
    ENT_COMP_CD: authState?.companyID,
    ENT_BRANCH_CD: authState?.user?.branchCode,
    TRAN_DT: authState?.workingDate,
  }), {
    enabled: formMode == "add",
  });
  const { data: acctDtlData, isLoading: isAcctDtlLoading } = useQuery(["headerData", requestData], () => headerDataRetrive(requestData), {
    enabled: formMode !== "add",
  });
  const { data: draftDtlData, isLoading: isdraftDtlLoading } = useQuery(["draftdata", requestData], () => commonDataRetrive(requestData), {
    enabled: formMode !== "add",
  });

  const { data: regionGridData, isLoading: isregionDataLoading, refetch: regionRefetch } = useQuery(
    ["regionData", requestData],
    () => getRegionDDData2(requestData),
    {
      enabled: formMode === "add",
    }
  );

  const { data: slipTransCd, isLoading: isSlipTranCdLoading } = useQuery(["getpaySliptranscd"], () => getSlipTransCd({
    ENT_COMP_CD: authState?.companyID,
    ENT_BRANCH_CD: authState?.user?.branchCode,
  }), {
    enabled: formMode == "add",
  });


  const jointDetailMutation = useMutation(getJointDetailsList,
    {
      onError: async (error: any) => {

        const btnName = await MessageBox({
          message: error?.error_msg,
          messageTitle: "error",
          buttonNames: ["Ok"],
        });

      },
      onSuccess: async (data) => {
        setjointDtlData(data)


      },
    }
  );
  const voucherMutation = useMutation(getVoucherList,
    {
      onError: async (error: any) => {

        const btnName = await MessageBox({
          message: error?.error_msg,
          messageTitle: "error",
          buttonNames: ["Ok"],
        });
        isErrorFuncRef.current?.endSubmit(false);
      },
      onSuccess: async (data) => {
        if (data[0]?.VOUCHER_MSG === "") {
          return
        }
        else {
          const btnName = await MessageBox({
            message: data[0]?.VOUCHER_MSG,
            messageTitle: "Vouchers Confirmation",
            buttonNames: ["Ok"],
          });
        }
        closeDialog();
        CloseMessageBox();
      },
    }
  );
  const PayslipSaveMutation = useMutation(savePayslipEntry,
    {
      onError: async (error: any) => {

        const btnName = await MessageBox({
          message: error?.error_msg,
          messageTitle: "error",
          buttonNames: ["Ok"],
        });
        isErrorFuncRef.current?.endSubmit(false);
      },
      onSuccess: async (data) => {

        if (data[0]?.TRAN_CD) {
          voucherMutation.mutate({
            A_ENT_COMP_CD: authState?.companyID,
            A_ENT_BRANCH_CD: authState?.user?.branchCode,
            A_TRAN_DT: format(new Date(authState?.workingDate), "dd/MMM/yyyy"),
            A_TRAN_CD: data[0]?.TRAN_CD,
            A_TRN_FLAG: "N",
            A_SDC: "PSLP",
            A_SR_CD: "0"
          })
        }

        slipdataRefetch();
        enqueueSnackbar("insertSuccessfully", {
          variant: "success",
        });
        closeDialog();
        CloseMessageBox();
      },
    }
  );
  const validDataNutation = useMutation(validatePayslipData,
    {
      onError: async (error: any) => {

        const btnName = await MessageBox({
          message: error?.error_msg,
          messageTitle: "error",
          buttonNames: ["Ok"],
        });
        closeDialog();
        isErrorFuncRef.current?.endSubmit(false);
      },
      onSuccess: async (data) => {
        let btn99, returnVal;
        const getButtonName = async (obj) => {
          let btnName = await MessageBox(obj);
          return { btnName, obj };
        };
        for (let i = 0; i < data.length; i++) {
          if (data[i]?.O_STATUS === "999") {
            const { btnName, obj } = await getButtonName({
              messageTitle: "Validation Failed",
              message: data[i]?.O_MESSAGE,
            });
            if (formMode == "edit") {
              setFormMode("edit");
            }
            returnVal = "";
          }
          else if (data[i]?.O_STATUS === "99") {
            if (btn99 !== "No") {
              const { btnName, obj } = await getButtonName({
                messageTitle: "Confirmation",
                message: data[i]?.O_MESSAGE,
              });
            }
          }
          else if (data[i]?.O_STATUS === "0") {
            const buttonName = await MessageBox({
              messageTitle: "Confirmation",
              message: "Proceed ?",
              buttonNames: ["Yes", "No"],
              loadingBtnName: ["Yes"],
            });
            if (buttonName === "Yes") {


              PayslipSaveMutation.mutate({

                ...formDataRef.current.data,
                TRAN_CD: formMode == "add" ? slipTransCd[0]?.TRAN_CD : (rows)?.[0]?.data?.TRAN_CD,
              })
            }

          }
        }
        isErrorFuncRef.current?.endSubmit(false);
      },
    }
  );
  const regionmutation = useMutation(addRegionData, {

    onSuccess: (data) => {
      regionRefetch();
      setregionRefetch((prev) => prev + 1);
      setregionDialouge(false);
      enqueueSnackbar("insertSuccessfully", {
        variant: "success",
      });
      CloseMessageBox();
    },
    onError: (error: any) => {


      let errorMsg = "Unknownerroroccured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
      CloseMessageBox();
    },
  }
  );
  const olddraftData = draftDtlData ? draftDtlData.map(item => {
    const { COL_SER_CHARGE, REASON_CD, LAST_ENTERED_BY, REQUEST_CD, TRAN_DT, LAST_MACHINE_NM, ISSUE_DT, DIFF_AMT, PENDING_FLAG, REALIZE_COMP_CD, LAST_MODIFIED_DATE, ENABLE, ACCT_CD, ACCT_TYPE, REALIZE_DATE, ENTERED_DATE, REALIZE_BY, REALIZE_AMT, CHEQUE_NO, ENTERED_BY, C_C_T_SP_C, REALIZE_BRANCH_CD, THROUGH_CHANNEL, DESCRIPTION, COMP_CD, COMM_TRX_CD, MACHINE_NM, COLLECT_COMISSION, REALIZE_FLAG, DOC_DATE, PRINT_CNT, REGION, TRAN_CD, ...rest } = item;
    return {
      ...rest,
      REGION_CD: item.REGION,
      AMOUNT: parseFloat(item.AMOUNT).toFixed(2)
    };
  }) : [];
  const oldaccttData = acctDtlData ? acctDtlData.map(item => {
    const { COMP_CD, ENABLE, ENABLE_ALL, TRAN_DT, ENTERED_BRANCH_CD, ENTERED_COMP_CD, ISSUE_DT, DUMMY_CHECK, DOC_DATE, TRAN_CD, ...rest } = item;
    return rest;
  }) : [];


  const setChequeImage = async () => {
    if (Boolean("rowimagedata?.CHEQUE_IMG")) {
      setOpenSignature(true);
      let blob = utilFunction.base64toBlob(
        "rowimagedata?.CHEQUE_IMG",
        "image/png"
      );

      setSignBlob(blob);
    } else {
      return "";
    }
  };
  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    action
  ) => {
    //@ts-ignore
    endSubmit(true);

    const filteredDraftData: any[] = [];
    const filteredAcctData: any[] = [];

    for (let i = 0; i < data?.PAYSLIP_DRAFT_DTL.length; i++) {
      const draft = data?.PAYSLIP_DRAFT_DTL[i];
      if (draft && typeof draft === 'object') {

        if ('REGIONBTN' in draft) {
          delete draft.REGIONBTN;
        }
        if ('INS_FLAG' in draft) {
          delete draft.INS_FLAG;
        }
        if ('PENDING_FLAG' in draft) {
          delete draft.PENDING_FLAG;
        }
        if ('HIDDEN_PAYSLIPNO' in draft) {
          delete draft.HIDDEN_PAYSLIPNO;
        }
        if ('TAX_RATE' in draft) {
          delete draft.TAX_RATE;
        }
        if ('signature1' in draft) {
          delete draft.signature1;
        }
        if ('signature2' in draft) {
          delete draft.signature2;
        }
        if ('GST_ROUND' in draft) {
          delete draft.GST_ROUND;
        }
        if ('BALANCE' in draft) {
          draft.BALANCE = draft.BALANCE === "0" ? "" : draft.BALANCE;
        }
        if ('AMOUNT' in draft) {
          draft.AMOUNT = parseFloat(draft.AMOUNT).toFixed(2)
        }
        filteredDraftData.push(draft);
      }
    };

    for (let i = 0; i < data?.PAYSLIP_MST_DTL.length; i++) {
      const acctdata = data?.PAYSLIP_MST_DTL[i];
      if (acctdata && typeof acctdata === 'object') {

        if ('TYPE_CD' in acctdata) {
          delete acctdata.TYPE_CD;
        }
        if ('JOINT_DTL' in acctdata) {
          delete acctdata.JOINT_DTL;
        }
        if ('PENDING_FLAG' in acctdata) {
          delete acctdata.PENDING_FLAG;
        }

        if ('DUMMY_CHECK' in acctdata) {
          if (acctdata.DUMMY_CHECK === true) {
            acctdata.DUMMY_CHECK = "Y";
          } else {
            acctdata.DUMMY_CHECK = "";
          }
        }

        filteredAcctData.push(acctdata);
      }
    };


    let validatePayslipReq = {
      ISSUE_DT: authState?.workingDate,
      PENDING_FLAG: data?.PENDING_FLAG === "Confirmed" ? "Y" : "N",
      SLIP_CD: data?.SLIP_CD,
      PAYSLIP_MST_DTL: filteredDraftData,
      PAYSLIP_DRAFT_DTL: filteredAcctData,
      SCREEN_REF: "RPT/14",
    };
    isErrorFuncRef.current = {
      validatePayslipReq,
      displayData,
      endSubmit,
      setFieldError,

    };

    endSubmit(true);
    let updPara1 = utilFunction.transformDetailDataForDML(
      oldaccttData ?? [],
      filteredAcctData ?? [],
      ["SR_CD"]
    );

    let updPara2 = utilFunction.transformDetailDataForDML(
      olddraftData ?? [],
      filteredDraftData ?? [],
      ["SR_CD"]
    );



    if (updPara2.isNewRow) {
      updPara2.isNewRow.forEach((item) => {
        delete item.SR_CD;
        delete item.ENTERED_BRANCH_CD;
        delete item.ENTERED_COMP_CD;
        item.BRANCH_CD = authState.user.branchCode;
      });

    }
    // @ts-ignore
    if (formMode === "edit") {
      if (updPara2.isUpdatedRow.length === 0) {
        setFormMode("view");
      }
    }

    if (data.MST_TOTAL !== data.FINAL_DRAFT_TOTAL) {
      const btn2 = await MessageBox({
        messageTitle: "Validation Failed...!",
        message: "Please Check Amount.",
        buttonNames: ["Ok"],
      });
    }
    else {
      validDataNutation.mutate({
        ...isErrorFuncRef.current?.validatePayslipReq
      });
    }



    formDataRef.current = {
      data: {
        ISSUE_DT: format(new Date(data.TRAN_DT), "dd/MMM/yyyy"),
        SLIP_CD: data?.SLIP_CD,
        REQ_FLAG: "D",
        _isNewRow: formMode == "add" ? true : false,
        PAYSLIP_DRAFT_DTL: updPara2,
        PAYSLIP_MST_DTL: updPara1,
      },
      endSubmit
    };



  };
  const handleClick = (e) => {
    myChequeFormRef.current.handleSubmit(e)
  }



  const updatedDraftDtlData = draftDtlData ? draftDtlData.map(item => ({
    ...item,
    HIDDEN_PAYSLIPNO: item.PAYSLIP_NO,
    REGION_CD: item.REGION
  })) : [];

  useEffect(() => {
    return () => {

      queryClient.removeQueries(["getpaySliptranscd"]);
      queryClient.removeQueries(["regionData"]);
      queryClient.removeQueries(["draftdata"]);
      queryClient.removeQueries(["headerData"]);
      queryClient.removeQueries(["getSlipNo"]);
    };
  }, []);

  return (

    <>
      <Dialog
        fullWidth
        maxWidth="xl"
        open={openForm}
        style={{ height: "100%" }}
        PaperProps={{ style: { width: "100%", height: "100%", padding: "7px" } }}
      >
        <AppBar position="relative" color="secondary">
          <Toolbar className={headerClasses.root} variant="dense">
            <Typography className={headerClasses.title} color="inherit" variant="h6" component="div">
              {"Payslip Issue Entry RPT/14"}
              <Chip style={{ color: "white", marginLeft: "8px" }} variant="outlined" color="primary" size="small" label={`${formMode} mode`} />
            </Typography>
            {formMode !== "add" && !isdraftDtlLoading && !isAcctDtlLoading && rows?.[0]?.data.ALLOW_DEL === "Y" && (
              <GradientButton
                onClick={(event) => {
                  setopenDltDialogue(true)
                }}
                color={"primary"}
              >
                Delete
              </GradientButton>
            )}
            {formMode === "edit" ? (
              <>
                <GradientButton
                  onClick={(event) => {
                    handleClick(event)
                  }}
                  endIcon={validDataNutation.isLoading || PayslipSaveMutation.isLoading ? <CircularProgress size={20} /> : null}
                  color={"primary"}
                >
                  Save
                </GradientButton>
                <GradientButton
                  onClick={() => {
                    setFormMode("view");
                  }}
                  color={"primary"}
                >
                  Cancel
                </GradientButton>
              </>
            ) : formMode === "add" ? (
              <>
                <GradientButton
                  onClick={(event) => {
                    handleClick(event)
                  }}
                  endIcon={validDataNutation.isLoading || PayslipSaveMutation.isLoading ? <CircularProgress size={20} /> : null}
                  color={"primary"}
                >
                  Save
                </GradientButton>
                <GradientButton onClick={closeDialog} color={"primary"}>
                  Close
                </GradientButton>
              </>
            ) : (
              <>
                {
                  !isdraftDtlLoading && !isAcctDtlLoading ?
                    <GradientButton
                      onClick={() => {
                        if ((rows)?.[0]?.data.CONFIRMED !== "Y") {
                          setFormMode("edit");
                        } else {
                          enqueueSnackbar("Cannot make changes in confirmed entry", {
                            variant: "error",
                          });
                        }
                      }}
                      color={"primary"}
                    >
                      Edit
                    </GradientButton>
                    : null
                }

                <GradientButton onClick={closeDialog} color={"primary"}>
                  Close
                </GradientButton>
              </>
            )}
          </Toolbar>
        </AppBar>

        {(formMode === "add" ? !isslipnoDataLoading : ![isAcctDtlLoading, isdraftDtlLoading].some(isLoading => isLoading)) ? (
          <>
            <FormWrapper
              ref={myChequeFormRef}
              key={`basicinfoform${formMode}`}
              hideHeader={true}
              metaData={extractMetaData(PayslipdetailsFormMetaData, formMode) as MetaDataType}
              displayMode={formMode}
              onSubmitHandler={onSubmitHandler}
              initialValues={{
                TRAN_DT: formMode === "add"
                  ? authState.workingDate
                  : (rows)?.[0]?.data.TRAN_DT,
                SLIP_CD: formMode === "add"
                  ? slipnoData?.[0]?.MAX_SLIP_CD
                  : (rows)?.[0]?.data?.SLIP_CD,
                PENDING_FLAG: formMode === "add"
                  ? "Pending"
                  : (rows)?.[0]?.data.PENDING_FLAG,

              }}
              formStyle={{ background: "white" }}

            />

            <FormWrapper
              key={`accdetailsformst${formMode}`}
              metaData={
                extractMetaData(
                  AccdetailsFormMetaData,
                  formMode
                ) as MetaDataType
              }
              displayMode={formMode}
              onSubmitHandler={() => { }}
              onFormButtonClickHandel={async (id) => {
                let startIndex = id.indexOf("[") + 1;
                let endIndex = id.indexOf("]");
                let btnIndex = parseInt(id.substring(startIndex, endIndex)); // 
                const formDadata = await myChequeFormRef?.current?.getFieldData();
                if (formDadata && formDadata.PAYSLIP_MST_DTL) {
                  let arrayIndex = formDadata.PAYSLIP_MST_DTL.length - 1 - btnIndex;
                  if (arrayIndex >= 0 && arrayIndex < formDadata.PAYSLIP_MST_DTL.length) {
                    const selectedObject = formDadata ? formDadata.PAYSLIP_MST_DTL[arrayIndex] : [];
                    const retrivedObj = acctDtlData ? acctDtlData[btnIndex] : [];
                    const ACCT_CD = formMode === "add" ? selectedObject.ACCT_CD : retrivedObj.ACCT_CD;
                    const ACCT_TYPE = formMode === "add" ? selectedObject.ACCT_TYPE : retrivedObj.ACCT_TYPE
                    jointDetailMutation.mutate({
                      ACCT_CD,
                      ACCT_TYPE,
                      COMP_CD: authState?.companyID,
                      BRANCH_CD: authState.user.branchCode,
                    });

                    setjointDtl(true);
                  }
                }
              }}

              initialValues={{
                PAYSLIP_MST_DTL: formMode === "add"
                  ? mstState?.PAYSLIP_MST_DTL ?? []
                  : acctDtlData ?? [],
              }}
              hideHeader={true}
              formState={{ MessageBox: MessageBox, Mode: formMode }}
              formStyle={{ background: "white", height: "31vh", overflow: "scroll" }}
            />

            <FormWrapper
              key={`draftmstdetails${formMode}`}
              metaData={
                extractMetaData(
                  DraftdetailsFormMetaData,
                  formMode
                ) as MetaDataType
              }
              displayMode={formMode}
              onSubmitHandler={() => { }}
              onFormButtonClickHandel={async (id) => {


                if (id.slice(id.indexOf(".") + 1) === "REGIONBTN") {
                  const btnName = await MessageBox({
                    message: "Are you sure to add region ?",
                    messageTitle: "Confirmation",
                    buttonNames: ["Yes", "No"],
                  });
                  if (btnName === "Yes") {
                    setregionDialouge(true);
                  }
                }
                if (id.slice(id.indexOf(".") + 1) === "signature1") {
                  setOpenSignature(true);
                }
                if (id.slice(id.indexOf(".") + 1) === "signature2") {
                  setOpenSignature(true);
                }
              }}
              initialValues={{
                PAYSLIP_DRAFT_DTL: formMode === "add"
                  ? draftState?.PAYSLIP_DRAFT_DTL ?? []
                  : updatedDraftDtlData ?? [],
              }}


              hideHeader={true}
              formStyle={{ background: "white", height: "40vh", overflow: "scroll" }}

              setDataOnFieldChange={async (action, paylod) => {
                if (action === "DEF_TRAN_CD") {

                  // setBillType(paylod.BILL_TYPE_CD)
                  billType.current = {
                    paylod
                  };
                }
              }}
              formState={{ MessageBox: MessageBox, refID: billType, REGIONDD: refetchRegion }}
            />


            <FormWrapper
              key={`totaldetaisformst${formMode}}`}
              metaData={extractMetaData(TotaldetailsFormMetaData, formMode) as MetaDataType}
              displayMode={formMode}
              onSubmitHandler={() => { }}
              initialValues={{}}
              hideHeader={true}
              formStyle={{ background: "white", height: "auto" }}
              formState={{ MessageBox: MessageBox, FLAG: (rows)?.[0]?.data.PENDING_FLAG === "Confirmed" ? "Y" : "N" }}
            />

          </>
        ) : <Paper sx={{ display: "flex", justifyContent: "center" }}>
          <LoadingTextAnimation />
        </Paper>}
        <Dialog open={regionDialouge}  >
          <MasterDetailsForm
            key={"regionMasterMetaData" + formMode}
            metaData={regionMasterMetaData}
            initialData={{
              _isNewRow: true,
              regionGridData,
              DETAILS_DATA: regionGridData,
            }}
            onSubmitData={(resultValueObj) => {

              const { COMM_TYPE_CD, REGION_CD, REGION_NM } = resultValueObj.data;

              regionmutation.mutate({

                COMM_TYPE_CD, REGION_CD, REGION_NM,
                COMP_CD: authState?.companyID,
                BRANCH_CD: authState?.user?.branchCode,
                _isNewRow: true,

              },
              );
            }}
            formStyle={{ background: "white", height: "auto" }}
          >
            {({ isSubmitting, handleSubmit }) => {
              return (
                <>
                  <GradientButton
                    onClick={handleSubmit}
                    color={"primary"}
                    endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                  >
                    Ok
                  </GradientButton>
                  <GradientButton onClick={() => setregionDialouge(false)} color={"primary"}>
                    Close
                  </GradientButton>
                </>
              );
            }}
          </MasterDetailsForm>
        </Dialog>
        <Dialog
          open={jointDtl}
          fullWidth
          maxWidth="lg"
        >
          <JointDetails
            data={jointDtlData}
            loading={jointDetailMutation.isLoading}
            onClose={async (result) => {
              setjointDtl(result);
            }}
          />

        </Dialog>
        <Dialog
          open={OpenSignature}
          PaperProps={{
            style: {
              height: "50%",
              width: "50%",
              overflow: "auto",
            },
          }}
          maxWidth="lg"
        >
          <ImageViewer
            blob={signBlob}
            fileName=" Payslip Issue Entry"
            onClose={() => {
              setOpenSignature(false);
              setFormMode(formMode);
            }}
          />

        </Dialog>

      </Dialog>


      <DeleteDialog
        closeDialog={closeDialog}
        open={openDltDialogue}
        rowData={{
          ...(rows?.[0]?.data || {}),
          draftDtlData: draftDtlData,
          acctDtlData: acctDtlData
        }}
        slipdataRefetch={slipdataRefetch}
      />
    </>
  );
};



export const PaySlipIssueEntryData = ({ defaultView, closeDialog, slipdataRefetch }) => {
  return (
    <ClearCacheProvider>
      <PayslipIsuueEntryform
        defaultView={defaultView}
        closeDialog={closeDialog}
        slipdataRefetch={slipdataRefetch}
      />
    </ClearCacheProvider>
  );
};