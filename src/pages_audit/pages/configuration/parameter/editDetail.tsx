import { Button, Dialog } from "@mui/material";
import { MetaDataType } from "components/dyanmicForm";
import { FormWrapper } from "components/dyanmicForm/formWrapper";
import { ParaDetailMetadata } from "./gridMetadata";
import { InitialValuesType } from "packages/form";
import { GradientButton } from "components/styledComponent/button";

export const EditDetail = ({ open, onClose, rowsData }) => {
  // const { state: rows }: any = useLocation();
  return (
    <Dialog
      open={open}
      fullWidth={true}
      PaperProps={{
        style: {
          maxWidth: "900px",
        },
      }}
    >
      <FormWrapper
        key={`EditDetail`}
        metaData={ParaDetailMetadata as MetaDataType}
        initialValues={rowsData?.[0]?.data as InitialValuesType}
        formStyle={{
          background: "white",
        }}
      >
        {({ isSubmitting, handleSubmit }) => (
          <>
           <GradientButton
              onClick={() => onClose()}
              color={"primary"}
            >
              Save
            </GradientButton>
            <GradientButton
              onClick={() => onClose()}
              color={"primary"}
            >
              Close
            </GradientButton>
          </>
        )}
      </FormWrapper>
    </Dialog>
  );
};
