import { AppBar, Button, Dialog } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";

import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { useLocation } from "react-router-dom";
import { confirmFormMetaData } from "./confirmationFormMetadata";
import { useMutation } from "react-query";
import { chequeBookCfm } from "../api";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { AuthContext } from "pages_audit/auth";
import { enqueueSnackbar } from "notistack";
import { usePopupContext } from "components/custom/popupContext";
import { Alert } from "components/common/alert";

export const ChequebookCfmForm = ({ closeDialog, result }) => {
  const { state: rows }: any = useLocation();
  const [isOpenSave, setIsOpenSave] = useState(false);
  const [isConfirm, setIsConfirm] = useState<any>();
  const { authState } = useContext(AuthContext);
  const { MessageBox } = usePopupContext();

  const chequeBkCfm: any = useMutation("chequeBkConfirmGrid", chequeBookCfm, {
    onError: () => {
      setIsOpenSave(false);
      // closeDialog();
    },
    onSuccess: (data, variables) => {
      setIsOpenSave(false);
      closeDialog();

      if (data?.status === "99") {
        MessageBox({
          messageTitle: "Invalid Confirmation",
          message: data?.message,
          icon: "WARNING",
        });
      } else {
        result.mutate({
          screenFlag: "chequebookCFM",
          COMP_CD: authState?.companyID,
          BRANCH_CD: rows?.[0]?.data?.BRANCH_CD,
          FROM_DATE: result?.variables?.FROM_DATE,
          TO_DATE: result?.variables?.TO_DATE,
          FLAG: variables?.FLAG ?? "",
        });
        if (Boolean(variables?.IS_CONFIMED)) {
          enqueueSnackbar("Data has been successfully confirmed", {
            variant: "success",
          });
        } else if (!Boolean(variables?.IS_CONFIMED)) {
          enqueueSnackbar("Data has been successfully Rejected", {
            variant: "success",
          });
        }
      }
    },
  });

  useEffect(() => {
    if (rows?.[0]?.data) {
      confirmFormMetaData.form.label = `Confirmation Detail \u00A0\u00A0 
      ${(
        rows?.[0]?.data?.COMP_CD +
        rows?.[0]?.data?.BRANCH_CD +
        rows?.[0]?.data?.ACCT_TYPE +
        rows?.[0]?.data?.ACCT_CD
      ).replace(/\s/g, "")}   \u00A0\u00A0   ${rows?.[0]?.data?.ACCT_NM}   `;
    }
  }, [rows?.[0]?.data]);

  return (
    <Dialog
      open={true}
      fullWidth={true}
      PaperProps={{
        style: {
          maxWidth: "1035px",
        },
      }}
    >
      <>
        {chequeBkCfm.isError && (
          <AppBar position="relative" color="primary">
            <Alert
              severity="error"
              errorMsg={chequeBkCfm?.error?.error_msg ?? "Unknow Error"}
              errorDetail={chequeBkCfm?.error?.error_detail ?? ""}
              color="error"
            />
          </AppBar>
        )}

        <FormWrapper
          key={"confirmation-Form"}
          metaData={confirmFormMetaData}
          initialValues={rows?.[0]?.data ?? []}
          displayMode="view"
          hideDisplayModeInTitle={true}
          formStyle={{
            background: "white",
            height: "calc(100vh - 543px)",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {({ isSubmitting, handleSubmit }) => {
            return (
              <>
                <Button
                  color="primary"
                  onClick={() => {
                    setIsOpenSave(true);
                    setIsConfirm("C");
                  }}
                >
                  Confirm
                </Button>
                <Button
                  color="primary"
                  onClick={() => {
                    setIsOpenSave(true);
                    setIsConfirm("R");
                  }}
                >
                  Reject
                </Button>
                <Button color="primary" onClick={closeDialog}>
                  close
                </Button>
              </>
            );
          }}
        </FormWrapper>

        {isOpenSave && (
          <PopupMessageAPIWrapper
            MessageTitle={"Confirmation"}
            Message={`Are you sure to  ${
              isConfirm === "C" ? "Confirm" : "Reject"
            } `}
            onActionYes={(rows) => {
              chequeBkCfm.mutate({
                IS_CONFIMED: isConfirm === "C" ? true : false,
                FLAG: rows?.REQ_FLAG,
                COMP_CD: authState?.companyID,
                BRANCH_CD: rows?.BRANCH_CD,
                TRAN_CD: rows?.TRAN_CD,
                AUTO_CHQBK_PRINT_FLAG: rows?.AUTO_CHQBK_PRINT_FLAG,
                ENTERED_BY: rows?.ENTERED_BY,
              });
            }}
            onActionNo={() => setIsOpenSave(false)}
            rows={rows?.[0]?.data}
            open={isOpenSave}
            loading={chequeBkCfm.isLoading}
          />
        )}
      </>
    </Dialog>
  );
};
