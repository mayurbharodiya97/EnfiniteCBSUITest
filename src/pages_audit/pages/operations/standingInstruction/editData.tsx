import { useContext, useEffect, useRef, useState } from "react";
import { CircularProgress, Dialog } from "@mui/material";
import { GradientButton } from "components/styledComponent/button";
import { usePopupContext } from "components/custom/popupContext";
import { MasterDetailsForm } from "components/formcomponent";
import { editDataMasterMetaData } from "./gridMetaData";
import { AuthContext } from "pages_audit/auth";
import { SubmitFnType } from "packages/form";
import { utilFunction } from "components/utils";
import { enqueueSnackbar } from "notistack";
import { useMutation } from "react-query";
import * as API from "./api";



export const StandingInstructionEditData = ({ allData, open, onClose, currentData }) => {
  const [formMode, setFormMode] = useState("edit");
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { authState } = useContext(AuthContext);
  const formRef = useRef<any>(null);
  const isErrorFuncRef = useRef<any>(null);
  const [formData, setFormData] = useState();
  const [isButtonClick, setButtonClick] = useState(false);
  useEffect(() => {
    const flag = currentData?.data?.SI_EXECUTE_FLG;
    if (flag === 'C' || flag === 'P' || flag === "Y") {
      setFormMode('view');
    } else {
      setFormMode('edit');
    }
  }, [currentData?.data?.SI_EXECUTE_FLG]);

  const mutation = useMutation(API.updateSiDetailData,
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
        });
        CloseMessageBox();
      },
    }
  );
  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData: any,
    endSubmit,
    setFieldError
  ) => {
    const oldData = [allData];
    const newData = [data.data];

    let updPara: any = utilFunction.transformDetailDataForDML(
      oldData ? oldData : [],
      newData ? newData : [],
      ["SUB_LINE_ID"]
    );

    isErrorFuncRef.current = {
      data: {
        _isNewRow: false,
        DETAILS_DATA: {
          ...updPara,
        },
      },

      displayData,
      endSubmit,
      setFieldError,
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

  }
  console.log(isButtonClick)
  return (
    <>
      {/* <>
      <Dialog open={open}
        PaperProps={{
          style: {
            width: "100%",
            overflow: "auto",
          },
        }}
        maxWidth="lg"
      >
        <FormWrapper
          key={"standingInstructionForm" + formMode}
          metaData={
            extractMetaData(
              StandingInstructionViewMetaData,
              formMode
            ) as MetaDataType
          }
          displayMode={formMode}
          // onSubmitHandler={onSubmitHandler}
          initialValues={{
            DEF_TRAN_CD: defTran  ` qq  Cd,
            ...(data?.data ?? {}),
          }}

          formStyle={{
            background: "white"
          }}
          formState={{ MessageBox: MessageBox }}
        >
          {({ isSubmitting, handleSubmit }) => (
            <>
              {formMode === "edit" ?
                (
                  <>
                    <GradientButton
                      onClick={(event) => {
                        handleSubmit(event, "Save");
                      }}
                      disabled={isSubmitting}
                      endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                      color={"primary"}
                    >
                      Save
                    </GradientButton>
                    <GradientButton
                      onClick={onClose}
                      color={"primary"}
                    >
                      Close
                    </GradientButton>
                  </>
                ) : <>
                  <GradientButton
                    onClick={onClose}
                    color={"primary"}
                  >
                    Close
                  </GradientButton>
                </>}
            </>
          )}
        </FormWrapper>
      </Dialog>
      </> */}
      <Dialog open={open} PaperProps={{
        style: {
          width: "100%",
          overflow: "auto",
        },
      }}
        maxWidth="lg" >
        {/* <MasterDetailsForm
          key={"editDataMasterMetaData" + formMode}
          metaData={editDataMasterMetaData}
          initialData={{
            ...(currentData?.data ?? {}),
            DETAILS_DATA: isButtonClick ? formData : allData
          }}
          displayMode={formMode}
          onSubmitData={onSubmitHandler}
          formStyle={{ background: "white", height: "auto" }}
          formState={{ MessageBox: MessageBox }}
          onFormButtonClickHandel={async () => {
            let event: any = { preventDefault: () => { } };
            const formdata = await formRef?.current?.getFieldData();
            setFormData(formdata);
            setButtonClick(true);
            console.log(formdata)
          }}
          ref={formRef}
        >
          {({ isSubmitting, handleSubmit }) => {
            return (
              <>
                <GradientButton
                  onClick={handleSubmit}
                  color={"primary"}
                >
                  Save
                </GradientButton>
                <GradientButton onClick={onClose} color={"primary"}>
                  Close
                </GradientButton>
              </>
            );
          }}
        </MasterDetailsForm> */}
        
      </Dialog>

    </>
  )
};


