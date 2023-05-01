import { useRef, useCallback, useEffect, useContext, useState } from "react";
import { DynamicBillerGridMetaData } from "./gridMetadata";
import GridWrapper from "components/dataTableStatic";
import { Alert } from "components/common/alert";
import { ActionTypes } from "components/dataTable";
import { useNavigate } from "react-router-dom";
import { GridMetaDataType } from "components/dataTable/types";
import { ClearCacheContext, queryClient } from "cache";
import { useMutation, useQuery } from "react-query";
import * as API from "./api";
import { useSnackbar } from "notistack";
import { Dialog } from "@mui/material";
import BillerDetailRefresh from "./billerDetailRefresh/billerDetailRefresh";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { StringtoUnicode } from "components/utils";

const actions: ActionTypes[] = [
  {
    actionName: "close",
    actionLabel: "Close",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  {
    actionName: "view-detail",
    actionLabel: "View Detail",
    multiple: false,
    rowDoubleClick: true,
  },
  {
    actionName: "update",
    actionLabel: "Update",
    multiple: true,
    rowDoubleClick: false,
  },
];

export const RefreshBillersData = ({ onCloseDialog }) => {
  const isDataChangedRef = useRef(false);
  const myGridRef = useRef<any>(null);
  const { getEntries } = useContext(ClearCacheContext);
  const { enqueueSnackbar } = useSnackbar();
  const [rowData, setRowData] = useState({});
  const [isOpenFields, setIsOpenFields] = useState(false);
  const [isOpenUpdateMsg, setIsOpenUpdateMsg] = useState(false);
  const navigate = useNavigate();
  const setCurrentAction = useCallback(
    (data) => {
      setRowData(data?.rows);
      if (data.name === "close") {
        onCloseDialog();
      } else if (data.name === "view-detail") {
        setIsOpenFields(true);
      } else if (data.name === "update") {
        setIsOpenUpdateMsg(true);
      } else {
        navigate(data?.name, {
          state: data?.rows,
        });
      }
    },
    [navigate]
  );
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getBillerInfoRefreshData"], () => API.getBillerInfoRefreshData());

  const onActionCancel = () => {
    setIsOpenUpdateMsg(false);
  };
  const result = useMutation(API.refreshBillerData, {
    onSuccess: (response: any) => {
      enqueueSnackbar(response, { variant: "success" });
      onActionCancel();
      onCloseDialog();
    },
    onError: (error: any) => {
      enqueueSnackbar(error?.error_msg ?? "error", { variant: "error" });
    },
    onSettled: () => {
      onActionCancel();
    },
  });
  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getBillerInfoRefreshData"]);
    };
  }, [getEntries]);

  const onAcceptPopupYes = (rows) => {
    let newReqData = data?.mainData?.map((item) => {
      let newitem = item;
      let { subCategories } = newitem;
      subCategories = subCategories.map((subitem) => {
        let { billerInformationList } = subitem;
        billerInformationList = billerInformationList.filter((billeritem) => {
          return rows.some((rowitem) => {
            if (
              rowitem?.data?.BILLER_ID === billeritem?.billerId &&
              rowitem?.data?.SUB_CATEGORY_ID === subitem?.code &&
              rowitem?.data?.CATEGORY_ID === item?.code
            ) {
              return true;
            }
            return false;
          });
        });
        billerInformationList = billerInformationList.map((biller) => {
          biller.fieldMetaList = biller?.fieldMetaList.map((field) => {
            if (
              Array.isArray(field?.fieldLabels) &&
              field?.fieldLabels.length > 0
            ) {
              field.fieldLabels = field?.fieldLabels.map((labels) => {
                if (labels?.language === "bn") {
                  labels.label = StringtoUnicode(labels.label);
                }
                return labels;
              });
            }
            return field;
          });
          return biller;
        });
        return { ...subitem, billerInformationList: billerInformationList };
      });
      return { ...newitem, subCategories: subCategories };
    });
    newReqData = newReqData.map((item) => {
      let { subCategories } = item;
      subCategories = subCategories.filter((subitem) => {
        if (subitem?.billerInformationList?.length === 0) {
          return false;
        }
        return true;
      });
      return { ...item, subCategories: subCategories };
    });
    newReqData = newReqData.filter((item) => {
      if (item?.subCategories?.length === 0) {
        return false;
      }
      return true;
    });
    newReqData = { data: newReqData };
    result.mutate(newReqData);
  };

  const onCloseFieldDialog = () => {
    setIsOpenFields(false);
  };
  return (
    // <Fragment>
    <Dialog open={true} fullScreen={true}>
      {isError && (
        <Alert
          severity="error"
          errorMsg={error?.error_msg ?? "Something went to wrong.."}
          errorDetail={error?.error_detail}
          color="error"
        />
      )}
      <GridWrapper
        key={`refreshBillerData`}
        finalMetaData={DynamicBillerGridMetaData as GridMetaDataType}
        data={data?.billerData ?? []}
        setData={() => null}
        loading={isLoading || isFetching}
        actions={actions}
        setAction={setCurrentAction}
        refetchData={() => refetch()}
        ref={myGridRef}
      />
      {isOpenFields ? (
        <BillerDetailRefresh
          open={isOpenFields}
          closeDialog={() => onCloseFieldDialog()}
          billerData={rowData?.[0]?.data}
        />
      ) : null}
      {isOpenUpdateMsg ? (
        <PopupMessageAPIWrapper
          MessageTitle="Confirmation"
          Message="Do you want to update selected biller data?"
          onActionYes={(rowVal) => onAcceptPopupYes(rowVal)}
          onActionNo={() => onActionCancel()}
          rows={rowData}
          open={isOpenUpdateMsg}
          loading={result.isLoading}
        />
      ) : null}
    </Dialog>
    // </Fragment>
  );
};
