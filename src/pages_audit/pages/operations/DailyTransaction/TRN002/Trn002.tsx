//UI
import { Button, Card, Grid, Typography } from "@mui/material";

import "./Trn002.css";

//logic
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useContext,
} from "react";
import { useLocation } from "react-router-dom";
import { useMutation } from "react-query";
import { useSnackbar } from "notistack";
import { format } from "date-fns";

import { TRN002_TableMetaData } from "./gridMetadata";
import GridWrapper from "components/dataTableStatic";
import { ActionTypes, GridMetaDataType } from "components/dataTable/types";
import * as trn2Api from "./api";
import * as CommonApi from "../TRNCommon/api";
import { AuthContext } from "pages_audit/auth";
import { AccDetailContext } from "pages_audit/auth";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import DailyTransTabs from "../TRNHeaderTabs";
import CommonFooter from "../TRNCommon/CommonFooter";
import { RemarksAPIWrapper } from "components/custom/Remarks";

const actions: ActionTypes[] = [
  {
    actionName: "view-detail",
    actionLabel: "",
    multiple: false,
    rowDoubleClick: true,
    // alwaysAvailable: true,
  },
  {
    actionName: "Delete",
    actionLabel: "Remove",
    multiple: false,
    rowDoubleClick: true,
  },
  {
    actionName: "view",
    actionLabel: "Confirm",
    actionIcon: "detail",
    multiple: false,
    rowDoubleClick: true,
  },
];

