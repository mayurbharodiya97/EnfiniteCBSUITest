import { GridMetaDataType } from "components/dataTableStatic";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import React, { useCallback, useEffect, useState } from "react";
import { useMutation } from "react-query";
import { RetrieveData } from "./retrieveData";
import * as API from "./api";
import { ActionTypes } from "components/dataTable";
import { AppBar } from "@mui/material";
import { Alert } from "components/common/alert";
import { chequeBkConfirmGridMetaData } from "./chequebkConfirmGridMetadata";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ConfirmationForm } from "./confirmationForm";

export const ChequebookConfirm = () => {
  const [isRetrieve, isSetRetrieve] = useState<any>(true);

  const navigate = useNavigate();
  const actions: ActionTypes[] = [
    {
      actionName: "retrieve",
      actionLabel: "Retrieve",
      multiple: undefined,
      rowDoubleClick: false,
      alwaysAvailable: true,
    },
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
      if (data?.name === "retrieve") {
        isSetRetrieve(true);
      } else if (data?.name === "view-detail") {
        navigate(data?.name, {
          state: data?.rows,
        });
      } else if (data?.name === "confirm") {
        console.log("<<<confirm", data);
      }
    },
    [navigate]
  );

  let closeDialog = () => {
    isSetRetrieve(false);
  };

  const chequeBkConfirmDetail: any = useMutation(
    "chequeBkConfirmGrid",
    API.chequeBkConfirmGrid,
    {}
  );

  return (
    <>
      {chequeBkConfirmDetail?.isError && (
        <AppBar position="relative" color="primary">
          <Alert
            severity="error"
            errorMsg={chequeBkConfirmDetail?.error?.error_msg ?? "Unknow Error"}
            errorDetail={chequeBkConfirmDetail?.error?.error_detail ?? ""}
            color="error"
          />
        </AppBar>
      )}

      <GridWrapper
        key={`chequebookConfirm`}
        finalMetaData={chequeBkConfirmGridMetaData as GridMetaDataType}
        data={chequeBkConfirmDetail.data ?? []}
        setData={() => {}}
        actions={actions}
        setAction={setCurrentAction}
        loading={chequeBkConfirmDetail?.isLoading}
        onClickActionEvent={async (index, id, data) => {}}
      />
      <Routes>
        <Route
          path="view-detail/*"
          element={<ConfirmationForm navigate={navigate} />}
        />
      </Routes>

      {isRetrieve && (
        <RetrieveData
          isRetrieve={isRetrieve}
          closeDialog={closeDialog}
          chequeBkConfirmDetail={chequeBkConfirmDetail}
        />
      )}
    </>
  );
};
