import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation } from "react-query";
import { TRN001_TableMetaData } from "./gridMetadata";
import GridWrapper from "components/dataTableStatic";
import { Alert } from "components/common/alert";
import { ActionTypes, GridMetaDataType } from "components/dataTable/types";
import * as trn1Api from "../api";
import * as CommonApi from "../../TRNCommon/api";
import { useSnackbar } from "notistack";
import { Grid, Typography } from "@mui/material";

import { AuthContext } from "pages_audit/auth";
import { AccDetailContext } from "pages_audit/auth";
import { useContext } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import {
  PopupMessageAPIWrapper,
  PopupRequestWrapper,
} from "components/custom/popupMessage";

import Scroll from "pages_audit/pages/dashboard/Today'sTransactionGrid/openScroll/scroll";
import { RemarksAPIWrapper } from "components/custom/Remarks";

const actions: ActionTypes[] = [
  {
    actionName: "view-detail",
    actionLabel: "View Detail",
    multiple: false,
    rowDoubleClick: true,
  },
  {
    actionName: "Delete",
    actionLabel: "Remove",
    multiple: false,
    rowDoubleClick: false,
    // alwaysAvailable: true,
  },
];

export const TRN001_Table = ({
  updatedRows,
  handleGetHeaderTabs,
  searchScrollNo,
  handleFilteredRows,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const myGridRef = useRef<any>(null);

  const { authState } = useContext(AuthContext);
  const { tempStore, setTempStore } = useContext(AccDetailContext);
  const { cardStore, setCardStore } = useContext(AccDetailContext);

  const [rows, setRows] = useState<any>([]);
  const [rows2, setRows2] = useState<any>([]);
  const [credit, setCredit] = useState<number>(0);
  const [debit, setDebit] = useState<number>(0);
  const [dataRow, setDataRow] = useState<any>({});
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
  const [scrollDialog, setScrollDialog] = useState<boolean>(false);

  let objData = {
    USER_NAME: authState?.user?.id,
    COMP_CD: authState?.companyID,
    BRANCH_CD: authState?.user?.branchCode,
  };

  useEffect(() => {
    rows2 && handleFilterByScroll();
  }, [searchScrollNo]);
  const handleFilterByScroll = () => {
    let result = rows2?.filter((item) => item?.SCROLL1 === searchScrollNo);
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
    console.log(result, "resssssult");
  };

  useEffect(() => {
    console.log(rows, "trn1 table rows");
  }, [rows]);

  useEffect(() => {
    if (updatedRows?.length > 0) {
      setRows(updatedRows);
    } else {
      console.log("trn1 refresh");
      getTRN001List.mutate(objData);
    }
  }, [updatedRows, tempStore?.refresh]);

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

      setTempStore({ ...tempStore, accInfo: data[0] });
      getCarousalCards.mutate(data[0]);
      handleGetHeaderTabs(data[0]?.PARENT_TYPE ?? "");
    },
    onError: (error) => {},
  });

  const getCarousalCards = useMutation(CommonApi.getCarousalCards, {
    onSuccess: (data) => {
      setCardStore({ ...cardStore, cardsInfo: data });
    },
    onError: (error) => {},
  });

  const deleteScrollByVoucher = useMutation(CommonApi.deleteScrollByVoucherNo, {
    onSuccess: (data) => {
      setDeleteDialog(false);
      getTRN001List.mutate(objData);
      enqueueSnackbar("Scroll Deleted", {
        variant: "success",
      });
    },
    onError: (error: any) => {
      setDeleteDialog(false);
      enqueueSnackbar(error?.error_msg, {
        variant: "error",
      });
    },
  });

  //-----------------------------

  const setCurrentAction = useCallback((data) => {
    let row = data.rows[0]?.data;
    console.log(row, "rowwww");
    setDataRow(row);

    console.log(row, "row setCurrentAction");
    if (data.name === "view-detail") {
      let obj = {
        COMP_CD: row?.COMP_CD,
        ACCT_TYPE: row?.ACCT_TYPE,
        ACCT_CD: row?.ACCT_CD,
        PARENT_TYPE: row?.PARENT_TYPE ?? "",

        BRANCH_CD: row?.BRANCH_CD,
        authState: authState,
      };

      setTempStore({ ...tempStore, accInfo: obj });
      getCarousalCards.mutate(obj);
      handleGetHeaderTabs(row?.PARENT_TYPE ?? "");
    }

    if (data.name === "Delete") {
      setDeleteDialog(true);
    }

    // if (row?.TYPE_CD === "3   " || row?.TYPE_CD === "6   ") {
    //   setScrollDialog(true);
    // }
  }, []);

  const handleDelete = (input) => {
    console.log(input, "input");
    console.log(dataRow, "dataRow");
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
      USER_DEF_REMARKS: input,
    };

    input.length > 5
      ? deleteScrollByVoucher.mutate(obj)
      : enqueueSnackbar("Kindly Enter Remarks of at least 5 Characters", {
          variant: "error",
        });
  };
  const handleCloseDialog = () => {
    setScrollDialog(false);
  };

  useEffect(() => {
    console.log(dataRow, "dataRow");
  }, [dataRow]);
  useEffect(() => {
    console.log(rows, "rows");
    console.log(rows2, "rows2");
  }, [rows, rows2]);

  return (
    <>
      <GridWrapper
        key={`TRN001_TableMetaData`}
        finalMetaData={TRN001_TableMetaData as GridMetaDataType}
        data={rows}
        setData={() => null}
        loading={getTRN001List.isLoading || getCarousalCards.isLoading}
        refetchData={() => getTRN001List.mutate(objData)}
        ref={myGridRef}
        actions={actions}
        setAction={setCurrentAction}
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
          onActionNo={() => setDeleteDialog(false)}
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
