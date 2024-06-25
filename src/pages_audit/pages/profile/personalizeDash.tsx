import { Grid } from "@mui/material";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  PersonlizationDashboardGridData,
  PersonlizationQuickGridMetaData,
} from "./metaData";
import { GridMetaDataType } from "components/dataTableStatic";
import { enqueueSnackbar } from "notistack";
import { useMutation, useQuery } from "react-query";

import { Alert } from "components/common/alert";
import * as API from "./api";
import { CreateDetailsRequestData } from "components/utils";
import { ActionTypes } from "components/dataTable";
import { AuthContext } from "pages_audit/auth";
import { useTranslation } from "react-i18next";
import { queryClient } from "cache";
export const PersonalizeDash = () => {
  const [dashBoxData, setDashBoxData] = useState<any>([]);
  const [quickViewData, setQuickViewData] = useState<any>([]);

  const { t } = useTranslation();
  const myGridRef = useRef<any>(null);
  const myGridQuickRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);

  const Dashactions: ActionTypes[] = [
    {
      actionName: "dashSave",
      actionLabel: "Save",
      multiple: false,
      rowDoubleClick: false,
      actionTextColor: "var(--theme-color2)",
      actionBackground: "var(--theme-color3)",
      alwaysAvailable: true,
      startsIcon: "Save",
      rotateIcon: "scale(1.4)",
    },
  ];
  const Quickactions: ActionTypes[] = [
    {
      actionName: "quickSave",
      actionLabel: "Save",
      multiple: false,
      rowDoubleClick: false,
      actionTextColor: "var(--theme-color2)",
      actionBackground: "var(--theme-color3)",
      alwaysAvailable: true,
      startsIcon: "Save",
      rotateIcon: "scale(1.4)",
    },
  ];

  const quickViewUsrData = useQuery<any, any, any>(
    ["GETUSRQUICKVIEW"],
    () =>
      API.getquickView({
        userID: authState?.user?.id,
        COMP_CD: authState?.companyID ?? "",
      }),
    {
      onSuccess: (data) => {
        setQuickViewData(data);
      },
    }
  );

  const dashboxUserData = useQuery<any, any, any>(
    ["GETUSRDASHBOX"],
    () =>
      API.getdashUserboxData({
        userID: authState?.user?.id,
        COMP_CD: authState?.companyID ?? "",
      }),
    {
      onSuccess: (data) => {
        setDashBoxData(data);
      },
    }
  );

  const saveQuickData: any = useMutation(
    "updateQuickViewData",
    API.updateQuickViewData,
    {
      onSuccess: () => {
        enqueueSnackbar("Record save successfully", {
          variant: "success",
        });
        quickViewUsrData.refetch();
      },
    }
  );

  const saveDashData: any = useMutation(
    "updateDashboxData",
    API.updateDashboxData,
    {
      onSuccess: () => {
        enqueueSnackbar("Record save successfully", {
          variant: "success",
        });
        dashboxUserData.refetch();
      },
    }
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["GETUSRQUICKVIEW"]);
      queryClient.removeQueries(["GETUSRDASHBOX"]);
      queryClient.removeQueries(["updateDashboxData"]);
      queryClient.removeQueries(["updateQuickViewData"]);
    };
  }, []);

  const setCurrentAction = useCallback((data) => {
    console.log("<<<data", data);
    if (data?.name === "quickSave") {
      async function quick() {
        let { hasError, data } = await myGridQuickRef.current?.validate(true);
        let isError = data.filter((item) => {
          if (item._error.DOC_CD) {
            return item._error.DOC_CD;
          }
        });

        if (isError[0]?._error?.DOC_CD) {
        } else {
          let result = myGridQuickRef?.current?.cleanData?.();
          let finalResult = result.filter((one) => !Boolean(one?._hidden));
          let newData = finalResult.map((item) => {
            // const trimmedDOC_CD = item.DOC_CD.trim();
            const newItem = {
              ...item,
              _isNewRow: item.IS_DATA === "N" && item.DOC_CD?.length > 0,
              BRANCH_CD: authState?.user?.branchCode,
            };
            return newItem;
          });
          newData = CreateDetailsRequestData(newData);
          if (newData.isNewRow) {
            newData.isNewRow.forEach((item) => {
              if ("TRAN_CD" in item) {
                delete item.TRAN_CD;
              }
              if ("LAST_ENTERED_DATE" in item) {
                delete item.LAST_ENTERED_DATE;
              }
            });
          }
          let reqData = {
            // ...refID,
            DETAILS_DATA: newData,
          };
          saveQuickData.mutate(reqData);
        }
      }
      quick();
    } else if (data?.name === "dashSave") {
      async function name() {
        let { hasError, data } = await myGridRef.current?.validate(true);
        let isError = data.filter((item) => {
          if (item._error.DASH_TRAN_CD.length > 5) {
            return (item._error.DASH_TRAN_CD = true);
          }
        });
        if (isError[0]?._error?.DASH_TRAN_CD) {
        } else {
          let result = myGridRef?.current?.cleanData?.();
          let finalResult = result.filter((one) => !Boolean(one?._hidden));
          let newData = finalResult.map((item) => {
            const newItem = {
              ...item,
              _isNewRow:
                item.IS_DATA === "N" && parseInt(item.DASH_TRAN_CD) > 0,
              USER_TYPE: "USER",
            };
            return newItem;
          });
          newData = CreateDetailsRequestData(newData);
          if (newData.isNewRow) {
            newData.isNewRow.forEach((item) => {
              delete item.TRAN_CD;
            });
          }
          let data = {
            // ...refID,
            DETAILS_DATA: newData,
          };
          saveDashData.mutate(data);
        }
      }
      name();
    }
  }, []);

  return (
    <>
      <Grid
        container
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 1,
          height: "fit-content",
        }}
      >
        <Grid
          item
          xs={5.9}
          md={5.9}
          sx={{
            boxShadow:
              "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
          }}
        >
          {saveQuickData?.isError || quickViewUsrData?.isError ? (
            <Alert
              severity="error"
              errorMsg={
                saveQuickData.error?.error_msg ??
                quickViewUsrData.error?.error_msg ??
                "Unknown Error occured"
              }
              errorDetail={
                saveQuickData.error?.error_detail ??
                quickViewUsrData.error?.error_detail ??
                ""
              }
            />
          ) : null}
          <GridWrapper
            key={`personalizeQuickView`}
            finalMetaData={PersonlizationQuickGridMetaData as GridMetaDataType}
            data={quickViewData ?? []}
            setData={setQuickViewData}
            loading={quickViewUsrData.isLoading || saveQuickData?.isLoading}
            actions={Quickactions}
            setAction={setCurrentAction}
            headerToolbarStyle={{
              background: "var(--theme-color2)",
              color: "black",
            }}
            ref={myGridQuickRef}
          />
        </Grid>
        <Grid
          item
          xs={5.9}
          md={5.9}
          sx={{
            boxShadow:
              "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
          }}
        >
          {saveDashData?.isError || dashboxUserData?.isError ? (
            <Alert
              severity="error"
              errorMsg={
                saveDashData.error?.error_msg ??
                dashboxUserData?.error?.error_msg ??
                "Unknown Error occured"
              }
              errorDetail={
                saveDashData.error?.error_detail ??
                dashboxUserData.error?.error_detail ??
                ""
              }
            />
          ) : null}
          <GridWrapper
            key={`personalizeDashboardData`}
            finalMetaData={PersonlizationDashboardGridData as GridMetaDataType}
            data={dashBoxData ?? []}
            headerToolbarStyle={{
              background: "var(--theme-color2)",
              color: "black",
            }}
            setData={setDashBoxData}
            loading={dashboxUserData.isLoading || saveDashData?.isLoading}
            actions={Dashactions}
            setAction={setCurrentAction}
            ref={myGridRef}
          />
        </Grid>
      </Grid>
    </>
  );
};
