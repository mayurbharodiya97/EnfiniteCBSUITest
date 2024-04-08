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
      actionName: "save",
      actionLabel: `${t("Save")}`,
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
      actionName: "save",
      actionLabel: `${t("Save")}`,
      multiple: false,
      rowDoubleClick: false,
      actionTextColor: "var(--theme-color2)",
      actionBackground: "var(--theme-color3)",
      alwaysAvailable: true,
      startsIcon: "Save",
      rotateIcon: "scale(1.4)",
    },
  ];

  const quickViewUsrData = useQuery<any, any, any>(["GETUSRQUICKVIEW"], () =>
    API.getquickView({
      userID: authState?.user?.id,
      COMP_CD: authState?.companyID ?? "",
    })
  );
  const dashboxUserData = useQuery<any, any, any>(["GETUSRDASHBOX"], () =>
    API.getdashUserboxData({
      userID: authState?.user?.id,
      COMP_CD: authState?.companyID ?? "",
    })
  );

  const setCurrentAction = useCallback((data) => {
    handleSubmit();
  }, []);

  const setQuickAction = useCallback((data) => {
    quickSubmit();
  }, []);
  const handleSubmit = async () => {
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
          _isNewRow: item.IS_DATA === "N" && parseInt(item.DASH_TRAN_CD) > 0,
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
  };

  const quickSubmit = async () => {
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
  };

  const saveDashData: any = useMutation(API.updateDashboxData, {
    onSuccess: (data, { endSubmit }) => {
      enqueueSnackbar("Record save successfully", {
        variant: "success",
      });
      dashboxUserData.refetch();
    },
  });
  const saveQuickData: any = useMutation(API.updateQuickViewData, {
    // onSuccess: (data) => {},
    onSuccess: (data, { endSubmit }) => {
      enqueueSnackbar("Record save successfully", {
        variant: "success",
      });
      quickViewUsrData.refetch();
    },
  });
  useEffect(() => {
    setQuickViewData(quickViewUsrData.data);
  }, [quickViewUsrData.data]);

  useEffect(() => {
    setDashBoxData(dashboxUserData.data);
  }, [dashboxUserData.data]);
  useEffect(() => {
    return () => {
      queryClient.removeQueries(["GETUSRQUICKVIEW"]);
      queryClient.removeQueries(["GETUSRDASHBOX"]);
    };
  }, []);
  return (
    <>
      <Grid
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 3,
          p: 2,
          height: "fit-content",
        }}
      >
        <Grid
          container
          sx={{
            boxShadow:
              "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
          }}
        >
          {saveQuickData?.isError && (
            <Alert
              severity="error"
              errorMsg={
                saveQuickData.error?.error_msg ?? "Unknown Error occured"
              }
              errorDetail={saveQuickData.error?.error_detail ?? ""}
            />
          )}
          <GridWrapper
            key={`personalizeQuickView`}
            finalMetaData={PersonlizationQuickGridMetaData as GridMetaDataType}
            data={quickViewData ?? []}
            setData={setQuickViewData}
            loading={saveQuickData.isLoading}
            actions={Quickactions}
            // controlsAtBottom={true}
            setAction={setQuickAction}
            headerToolbarStyle={{
              background: "var(--theme-color2)",
              color: "black",
            }}
            // refetchData={() => {}}
            ref={myGridQuickRef}
          />
        </Grid>
        <Grid
          container
          sx={{
            boxShadow:
              "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
          }}
        >
          {saveDashData?.isError && (
            <Alert
              severity="error"
              errorMsg={
                saveDashData.error?.error_msg ?? "Unknown Error occured"
              }
              errorDetail={saveDashData.error?.error_detail ?? ""}
            />
          )}
          <GridWrapper
            key={`personalizeDashboardData`}
            finalMetaData={PersonlizationDashboardGridData as GridMetaDataType}
            data={dashBoxData ?? []}
            headerToolbarStyle={{
              background: "var(--theme-color2)",
              color: "black",
            }}
            setData={setDashBoxData}
            loading={saveDashData.isLoading}
            actions={Dashactions}
            // controlsAtBottom={true}
            setAction={setCurrentAction}
            // refetchData={() => {}}
            ref={myGridRef}
          />
        </Grid>
      </Grid>
    </>
  );
};
