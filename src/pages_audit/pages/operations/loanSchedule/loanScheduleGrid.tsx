import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
  LoanScheduleDetailsGridMetadata,
  LoanScheduleGridMetaData,
} from "./gridMetadata";
import { LoanRegenerateFormWrapper } from "./form/loanRegenerate";
import { LoanRescheduleFormWrapper } from "./form/loanReschedule";
import { AuthContext } from "pages_audit/auth";
import { useMutation, useQuery } from "react-query";
import * as API from "./api";
import { t } from "i18next";
import { RetrievalFormWrapper } from "./form/retrieveForm";
import {
  Alert,
  queryClient,
  GridWrapper,
  extractGridMetaData,
  ActionTypes,
  GridMetaDataType,
} from "@acuteinfo/common-base";
import { LoanReviseFormWrapper } from "./form/loanReviseForm";

export const LoanScheduleGrid = () => {
  const isDataChangedRef = useRef(false);
  const retrievalParaRef = useRef<any>(null);
  const headerDataRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const [editOpen, setEditOpen] = useState(false);
  const [srCd, setSrCd] = useState<any>(null);
  const [headerGridData, setHeaderGridData] = useState<any>([]);
  const [detailsGridData, setDetailsGridData] = useState<any>([]);
  const [reviseData, setReviseData] = useState<any>(null);
  const [previousRowData, setPreviousRowData] = useState<any>(null);
  const [selectedRowData, setSelectedRowData] = useState<any>(null);
  const navigate = useNavigate();
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
    } else if (retrievalParaRef.current?.ALLOW_REGERATE === "N") {
      setActions([
        {
          actionName: "retrieve",
          actionLabel: "Retrieve",
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
    } else if (retrievalParaRef.current?.ALLOW_RESCHEDULE === "N") {
      setActions([
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
      ]);
    } else {
      setActions([
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

  const { data, isLoading, isError, error, isFetching, refetch } = useQuery<
    any,
    any
  >(
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
        navigate(data?.name, {
          state: [],
        });
        setHeaderGridData([]);
        setDetailsGridData([]);
        setSrCd(null);
        headerDataRef.current = null;
        LoanScheduleGridMetaData.gridConfig.gridLabel = "";
      } else if (data?.name === "regenerate") {
        navigate(data?.name, {
          state: headerDataRef.current,
        });
      } else if (data?.name === "reschedule") {
        navigate(data?.name, {
          state: data?.rows?.[0]?.original,
        });
      } else if (data?.name === "_rowChanged") {
        setSelectedRowData(data?.rows?.[0]);
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
    navigate("retrieve");
  }, []);

  const selectedDatas = (dataObj) => {
    navigate(".");
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

  const handleRetrieveFormClose = () => {
    navigate(".");
  };

  const handleDialogClose = useCallback(() => {
    LoanScheduleGridMetaData.gridConfig.hideHeader = false;
    LoanScheduleGridMetaData.gridConfig.containerHeight = {
      min: "28vh",
      max: "28vh",
    };
    LoanScheduleDetailsGridMetadata.gridConfig.containerHeight = {
      min: "45vh",
      max: "45vh",
    };
    LoanScheduleDetailsGridMetadata.columns[8].isVisible = true;
    navigate(".");
  }, [navigate]);

  const handleFormClose = useCallback(() => {
    navigate(".");
    if (isDataChangedRef.current === true) {
      navigate("retrieve");
      setHeaderGridData([]);
      setDetailsGridData([]);
      setSrCd(null);
      headerDataRef.current = null;
      isDataChangedRef.current = false;
    }
  }, [navigate]);

  const handleEditClose = () => {
    setEditOpen(false);
    if (isDataChangedRef.current === true) {
      refetch();
      isDataChangedRef.current = false;
    }
  };

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
        key={`loanScheduleGrid` + headerGridData.length + actions}
        finalMetaData={LoanScheduleGridMetaData as GridMetaDataType}
        data={headerGridData}
        setData={setHeaderGridData}
        loading={loanScheduleHeaderData?.isLoading}
        actions={actions}
        setAction={setCurrentAction}
        // Temporary commented
        // disableMultipleRowSelect={formMode === "edit" ? true : false}
        defaultSelectedRowId={
          headerGridData?.length > 0 ? headerGridData?.[0]?.SR_CD : ""
        }
        // hideActionBar={true}
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
        key={`LoanScheduleDetails` + data}
        finalMetaData={LoanScheduleDetailsGridMetadata as GridMetaDataType}
        data={detailsGridData}
        setData={setDetailsGridData}
        loading={isLoading || isFetching}
        onClickActionEvent={async (index, id, data) => {
          if (id === "EDIT_BTN") {
            setReviseData({
              ...data,
              TOTAL_RECORDS: String(detailsGridData.length),
            });
            setEditOpen(true);
            if (index > 0 && Boolean(data.SR_CD)) {
              const previousRowData = detailsGridData[index - 1];
              setPreviousRowData(previousRowData);
            }
          }
        }}
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
        <Route
          path="retrieve/*"
          element={
            <RetrievalFormWrapper
              closeDialog={handleRetrieveFormClose}
              retrievalParaValues={selectedDatas}
            />
          }
        />
      </Routes>

      {editOpen && (
        <LoanReviseFormWrapper
          isDataChangedRef={isDataChangedRef}
          closeDialog={handleEditClose}
          reviseData={reviseData}
          previousRowData={previousRowData}
          selectedRowData={selectedRowData}
        />
      )}
    </>
  );
};
