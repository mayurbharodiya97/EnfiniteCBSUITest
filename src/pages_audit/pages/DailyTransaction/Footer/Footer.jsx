import FormWrapper from "components/dyanmicForm";
import React from "react";
import { footerFormMetaData } from "./metaData";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Box, Grid, IconButton, Typography } from "@mui/material";

const Footer = () => {
  return (
    <>
      <div
        style={{
          boxShadow: "0px 1px 4px -1px #999999",
          borderRadius: "5px",
          margin: "9px",
        }}
      >
        <Grid item xl={12} lg={8} xs={12} sm={6} md={4}>
          <FormWrapper
            metaData={footerFormMetaData}
            hideHeader={true}
            displayMode={"new"}
            formStyle={{
              background: "white",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          ></FormWrapper>{" "}
        </Grid>
      </div>

      <Grid item xl={12} lg={8} xs={12} sm={6} md={4} spacing={5}>
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
      </Grid>
    </>
  );
};

export default Footer;
