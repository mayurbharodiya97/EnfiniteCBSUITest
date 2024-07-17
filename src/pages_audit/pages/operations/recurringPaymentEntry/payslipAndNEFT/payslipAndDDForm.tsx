import { AppBar, Theme, Toolbar, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { usePopupContext } from "components/custom/popupContext";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { extractMetaData } from "components/utils";
import { InitialValuesType } from "packages/form";
import { forwardRef, useState } from "react";
import { PayslipAndDDFormMetaData } from "./metaData/payslipAndDDMetaData";

const useTypeStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    background: "var(--theme-color5)",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--theme-color2)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
  },
}));

export const PayslipAndDDForm = forwardRef<any, any>(
  (
    { defaultView, accountDetailsForPayslip, payslipSubmitHandler },
    ref: any
  ) => {
    const { MessageBox } = usePopupContext();
    const headerClasses = useTypeStyles();

    return (
      <>
        <AppBar position="relative" style={{ marginBottom: "10px" }}>
          <Toolbar variant="dense" className={headerClasses.root}>
            <Typography
              component="span"
              variant="h5"
              className={headerClasses.title}
            >
              {`${
                accountDetailsForPayslip?.SCREEN_NAME
              }\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0 Branch: ${
                accountDetailsForPayslip?.BRANCH_CD ?? ""
              }\u00A0\u00A0   A/c Type: ${
                accountDetailsForPayslip?.ACCT_TYPE ?? ""
              }\u00A0\u00A0   A/c No.: ${
                accountDetailsForPayslip?.ACCT_CD ?? ""
              }\u00A0\u00A0`}
            </Typography>
          </Toolbar>
        </AppBar>
        <FormWrapper
          key={"payslipAndDDForm" + accountDetailsForPayslip}
          metaData={
            extractMetaData(
              PayslipAndDDFormMetaData,
              defaultView
            ) as MetaDataType
          }
          hideHeader={true}
          initialValues={{ ...accountDetailsForPayslip } as InitialValuesType}
          onSubmitHandler={payslipSubmitHandler}
          ref={ref}
          formState={{
            MessageBox: MessageBox,
            accountDetailsForPayslip: accountDetailsForPayslip,
          }}
          formStyle={{
            background: "white",
          }}
        />
      </>
    );
  }
);
