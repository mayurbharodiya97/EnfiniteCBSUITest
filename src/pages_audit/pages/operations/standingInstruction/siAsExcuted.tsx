import React, { Fragment, useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ActionTypes } from "components/dataTable";
import { siasExecutedGridMetadata } from "./gridMetaData";
import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import { AuthContext } from "pages_audit/auth";
import * as API from "./api";
import { usePopupContext } from "components/custom/popupContext";
import { GradientButton } from "components/styledComponent/button";
import { Dialog } from "@mui/material";
import { siasExecute } from "./metaData";
import FormWrapper from "components/dyanmicForm";
import { useMutation, useQuery } from "react-query";
import { queryClient } from "cache";
import { utilFunction } from "components/utils";
import { enqueueSnackbar } from "notistack";

const actions: ActionTypes[] = [];

const SIAsExcutedGrid = ({ open, onClose }) => {
  const authController = useContext(AuthContext);
  const navigate = useNavigate();
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const [formData, setFormData] = useState({});
  const formRef = useRef<any>(null);
  const [apiData, setApiData] = useState<any>(null);
  const [oldData, setOldData] = useState(null)
  const [acctType, setAcctType] = useState("");
  const [acctCd, setAcctCd] = useState("");
  const isErrorFuncRef = useRef<any>(null);


  const handleSubmit = async (data) => {
    setAcctType(data.ACCT_TYPE);
    setAcctCd(data.ACCT_CD);
    const response = await API.getSIAsExcutedData({
      companyID: authController?.authState?.companyID,
      branchCode: authController?.authState?.user?.branchCode,
      acct_type: data.ACCT_TYPE,
      acct_cd: data.ACCT_CD,
    });
    setApiData(response);
    setOldData(response);

  };

  const { isLoading, isFetching, refetch, data } = useQuery(
    ["getSIAsExcutedData"],
    () => { },
    { enabled: true }
  );

  const handleAllExecutedClick = async () => {
    const btnName = await MessageBox({
      message: "This Can't be Revert back! Do you want to Consider it as executed?",
      messageTitle: "Confirmation",
      buttonNames: ["Yes", "No"],
    });
    if (btnName === "Yes") {

      const updatedData = apiData.map((item) => ({
        ...item,
        SI_EXECUTE_FLG: "C",
      }));
      setApiData(updatedData);

    }
  };

  const mutation = useMutation(API.updateSiAsExecute, {
    onError: (error: any) => {
      let errorMsg = "Unknown Error occurred";
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
      });
      refetch();
      CloseMessageBox();
    },
  });


  const saveData = async () => {
    const olddata = oldData;
    const newData: any = apiData;
    const UpdatedNewData = newData.map((rowData) => {
      const {
        COMP_CD, DR_ACCT_CD, CR_COMP_CD, SI_AMOUNT, CR_BRANCH_CD,
        CR_ACCT_CD, LAST_MODIFIED_DATE, EXECUTE_DT, DR_ACCT_TYPE, LAST_ENTERED_BY,
        BRANCH_CD, ENTERED_DATE, LAST_MACHINE_NM, CR_ACCT_TYPE,
        _displaySequence, _error, _isTouchedCol, _oldData, _touched, ...others } = rowData;
      return { ...others };
    });

    const updatedNewData = UpdatedNewData
      ? UpdatedNewData.map(item => {
        if (item.SI_EXECUTE_FLG === "C") {
          return {
            ...item,
            PROCESS_DT: authController?.authState?.workingDate
          };
        } else {
          return item;
        }
      })
      : [];
    let updPara: any = utilFunction.transformDetailDataForDML(
      olddata ? olddata : [],
      updatedNewData ? updatedNewData : [],
      ["SUB_LINE_ID"]
    );

    isErrorFuncRef.current = {
      data: {
        _isNewRow: false,
        DETAILS_DATA: {
          ...updPara,
        },
      }
    };

    const btnName = await MessageBox({
      message: "Are you sure you want to save?",
      messageTitle: "Confirmation",
      buttonNames: ["Yes", "No"],
      loadingBtnName: ["Yes"],
    });

    if (btnName === "Yes") {
      mutation.mutate({
        data: { ...isErrorFuncRef.current?.data }
      });
    }
  };


  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getSIAsExcutedData"]);
    };
  }, []);

  return (
    <Fragment>
      <Dialog open={open} PaperProps={{ style: { width: "100%", overflow: "auto" } }} maxWidth="lg">
        <FormWrapper
          key={"siasExecute"}
          metaData={siasExecute}
          onSubmitHandler={(data) => handleSubmit(data)}
          formStyle={{ background: "white" }}
          onFormDataChange={(data) => setFormData(data)}
          onFormButtonClickHandel={() => {
            let event: any = { preventDefault: () => { } };
            formRef?.current?.handleSubmit(event, "BUTTON_CLICK");
          }}
          ref={formRef}
          formState={{ MessageBox: MessageBox }}
        />
        <GridWrapper
          key={"standingInsructionViewGridMetaData"}
          finalMetaData={siasExecutedGridMetadata as GridMetaDataType}
          loading={isLoading || isFetching}
          data={apiData ?? []}
          setData={setApiData}
          actions={actions}
          refetchData={() => refetch()}
        />
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "end", margin: "0 20px 10px 0" }}>
          <GradientButton onClick={handleAllExecutedClick}>All SI as Executed</GradientButton>
          <GradientButton onClick={saveData}>Save</GradientButton>
          <GradientButton onClick={onClose}>Close</GradientButton>
        </div>
      </Dialog>
    </Fragment>
  );
};

export default SIAsExcutedGrid;
