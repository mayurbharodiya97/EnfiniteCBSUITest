import React, { useState, useEffect, useCallback, useContext } from "react";
import { AppBar, Dialog, IconButton } from "@mui/material";
import * as API from "./api";
import { AuthContext } from "pages_audit/auth";
import { useMutation, useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import Dependencies from "pages_audit/acct_Inquiry/dependencies";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import {
  usePopupContext,
  Alert,
  LoaderPaperComponent,
  ActionTypes,
  queryClient,
} from "@acuteinfo/common-base";
export const DeactivateCustomer = ({ rowdata, onClose }) => {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [dependecyDialogOpen, setDependecyDialogOpen] = useState(false);
  const { state: data } = useLocation();
  const { MessageBox } = usePopupContext();
  // console.log("::stateeee", data)
  const {
    data: inactivateCustData,
    isError: isinactivateCustError,
    error: InactivateCustError,
    isLoading: isinactivateCustLoading,
    refetch: inactivateCustRefetch,
  } = useQuery<any, any>(["DeactivateCustomer", { data }], () =>
    API.DeactivateCustomer({
      COMP_CD: authState?.companyID ?? "",
      CUSTOMER_ID: data?.[0]?.data?.CUSTOMER_ID ?? "", // mutation?.data?.[0]?.CUSTOMER_ID ??
      // ACCT_TYPE: "143 ",
      // ACCT_CD: "000039",
      // AS_FROM: "C"
    })
  );

  useEffect(() => {
    if (inactivateCustData && !isinactivateCustLoading) {
      let data: any[] = inactivateCustData;
      if (Array.isArray(data) && data?.length > 0) {
        if (data?.[0]?.STATUS === "999" && Boolean(data?.[0]?.MSG)) {
          msgBox(data?.[0]?.STATUS, data?.[0]?.MSG);
        } else if (data?.[0]?.STATUS === "0") {
          msgBox(data?.[0]?.STATUS, "");
        }
      }
    }
  }, [inactivateCustData, isinactivateCustLoading]);

  const msgBox = async (status, msg) => {
    const buttonName = await MessageBox({
      messageTitle: "Confirmation",
      message:
        status === "999"
          ? msg
          : `Customer Deactivated Successfully : ${data?.[0]?.data?.CUSTOMER_ID}`,
      buttonNames: ["Ok"],
      loadingBtnName: ["Yes"],
    });
    if (buttonName === "Ok") {
      if (status === "999") {
        setDependecyDialogOpen(true);
      } else if (status === "0") {
        onClose();
      }
    }
  };

  return (
    <React.Fragment>
      {dependecyDialogOpen && (
        <Dependencies
          rowsData={data}
          open={dependecyDialogOpen}
          onClose={() => {
            setDependecyDialogOpen(false);
            onClose();
          }}
        />
      )}
      <Dialog
        open={true}
        maxWidth="lg"
        PaperProps={{
          style: {
            minWidth: "70%",
            width: "80%",
            // maxWidth: "90%",
          },
        }}
      >
        {isinactivateCustLoading ? (
          <div style={{ height: 100, paddingTop: 10 }}>
            <div style={{ padding: 10 }}>
              <LoaderPaperComponent />
            </div>
            {typeof onClose === "function" ? (
              <div style={{ position: "absolute", right: 0, top: 0 }}>
                <IconButton onClick={onClose}>
                  <HighlightOffOutlinedIcon />
                </IconButton>
              </div>
            ) : null}
          </div>
        ) : (
          isinactivateCustError && (
            <div
              style={{
                paddingRight: "10px",
                paddingLeft: "10px",
                height: 100,
                paddingTop: 10,
              }}
            >
              <AppBar position="relative" color="primary">
                <Alert
                  severity="error"
                  errorMsg={InactivateCustError?.error_msg ?? "Unknow Error"}
                  errorDetail={InactivateCustError?.error_detail ?? ""}
                  color="error"
                />
                {typeof onClose === "function" ? (
                  <div style={{ position: "absolute", right: 0, top: 0 }}>
                    <IconButton onClick={onClose}>
                      <HighlightOffOutlinedIcon />
                    </IconButton>
                  </div>
                ) : null}
              </AppBar>
            </div>
          )
        )}
      </Dialog>
    </React.Fragment>
  );
};
