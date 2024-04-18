import { GridMetaDataType } from "components/dataTableStatic";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import * as API from "./api";
import { ActionTypes } from "components/dataTable";
import { AppBar } from "@mui/material";
import { Alert } from "components/common/alert";
import { Route, Routes, useNavigate } from "react-router-dom";
import { AuthContext } from "pages_audit/auth";
import { lienConfirmGridMetaData } from "./lienConfirmGridMetadata";
import { LienConfirmationForm } from "./confirmationForm";

export const LienConfirm = () => {
  const { authState } = useContext(AuthContext);

  const navigate = useNavigate();
  const actions: ActionTypes[] = [
    {
      actionName: "confirm",
      actionLabel: "Confirm",
      multiple: true,
      rowDoubleClick: false,
      alwaysAvailable: false,
      actionTextColor: "var(--theme-color2) !important",
    },
    {
      actionName: "view-detail",
      actionLabel: "View Detail",
      multiple: false,
      rowDoubleClick: true,
    },
  ];

  const setCurrentAction = useCallback(
    (data) => {
      if (data?.name === "view-detail") {
        navigate(data?.name, {
          state: data?.rows,
        });
      } else if (data?.name === "confirm") {
        console.log("<<<confirm", data);
      }
    },
    [navigate]
  );

  const {
    data: lienGridData,
    isError,
    error,
    isLoading,
  } = useQuery<any, any, any>(["lienConfirmGrid"], () =>
    API.lienConfirmGrid({
      COMP_CD: authState?.companyID,
      BRANCH_CD: authState?.user?.branchCode,
    })
  );

  return (
    <>
      {isError && (
        <AppBar position="relative" color="primary">
          <Alert
            severity="error"
            errorMsg={error?.error_msg ?? "Unknow Error"}
            errorDetail={error?.error_detail ?? ""}
            color="error"
          />
        </AppBar>
      )}

      <GridWrapper
        key={`lienConfirm`}
        finalMetaData={lienConfirmGridMetaData as GridMetaDataType}
        data={lienGridData ?? []}
        setData={() => {}}
        actions={actions}
        setAction={setCurrentAction}
        loading={isLoading}
        onClickActionEvent={async (index, id, data) => {}}
      />
      <Routes>
        <Route
          path="view-detail/*"
          element={<LienConfirmationForm navigate={navigate} />}
        />
      </Routes>
    </>
  );
};
