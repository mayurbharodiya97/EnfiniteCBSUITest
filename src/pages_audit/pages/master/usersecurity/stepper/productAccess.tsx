import {
  Fragment,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { productaccess } from "./metaData/metaDataGrid";
import * as API from "./api/api";
import { useMutation, useQuery } from "react-query";
import { AuthContext } from "pages_audit/auth";
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

export const ProductAccess = forwardRef<any, any>(
  ({ defaultView, username }, ref) => {
    const Username = username?.USER_NAME;
    const { authState } = useContext(AuthContext);
    const { userState, dispatchCommon, updateoldData2 } =
      useContext(SecurityContext);
    const [gridData, setGridData] = useState<any>([]);
    const [populateDataset, setpopulateDataset] = useState<any>([]);
    const [grid1Data, setGrid1Data] = useState<any>([]);
    const [combinedData, setCombinedData] = useState<any>([]);
    const [rowsData, setRowsData] = useState<any>([]);
    const navigate = useNavigate();

    const {
      data: newData,
      isLoading: newloading,
      isFetching: newfetching,
      isError: newisError,
      error: newerror,
      refetch: newRefetch,
    }: any = useQuery<any, any>(
      ["getNewUserProductAccess", Username],
      () =>
        API.getNewUserProductAccess({
          base_branch_cd: authState?.user?.baseBranchCode,
          base_comp_cd: authState?.baseCompanyID,
        }),
      { enabled: defaultView === "new" }
    );

    const {
      data: productData,
      isLoading: editloading,
      isFetching: editfetching,
      isError: editisError,
      error: editerror,
      refetch: editRefetch,
    }: any = useQuery<any, any>(
      ["getproductaccess", Username],
      () => API.getproductaccess({ userid: Username }),
      { enabled: defaultView === "edit" || defaultView === "view" }
    );

    const mutation = useMutation(API.getNewUserProductAccess, {
      onError: (error: any) => {
        let errorMsg = "Unknown Error occurred";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
      },
      onSuccess: (data) => {
        const updatedGrid1Data = data?.map((gridItem) => ({
          ...gridItem,
          ACCT_TYPE: gridItem?.ACCT_TYPE,
          ACCESS: gridItem?.ACCESS === "Y" ? true : false,
        }));
        let filteredGrid1Data = updatedGrid1Data?.filter(
          (gridItem) =>
            !productData?.some(
              (dataItem) => dataItem.TYPE_NM === gridItem?.TYPE_NM
            )
        );
        const last = filteredGrid1Data?.map((row) => ({
          ...row,
          _isNewRow: true,
        }));
        const MergeData = [...productData, ...last];
        setpopulateDataset(MergeData);
      },
    });

    useEffect(() => {
      if (defaultView === "new") {
        if (userState?.productUpdatedData?.length > 0) {
          setGridData(userState?.productUpdatedData);
        } else {
          setGridData(newData);
        }
      }
    }, [defaultView, userState?.productUpdatedData, newData]);

    useEffect(() => {
      if (defaultView === "edit" || defaultView === "view") {
        if (
          userState?.productUpdatedData.length === 0 &&
          populateDataset.length === 0
        ) {
          setGridData(productData);
          dispatchCommon("commonType", { oldproductContextData: productData });
        } else if (populateDataset.length > 0) {
          setGridData(populateDataset);
        } else {
          setGridData(userState?.productUpdatedData);
        }
      }
    }, [
      userState?.productUpdatedData,
      productData,
      populateDataset,
      defaultView,
    ]);
    const setCurrentAction = useCallback(
      (data) => {
        if (data.name === "populate") {
          setRowsData(data?.rows);
          mutation.mutate({
            base_branch_cd: authState?.user?.baseBranchCode ?? "",
            base_comp_cd: authState?.baseCompanyID ?? "",
          });
        } else {
          navigate(data?.name, {
            state: data?.rows,
          });
        }
      },
      [navigate, mutation, authState]
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
            extractGridMetaData(productaccess, defaultView) as GridMetaDataType
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
