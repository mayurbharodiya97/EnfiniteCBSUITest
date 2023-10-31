import { Button } from "@mui/material";
import React from "react";

import { useNavigate } from "react-router-dom";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { FormWrapper } from "components/dyanmicForm/formWrapper";
import { reference } from "./JointDetails/metaData/reference";
import { membership } from "./JointDetails/metaData/membership";
import { personalDetail } from "./JointDetails/metaData/personalDetail";
import { remarks } from "./JointDetails/metaData/remarks";
import { mortgage } from "./JointDetails/metaData/mortgage";
import { valuer } from "./JointDetails/metaData/valuer";
import { clearance } from "./JointDetails/metaData/clearance";

const Root = () => {
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const navArray = [
    {
      name: "Account",
      path: "acc",
    },
    {
      name: "Joint Detail",
      path: "joint",
    },
    {
      name: "Today Trans",
      path: "todayTrans",
    },
    {
      name: "ChequeBook",
      path: "checkBook",
    },
    {
      name: "Snapshot",
      path: "snapshot",
    },
    {
      name: "HoldCharge",
      path: "holdCharge",
    },
    {
      name: "Disbursement",
      path: "disbursement",
    },
    {
      name: "Subsidy",
      path: "subsidy",
    },
    {
      name: "Document",
      path: "document",
    },
    {
      name: "Stop Pay",
      path: "stopPay",
    },
    {
      name: "Search",
      path: "search",
    },
    {
      name: "Insurance",
      path: "insurance",
    },
  ];
  const onConfirmFormButtonClickHandel = () => {
    console.log("helllo");
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          cursor: "pointer",
          padding: "10px",
          alignItems: "center",
          justifyContent: "space-evenly",
          fontFamily: "sans-serif",
          boxShadow: "0px 1px 4px -1px #999999",
          borderRadius: "5px",
          marginBottom: "10px",
        }}
      >
        {navArray.map((a) => {
          return <div onClick={() => navigate(a.path)}>{a.name}</div>;
        })}
        <div>
          <Button variant="contained" color="primary" onClick={handleOpen}>
            +
          </Button>
        </div>
      </div>

      <Dialog
        PaperProps={{
          style: {
            width: "100%",
            minHeight: "46vh",
          },
        }}
        open={open}
        onClose={handleClose}
        maxWidth="md"
        scroll="body"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Joint Full View for: Test Customer
        </DialogTitle>
        <DialogContent>
          <div
            style={{
              boxShadow: "0px 1px 4px -1px #999999",
              borderRadius: "5px",
              margin: "10px",
              padding: "10px",
            }}
          >
            <h3>Reference</h3>
            <FormWrapper
              metaData={reference}
              // onSubmitHandler={onSubmitHandler}
              onFormButtonClickHandel={onConfirmFormButtonClickHandel}
              hideHeader={true}
              displayMode={"new"}
              formStyle={{
                background: "white",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            ></FormWrapper>
          </div>
          <div
            style={{
              boxShadow: "0px 1px 4px -1px #999999",
              borderRadius: "5px",
              margin: "10px",
              padding: "10px",
            }}
          >
            <h3>Membership</h3>
            <FormWrapper
              metaData={membership}
              hideHeader={true}
              displayMode={"new"}
              formStyle={{
                background: "white",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            ></FormWrapper>
          </div>
          <div
            style={{
              boxShadow: "0px 1px 4px -1px #999999",
              borderRadius: "5px",
              margin: "10px",
              padding: "10px",
            }}
          >
            <FormWrapper
              metaData={personalDetail}
              hideHeader={true}
              displayMode={"new"}
              formStyle={{
                background: "white",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            ></FormWrapper>
          </div>

          <div
            style={{
              boxShadow: "0px 1px 4px -1px #999999",
              borderRadius: "5px",
              margin: "10px",
              padding: "10px",
            }}
          >
            <FormWrapper
              metaData={remarks}
              hideHeader={true}
              displayMode={"new"}
              formStyle={{
                background: "white",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            ></FormWrapper>
          </div>

          <div
            style={{
              boxShadow: "0px 1px 4px -1px #999999",
              borderRadius: "5px",
              margin: "10px",
              padding: "10px",
            }}
          >
            <h3>Mortgage/Hypothication/Security Detail</h3>

            <FormWrapper
              metaData={mortgage}
              hideHeader={true}
              displayMode={"new"}
              formStyle={{
                background: "white",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            ></FormWrapper>
          </div>

          <div
            style={{
              boxShadow: "0px 1px 4px -1px #999999",
              borderRadius: "5px",
              margin: "10px",
              padding: "10px",
            }}
          >
            <h3>Valuer</h3>
            <FormWrapper
              metaData={valuer}
              hideHeader={true}
              displayMode={"new"}
              formStyle={{
                background: "white",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            ></FormWrapper>
          </div>

          <div
            style={{
              boxShadow: "0px 1px 4px -1px #999999",
              borderRadius: "5px",
              margin: "10px",
              padding: "10px",
            }}
          >
            <h3>Tile Clearance</h3>
            <FormWrapper
              metaData={clearance}
              hideHeader={true}
              displayMode={"new"}
              formStyle={{
                background: "white",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            ></FormWrapper>
          </div>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </>
  );
};

export default Root;
