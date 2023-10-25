import FormWrapper from "components/dyanmicForm";
import React from "react";
import { footerForm } from "./metaData";
import { Button } from "@mui/material";

const Footer = () => {
  return (
    <>
      <div
        style={{
          boxShadow: "0px 1px 4px -1px #999999",
          borderRadius: "5px",
          marginTop: "10px",
        }}
      >
        <FormWrapper
          metaData={footerForm}
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
          marginTop: "10px",
          padding: "10px",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <Button variant="contained" color="primary">
          View All
        </Button>
        <Button variant="contained" color="primary">
          Search
        </Button>
        <Button variant="contained" color="primary">
          Calculator
        </Button>
        <Button variant="contained" color="primary">
          Query
        </Button>
        <Button variant="contained" color="primary">
          Delete
        </Button>
        <Button variant="contained" color="primary">
          refresh
        </Button>
        <Button variant="contained" color="primary">
          scroll search
        </Button>
        <Button variant="contained" color="primary">
          scroll del
        </Button>
        <Button variant="contained" color="primary">
          other a/c
        </Button>
        <Button variant="contained" color="primary">
          other Tx Detail
        </Button>
      </div>
    </>
  );
};

export default Footer;
