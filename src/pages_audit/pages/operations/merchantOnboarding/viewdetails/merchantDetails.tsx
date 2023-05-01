import { Button, Dialog } from "@material-ui/core";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { Transition } from "pages_audit/common";
import { useRef, FC, useState } from "react";
import { useDialogStyles } from "components/detailPopupGridData";
import { SubmitFnType } from "packages/form";
import { useLocation } from "react-router-dom";
import { MerchantOnboardingMetadata } from "./metadata";
import { FromSourceMetaData } from "./fromSourceMetaData";

export const MerchantViewDetails: FC<{
  moduleType: any;
  isDataChangedRef: any;
  closeDialog?: any;
  formView?: string;
}> = ({ isDataChangedRef, closeDialog, formView }) => {
  const isErrorFuncRef = useRef<any>(null);
  const [isOpenSave, setIsOpenSave] = useState(false);
  const { state: rows }: any = useLocation();
  const classes = useDialogStyles();

  const onSubmitHandler: SubmitFnType = (
    data,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    //@ts-ignore
    endSubmit(true);
    isErrorFuncRef.current = { data, displayData, endSubmit, setFieldError };
    setIsOpenSave(true);
  };
  let Merchantviewdetails: MetaDataType = {} as MetaDataType;

  return (
    <>
      <Dialog
        open={true}
        //@ts-ignore
        TransitionComponent={Transition}
        PaperProps={{
          style: {
            width: "100%",
          },
        }}
        maxWidth="lg"
        classes={{
          scrollPaper: classes.topScrollPaper,
          paperScrollBody: classes.topPaperScrollBody,
        }}
      >
        <FormWrapper
          metaData={MerchantOnboardingMetadata as MetaDataType}
          // key={`${dataUniqueKey}-${defaultView}`}

          initialValues={rows?.[0]?.data ?? []}
          onSubmitHandler={() => {}}
          //@ts-ignore
          // displayMode={formMode}
          formStyle={{
            background: "white",
          }}
        >
          {({ isSubmitting, handleSubmit }) => (
            <>
              <Button
                onClick={(event) => {
                  // setAmountLabelOpen(true);
                }}
                disabled={isSubmitting}
                //endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                color={"primary"}
              >
                Amount Label
              </Button>
              {/* <Button
              onClick={(event) => {
                isSubmitEventRef.current = event;
                handleSubmit(event, "Save");
              }}
              disabled={isSubmitting}
              endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              color={"primary"}
            >
              Save
            </Button> */}
              <Button
                onClick={closeDialog}
                color={"primary"}
                disabled={isSubmitting}
              >
                Close
              </Button>
              {/* <Button
            onClick={moveToViewMode}
           
																		  
            color={"primary"}
          >
            Cancel
          </Button> */}
            </>
          )}
        </FormWrapper>
        <FormWrapper
          //@ts-ignore
          metaData={FromSourceMetaData as MetaDataType}
          initialValues={[]}
          onSubmitHandler={() => {}}
          controlsAtBottom={true}
          formStyle={{
            background: "white",
            height: "calc(43vh - 48px)",
            overflowY: "auto",
            overflowX: "hidden",
            // padding: "24px",
          }}
          hideHeader={true}

          // onFormButtonClickHandel={onFormButtonClickHandel}
        ></FormWrapper>
        {/* {isAmountLabelOpen ? (
        <AmountLabelsGridWrapper
          open={isAmountLabelOpen}
          closeDialog={() => {
            ClosedEventCall();
          }}
          rowData={rowsdata}
        />
      ) : null} */}
      </Dialog>
    </>
  );
};
