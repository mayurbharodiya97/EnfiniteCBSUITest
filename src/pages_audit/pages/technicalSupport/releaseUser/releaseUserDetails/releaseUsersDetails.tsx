import { Dialog } from "@material-ui/core";
import { useDialogStyles } from "pages_audit/common/dialogStyles";
//import { useLocation } from "react-router-dom";
export const ReleaseUsersEditViewWrapper = ({
  handleDialogClose,
  isDataChangedRef,
  moduleType,
}) => {
  const classes = useDialogStyles();
  //const { state: rows }: any = useLocation();
  return (
    <>
      <Dialog
        open={true}
        //@ts-ignore
        fullWidth={false}
        classes={{
          scrollPaper: classes.topScrollPaper,
          paperScrollBody: classes.topPaperScrollBody,
        }}
      >
        Hello User
      </Dialog>
    </>
  );
};
