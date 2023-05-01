import { DetailsGridWithHeader } from "components/detailPopupGridData";
import { CustomerDetailsForm } from "./metaData";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import { CustomerDetailsGridMetaData } from "./gridMetadata";
import { GridMetaDataType } from "components/dataTable/types";
import { FilterFormMetaType } from "components/formcomponent/filterform";
import { useMutation } from "react-query";
import * as API from "../api";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
export const CustomerDetailsGrid = ({ ClosedEventCall }) => {
  const { state: rows }: any = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const DetailsData = useMemo(() => {
    return (rows[0]?.data?.DETAILS_DATA ?? []).map((item, index) => ({
      SR_CD: index + 1,
      ...item,
    }));
  }, [rows]);
  useEffect(() => {
    if (rows.length === 0) {
      enqueueSnackbar("Please select one user to get the details", {
        variant: "warning",
      });
      ClosedEventCall();
      return;
    }
  }, [rows, enqueueSnackbar, ClosedEventCall]);
  const mutation = useMutation(API.updatePasswordResetData, {
    onSuccess: (response: any) => {
      enqueueSnackbar(response, {
        variant: "success",
      });
      onActionCancel();
    },
    onError: (error: any) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
      onActionCancel();
    },
  });
  const onPopupYes = (rows) => {
    mutation.mutate({
      userName: rows,
    });
  };
  const onActionCancel = () => {
    setIsOpenPopup(false);
  };
  const ClickEventManage = useCallback((data, columnvisible) => {
    setIsOpenPopup(true);
  }, []);
  return (
    <Fragment>
      <DetailsGridWithHeader
        metadata={CustomerDetailsGridMetaData as GridMetaDataType}
        ClosedEventCall={ClosedEventCall}
        data={DetailsData}
        HeaderMetaData={CustomerDetailsForm as FilterFormMetaType}
        HeaderData={rows[0]?.data ?? {}}
        ClickEventManage={ClickEventManage}
      />
      {isOpenPopup ? (
        <PopupMessageAPIWrapper
          MessageTitle="Confirmation"
          Message="Do you want to Password Reset?"
          onActionYes={(rowVal) => onPopupYes(rowVal)}
          onActionNo={() => onActionCancel()}
          rows={rows[0]?.data?.CUSTOMER_ID}
          open={isOpenPopup}
          loading={mutation.isLoading}
        />
      ) : null}
    </Fragment>
  );
};
