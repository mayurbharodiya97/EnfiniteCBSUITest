import {
  Fragment,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { userAccessbranch } from "./metaData/metaDataGrid";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import { GridMetaDataType } from "components/dataTableStatic";
import * as API from "./api/api";
import { useMutation, useQuery } from "react-query";
import { AuthContext } from "pages_audit/auth";
import { ActionTypes } from "components/dataTable";
import { useNavigate } from "react-router-dom";
import { SecurityContext } from "../context/SecuityForm";
import { extractGridMetaData } from "components/utils";
import { Alert } from "reactstrap";
const actions: ActionTypes[] = [
  {
    actionName: "populate",
    actionLabel: "Populate",
    multiple: undefined,
    alwaysAvailable: true,
    rowDoubleClick: false,
  },
];

const BranchAccessRights = forwardRef<any, any>(
  ({ defaultView, username }, ref) => {
    const { authState } = useContext(AuthContext);
    const { userState, dispatchCommon } = useContext(SecurityContext);
    let Username = username?.USER_NAME;
    const [gridData, setGridData] = useState<any>([]);
    const [populateDataset, setpopulateDataset] = useState<any>([]);
    const navigate = useNavigate();
    const {
      data: mainData,
      isLoading: newloading,
      isFetching: newfetching,
      isError: newisError,
      error: newerror,
      refetch: newRefetch,
    }: any = useQuery<any, any>(
      ["getNewUserBranchAccess", Username],
      () => {
        if (defaultView === "new") {
          return API.getNewUserBranchAccess({
            comp_cd: authState?.companyID,
          });
        }
      }
    );
    const {
      data: branchData,
      isLoading: editloading,
      isFetching: editfetching,
      isError: editisError,
      error: editerror,
      refetch: editRefetch,
    }: any = useQuery<any, any>(["getUserAccessBranch", Username], () => {
      if (defaultView === "edit" || defaultView === "view") {
        return API.getUserAccessBranch({
          userid: Username,
        });
      }
    });
    const mutation = useMutation(API.getNewUserBranchAccess, {
      onError: (error: any) => {
        let errorMsg = "Unknown Error occured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
      },
      onSuccess: (data) => {
        const updatedGrid1Data = data.map((gridItem) => ({
          ...gridItem,
          BRANCH_CD: gridItem.BRANCH_CD,
          LOGIN_ACCESS: gridItem.LOGIN_ACCESS === "Y" ? true : false,
          REPORT_ACCESS: gridItem.REPORT_ACCESS === "Y" ? true : false,
        }));
        let filteredGrid1Data = updatedGrid1Data.filter(
          (gridItem) =>
            !branchData.some(
              (dataItem) => dataItem.BRANCH_NM === gridItem.BRANCH_NM
            )
        );
        const last = filteredGrid1Data.map((row) => ({
          ...row,
          _isNewRow: true,
        }));
        const MergeData = [...branchData, ...last];
        setpopulateDataset(MergeData);
      },
    });
    useEffect(() => {
      if (defaultView === "new") {
        if (userState?.branchUpdatedData?.length > 0) {
          setGridData(userState?.branchUpdatedData);
        } else {
          setGridData(mainData);
        }
      }
    }, [defaultView, userState?.branchUpdatedData, mainData]);
    useEffect(() => {
      if (defaultView === "edit" || defaultView === "view") {
        if (
          userState?.branchUpdatedData.length === 0 &&
          populateDataset.length === 0
        ) {
          setGridData(branchData);
          dispatchCommon("commonType", { oldbranchContextData: branchData });
        } else if (populateDataset.length > 0) {
          setGridData(populateDataset);
        } else {
          setGridData(userState?.branchUpdatedData);
        }
      }
    }, [
      userState?.branchUpdatedData,
      branchData,
      populateDataset,
      defaultView,
    ]);
    const setCurrentAction = useCallback(
      (data) => {
        if (data.name === "populate") {
          mutation.mutate({ comp_cd: authState?.companyID });
        } else {
          navigate(data?.name, {
            state: data?.rows,
          });
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
              userAccessbranch,
              defaultView
            ) as GridMetaDataType
          }
          data={gridData || []}
          actions={defaultView === "edit" ? actions : []}
          setAction={setCurrentAction}
          loading={
            newloading ||
            editloading ||
            newfetching ||
            editfetching ||
            mutation?.isLoading
          }
          setData={setGridData}
          refetchData={() => {
            newRefetch();
            editRefetch();
          }}
          ref={ref}
        />
      </Fragment>
    );
  }
);

export default BranchAccessRights;
