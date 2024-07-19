import { Fragment, useContext, useRef, useState, useEffect } from "react";
import { useCallback } from "react";
import { useNavigate, useLocation, Route, Routes } from "react-router-dom";
import { ActionTypes } from "components/dataTable";
import { standingInsructionViewGridMetaData } from "./gridMetaData";
import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import { AuthContext } from "pages_audit/auth";
import * as API from "./api";
import { useQuery } from "react-query";
import { usePopupContext } from "components/custom/popupContext";
import { StandingInstructionEditData } from "./editData";
import SiExecuteDetailView from "./siExecuteDetailView";
import AddSubData from "./addSubdata";

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
  const [lineId, setLineId] = useState(null);
  const [srCd, setSrCd] = useState(null);

  const tranCd = rows?.[0]?.data?.TRAN_CD;

  const setCurrentAction = useCallback(
    async (data) => {
      if (data?.name === "Delete") {
        const btnName = await MessageBox({
          message: "Are you sure to delete selected row?",
          messageTitle: "Confirmation",
          buttonNames: ["Yes", "No"],
          loadingBtnName: ["Yes"],
        });
        if (btnName === "Yes") {
          // deleteMutation.mutate({
          //   ...isDeleteDataRef.current?.data,
          //   _isDeleteRow: true,
          // });
        }
      }
      if (data?.name === "subadd") {
        setOpens(true);
      }
      navigate(data?.name, {
        state: data?.rows,
      });
    },
    [MessageBox, navigate]
  );


  const { data: apidata, isLoading, isFetching, isError, error, refetch } = useQuery(
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
  // const updatedAddSecurityUsers = {
  //   ...standingInsructionViewGridMetaData,
  //   fields: standingInsructionViewGridMetaData.columns.map((field, i) => {
  //     // Ensure apidata exists and has elements
  //     if (apidata && apidata.length > i) {
  //       const count = parseInt(apidata[i].SI_COUNT); // Parse SI_COUNT to integer
  //       const isHidden = count <= 0; // Determine visibility based on SI_COUNT

  //       console.log(isHidden);
  //       console.log(count);

  //       if (field.accessor === "_hidden") {
  //         return { ...field, isVisible: !isHidden };
  //       } else {
  //         return { ...field, isVisible: true };
  //       }
  //     }
  //   }),
  // };
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
          if (id === "_hidden") {
            const { LINE_ID, SR_CD, TRAN_CD } = currentData;
            setLineId(LINE_ID);
            setSrCd(SR_CD);
            setOpens(true);
          }
        }}
      />
      {/* {opens &&  (
        <SiExecuteDetailView
          open={opens}
          lienId={lineId}
          srCd={srCd}   
          tran_cd={tranCd}
        />
      )} */}
      <Routes>
        <Route
          path="subadd/*"
          element={<AddSubData open={opens} onClose={() => setOpens(false)} mainRefetch={refetch} />}
        />
      </Routes>
    </Fragment>
  );
};

export default StadingInstructionViewData;
