import { Fragment, useContext, useState } from "react";
import { useCallback } from "react";
import { useNavigate, useLocation, Route, Routes } from "react-router-dom";
import { ActionTypes } from "components/dataTable";
import { standingInsructionViewGridMetaData } from "./metaData/gridMetaData";
import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import { AuthContext } from "pages_audit/auth";
import * as API from "./api";
import { useQuery } from "react-query";
import { usePopupContext } from "components/custom/popupContext";
import AddSubData from "./addSubdata";
import SiExecuteDetailView from "./siExecuteDetailView";
import { DeleteDialog } from "./deleteDialog";
import PhotoSignWithHistory from "components/custom/photoSignWithHistory/photoSignWithHistory";

const actions: ActionTypes[] = [
  {
    actionName: "subadd",
    actionLabel: "Add",
    multiple: false,
    rowDoubleClick: false,
  },
];

const StadingInstructionViewData = () => {
  const { state: rows } = useLocation();
  const authController = useContext(AuthContext);
  const navigate = useNavigate();
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const [opens, setOpens] = useState(false)
  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [lineId, setLineId] = useState(null);
  const [srCd, setSrCd] = useState(null);
  const [currentRowData, setCurrentRowData] = useState(null)
  const [deleteopen, setDeleteOpen] = useState(false)
  const [isPhotoSign, setIsPhotoSign] = useState(false);
  const [Acctdata, SetAcctData] = useState({});
  const tranCd = rows?.[0]?.data?.TRAN_CD;

  const setCurrentAction = useCallback(
    async (data) => {

      if (data?.name === "subadd") {
        setOpenAddDialog(true);
      }
      navigate(data?.name, {
        state: data?.rows,
      });
    },
    [MessageBox, navigate]
  );


  const { data: apidata, isLoading, isFetching, refetch } = useQuery(
    ["getStandingInstructionInnerData", authController?.authState?.companyID, authController?.authState?.user?.branchCode, tranCd],
    () => {
      return API.getStandingInstructionInnerData({
        companyID: authController?.authState?.companyID,
        branchCode: authController?.authState?.user?.branchCode,
        Tran_cd: tranCd
      });
    },
    {
      enabled: !!tranCd,
    }
  );

  return (
    <Fragment>
      <GridWrapper
        key={"standingInsructionViewGridMetaData"}
        finalMetaData={standingInsructionViewGridMetaData as GridMetaDataType}
        loading={isLoading || isFetching}
        data={apidata ?? []}
        setData={() => null}
        actions={actions}
        setAction={setCurrentAction}
        refetchData={() => refetch()}
        onClickActionEvent={(index, id, currentData) => {
          if (id === "edit") {
            const { LINE_ID, SR_CD } = currentData;
            setLineId(LINE_ID);
            setSrCd(SR_CD);
            setOpens(true);
          }
          if (id === "delete") {
            setDeleteOpen(true);
            setCurrentRowData(currentData)
          }
          if (id === "credit") {
            const { COMP_CD, BRANCH_CD, CR_ACCT_TYPE, CR_ACCT_CD, SI_AMOUNT, CR_ACCT_NM } = currentData
            const payload = {
              COMP_CD: COMP_CD,
              BRANCH_CD: BRANCH_CD,
              ACCT_TYPE: CR_ACCT_TYPE,
              ACCT_CD: CR_ACCT_CD,
              AMOUNT: SI_AMOUNT,
              ACCT_NM: CR_ACCT_NM
            }
            setIsPhotoSign(true)
            SetAcctData(payload);
          }
          if (id === "debit") {
            const { COMP_CD, BRANCH_CD, DR_ACCT_TYPE, DR_ACCT_CD, SI_AMOUNT, DR_ACCT_NM } = currentData
            const payload = {
              COMP_CD: COMP_CD,
              BRANCH_CD: BRANCH_CD,
              ACCT_TYPE: DR_ACCT_TYPE,
              ACCT_CD: DR_ACCT_CD,
              AMOUNT: SI_AMOUNT,
              ACCT_NM: DR_ACCT_NM
            }
            setIsPhotoSign(true)
            SetAcctData(payload);

          }
        }}
      />
       <>
        {isPhotoSign ? (
          <>
            <div style={{ paddingTop: 10 }}>
              <PhotoSignWithHistory data={Acctdata}
                onClose={() => {
                  setIsPhotoSign(false)
                }}
                screenRef={"TRN/394"}
              />
            </div>
          </>
        ) : null}
      </>
      {/* {opens &&  (
        <SiExecuteDetailView
          open={opens}
          lineId={lineId}
          srCd={srCd}   
          tran_cd={tranCd}
        />
      )} */}
      <Routes>
        <Route
          path="subadd/*"
          element={<AddSubData open={openAddDialog} onClose={()=>{setOpenAddDialog(false)}} mainRefetch={refetch}/>}
        />
      </Routes>
      <SiExecuteDetailView
        open={opens}
        onClose={() => setOpens(false)}
        lineId={lineId}
        srCd={srCd}
        tran_cd={tranCd}
      />
      <DeleteDialog open={deleteopen} onClose={() => setDeleteOpen(false)} rowData={currentRowData} siRefetch={refetch} mainRefetch={refetch} />
    </Fragment>
  );
};

export default StadingInstructionViewData;
