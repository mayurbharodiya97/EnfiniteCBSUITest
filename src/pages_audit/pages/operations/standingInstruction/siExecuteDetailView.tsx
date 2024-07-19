import { Fragment, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ActionTypes } from "components/dataTable";
import { siExecuteDetailViewGridMetaData } from "./gridMetaData";
import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import { AuthContext } from "pages_audit/auth";
import * as API from "./api";
import { useMutation, useQuery } from "react-query";
import { Dialog, Grid, TableFooter, Typography } from "@mui/material";
import { StandingInstructionEditData } from "./editData";
import AuditData from "./auditdatadisplay";
import { usePopupContext } from "components/custom/popupContext";
import { Message } from "@mui/icons-material";
import { enqueueSnackbar } from "notistack";
import { t } from "i18next";
import { queryClient } from "cache";

const actions: ActionTypes[] = [

  {
    actionName: "edit",
    actionLabel: "Edit",
    rowDoubleClick: false,
    alwaysAvailable: false,
    multiple: false
  },
  {
    actionName: "close",
    actionLabel: "Close",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  {
    actionName: "delete",
    actionLabel: "Delete",
    rowDoubleClick: true,
    alwaysAvailable: false,
    multiple: undefined
  }
];

const SiExecuteDetailView = ({ open, lienId, srCd, tran_cd, onClose }) => {
  const authController = useContext(AuthContext);
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [opens, setOpens] = useState(false);
  const [opensAuditDialog, setOpensAuditDialog] = useState(false);
  const [editData, setEditData] = useState(null);
  const [currentRowData, setCurrentRowData] = useState<any>({});
  const [rows, setrows] = useState([]);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const isDeleteDataRef = useRef<any>(null);

  const setCurrentAction = useCallback(async (data) => {
    isDeleteDataRef.current = data?.rows?.[0];
    const { name, rows } = data;
    if (name === "close") {
      onClose();
    }
    else if (name === "edit") {
      if (rows && rows.length > 0) {
        setOpens(true);
        setEditData(rows[0]);
        setCurrentRowData(rows[0]);
      }
    }
    else if (name === "delete") {
      if (rows && rows.length > 0) {
        setCurrentRowData(rows[0].data);
      }

      deleteValidationMutation.mutate({
        reqData: {
          ENT_COMP_CD: data?.rows[0].data?.ENT_COMP_CD,
          ENT_BRANCH_CD: data?.rows[0].data?.ENT_BRANCH_CD,
          TRAN_CD: data?.rows[0].data?.TRAN_CD,
          SR_CD: data?.rows[0].data?.SR_CD,
          LINE_ID: data?.rows[0].data?.LINE_ID,
          SUB_LINE_ID: data?.rows[0].data?.SUB_LINE_ID,
          REF_TRAN_CD: data?.rows[0].data?.REF_TRAN_CD,
          PROCESS_DT: data?.rows[0].data?.PROCESS_DT,
          SI_EXECUTE_FLG: data?.rows[0].data?.SI_EXECUTE_FLG,
          SCREEN_REF: "TRN/394"
        }
      });


    }
    else {
      navigate(name, {
        state: rows,
      });
    }
  }, [navigate, onClose]);
  const { refetch: siRefetch, isLoading, isFetching } = useQuery(
    ["getSiExecuteDetailViewData", lienId, srCd],
    () => API.getSiExecuteDetailViewData({
      companyID: authController?.authState?.companyID,
      branchCode: authController?.authState?.user?.branchCode,
      Tran_cd: tran_cd,
      Lien_id: lienId,
      Sr_cd: srCd,
    }),
    {
      onSuccess: (data) => {
        setData(data);
      },
      // enabled: true,
    }
  );

  // useEffect(() => {
  //   if (open) {
  //     refetch();
  //   }
  // }, [open, refetch]);


  let populatedata: any = [];

  if (currentRowData && currentRowData.id !== undefined) {
    for (let i = currentRowData.id; i < data.length; i++) {
      if (data[i].SI_EXECUTE_FLG === "N") {
        populatedata.push(data[i]);
      }
    }
  }

  const deleteValidationMutation = useMutation(API.deleteSIDetailData,
    {
      onSuccess: async (data) => {
        if (data?.[0]?.O_STATUS === "0") {
          enqueueSnackbar("Records successfully deleted", {
            variant: "success",
          })
        } else if (data?.[0]?.O_STATUS === "999") {
          MessageBox({
            messageTitle: "Not Allowed",
            message: data?.[0]?.O_MESSAGE,
          });
        }
        else if (data?.[0]?.O_STATUS === "99") {
          const buttonName = await MessageBox({
            messageTitle: "Validation Failed",
            message: data?.[0]?.O_MESSAGE,
            buttonNames: ["Yes", "No"],
          });
          if (buttonName === "Yes") {
            deleteMutation.mutate({
              reqdata: {
                ENT_COMP_CD: isDeleteDataRef.current?.data?.ENT_COMP_CD,
                ENT_BRANCH_CD: isDeleteDataRef.current?.data?.ENT_BRANCH_CD,
                TRAN_CD: isDeleteDataRef.current?.data?.TRAN_CD,
                SR_CD: isDeleteDataRef.current?.data?.SR_CD,
                LINE_ID: isDeleteDataRef.current?.data?.LINE_ID,
                SUB_LINE_ID: isDeleteDataRef.current?.data?.SUB_LINE_ID,
                REF_TRAN_CD: isDeleteDataRef.current?.data?.REF_TRAN_CD,
              },
            });
          }
        }
      },
      onError: (error: any) => {
        MessageBox({
          messageTitle: "Validation Alert",
          message: error?.error_detail,
        });
      },

    })

  const deleteMutation = useMutation(API.deleteSIExecuteDetail,
    {
      onSuccess: async (data) => {
        enqueueSnackbar("Records successfully deleted", {
          variant: "success",
        });
        if (data?.[0]?.O_STATUS === "0") {
          const buttonName = await MessageBox({
            messageTitle: "Alert",
            message: data?.[0]?.O_MESSAGE,
            buttonNames: ["Yes", "No"],
          });
          if (buttonName === "Yes") {
            if (open) {
              siRefetch();
            }
          }

        } else if (data?.[0]?.STATUS === "999") {
          MessageBox({
            messageTitle: "Validation Failed",
            message: data?.[0]?.O_MESSAGE,
          });
        }
      },
      onError: (error: any) => {
        MessageBox({
          messageTitle: "Validation Alert",
          message: error?.error_detail,
        });
      },
    }
  )
  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getSiExecuteDetailViewData"]);
    };
  }, []);


  const proccessedCount = data?.filter(
    (item) => item.SI_EXECUTE_FLG === "Y" || item.SI_EXECUTE_FLG === "C"
  ).length;



  const pendingCount = data?.filter(
    (item) => item.SI_EXECUTE_FLG === "N"
  ).length;

  return (
    <Fragment>
      <Dialog open={open} PaperProps={{ style: { width: "100%", overflow: "auto" } }} maxWidth="lg">
        <GridWrapper
          key={"standingInsructionGridMetaData"}
          finalMetaData={siExecuteDetailViewGridMetaData as GridMetaDataType}
          loading={isLoading || isFetching}
          data={data ?? []}
          setData={() => null}
          actions={actions}
          setAction={setCurrentAction}
          refetchData={() => siRefetch()}
          onClickActionEvent={(index, id, currentData) => {
            if (id === "_hidden2") {
              setOpensAuditDialog(true);
            }
            setrows(currentData);

          }}
        />
        {/* <Grid
          item
          xs={12}
          sm={12}
          sx={{
            height: "23px",
            width: "100%",
            float: "right",
            position: "relative",
            top: "-2.67rem",
            right: "20%",
            display: "flex",
            justifyContent: "right",
            gap: "4rem",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontWeight: "bold" }} variant="subtitle1">
            {"Proccessed"} : {proccessedCount}
          </Typography>
          <Typography sx={{ fontWeight: "bold" }} variant="subtitle1">
            {"Pending"} :{pendingCount}
          </Typography>
        </Grid> */}
      </Dialog>
      <StandingInstructionEditData open={opens} onClose={() => setOpens(false)} allData={populatedata} currentData={currentRowData} />
      <AuditData open={opensAuditDialog} onClose={() => setOpensAuditDialog(false)} griddata={rows} />
    </Fragment>
  );
};

export default SiExecuteDetailView;