export const Trn002 = () => {
  const location = useLocation();

  const { authState } = useContext(AuthContext);
  const { tempStore, setTempStore } = useContext<any>(AccDetailContext);
  const { cardStore, setCardStore } = useContext<any>(AccDetailContext);
  const myGridRef = useRef<any>(null);

  const [rows, setRows] = useState<any>([]);
  const [rows2, setRows2] = useState<any>([]);
  const [refRows, setRefRows] = useState<any>([]);
  const [filteredRows, setFilteredRows] = useState<any>([]);

  const [tabsData, setTabsData] = useState<any>([]);
  const [dataRow, setDataRow] = useState<any>({});
  const [credit, setCredit] = useState<number>(0);
  const [debit, setDebit] = useState<number>(0);
  const [confirmed, setConfirmed] = useState<number>(0);
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
  const [confirmDialog, setConfirmDialog] = useState<boolean>(false);
  const [remarks, setRemarks] = useState<any>("");
  const [cardsData, setCardsData] = useState([]);
  const [reqData, setReqData] = useState([]);

  const { enqueueSnackbar } = useSnackbar();
  let dataObj = {
    COMP_CD: authState?.companyID,
    BRANCH_CD: authState?.user?.branchCode,
  };

  const subjectOptions = [
    { value: "science", label: "science" },
    { value: "maths", label: "maths" },
  ];

  const formMetaData: any = [
    {
      value: "",
      label: "Name",
      type: "text",
      component: "textField",
    },
    {
      value: "0",
      label: "Age",
      type: "Number",
      component: "textField",
    },
    {
      value: "",
      label: "subjects",
      type: "text",
      component: "autoComplete",
      options: subjectOptions,
    },
    {
      value: "",
      label: "X",
      type: "",
      component: "clearBtn",
    },
  ];

  const handleFormSave = (obj) => {
    console.log(obj, "objjjj save");
  };

  useEffect(() => {
    handleSetRemarks();
  }, [location]);

  const handleSetRemarks = () => {
    let msg = "WRONG ENTRY FROM DAILY TRAN";
    if (location.pathname.includes("/cnf_daily_tran_F2")) {
      setRemarks(msg + " CONFIRMATION (F2) (TRN/002)");
    } else {
      setRemarks(msg + " MAKER (TRN/001)");
    }
  };
  const handleFilterByScroll = (txt) => {
    let arr = refRows?.filter((a) => a?.CONFIRMED == "0");
    let result = refRows?.filter(
      (item) => item?.SCROLL1 != "" && item?.SCROLL1 === txt
    );
    if (result?.length > 0) {
      console.log("case1");
      setRows2(result);
      handleUpdateSum(result);
    } else if (!txt) {
      console.log("case2");
      result = [];
      setRows2(arr);
      handleUpdateSum(arr);
    } else {
      console.log("case3");
      result = [];
      setRows2([]);
      handleUpdateSum(result);
    }

    setFilteredRows(result);
  };

  useEffect(() => {
    handleGetTRN002List();
    setTabsData([]);
  }, []);

  // api define ========================================================================
  const getTRN002List = useMutation(trn2Api.getTRN002List, {
    onSuccess: (data) => {
      console.log(data, "dataaa getTRN002List");
      setRefRows(data);
      //data.sort((a, b) => new Date(a.ENTERED_DATE) - new Date(b.ENTERED_DATE));
      let arr = data?.filter((a) => a.CONFIRMED == "0");
      arr.map((a, i) => (a.index = i));
      setRows2(arr);
      setRows(data);
      setTempStore({ ...tempStore, accInfo: arr[0] });
      setReqData(arr[0]);
      console.log(arr, "Arr getTRN002List");
      arr?.length > 0
        ? getCarousalCards.mutate({ reqData: arr[0] })
        : setCardStore({ ...cardStore, cardsInfo: [] });

      arr[0] && getTabsByParentType.mutate({ reqData: arr[0] ?? "" });
      handleUpdateSum(arr);
      setConfirmed(data.length - arr?.length);
    },
    onError: (error) => {},
  });

  const getCarousalCards = useMutation(CommonApi.getCarousalCards, {
    onSuccess: (data) => {
      setCardStore({ ...cardStore, cardsInfo: data });
      setCardsData(data);
    },
    onError: (error) => {
      setCardStore({ ...cardStore, cardsInfo: [] });
    },
  });

  const confirmScroll = useMutation(trn2Api.confirmScroll, {
    onSuccess: (data) => {
      setConfirmDialog(false);
      enqueueSnackbar("Record Confirm", {
        variant: "success",
      });
      handleGetTRN002List();
    },
    onError: (error: any) => {
      setConfirmDialog(false);
      enqueueSnackbar(error?.error_msg, {
        variant: "error",
      });
    },
  });
  const deleteScrollByVoucher = useMutation(CommonApi.deleteScrollByVoucherNo, {
    onSuccess: (data) => {
      setDeleteDialog(false);
      enqueueSnackbar("Transaction Deleted", {
        variant: "success",
      });
      handleGetTRN002List();
    },
    onError: (error: any) => {
      setDeleteDialog(false);
      enqueueSnackbar(error?.error_msg, {
        variant: "error",
      });
    },
  });
  const getTabsByParentType = useMutation(CommonApi.getTabsByParentType, {
    onSuccess: (data) => {
      setTabsData(data);
    },
    onError: (error: any) => {
      enqueueSnackbar(error?.error_msg, {
        variant: "error",
      });
    },
  });
  // function define  ======================================================================

  const setCurrentAction = useCallback((data) => {
    let row = data.rows[0]?.data;
    setDataRow(row);
    if (data.name === "view-detail") {
      let obj: any = {
        COMP_CD: row?.COMP_CD,
        ACCT_TYPE: row?.ACCT_TYPE,
        ACCT_CD: row?.ACCT_CD,
        PARENT_TYPE: row?.PARENT_TYPE ?? "",

        BRANCH_CD: row?.BRANCH_CD,
        authState: authState,
      };
      setTempStore({ ...tempStore, accInfo: obj });
      setReqData(obj);
      getCarousalCards.mutate({ reqData: obj });
      let reqData = {
        COMP_CD: obj?.COMP_CD,
        ACCT_TYPE: obj?.ACCT_TYPE,
        BRANCH_CD: obj?.BRANCH_CD,
      };
      getTabsByParentType.mutate({ reqData });
    }

    if (data.name === "view") {
      if (row.CONFIRMED == "0") {
        setConfirmDialog(true);
      } else {
        enqueueSnackbar("Transaction Already Confirmed", {
          variant: "error",
        });
      }
    }

    if (data.name === "Delete") {
      setDeleteDialog(true);
    }
  }, []);

  const handleGetTRN002List = () => {
    getTRN002List.mutate(dataObj);
  };

  const handleViewAll = () => {
    let arr = [...rows];
    console.log(arr, "arr");
    setRows2(arr);
    handleUpdateSum(arr);
  };

  const handleUpdateSum = (arr) => {
    let crSum = 0;
    let drSum = 0;
    arr?.map((a) => {
      if (
        a.TYPE_CD.includes("1") ||
        a.TYPE_CD.includes("2") ||
        a.TYPE_CD.includes("3")
      ) {
        crSum = crSum + Number(a?.AMOUNT);
      }
      if (
        a.TYPE_CD.includes("4") ||
        a.TYPE_CD.includes("5") ||
        a.TYPE_CD.includes("6")
      ) {
        drSum = drSum + Number(a?.AMOUNT);
      }
    });
    setCredit(crSum);
    setDebit(drSum);
  };

  const handleDeleteByVoucher = (input) => {
    let obj = {
      TRAN_CD: dataRow?.TRAN_CD,
      ENTERED_COMP_CD: dataRow?.COMP_CD,
      ENTERED_BRANCH_CD: dataRow?.BRANCH_CD,

      COMP_CD: dataRow?.COMP_CD,
      BRANCH_CD: dataRow?.BRANCH_CD,
      ACCT_TYPE: dataRow?.ACCT_TYPE,
      ACCT_CD: dataRow?.ACCT_CD,
      TRAN_AMOUNT: dataRow?.AMOUNT,
      ACTIVITY_TYPE: "DAILY TRANSACTION",
      TRAN_DT: dataRow?.TRAN_DT,
      CONFIRM_FLAG: "N",
      CONFIRMED: "N",
      USER_DEF_REMARKS: input,
    };
    input.length > 5
      ? deleteScrollByVoucher.mutate(obj)
      : enqueueSnackbar("Kindly Enter Remarks of at least 5 Characters", {
          variant: "error",
        });
  };

  const handleConfirm = () => {
    confirmScroll.mutate(dataRow);
  };
  console.log(rows2, "rows2");
  return (
    <>
      <DailyTransTabs
        heading=" Daily Transaction Confirmation (F2) (TRN/002)"
        tabsData={tabsData}
        cardsData={cardsData}
        reqData={reqData}
      />
      <Card
        sx={{
          boxShadow: "0px 1px 4px -1px #999999",
          borderRadius: "5px",
          padding: "8px",
          margin: "4px",
        }}
      >
        <GridWrapper
          key={`TRN002_TableMetaData`}
          finalMetaData={TRN002_TableMetaData as GridMetaDataType}
          data={rows2}
          setData={() => null}
          loading={getTRN002List.isLoading || getCarousalCards.isLoading}
          ref={myGridRef}
          refetchData={() => handleGetTRN002List()}
          actions={actions}
          setAction={setCurrentAction}
          onlySingleSelectionAllow={true}
          isNewRowStyle={true}
          defaultSelectedRowId={0}
          // headerToolbarStyle={{
          //   background: "var(--theme-color2)",
          //   color: "black",
          //   padding: "0",
          // }}
        />
        <Grid
          item
          xs={12}
          sm={12}
          sx={{
            height: "23px",
            // width: "60%",
            right: "30px",
            float: "right",
            position: "relative",
            top: "-2.67rem",
            display: "flex",
            gap: "4rem",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontWeight: "bold" }} variant="subtitle1">
            Confirmed Records : {confirmed}
          </Typography>
          <Typography
            sx={{ fontWeight: "bold" }}
            variant="subtitle1"
            // style={{ color: "green" }}
          >
            Credit : ₹ {credit}
          </Typography>
          <Typography
            sx={{ fontWeight: "bold" }}
            variant="subtitle1"
            // style={{ color: "tomato" }}
          >
            Debit : ₹ {debit}
          </Typography>
        </Grid>
      </Card>
      <CommonFooter
        viewOnly={true}
        filteredRows={filteredRows}
        handleFilterByScroll={handleFilterByScroll}
        handleViewAll={handleViewAll}
        handleRefresh={() => handleGetTRN002List()}
      />

      <>
        {Boolean(deleteDialog) ? (
          <RemarksAPIWrapper
            TitleText={
              "Do you want to Delete the transaction - VoucherNo." +
              dataRow?.TRAN_CD +
              " ?"
            }
            onActionYes={(input) => handleDeleteByVoucher(input)}
            onActionNo={() => setDeleteDialog(false)}
            isLoading={deleteScrollByVoucher.isLoading}
            isEntertoSubmit={true}
            AcceptbuttonLabelText="Ok"
            CanceltbuttonLabelText="Cancel"
            open={deleteDialog}
            rows={dataRow}
          />
        ) : null}

        {Boolean(confirmDialog) ? (
          <PopupMessageAPIWrapper
            MessageTitle="Transaction Confirmation"
            Message={
              "Do you wish to Confirm this Transaction - Voucher No. " +
              dataRow?.TRAN_CD +
              " ?"
            }
            onActionYes={() => handleConfirm()}
            onActionNo={() => setConfirmDialog(false)}
            rows={[]}
            open={confirmDialog}
            loading={confirmScroll.isLoading}
          />
        ) : null}
      </>
    </>
  );
};
