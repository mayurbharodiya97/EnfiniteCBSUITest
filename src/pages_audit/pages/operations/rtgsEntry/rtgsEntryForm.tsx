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
  IFSCBankDetailGridMetaData,
  RtgsEntryFormMetaData,
  SlipJoinDetailGridMetaData,
  rtgsAccountDetailFormMetaData,
} from "./metaData";
import * as API from "./api";
import { useMutation } from "react-query";
import { AuthContext } from "pages_audit/auth";
import {
  AppBar,
  Box,
  Grid,
  Stack,
  Step,
  StepIconProps,
  StepLabel,
  Stepper,
  Toolbar,
  Typography,
  IconButton,
  Collapse,
  Dialog,
} from "@mui/material";
import { SubmitFnType } from "packages/form";
import { ActionTypes } from "components/dataTable";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
// import { AddNewBankMasterForm } from "./addNewBank";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { useSnackbar } from "notistack";
// import { RetrieveClearingForm } from "./retrieveClearing";
import { usePopupContext } from "components/custom/popupContext";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import {
  ColorlibStepIconRoot,
  ColorlibConnector,
} from "../../../../components/dyanmicForm/stepperForm/style";
const actions: ActionTypes[] = [
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
  const myFormRef: any = useRef(null);
  const myChequeFormRef: any = useRef(null);
  const slipFormDataRef: any = useRef(null);

  const [beneficiaryDtlData, setBeneficiaryDtlData] = useState<any>({
    beneficiaryAcDetails: [{ AMOUNT: "", REMARKS: "" }],
    SLIP_AMOUNT: "0",
  });
  const [state, setState] = useState<any>({
    formMode: "new",
    isJointDtlExpand: false,
    gridData: [],
    beneficiaryDtlRefresh: 0,
    activeStep: 0,
    ifscGrid: false,
    isIfscCode: [],
  });
  const {
    formMode,
    isJointDtlExpand,
    gridData,
    beneficiaryDtlRefresh,
    activeStep,
    ifscGrid,
    isIfscCode,
  } = state;
  const steps = [
    "New RTGS Entry(Ordering A/C Details)",
    "Beneficiary A/C Detail",
  ];

  const setCurrentAction = useCallback(async (data) => {
    if (data.name === "close") {
      setState((old) => ({
        ...old,
        ifscGrid: false,
      }));
    }
  }, []);
  const getIfscBankGridData: any = useMutation(API.getIfscBankGridData, {
    onError: (error: any) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
    },

    onSuccess: (data) => {},
  });
  useEffect(() => {
    const handleKeyDown = async (event) => {
      if (event.ctrlKey && (event?.key === "J" || event?.key === "j")) {
        event.preventDefault();
        setState((old) => ({
          ...old,
          isJointDtlExpand: true,
        }));
      } else if (event && event?.key === "Escape") {
        setState((old) => ({
          ...old,
          isJointDtlExpand: false,
        }));
      }
    };
    document.addEventListener("keydown", handleKeyDown);
  }, [formMode]);

  function ColorlibStepIcon(props: StepIconProps) {
    const { active, completed, className } = props;
    // const fdType = fdState?.fdParaFormData?.FD_TYPE;
    // Object mapping step numbers to corresponding icons
    const icons: { [index: string]: React.ReactElement } = {
      1: <SettingsIcon />,
      2: <GroupAddIcon />,
    };

    return (
      <ColorlibStepIconRoot
        ownerState={{ completed, active }}
        className={className}
      >
        {icons[String(props.icon)]}
      </ColorlibStepIconRoot>
    );
  }

  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    action
  ) => {
    //@ts-ignore
    endSubmit(true);
    let newData = [];
    if (
      Boolean(data?.beneficiaryAcDetails) &&
      Array.isArray(data?.beneficiaryAcDetails)
    ) {
      newData = data?.beneficiaryAcDetails?.map((item) => ({
        ...item,
        _isNewRow: formMode === "new" ? true : false,
        BRANCH_CD: slipFormDataRef?.current?.BRANCH_CD,
        PROCESSED: "N",
        // REASON: zoneTranType === "S" ? "N" : item?.REASON,
        CLEARING_STATUS: "C",
      }));
    }

    if (
      !Boolean(data?.SLIP_AMOUNT) ||
      parseFloat(data?.SLIP_AMOUNT ?? 0) <= 0
    ) {
      MessageBox({
        messageTitle: "Validation Failed",
        message: "Please Enter RTGS/NEFT Ordering Amount",
      });
    } else if (
      parseFloat(data?.TOTAL_AMOUNT) === 0 &&
      newData &&
      newData.length > 0
    ) {
      // finalReqDataRef.current = {
      //   DAILY_CLEARING: {
      //     ...slipFormDataRef?.current,
      //     _isNewRow: true,
      //     REQUEST_CD: "",
      //     TRAN_TYPE: zoneTranType,
      //   },
      //   DETAILS_DATA: {
      //     isNewRow: [...newData],
      //     isUpdatedRow: [],
      //     isDeleteRow: [],
      //   },
      //   ...slipFormDataRef?.current,
      //   PROCESSED: "N",
      //   SKIP_ENTRY: "N",
      //   _isNewRow: true,
      //   endSubmit,
      // };
      endSubmit(true);
      const buttonName = await MessageBox({
        messageTitle: "Confirmation",
        message: " Proceed ?",
        buttonNames: ["No", "Yes"],
        loadingBtnName: ["Yes"],
      });
      if (buttonName === "Yes") {
        // mutationOutward.mutate(finalReqDataRef.current);
      }
    } else if (
      parseFloat(data?.TOTAL_AMOUNT) > 0 &&
      Array.isArray(beneficiaryDtlData?.beneficiaryAcDetails) &&
      beneficiaryDtlData?.beneficiaryAcDetails?.length > 0 &&
      data?.beneficiaryAcDetails?.length > 0
    ) {
      setBeneficiaryDtlData((old) => ({
        ...old,
        beneficiaryAcDetails: [
          {
            ...old?.beneficiaryAcDetails,
          },
          ...data.beneficiaryAcDetails,
        ],
      }));
      myChequeFormRef?.current?.handleFormReset({ preventDefault: () => {} });
      setState((old) => ({
        ...old,
        beneficiaryDtlRefresh: old.beneficiaryDtlRefresh + 1,
      }));
    } else if (
      (parseFloat(data?.TOTAL_AMOUNT) > 0 || newData?.length,
      newData.length === 0)
    ) {
      console.log(
        "if 4",
        data?.TOTAL_AMOUNT,
        beneficiaryDtlData?.beneficiaryAcDetails
      );
      setBeneficiaryDtlData((old) => ({
        ...old,
        beneficiaryAcDetails: [
          {
            ...old?.beneficiaryAcDetails,
            SLIP_AMOUNT: data?.SLIP_AMOUNT,
          },
        ],
      }));

      setState((old) => ({
        ...old,
        beneficiaryDtlRefresh: old.beneficiaryDtlRefresh + 1,
      }));
    } else if (parseFloat(data?.TOTAL_AMOUNT) < 0) {
      MessageBox({
        messageTitle: "Validation Failed",
        message:
          "Total Beneficiary Amount can't be greater than total ordering RTGS/NEFT Amount",
      });
    }
  };
  return (
    <Fragment>
      <AppBar position="relative" style={{ marginBottom: "5px" }}>
        <Toolbar
          variant="dense"
          style={{ background: "var(--theme-color5)", padding: "0px" }}
        >
          <Typography component="span" variant="h5" color="primary" px={2}>
            {"RTGS Entry(MST/552)"}
          </Typography>
        </Toolbar>
      </AppBar>
      <Stack sx={{ width: "100%" }} spacing={4}>
        <Stepper
          alternativeLabel
          activeStep={activeStep}
          connector={<ColorlibConnector />}
        >
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel
                StepIconComponent={ColorlibStepIcon}
                componentsProps={{
                  label: {
                    style: { marginTop: "2px", color: "var(--theme-color1)" },
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <div style={{ marginTop: "0px" }}>
          {/* {RenderStepForm(fdState.activeStep)} */}

          {activeStep === 0 ? (
            <>
              <FormWrapper
                key={"RtgsEntry" + formMode}
                metaData={
                  extractMetaData(
                    RtgsEntryFormMetaData,
                    formMode
                  ) as MetaDataType
                }
                initialValues={
                  formMode === "new"
                    ? {
                        ...slipFormDataRef.current,
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

                  setState((old) => ({
                    ...old,
                    activeStep: old.activeStep + 1,
                  }));

                  // setBeneficiaryDtlData(
                  //   (old) => (
                  //     {
                  //       ...old,
                  //       SLIP_AMOUNT: data?.TOTAL,
                  //     }
                  //   )
                  // );
                  setBeneficiaryDtlData((old) => ({
                    beneficiaryAcDetails: [{ AMOUNT: "", REMARKS: "" }],
                    SLIP_AMOUNT: data?.TOTAL,
                  }));

                  setState((old) => ({
                    ...old,
                    beneficiaryDtlRefresh: old.beneficiaryDtlRefresh + 1,
                  }));
                  // if (rtgsAccountDetailFormMetaData.fields[5]?._fields?.[0]) {
                  //   rtgsAccountDetailFormMetaData.fields[5]._fields[0].isFieldFocused ??=
                  //     true;
                  // }
                }}
                setDataOnFieldChange={(action, payload) => {
                  if (action === "JOINT_DETAIL") {
                    setState((old) => ({
                      ...old,
                      gridData: payload,
                    }));
                  }
                }}
                //@ts-ignore
                displayMode={formMode}
                formStyle={{
                  background: "white",
                  width: "100%",
                  padding: "05px",
                  // height: "19.2em",
                  // overflow: "auto",
                }}
                formState={{
                  MessageBox: MessageBox,
                }}
                ref={myFormRef}
                hideHeader={true}
              ></FormWrapper>
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
                    sx={{
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
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
                    <IconButton
                      onClick={() => {
                        setState((old) => ({
                          ...old,
                          isJointDtlExpand: !old.isJointDtlExpand,
                        }));
                      }}
                    >
                      {!isJointDtlExpand ? (
                        <ExpandMoreIcon />
                      ) : (
                        <ExpandLessIcon />
                      )}
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
            </>
          ) : activeStep === 1 ? (
            <>
              <div
                onKeyDown={(e) => {
                  let target: any = e?.target;
                  const charAtIndex = target.name
                    ?.split("")
                    .find((char, index) => {
                      return index === 48;
                    });
                  if (e?.key === "Enter" || e?.key === "Tab") {
                    // beneficiaryDtlFormMetaData/beneficiaryAcDetails[0].AMOUNT
                    let metaData;
                    metaData = rtgsAccountDetailFormMetaData;
                    if (
                      (target?.name ?? "") ===
                      metaData.form.name +
                        "/" +
                        metaData.fields[5].name +
                        `[${charAtIndex}]` +
                        ".AMOUNT"
                    ) {
                      let event: any = { preventDefault: () => {} };
                      myChequeFormRef?.current?.handleSubmit(event, "FINAL");
                    }
                  }
                }}
              >
                <FormWrapper
                  key={`ChequeDetails` + formMode + beneficiaryDtlRefresh}
                  metaData={
                    extractMetaData(
                      rtgsAccountDetailFormMetaData,
                      formMode
                    ) as MetaDataType
                  }
                  displayMode={formMode}
                  onSubmitHandler={onSubmitHandler}
                  initialValues={
                    formMode === "new"
                      ? {
                          ...beneficiaryDtlData,
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
                    } else if (action === "IFSC_CD") {
                      setState((old) => ({
                        ...old,
                        isIfscCode: paylod,
                      }));
                    }
                  }}
                  onFormButtonClickHandel={(id) => {
                    if (id === "ADDNEWROW") {
                      let event: any = { preventDefault: () => {} };
                      myChequeFormRef?.current?.handleSubmit(event, "FINAL");
                    } else {
                      setState((old) => ({
                        ...old,
                        ifscGrid: isIfscCode.length > 0 ? true : old.ifscGrid,
                      }));
                      getIfscBankGridData.mutate({
                        COMP_CD: authState?.companyID ?? "",
                        BRANCH_CD: authState?.user?.branchCode ?? "",
                        IFSC_CODE: isIfscCode ?? "",
                      });
                    }
                  }}
                  ref={myChequeFormRef}
                  formState={{
                    MessageBox: MessageBox,
                    rtgsAcData: slipFormDataRef.current,
                  }}
                />
              </div>
            </>
          ) : null}
        </div>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            pt: 2,
            marginTop: "0px !important",
            position: "relative",
          }}
        >
          {/* <Box sx={{ flex: "1 1 auto" }} /> */}
          <div style={{ position: "fixed", bottom: 0, right: "10px" }}>
            {activeStep === 0 ? null : (
              <GradientButton
                tabindex={-1}
                onClick={() => {
                  // setIsBackButton(true);
                  setState((old) => ({
                    ...old,
                    activeStep: old.activeStep - 1,
                  }));
                }}
              >
                Back
              </GradientButton>
            )}
            {
              activeStep !== steps.length && (
                <>
                  {activeStep !== steps.length - 1 ? (
                    <GradientButton
                      onClick={(event) => {
                        myFormRef?.current?.handleSubmit(event, "CHEQUEDTL");
                      }}
                    >
                      Next
                    </GradientButton>
                  ) : null}
                </>
              )
              // ))
            }
          </div>
        </Box>
      </Stack>
      <>
        {ifscGrid ? (
          <Dialog
            open={true}
            // onClose={() => }
            PaperProps={{
              style: {
                width: "100%",
              },
            }}
            maxWidth="lg"
          >
            <GridWrapper
              key={"IFSCBankDetailGridMetaData"}
              finalMetaData={IFSCBankDetailGridMetaData}
              data={getIfscBankGridData?.data ?? []}
              setData={() => null}
              actions={actions}
              setAction={setCurrentAction}
              loading={getIfscBankGridData?.isLoading}
            />
          </Dialog>
        ) : null}
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
