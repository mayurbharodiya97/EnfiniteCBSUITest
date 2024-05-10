import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation } from "react-query";
import { TRN001_TableMetaData } from "./gridMetadata";
import GridWrapper from "components/dataTableStatic";
import { ActionTypes, GridMetaDataType } from "components/dataTable/types";
import * as trn1Api from "../api";
import * as CommonApi from "../../TRNCommon/api";
import { useSnackbar } from "notistack";
import { Grid, Typography } from "@mui/material";

import { AuthContext } from "pages_audit/auth";
import { useContext } from "react";

import Scroll from "pages_audit/pages/dashboard/Today'sTransactionGrid/openScroll/scroll";
import { RemarksAPIWrapper } from "components/custom/Remarks";

import { useLocation } from "react-router-dom";

const actions: ActionTypes[] = [
  // {
  //   actionName: "view-detail",
  //   actionLabel: "",
  //   multiple: false,
  //   rowDoubleClick: true,
  // },
  {
    actionName: "Delete",
    actionLabel: "Remove",
    multiple: false,
    rowDoubleClick: false,
    // alwaysAvailable: true,
  },
];

export const TRN001_Table = ({
  handleGetHeaderTabs,
  searchScrollNo,
  handleFilteredRows,
  handleSetCards,
  handleSetAccInfo,
  isTabsLoading,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const myGridRef = useRef<any>(null);
  const location = useLocation();
  const { authState } = useContext(AuthContext);
  const controllerRef = useRef<AbortController>();
  // const { tempStore, setTempStore } = useContext(AccDetailContext);
  // const { cardStore, setCardStore } = useContext(AccDetailContext);

  const [rows, setRows] = useState<any>([]);
  const [rows2, setRows2] = useState<any>([]);
  const [credit, setCredit] = useState<number>(0);
  const [debit, setDebit] = useState<number>(0);
  const [remarks, setRemarks] = useState<any>("");
  const [dataRow, setDataRow] = useState<any>({});
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
  const [scrollDialog, setScrollDialog] = useState<boolean>(false);

  let objData = {
    USER_NAME: authState?.user?.id,
    COMP_CD: authState?.companyID,
    BRANCH_CD: authState?.user?.branchCode,
  };
  useEffect(() => {
    handleSetRemarks();
  }, [location]);
  useEffect(() => {
    rows2 && handleFilterByScroll();
  }, [searchScrollNo]);

  useEffect(() => {
    getTRN001List.mutate(objData);
  }, []);

  // api define=============================================
  const getTRN001List = useMutation(trn1Api.getTRN001List, {
    onSuccess: (data) => {
      let crSum = 0;
      let drSum = 0;
      data.map((a) => {
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
      setRows(data);
      setRows2(data);
      // console.log(data, "data getTRN001List");
      // console.log(data[0], "data[0] getTRN001List");
      // setTempStore({ ...tempStore, accInfo: data[0] });
      // handleSetAccInfo(data[0]);
      // data?.length > 0 && getCarousalCards.mutate({ reqData: data[0] });
      // data?.length > 0 && handleGetHeaderTabs(data[0] ?? "");
    },
    onError: (error) => {},
  });

  const getCarousalCards = useMutation(CommonApi.getCarousalCards, {
    onSuccess: (data) => {
      // setCardStore({ ...cardStore, cardsInfo: data });
      handleSetCards(data);
    },
    onError: (error) => {
      // setCardStore({ ...cardStore, cardsInfo: [] });
      handleSetCards([]);
    },
  });

  const deleteScrollByVoucher = useMutation(CommonApi.deleteScrollByVoucherNo, {
    onSuccess: (res) => {
      setDeleteDialog(false);
      getTRN001List.mutate(objData);
      enqueueSnackbar(res?.messageDetails, {
        variant: "success",
      });
      handleSetRemarks();
    },
    onError: (error: any) => {
      setDeleteDialog(false);
      enqueueSnackbar(error?.error_msg, {
        variant: "error",
      });
    },
  });

  // fn define-----------------------------
  const setCurrentAction = useCallback((data) => {
    let row = data.rows[0]?.data;
    setDataRow(row);

    if (data.name === "Delete") {
      setDeleteDialog(true);
    }
    if (data.name === "_rowChanged") {
      let obj = {
        COMP_CD: row?.COMP_CD,
        ACCT_TYPE: row?.ACCT_TYPE,
        ACCT_CD: row?.ACCT_CD,
        PARENT_TYPE: row?.PARENT_TYPE ?? "",

        BRANCH_CD: row?.BRANCH_CD,
        // authState: authState,
      };

      handleSetAccInfo(obj);
      // setTempStore({ ...tempStore, accInfo: obj });
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
      // Create a new AbortController
      controllerRef.current = new AbortController();
      getCarousalCards.mutate({
        reqData: obj,
        controllerFinal: controllerRef.current,
      });
      handleGetHeaderTabs(obj ?? "");
    }
  }, []);

  const handleSetRemarks = () => {
    let msg = "WRONG ENTRY FROM DAILY TRAN";
    if (location.pathname.includes("/cnf_daily_tran_F2")) {
      setRemarks(msg + " CONFIRMATION (F2) (TRN/002)");
    } else {
      setRemarks(msg + " MAKER (TRN/001)");
    }
  };

  const handleFilterByScroll = () => {
    let result = rows2?.filter(
      (item) => item?.SCROLL1 != "" && item?.SCROLL1 === searchScrollNo
    );
    if (result?.length > 0) {
      setRows(result);
    } else if (!searchScrollNo) {
      result = [];
      setRows(rows2);
    } else {
      result = [];
      setRows([]);
    }
    handleFilteredRows(result);
  };

  const handleDelete = (input) => {
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
      // USER_DEF_REMARKS: remarks,
      USER_DEF_REMARKS: input,
    };

    input?.length > 5
      ? deleteScrollByVoucher.mutate(obj)
      : enqueueSnackbar("Kindly Enter Remarks of at least 5 Characters", {
          variant: "error",
        });
  };

  const handleCloseDialog = () => {
    setScrollDialog(false);
  };

  return (
    <>
      <GridWrapper
        key={`TRN001_TableMetaData${getTRN001List?.isLoading}`}
        finalMetaData={TRN001_TableMetaData as GridMetaDataType}
        data={rows}
        setData={() => null}
        loading={getTRN001List.isLoading || getCarousalCards.isLoading}
        refetchData={() => getTRN001List.mutate(objData)}
        ref={myGridRef}
        actions={actions}
        setAction={setCurrentAction}
        onlySingleSelectionAllow={true}
        isNewRowStyle={true}
        defaultSelectedRowId={rows?.[0]?.TRAN_CD ? rows?.[0]?.TRAN_CD : ""}
      />
      <Grid
        item
        xs={12}
        sm={12}
        sx={{
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
          Total Records : {rows ? rows.length : 0}
        </Typography>
        <Typography sx={{ fontWeight: "bold" }} variant="subtitle1">
          Debit : ₹ {debit}
        </Typography>
        <Typography sx={{ fontWeight: "bold" }} variant="subtitle1">
          Credit : ₹ {credit}
        </Typography>
      </Grid>

      {scrollDialog && (
        <Scroll
          data={dataRow}
          open={scrollDialog}
          handleCloseDialog={handleCloseDialog}
        />
      )}

      {Boolean(deleteDialog) ? (
        <RemarksAPIWrapper
          TitleText={
            "Do you want to Delete the transaction - VoucherNo." +
            dataRow?.TRAN_CD +
            " ?"
          }
          onActionYes={(input) => handleDelete(input)}
          onActionNo={() => {
            setDeleteDialog(false);
            handleSetRemarks();
          }}
          isLoading={deleteScrollByVoucher.isLoading}
          isEntertoSubmit={true}
          AcceptbuttonLabelText="Ok"
          CanceltbuttonLabelText="Cancel"
          open={deleteDialog}
          rows={dataRow}
        />
      ) : null}
    </>
  );
};
