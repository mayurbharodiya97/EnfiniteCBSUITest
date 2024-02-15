import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "pages_audit/auth";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  Grid,
  InputAdornment,
  List,
  ListItem,
} from "@mui/material";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { GradientButton } from "components/styledComponent/button";
import { useSnackbar } from "notistack";
import { useMutation, useQuery } from "react-query";
import * as API from "./api";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { InwardClearingRetrievalMetadata } from "./metadata";
import { useStyles } from "pages_audit/auth/style";
import SearchIcon from "@mui/icons-material/Search";
import { TextField } from "components/styledComponent";
import { SubmitFnType } from "packages/form";
import { Alert } from "components/common/alert";
import { queryClient } from "cache";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import { InwardCleaingGridMetaData } from "./gridMetadata";
import { GridMetaDataType } from "components/dataTableStatic";
import { ActionTypes } from "components/dataTable";
const actions: ActionTypes[] = [
  {
    actionName: "retrieve",
    actionLabel: "Retrieve",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
];
export const InwardClearing = () => {
  const [isOpenRetrieve, setIsOpenRetrieve] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const actionClasses = useStyles();
  const { authState } = useContext(AuthContext);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const selectedRowsRef = useRef<any>(null);
  const myRef = useRef<any>();
  const [selectedRowsData, setSelectedRowsData] = useState<any>([]);
  const [selectAll, setSelectAll] = useState<any>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState<any>([]);

  const { data, isLoading, isFetching, refetch, error, isError, status } =
    useQuery<any, any>(["BranchSelectionGridData"], () =>
      API.BranchSelectionGridData()
    );

  const getInwardClearingData: any = useMutation(API.getInwardClearingData, {
    onSuccess: (data) => {
      refetch();
    },
    onError: (error: any) => {},
  });

  const setCurrentAction = useCallback((data) => {
    if (data?.name === "retrieve") {
      setIsOpenRetrieve(true);
    }
    // else {
    //   navigate(data?.name, {
    //     state: data?.rows,
    //   });
    // }
  }, []);
  useEffect(() => {
    if (!isLoading && !isFetching) {
      const filteredData = data.filter(
        (item) => item?.value === authState?.user?.branchCode
      );
      setFilteredData(data);
      setSelectedRows(filteredData.map((item) => item?.value));
    }
  }, [isLoading, isFetching]);
  useEffect(() => {
    return () => {
      queryClient.removeQueries(["BranchSelectionGridData"]);
    };
  }, []);
  const handleRowClick = (event: any, name: string, label: string) => {
    setSelectAll(false);
    if (event.ctrlKey) {
      if (selectedRows.includes(name) || selectedRowsData.includes(label)) {
        setSelectedRows((prev) => prev.filter((row) => row !== name));
        setSelectedRowsData((prev) => prev.filter((row) => row !== label));
      } else {
        setSelectedRows([...selectedRows, name]);
        setSelectedRowsData([...selectedRowsData, label]);
      }
    } else {
      setSelectedRows([name]);
      setSelectedRowsData([label]);
    }
  };
  const handleSearchInputChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    const filtered = data.filter((item) =>
      item.label.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const onSubmitHandler: SubmitFnType = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    // @ts-ignore
    endSubmit(true);

    getInwardClearingData.mutate({
      data: {
        ...data,
        BRANCH_CD: selectedRowsRef.current,
        COMP_CD: authState?.companyID ?? "",
        TRAN_DT: authState?.workingDate,
      },
      endSubmit,
    });
    setIsOpenRetrieve(false);
  };
  return (
    <>
      <Dialog
        open={isOpenRetrieve}
        //@ts-ignore
        PaperProps={{
          style: {
            width: "55%",
            // minHeight: "36vh",
            // height: "36vh",
          },
        }}
        maxWidth="md"
      >
        <>
          <FormWrapper
            key={"inwardClearingRetrieval"}
            metaData={InwardClearingRetrievalMetadata as MetaDataType}
            initialValues={{}}
            onSubmitHandler={onSubmitHandler}
            //@ts-ignore
            formStyle={{
              background: "white",
              padding: "0px",
            }}
            ref={myRef}
          />
          <TextField
            placeholder="Search"
            id=""
            name={"Search"}
            size="small"
            value={searchQuery}
            onChange={handleSearchInputChange}
            style={{ width: "96%", margin: "0px 11px auto" }}
            InputProps={{
              style: { margin: "0px" },
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            //@ts-ignore
          />
          <>
            {isLoading || isFetching ? (
              <LoaderPaperComponent />
            ) : isError ? (
              <>
                <div style={{ width: "100%", paddingTop: "10px" }}>
                  <Alert
                    severity={error?.severity ?? "error"}
                    errorMsg={error?.error_msg ?? "Error"}
                    errorDetail={error?.error_detail ?? ""}
                  />
                </div>
              </>
            ) : (
              <Grid item xs={12} sm={12} md={12} style={{ padding: "10px" }}>
                <Box
                  sx={{
                    width: "100%",
                    // maxWidth: 400,
                    bgcolor: "background.paper",
                    height: "35vh",
                    overflow: "scroll",
                    border: "ridge",
                    borderRadius: "3",
                  }}
                >
                  <nav
                    aria-label="main mailbox folders"
                    style={{ position: "relative" }}
                  >
                    <Box
                      sx={{
                        position: "sticky",
                        top: 0,
                        textAlign: "left",
                        padding: ".75rem",
                        fontWeight: 500,
                        fontFamily: "Roboto, Helvetica",
                        background: "var(--theme-color1)",
                        color: "#fff",
                        alignItems: "center",
                        display: "grid",
                        gridTemplateColumns: "0.62fr 0.7fr 2fr 1fr",
                        gap: "0 18px",
                        zIndex: 9,
                      }}
                    >
                      <>
                        <div>Bank</div>
                        <div>Branch</div>
                        <div>Branch Name</div>
                        <div style={{ marginLeft: "24px" }}>Status</div>
                      </>
                    </Box>
                    <List style={{ paddingTop: "0px", paddingBottom: "0px" }}>
                      {filteredData?.map((item) => (
                        <ListItemData
                          key={item?.value}
                          name={item?.label}
                          disabled={false}
                          selected={
                            selectAll ||
                            selectedRows.includes(item?.value) ||
                            selectedRowsData.includes(item.label)
                          }
                          onClick={(event) =>
                            handleRowClick(event, item?.value, item?.label)
                          }
                          onDoubleClick={(event) => {
                            selectedRowsRef.current = selectedRows;
                            myRef?.current?.handleSubmit(event, "save");
                            setIsOpenRetrieve(false);
                          }}
                        />
                      ))}
                    </List>
                  </nav>
                </Box>
              </Grid>
            )}
          </>
          <DialogActions
            className={actionClasses.verifybutton}
            style={{ marginTop: "2px", marginBottom: "2px" }}
          >
            <>
              <GradientButton
                onClick={() => {
                  if (!selectAll) {
                    setSelectedRows(filteredData.map((item) => item?.value));
                    setSelectedRowsData(
                      filteredData.map((item) => item?.label)
                    );
                    setSelectAll(true);
                  } else {
                    setSelectedRows([]);
                    setSelectedRowsData([]);
                    setSelectAll(false);
                  }
                }}
              >
                {status === "success" && selectAll
                  ? "Deselect All"
                  : "Select All"}
              </GradientButton>
              <GradientButton
                endIcon={
                  getInwardClearingData.isLoading ? (
                    <CircularProgress size={20} />
                  ) : null
                }
                onClick={(event) => {
                  console.log("selectedRows", selectedRows);
                  if (
                    (!selectedRows && selectedRows?.length > 0) ||
                    (!selectedRowsData && selectedRowsData?.length > 0)
                  ) {
                    enqueueSnackbar("Please select at least one row.", {
                      variant: "error",
                    });
                  } else {
                    setIsOpenRetrieve(false);
                    myRef?.current?.handleSubmit(event, "save");
                    selectedRowsRef.current = selectedRows;
                  }
                }}
              >
                Ok
              </GradientButton>

              <GradientButton
                // disabled={result.isLoading || isLocalLoding}
                onClick={() => {
                  setIsOpenRetrieve(false);
                }}
              >
                Close
              </GradientButton>
            </>
          </DialogActions>
        </>
      </Dialog>
      <>
        <GridWrapper
          key={"inwardCleringGrid"}
          finalMetaData={InwardCleaingGridMetaData as GridMetaDataType}
          data={getInwardClearingData?.data ?? []}
          setData={() => null}
          loading={getInwardClearingData.isLoading || isFetching}
          actions={actions}
          setAction={setCurrentAction}
          refetchData={{}}
          // ref={myGridRef}
        />
      </>
    </>
  );
};
export const ListItemData = ({
  name,
  disabled,
  selected,
  onClick,
  onDoubleClick,
}) => {
  //@ts-ignore
  const splitNames = name?.split("|");
  return (
    <div>
      <ListItem
        button
        style={{
          color: selected ? "white" : "black",
          fontSize: "14px",
          backgroundColor: selected ? "var(--theme-color3)" : "transparent",
          border: "0.5px solid #F3F6F9",
        }}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
      >
        {splitNames?.map((names, index) => (
          <span
            style={{
              textAlign: "left",
              flex: index === 2 ? 1.5 : 0.5,
              padding: ".35rem 0",
              fontWeight: 400,
              fontFamily: "Roboto, Helvetica",
            }}
          >
            {names}
          </span>
        ))}
      </ListItem>
    </div>
  );
};
