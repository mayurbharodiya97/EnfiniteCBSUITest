import { DetailsGridWithHeader } from "components/detailPopupGridData";
import { Fragment, useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import { GridMetaDataType } from "components/dataTable/types";
import { FilterFormMetaType } from "components/formcomponent/filterform";
import {
  CustomerDetailsGridMetaData,
  CustomerDetailsForm,
} from "./gridMetadata";
import { UpdateRequestDataVisibleColumn } from "components/utils";
import { useMutation } from "react-query";
import * as API from "../api";

export const CustomerDataRefreshView = ({ ClosedEventCall }) => {
  const { state: rows }: any = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const [secondButtonHide, setSecondButtonHide] = useState(true);
  useEffect(() => {
    if (rows.length === 0) {
      enqueueSnackbar("Please select one user to get the details", {
        variant: "warning",
      });
      ClosedEventCall();
      return;
    }
  }, [rows, enqueueSnackbar, ClosedEventCall]);

  const getData = useMutation(API.getRefreshDataDetail, {
    onSuccess: (response: any) => {
      setSecondButtonHide(false);
    },
    onError: (error: any) => {
      setSecondButtonHide(true);
    },
  });

  const updateData = useMutation(API.updateCustomerRefreshData, {
    onSuccess: (response: any) => {
      setSecondButtonHide(true);
      enqueueSnackbar(response, {
        variant: "success",
      });
      ClosedEventCall();
    },
    onError: (error: any) => {
      setSecondButtonHide(false);
    },
  });

  const ClickEventManage = useCallback(
    (data, columnvisible) => {
      let retdata = UpdateRequestDataVisibleColumn(data, columnvisible);
      getData.mutate(rows[0]?.data.CUSTOMER_ID);
    },
    [getData]
  );
  const ClickSecondButtonEventManage = useCallback(
    (retdata, columnvisible) => {
      let retrdata = UpdateRequestDataVisibleColumn(retdata, columnvisible);
      // setRetData(retrdata);
      updateData.mutate({
        customerID: rows[0]?.data.CUSTOMER_ID,
        userName: rows[0]?.data.CUSTOMER_ID,
        inputData: getData?.data,
      });
    },
    [getData]
  );

  return (
    <Fragment>
      {/* {getData.isError && (
        <Alert
          severity={getData.error?.severity ?? "error"}
          errorMsg={getData.error?.error_msg ?? "Something went to wrong.."}
          errorDetail={getData.error?.error_detail}
          color="error"
        />
      )}
      {updateData.isError && (
        <Alert
          severity={updateData.error?.severity ?? "error"}
          errorMsg={updateData.error?.error_msg ?? "Something went to wrong.."}
          errorDetail={updateData.error?.error_detail}
          color="error"
        />
      )} */}
      <DetailsGridWithHeader
        metadata={CustomerDetailsGridMetaData as GridMetaDataType}
        ClosedEventCall={ClosedEventCall}
        data={getData?.data ?? []}
        HeaderMetaData={CustomerDetailsForm as FilterFormMetaType}
        HeaderData={rows[0]?.data ?? {}}
        ClickEventManage={ClickEventManage}
        isLoading={getData.isLoading}
        submitSecondAction={ClickSecondButtonEventManage}
        submitSecondButtonName="Update Data"
        submitSecondButtonHide={secondButtonHide}
        submitSecondLoading={false}
        isError={getData.isError || updateData.isError}
        ErrorMessage={
          getData.isError
            ? getData.error?.error_msg
            : updateData.isError
            ? updateData.error?.error_msg
            : ""
        }
      />
      {/* <h1>Test</h1> */}
    </Fragment>
  );
};
