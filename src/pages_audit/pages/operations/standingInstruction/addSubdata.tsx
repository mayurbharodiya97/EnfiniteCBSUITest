import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { standingInsructionViewGridMetaData } from "./gridMetaData";
import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import { AuthContext } from "pages_audit/auth";
import * as API from "./api";
import { usePopupContext } from "components/custom/popupContext";
import { GradientButton } from "components/styledComponent/button";
import { CircularProgress, Dialog } from "@mui/material";
import { AddSubDataMetaData } from "./metaData";
import FormWrapper from "components/dyanmicForm";
import { useMutation, useQuery } from "react-query";
import SiExecuteDetailView from "./siExecuteDetailView";
import { SubmitFnType } from "packages/form";
import { enqueueSnackbar } from "notistack";
import { format } from "date-fns";
import { DeleteDialog } from "./deleteDialog";
import { queryClient } from "cache";



const AddSubData = ({ open, onClose, mainRefetch }) => {
  const authController = useContext(AuthContext);
  const { authState } = useContext(AuthContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { state: rows } = useLocation();
  const [lineId, setLineId] = useState(null);
  const [srCd, setSrCd] = useState(null);
  const tranCd = rows?.[0]?.data?.TRAN_CD;
  const [opens, setOpens] = useState(false)
  const [deleteopen, setDeleteOpen] = useState(false)
  const [formMode, setFormMode] = useState("add");
  const isErrorFuncRef = useRef<any>(null);
  const [currentRowData, setCurrentRowData] = useState(null)
  const { data, isLoading, isFetching, isError, error, refetch: siRefetch } = useQuery(
    ["getStandingInstructionInnerData", authController?.authState?.companyID, authController?.authState?.user?.branchCode, tranCd],
    () => {
      return API.getStandingInstructionInnerData({
        companyID: authController?.authState?.companyID,
        branchCode: authController?.authState?.user?.branchCode,
        Tran_cd: tranCd
      });
    }
  );
  const validDataMutation = useMutation(API.validateStandingInstructionData,
    {
      onSuccess: async (data) => {
        if (data?.[0]?.O_STATUS === "0") {
          const btnName = await MessageBox({
            message: "Do you want to save this Request?",
            messageTitle: "Confirmation",
            buttonNames: ["Yes", "No"],
            loadingBtnName: ["Yes"],
          });
          if (btnName === "Yes") {
            mutation.mutate({
              data: { ...isErrorFuncRef.current?.data }
            });
          }
        } else if (data?.[0]?.O_STATUS === "999") {
          const messages = data.map(item => item.O_MESSAGE).join('\n');
          MessageBox({
            messageTitle: "Validation Failed",
            message: messages,
          });
        }
      },
      onError: (error: any) => {
        MessageBox({
          messageTitle: "Validation Alert",
          message: error?.error_detail,
        });
      },
    })

  const mutation = useMutation(API.addStandingInstructionTemplate,
    {
      onError: (error: any) => {
        let errorMsg = "Unknown Error occured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        enqueueSnackbar(errorMsg, {
          variant: "error",
        });
        CloseMessageBox();
      },
      onSuccess: (data) => {
        enqueueSnackbar("Records successfully Saved", {
          variant: "success",
        }
        );
        siRefetch();
        CloseMessageBox();
        onClose();
        mainRefetch();
      },
    }
  );
  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getStandingInstructionInnerData"]);
    };
  }, []);

  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData: any,
    endSubmit,
    setFieldError
  ) => {
    endSubmit(true);

    const newData = {
      isNewRow: Array.isArray(data) ? data : [data],
    };

    isErrorFuncRef.current = {
      data: {
        COMP_CD: authState?.companyID,
        BRANCH_CD: authState?.user?.branchCode,
        TRAN_CD: tranCd,
        _isNewRow: false,
        SI_SDT: {
          ...newData,
        },
      },

      displayData,
      endSubmit,
      setFieldError,
    };
    validDataMutation.mutate({
      START_DT: format(new Date(data.START_DT), "dd/MMM/yyyy"),
      EXECUTE_DAY: data.EXECUTE_DAY,
      SI_AMOUNT: data.SI_AMOUNT,
      VALID_UPTO: format(new Date(data.VALID_UPTO), "dd/MMM/yyyy"),
    });
  };

  return (
    <Fragment>
      <Dialog open={open} PaperProps={{ style: { width: "100%", overflow: "auto" } }} maxWidth="lg">
        <FormWrapper
          key={"standingInstructionForm"}
          metaData={AddSubDataMetaData}
          onSubmitHandler={onSubmitHandler}
          initialValues={rows?.[0]?.data}
          formStyle={{
            background: "white",
          }}
          formState={{
            MessageBox: MessageBox,
          }}
        >
          {({ isSubmitting, handleSubmit }) => (
            <>
              {formMode === "add" ? (
                <>
                  <GradientButton
                    onClick={(event) => {
                      handleSubmit(event, "Save");
                    }}
                    disabled={isSubmitting}
                    endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                    color={"primary"}
                  >
                    Add
                  </GradientButton>

                  <GradientButton onClick={onClose} color={"primary"}>
                    Close
                  </GradientButton>
                </>
              ) : ""}
            </>
          )}
        </FormWrapper>
        <GridWrapper
          key={"standingInsructionViewGridMetaData"}
          finalMetaData={standingInsructionViewGridMetaData as GridMetaDataType}
          loading={isLoading || isFetching}
          data={data ?? []}
          setData={() => null}
          refetchData={() => siRefetch()}
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
          }}
        />
      </Dialog>

      <SiExecuteDetailView
        open={opens}
        onClose={() => setOpens(false)}
        lienId={lineId}
        srCd={srCd}
        tran_cd={tranCd}
      />
      <DeleteDialog open={deleteopen} onClose={() => setDeleteOpen(false)} rowData={currentRowData} siRefetch={siRefetch} mainRefetch={mainRefetch} />
    </Fragment>
  );
};

export default AddSubData;
