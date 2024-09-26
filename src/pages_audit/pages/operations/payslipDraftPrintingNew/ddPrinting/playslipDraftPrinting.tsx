import { Dialog } from "@mui/material";
import { GradientButton } from "@acuteinfo/common-base";

const PlaySlipDraftPrintingNew = ({
  SelectedRowData,
  handleClose,
  navigate,
}) => {
  console.log("SelectedRowData", SelectedRowData);
  return (
    <>
      <Dialog
        open={true}
        PaperProps={{
          style: {
            width: "100%",
            overflow: "auto",
            padding: "10px",
            height: "100%",
          },
        }}
        maxWidth="xl"
      >
        <GradientButton onClick={handleClose}>Retrieve</GradientButton>
        <p>Printind Data</p>
      </Dialog>
    </>
  );
};
export default PlaySlipDraftPrintingNew;
