import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import { GradientButton } from "@acuteinfo/common-base";
import { AuthContext } from "pages_audit/auth";
import { useContext } from "react";

export const LogoutModal = ({ setLogoutOpen, logoutOpen }) => {
  const authController = useContext(AuthContext);
  return (
    <Dialog
      // fullScreen={fullScreen}
      open={true}
      // onClose={handleClose}
      // maxWidth={"sm"}
      PaperProps={{
        style: {
          width: "auto",
          height: "auto",
        },
      }}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle
        sx={{
          background: "var(--theme-color3)",
          color: "var(--theme-color2)",
          // letterSpacing: "1.3px",
          justifyItems: "center",
          margin: "10px",
          boxShadow:
            "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;",
          fontWeight: 500,
          borderRadius: "inherit",
          minWidth: "150px",
          py: 1,
        }}
        id="responsive-dialog-title"
      >
        <Typography variant="h4">Logout</Typography>
        {/* <img src={Logout} alt="logout-icon"  style={{height:"100%", paddingLeft:"85px"}}/> */}
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          sx={{
            // fontSize: "22px",
            display: "flex",
            justifyContent: "center",
            // height:"100px"
            // marginTop: "15px",
          }}
        >
          {/* <h2 style={{color:"black"}}>Are you sure want to </h2> */}
          <Typography variant="h5" style={{ color: "black" }}>
            Are you sure want to
          </Typography>
          {/* <HelpIcon color="secondary" fontSize="large" /> */}
        </DialogContentText>
        <DialogContentText
          sx={{
            // fontSize: "22px",
            display: "flex",
            justifyContent: "center",
            // height:"100px"
            // marginTop: "15px",
          }}
        >
          {/* <h2 style={{color:"black",textAlign:"center"}}>logout.. ?</h2> */}
          <Typography
            variant="h5"
            style={{ color: "black", textAlign: "center" }}
          >
            logout.. ?
          </Typography>
          {/* <HelpIcon color="secondary" fontSize="large" /> */}
        </DialogContentText>
      </DialogContent>
      <DialogActions
        style={{
          justifyContent: "center",
          padding: "10px 20px",
          borderRadius: "5px",
          marginTop: "-15px",
        }}
      >
        <GradientButton onClick={() => authController?.logout()} autoFocus>
          Yes
        </GradientButton>
        <GradientButton onClick={() => setLogoutOpen(false)}>No</GradientButton>
      </DialogActions>
    </Dialog>
  );
};
