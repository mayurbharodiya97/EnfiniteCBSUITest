import {
  Fragment,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useMutation, useQuery } from "react-query";
import * as API from "./api/api";
import { applicationAccess } from "./metaData/metaDataGrid";
import { useNavigate } from "react-router-dom";
import { SecurityContext } from "../context/SecuityForm";
import { Alert } from "reactstrap";

import {
  extractGridMetaData,
  GridWrapper,
  GridMetaDataType,
  ActionTypes,
} from "@acuteinfo/common-base";
const actions: ActionTypes[] = [
  {
    actionName: "populate",
    actionLabel: "Populate",
    multiple: undefined,
    alwaysAvailable: true,
    rowDoubleClick: false,
  },
];
const NewApplicationAccess = forwardRef<any, any>(
  ({ defaultView, username }, ref) => {
    const Username = username?.USER_NAME;
    const [gridData, setGridData] = useState<any>([]);
    const [populateDataset, setpopulateDataset] = useState<any>([]);
    const { userState, dispatchCommon } = useContext(SecurityContext);
    const navigate = useNavigate();

    // Get API for New User.
    const {
      data: newData,
      isLoading: newloading,
      isFetching: newfetching,
      isError: newisError,
      error: newerror,
      refetch: newRefetch,
    }: any = useQuery<any, any>(
      ["getnewapplicationaccess", userState?.formData?.USER_NAME],
      () => {
        if (defaultView === "new") {
          return API.getnewapplicationaccess({ userid: "" });
        }
      }
    );

    // Get API for Existing User.
    const {
      data: applicationData,
      isLoading: editloading,
      isFetching: editfetching,
      isError: editisError,
      error: editerror,
      refetch: editRefetch,
    }: any = useQuery(["getapplicationaccess", Username], () => {
      if (defaultView === "edit" || defaultView === "view") {
        return API.getapplicationaccess({ userid: Username });
      }
    });
    const mutation = useMutation(API.getnewapplicationaccess, {
      onError: (error: any) => {
        let errorMsg = "Unknown Error occurred";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
      },
      onSuccess: (data) => {
        const updatedGrid1Data = data?.map((gridItem) => ({
          ...gridItem,
          APP_TRAN_CD: gridItem?.TRAN_CD,
          LOGIN_ACCESS: gridItem?.LOGIN_ACCESS === "Y" ? true : false,
        }));
        let filteredGrid1Data = updatedGrid1Data?.filter(
          (gridItem) =>
            !applicationData?.some(
              (dataItem) => dataItem.APP_NM === gridItem.APP_NM
            )
        );
        const last = filteredGrid1Data?.map((row) => ({
          ...row,
          _isNewRow: true,
        }));
        const MergeData = [...applicationData, ...last];
        setpopulateDataset(MergeData);
      },
    });
    useEffect(() => {
      if (defaultView === "new") {
        if (userState?.appUpdatedData?.length > 0) {
          setGridData(userState?.appUpdatedData);
        } else {
          setGridData(newData);
        }
      }
    }, [defaultView, userState?.appUpdatedData, newData]);
    useEffect(() => {
      if (defaultView === "edit" || defaultView === "view") {
        if (
          userState?.appUpdatedData.length === 0 &&
          populateDataset.length === 0
        ) {
          setGridData(applicationData);
          dispatchCommon("commonType", { oldappContextData: applicationData });
        } else if (populateDataset.length > 0) {
          setGridData(populateDataset);
        } else {
          setGridData(userState?.appUpdatedData);
        }
      }
    }, [
      userState?.appUpdatedData,
      applicationData,
      populateDataset,
      defaultView,
    ]);
    const setCurrentAction = useCallback(
      (data) => {
        if (data.name === "populate") {
          mutation.mutate({ userid: "" });
        } else {
          navigate(data.name, { state: data.rows });
        }
      },
      [navigate]
    );

    return (
      <Fragment>
        {newisError ||
          (editisError && (
            <Alert
              severity="error"
              errorMsg={
                newerror?.error_msg ??
                editerror?.error_msg ??
                "Somethingwenttowrong"
              }
              errorDetail={newerror?.error_detail ?? editerror?.error_detail}
              color="error"
            />
          ))}
        <GridWrapper
          key={`userAccessbranch`}
          finalMetaData={
            extractGridMetaData(
              applicationAccess,
              defaultView
            ) as GridMetaDataType
          }
          actions={defaultView === "edit" ? actions : []}
          setAction={setCurrentAction}
          data={gridData || []}
          loading={
            newloading ||
            editloading ||
            newfetching ||
            editfetching ||
            mutation?.isLoading
          }
          setData={setGridData}
          hideHeader={true}
          ref={ref}
          refetchData={() => {
            newRefetch();
            editRefetch();
          }}
        />
      </Fragment>
    );
  }
);

export default NewApplicationAccess;
