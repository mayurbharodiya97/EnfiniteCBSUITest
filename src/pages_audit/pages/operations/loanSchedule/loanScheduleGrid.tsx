import { useCallback, useContext, useEffect, useRef, useState } from "react";
import GridWrapper from "components/dataTableStatic";
import { ActionTypes, GridMetaDataType } from "components/dataTable/types";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
  LoanScheduleBalanceGridMetadata,
  LoanScheduleGridMetaData,
} from "./gridMetadata";
import { LoanRegenerateFormWrapper } from "./form/loanRegenerate";
import { LoanRescheduleFormWrapper } from "./form/loanReschedule";
import { AuthContext } from "pages_audit/auth";
import { useMutation, useQuery } from "react-query";
import * as API from "./api";
import { t } from "i18next";
import { enqueueSnackbar } from "notistack";
import { RetrievalFormWrapper } from "./form/retrieveForm";
import { headerDataRetrive } from "../payslip-issue-entry/api";
import { extractGridMetaData } from "components/utils";
import { queryClient } from "cache";
import { Alert } from "components/common/alert";

export const LoanScheduleGrid = () => {
  const isDataChangedRef = useRef(false);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const retrievalParaRef = useRef<any>(null);
  const location = useLocation();
  const initialRender = useRef(true);
  const { authState } = useContext(AuthContext);
  const [srCd, setSrCd] = useState<any>(null);
  const [headerGridData, setHeaderGridData] = useState<any>([]);
  const [detailsGridData, setDetailsGridData] = useState<any>([]);
  const headerDataRef = useRef<any>(null);
  const [formMode, setFormMode] = useState("view");
  const [actions, setActions] = useState<ActionTypes[]>([
    {
      actionName: "retrieve",
      actionLabel: "Retrieve",
      multiple: undefined,
      rowDoubleClick: false,
      alwaysAvailable: true,
    },
  ]);

  useEffect(() => {
    if (Boolean(headerGridData) && headerGridData.length === 0) {
      setActions([
        {
          actionName: "retrieve",
          actionLabel: "Retrieve",
          multiple: undefined,
          rowDoubleClick: false,
          alwaysAvailable: true,
        },
      ]);
    } else {
      setActions([
        {
          actionName: "edit",
          actionLabel: "Edit",
          multiple: undefined,
          rowDoubleClick: false,
          alwaysAvailable: true,
        },
        {
          actionName: "save",
          actionLabel: "Save",
          multiple: undefined,
          rowDoubleClick: false,
          alwaysAvailable: true,
        },
        {
          actionName: "retrieve",
          actionLabel: "Retrieve",
          multiple: undefined,
          rowDoubleClick: false,
          alwaysAvailable: true,
        },
        {
          actionName: "regenerate",
          actionLabel: "Regenerate",
          multiple: undefined,
          rowDoubleClick: false,
          alwaysAvailable: true,
        },
        {
          actionName: "reschedule",
          actionLabel: "Reschedule",
          multiple: undefined,
          rowDoubleClick: false,
          alwaysAvailable: true,
        },
      ]);
    }

    if (Boolean(headerGridData) && headerGridData.length > 0) {
      const branchCode = headerGridData[0]?.BRANCH_CD?.trim() ?? "";
      const accountType = headerGridData[0]?.ACCT_TYPE?.trim() ?? "";
      const accountNo = headerGridData[0]?.ACCT_CD?.trim() ?? "";
      const companyCode = headerGridData[0]?.COMP_CD?.trim() ?? "";
      const accountName = headerGridData[0]?.ACCT_NM ?? "";
      LoanScheduleGridMetaData.gridConfig.gridLabel = `Loan Schedule of A/c No.:\u00A0${companyCode}-${branchCode}-${accountType}-${accountNo}\u00A0\u00A0 Name: ${accountName}`;
    }
    return () => {
      LoanScheduleGridMetaData.gridConfig.gridLabel = "";
    };
  }, [headerGridData, headerGridData.length]);

  const loanScheduleHeaderData = useMutation(API.getLoanScheduleHeaderData, {
    onSuccess: (data) => {
      setSrCd(data?.[0]?.SR_CD);
      const updateData = data.map((item) => ({
        ...item,
        DISBURSEMENT_AMT: Number(item?.DISBURSEMENT_AMT ?? 0).toFixed(2),
        INST_RS: Number(item?.INST_RS ?? 0).toFixed(2),
      }));
      setHeaderGridData(updateData);
      headerDataRef.current = data;
    },
    onError: (error: any) => {},
  });

  const { data, isLoading, isError, error, isFetching } = useQuery<any, any>(
    ["getLoanScheduleDetails", authState?.user?.branchCode, srCd],
    () =>
      API.getLoanScheduleDetails({
        BRANCH_CD: authState?.user?.branchCode ?? "",
        COMP_CD: authState?.companyID ?? "",
        ACCT_TYPE: retrievalParaRef.current?.ACCT_TYPE ?? "",
        ACCT_CD: retrievalParaRef.current?.ACCT_CD ?? "",
        TRAN_CD: srCd ?? "",
        GD_DATE: authState?.workingDate ?? "",
        USER_LEVEL: authState?.role ?? "",
      }),
    {
      enabled: Boolean(srCd),
      onSuccess(data) {
        if (Array.isArray(data) && data.length > 0) {
          const updatedData = data.map((item) => ({
            ...item,
            BEGIN_BAL: Number(item?.BEGIN_BAL ?? 0).toFixed(2),
            INT_RATE: Number(item?.INT_RATE ?? 0).toFixed(2),
            INST_RS: Number(item?.INST_RS ?? 0).toFixed(2),
            PRIN_DEMAND_AMT: Number(item?.PRIN_DEMAND_AMT ?? 0).toFixed(2),
            INT_DEMAND_AMT: Number(item?.INT_DEMAND_AMT ?? 0).toFixed(2),
            END_BAL: Number(item?.END_BAL ?? 0).toFixed(2),
          }));
          setDetailsGridData(updatedData);
        } else {
          setDetailsGridData([]);
        }
      },
    }
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries([
        "getLoanScheduleDetails",
        authState?.user?.branchCode,
        srCd,
      ]);
    };
  }, []);

  const setCurrentAction = useCallback(
    async (data) => {
      if (data?.name === "retrieve") {
        setOpen(true);
        setHeaderGridData([]);
        setDetailsGridData([]);
        setFormMode("view");
        setSrCd(null);
        headerDataRef.current = null;
        LoanScheduleGridMetaData.gridConfig.gridLabel = "";
      } else if (data?.name === "regenerate") {
        if (
          Boolean(headerDataRef.current) &&
          Array.isArray(headerDataRef.current) &&
          headerDataRef.current?.[0]?.ALLOW_REGERATE === "Y"
        ) {
          navigate(data?.name, {
            state: headerDataRef.current,
          });
        }
      } else if (data?.name === "reschedule") {
        if (
          Boolean(headerDataRef.current) &&
          Array.isArray(headerDataRef.current) &&
          headerDataRef.current?.[0]?.ALLOW_RESCHEDULE === "Y"
        ) {
          navigate(data?.name, {
            state: data?.rows?.[0]?.original,
          });
        }
      } else if (data?.name === "edit") {
        setActions((prevActions) =>
          prevActions.map((item) =>
            item.actionName === "edit"
              ? { ...item, actionName: "view", actionLabel: t("View") }
              : item
          )
        );
        setFormMode("edit");
      } else if (data?.name === "view") {
        setActions((prevActions) =>
          prevActions.map((item) =>
            item.actionName === "view"
              ? { ...item, actionName: "edit", actionLabel: t("Edit") }
              : item
          )
        );
        setFormMode("view");
      } else if (data?.name === "_rowChanged") {
        setSrCd(data?.rows?.[0]?.data?.SR_CD);
      } else {
        navigate(data?.name, {
          state: data?.rows,
        });
      }
    },
    [navigate]
  );

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      if (location.pathname === "/cbsenfinity/operation/loanschedule") {
        setOpen(true);
      }
    }
  }, [location.pathname, navigate]);

  const selectedDatas = (dataObj) => {
    setOpen(false);
    if (dataObj) retrievalParaRef.current = dataObj;
    const retrieveData: any = {
      COMP_CD: authState?.companyID ?? "",
      BRANCH_CD: retrievalParaRef.current?.BRANCH_CD ?? "",
      ACCT_TYPE: retrievalParaRef.current?.ACCT_TYPE ?? "",
      ACCT_CD: retrievalParaRef.current?.ACCT_CD ?? "",
      ENT_BRANCH_CD: authState?.user?.branchCode ?? "",
      ENT_COMP_CD: authState?.companyID ?? "",
      GD_DATE: authState?.workingDate ?? "",
    };
    loanScheduleHeaderData.mutate(retrieveData);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleDialogClose = useCallback(() => {
    LoanScheduleGridMetaData.gridConfig.hideHeader = false;
    LoanScheduleGridMetaData.gridConfig.containerHeight = {
      min: "25vh",
      max: "25vh",
    };
    navigate(".");
  }, [navigate]);

  const handleFormClose = useCallback(() => {
    navigate(".");
    if (isDataChangedRef.current === true) {
      // refetch();
      setOpen(true);
      setHeaderGridData([]);
      setDetailsGridData([]);
      setFormMode("view");
      setSrCd(null);
      headerDataRef.current = null;
      isDataChangedRef.current = false;
    }
  }, [navigate]);

  return (
    <>
      {loanScheduleHeaderData.isError && (
        <Alert
          severity="error"
          errorMsg={
            loanScheduleHeaderData?.error?.error_msg ??
            "Something went to wrong.."
          }
          errorDetail={loanScheduleHeaderData?.error?.error_detail}
          color="error"
        />
      )}
      <GridWrapper
        key={`loanScheduleGrid` + formMode + headerGridData.length + actions}
        finalMetaData={LoanScheduleGridMetaData as GridMetaDataType}
        data={headerGridData ?? []}
        setData={setHeaderGridData}
        loading={loanScheduleHeaderData?.isLoading}
        actions={actions}
        setAction={setCurrentAction}
        onlySingleSelectionAllow={formMode === "edit" ? true : false}
        defaultSelectedRowId={
          headerGridData?.length > 0 ? headerGridData?.[0]?.SR_CD : ""
        }
      />
      {isError && (
        <Alert
          severity="error"
          errorMsg={error?.error_msg ?? "Something went to wrong.."}
          errorDetail={error?.error_detail}
          color="error"
        />
      )}
      <GridWrapper
        key={`loanScheduleBalanceGrid` + formMode + data + detailsGridData}
        finalMetaData={
          extractGridMetaData(
            LoanScheduleBalanceGridMetadata,
            formMode
          ) as GridMetaDataType
        }
        data={detailsGridData ?? []}
        setData={setDetailsGridData}
        loading={isLoading || isFetching}
      />
      <Routes>
        <Route
          path="regenerate/*"
          element={
            <LoanRegenerateFormWrapper
              isDataChangedRef={isDataChangedRef}
              closeDialog={handleFormClose}
            />
          }
        />
        <Route
          path="reschedule/*"
          element={
            <LoanRescheduleFormWrapper
              isDataChangedRef={isDataChangedRef}
              closeDialog={handleDialogClose}
              handleFormClose={handleFormClose}
            />
          }
        />
      </Routes>

      {open && (
        <RetrievalFormWrapper
          closeDialog={handleClose}
          retrievalParaValues={selectedDatas}
        />
      )}
    </>
  );
};
