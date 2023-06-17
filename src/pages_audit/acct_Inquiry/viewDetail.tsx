import { Button, Dialog } from "@mui/material";
import { MetaDataType } from "components/dyanmicForm";
import { FormWrapper } from "components/dyanmicForm/formWrapper";
import { ViewDetailMetadata } from "./metaData";
// import { useLocation } from "react-router-dom";
import { InitialValuesType } from "packages/form";

export const ViewDetail = ({ open, onClose, rowsData }) => {
  // const { state: rows }: any = useLocation();
  console.log("<<<viewdetail", rowsData);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth={true}
      PaperProps={{
        style: {
          maxWidth: "900px",
        },
      }}
    >
      <FormWrapper
        key={`ViewStatement`}
        metaData={ViewDetailMetadata as MetaDataType}
        // initialValues={rows?.[0]?.data as InitialValuesType}
        initialValues={rowsData?.[0]?.data as InitialValuesType}
        //   onSubmitHandler={onSubmitHandler}
        //   displayMode={formMode}
        formStyle={{
          background: "white",
        }}
        // controlsAtBottom={true}
      >
        {({ isSubmitting, handleSubmit }) => (
          <>
            <Button
              onClick={() => onClose()}
              color={"primary"}
              // disabled={isSubmitting}
            >
              Close
            </Button>
          </>
        )}
      </FormWrapper>
    </Dialog>
  );
};
