import { useEffect, useRef, useState } from "react";
import { Dialog, Paper } from "@mui/material";
import { GradientButton } from "components/styledComponent/button";
import { usePopupContext } from "components/custom/popupContext";
import { StandingInstructionViewMetaData } from "./metaData/metaData";
import { extractMetaData, utilFunction } from "components/utils";
import { enqueueSnackbar } from "notistack";
import { useMutation } from "react-query";
import * as API from "./api";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import { populateGridData } from "./metaData/gridMetaData";
import Draggable from "react-draggable";
import { t } from "i18next";

export const StandingInstructionEditData = ({ allData, open, onClose, currentData,siRefetch }) => {
  const [formMode, setFormMode] = useState("edit");
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const formRef = useRef<any>(null);
  const gridRef = useRef<any>(null);
  const isErrorFuncRef = useRef<any>(null);
  const [formData, setFormData] = useState();
  const [data, setData] = useState<any>();
  const [gridData, setgridData] = useState([]);
  // const [isButtonClick, SetButtonClick] = useState<any>()

  useEffect(() => {
    if (allData) {
      setData(allData)
    }
    const flag = currentData?.data?.SI_EXECUTE_FLG;
    if (flag === 'C' || flag === 'P' || flag === "Y") {
      setFormMode('view');
    } else {
      setFormMode('edit');
    }
  }, [currentData?.data?.SI_EXECUTE_FLG, allData]);

  const mutation = useMutation(API.updateSiDetailData, {
    onError: (error: any) => {
      let errorMsg = t("Unknownerroroccured");
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
      CloseMessageBox();
    },
    onSuccess: (data) => {
      enqueueSnackbar(t("insertSuccessfully"), {
        variant: "success",
      });
      CloseMessageBox();
      onClose();
      siRefetch();
      setgridData([]);
    },
  });



  const onPopulateDataClick = async () => {
    const formdata = await formRef?.current?.getFieldData();
    setFormData(formdata);

    const updatedData= data?.map((rowData) => {
      const updatedRow = { ...rowData };

      if (formdata.hasOwnProperty('SI_CHARGE')) {
        updatedRow.SI_CHARGE = formdata.SI_CHARGE.trim();
      }
      if (formdata.hasOwnProperty('REMARKS')) {
        updatedRow.REMARKS = formdata.REMARKS.trim();
      }
      if (formdata.hasOwnProperty('SI_AMOUNT')) {
        updatedRow.SI_AMOUNT = formdata.SI_AMOUNT.trim();
      }
      if (formdata.hasOwnProperty('DR_ACCT_CD')) {
        updatedRow.DR_ACCT_CD = formdata.DR_ACCT_CD
      }
      if (formdata.hasOwnProperty('DR_ACCT_TYPE')) {
        updatedRow.DR_ACCT_TYPE = formdata.DR_ACCT_TYPE
      }
      if (formdata.hasOwnProperty('BRANCH_CD')) {
        updatedRow.BRANCH_CD = formdata.BRANCH_CD
      }
      return updatedRow;
    });
    setData(updatedData);
    setgridData(updatedData)
    // SetButtonClick("N")
  };
  const saveData = async () => {
    const oldData = allData;
    const newData = gridData;


    let updPara = utilFunction.transformDetailDataForDML(
      oldData ?? [],
      newData ?? [],
      ["SUB_LINE_ID"]
    );


    isErrorFuncRef.current = {
      data: {
        _isNewRow: false,
        DETAILS_DATA: {
          ...updPara,
        },
      },
    }
    const btnName = await MessageBox({
      message:t("SaveData"),
      messageTitle: t("Confirmation"),
      buttonNames: ["Yes", "No"],
      loadingBtnName: ["Yes"],
    });

    if (btnName === "Yes") {
      mutation.mutate({
        data: { ...isErrorFuncRef.current?.data }
      });
    }
    else if((btnName === "No"))
    {
      setgridData([]);
    }
  }
  return (
    <>
      <Dialog
        open={open}
        PaperProps={{
          style: {
            width: "100%",
            overflow: "auto",
          },
        }}
        // PaperComponent={(props) => (
        //   <Draggable
        //     handle="#draggable-dialog-title"
        //     cancel={'[class*="MuiDialogContent-root"]'}
        //   >
        //     <Paper {...props} />
        //   </Draggable>
        // )}
        maxWidth="lg"
      >
        {/* <div id="draggable-dialog-title"> */}
          <FormWrapper
            key={"standingInstructionForm" + formMode}
            metaData={extractMetaData(
              StandingInstructionViewMetaData,
              formMode
            ) as MetaDataType}
            displayMode={formMode}
            initialValues={{
              ...(currentData?.data ?? {}),
            }}
            formState={{ MessageBox: MessageBox,docCd: "TRN/394"}}
            formStyle={{ background: "white", height: "auto" }}
            onFormButtonClickHandel={onPopulateDataClick}
            ref={formRef}
          >
          </FormWrapper>
          {formMode !== "view" &&
          <GridWrapper
            key={"standingInsructionViewGridMetaData"}
            finalMetaData={populateGridData as GridMetaDataType}
            data={gridData.length !== 0 ? gridData : data}
            setData={setData}
            ref={gridRef}
          />}
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "end", margin: "0 20px 10px 0" }}>
          {formMode !== "view" &&<GradientButton onClick={saveData}>Save & Close</GradientButton>}
            <GradientButton onClick={onClose} >Close</GradientButton>
          </div>
        {/* </div> */}
      </Dialog>
    </>
  );
};

