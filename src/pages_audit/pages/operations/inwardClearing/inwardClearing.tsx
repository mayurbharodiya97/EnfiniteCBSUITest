import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "pages_audit/auth";
import {
  AppBar,
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  Grid,
  InputAdornment,
  List,
  ListItem,
  Toolbar,
  Theme,
  Typography,
} from "@mui/material";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { GradientButton } from "components/styledComponent/button";
import { useSnackbar } from "notistack";
import { useMutation, useQuery } from "react-query";
import * as API from "./api";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { useStyles } from "pages_audit/auth/style";
import SearchIcon from "@mui/icons-material/Search";
import { TextField } from "components/styledComponent";
import { SubmitFnType } from "packages/form";
import { Alert } from "components/common/alert";
import { queryClient } from "cache";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import {
  InwardCleaingGridMetaData,
  InwardClearingRetrievalMetadata,
} from "./gridMetadata";
import { GridMetaDataType } from "components/dataTableStatic";
import { ActionTypes } from "components/dataTable";
import { ChequeSignForm } from "./inwardClearingForm/chequeSignForm";
import { format } from "date-fns";
import { ChequeReturnPostFormWrapper } from "./inwardClearingForm/chequeReturnPostForm";
import { usePopupContext } from "components/custom/popupContext";
import { Route, Routes, useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";

const useTypeStyles = makeStyles((theme: Theme) => ({
  root: {
    background: "var(--theme-color5)",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--theme-color2)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
  },
  refreshiconhover: {},
}));
const actions: ActionTypes[] = [
  {
    actionName: "retrieve",
    actionLabel: "Retrieve",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  {
    actionName: "view-details",
    actionLabel: "Edit Detail",
    multiple: false,
    rowDoubleClick: true,
  },
];
export const InwardClearing = () => {
  const [isOpenRetrieve, setIsOpenRetrieve] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const headerClasses = useTypeStyles();
  const actionClasses = useStyles();
  const { authState } = useContext(AuthContext);
  const [selectedRows, setSelectedRows] = useState<any>(
    authState?.user?.branchCode ?? []
  );
  const [selectedRowsData, setSelectedRowsData] = useState<any>(
    authState?.user?.branchCode ?? []
  );
  const selectedRowsRef = useRef<any>(null);
  const myRef = useRef<any>();
  const inputButtonRef = useRef<any>(null);
  const [selectAll, setSelectAll] = useState<any>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState<any>([]);
  const [isChequeSign, setIsChequeSign] = useState<any>(false);
  const [formData, setFormData] = useState<any>();
  const [isChequeReturnPost, setIsChequeReturnPost] = useState<any>(false);
  const mysubdtlRef = useRef<any>({});
  const { MessageBox } = usePopupContext();
  const navigate = useNavigate();
  const { data, isLoading, isFetching, refetch, error, isError, status } =
    useQuery<any, any>(["BranchSelectionGridData"], () =>
      API.BranchSelectionGridData()
    );

  const getInwardClearingData: any = useMutation(API.getInwardClearingData, {
    onError: (error: any) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
    },

    onSuccess: (data) => {},
  });

  const validatePostData: any = useMutation(API.validatePost, {
    onSuccess: (data, variables) => {
      let apiReq = {
        ...variables,
        _isNewRow: true,
      };
      if (data?.[0]?.O_STATUS === "0") {
        // setMessageData({
        //   messageTitle: "Validation Successfull..",
        //   message: "Do you Want to save this data",
        //   apiReq: apiReq,
        // });
        // setIsOpenSave(true);
      } else if (data?.[0]?.O_STATUS === "9") {
        MessageBox({
          messageTitle: "Validation Alert..",
          message: data?.[0]?.O_MESSAGE,
        });
      } else if (data?.[0]?.O_STATUS === "99") {
        // setMessageData({
        //   messageTitle: "Are you sure do you want to continue?",
        //   message: data?.[0]?.O_MESSAGE,
        //   apiReq: apiReq,
        // });
        // setIsOpenSave(true);
      } else if (data?.[0]?.O_STATUS === "999") {
        MessageBox({
          messageTitle: "Validation Failed...!",
          message: data?.[0]?.O_MESSAGE,
        });
      }
    },
    // onSuccess: async (data, variables) => {
    //   console.log("data!!", data, variables);
    //   if (data?.[0]?.O_STATUS === "999" && data?.[0]?.O_MESSAGE) {
    //     MessageBox({
    //       messageTitle: "Validation Failed",
    //       message: data?.[0]?.O_MESSAGE,
    //     });
    //   } else if (
    //     data?.[0]?.O_STATUS === "99" ||
    //     "9" ||
    //     ("0" && data?.[0]?.O_MESSAGE)
    //   ) {
    //     // setDeletePopup(true);
    //   }
    // },
  });
  const setCurrentAction = useCallback((data) => {
    if (data?.name === "retrieve") {
      setIsOpenRetrieve(true);
    } else if (data?.name === "view-details") {
      mysubdtlRef.current = data?.rows?.[0]?.data;
      setIsChequeReturnPost(true);
    }
  }, []);
  useEffect(() => {
    if (!isLoading && !isFetching) {
      setFilteredData(data);
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
        setSelectedRows((prev) => prev?.filter((row) => row !== name));
        setSelectedRowsData((prev) => prev?.filter((row) => row !== label));
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
    const filtered = data?.filter((item) =>
      item.label.toLowerCase().includes(value?.toLowerCase())
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
        BRANCH_CD: selectedRowsRef?.current.toString(),
        COMP_CD: authState?.companyID ?? "",
      },
      endSubmit,
    });
    setFormData(data);
    setIsOpenRetrieve(false);
  };
  return (
    <>
      <div
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            inputButtonRef?.current?.click?.();
            setIsOpenRetrieve(false);
          }
        }}
      >
        {" "}
        <Dialog
          open={isOpenRetrieve}
          //@ts-ignore
          PaperProps={{
            style: {
              width: "55%",
            },
          }}
          maxWidth="md"
        >
          <>
            {" "}
            <AppBar position="relative" color="secondary" style={{}}>
              <Toolbar className={headerClasses.root} variant={"dense"}>
                <Typography
                  className={headerClasses.title}
                  color="inherit"
                  variant={"h6"}
                  component="div"
                >
                  Parameters
                </Typography>
              </Toolbar>
            </AppBar>
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
              containerstyle={{ paddingTop: "0px !important" }}
              ref={myRef}
              hideHeader={true}
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
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{ padding: "3px 19px 0px 10px" }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      // maxWidth: 400,
                      bgcolor: "background.paper",
                      height: "50vh",
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
                          padding: ".45rem",
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
                              if (
                                selectedRows?.length === 0 ||
                                selectedRowsData?.length === 0
                              ) {
                                enqueueSnackbar(
                                  "Please select at least one row.",
                                  {
                                    variant: "error",
                                  }
                                );
                              } else {
                                setIsOpenRetrieve(false);
                                myRef?.current?.handleSubmit(event, "save");
                                selectedRowsRef.current = selectedRows;
                              }
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
                      setSelectedRows(filteredData?.map((item) => item?.value));
                      setSelectedRowsData(
                        filteredData?.map((item) => item?.label)
                      );
                      setSelectAll(true);
                    } else {
                      setSelectedRows([]);
                      setSelectedRowsData([]);
                      setSelectAll(false);
                    }
                  }}
                >
                  {getInwardClearingData?.status === "success" && selectAll
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
                    if (
                      selectedRows?.length === 0 ||
                      selectedRowsData?.length === 0
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
                  ref={inputButtonRef}
                >
                  Ok
                </GradientButton>

                <GradientButton
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
      </div>

      <>
        <GridWrapper
          key={"inwardCleringGrid"}
          finalMetaData={InwardCleaingGridMetaData as GridMetaDataType}
          data={getInwardClearingData?.data ?? []}
          setData={() => null}
          loading={getInwardClearingData.isLoading || isFetching}
          actions={actions}
          setAction={setCurrentAction}
          ReportExportButton={true}
          refetchData={() =>
            getInwardClearingData.mutate({
              data: {
                ...formData,
                BRANCH_CD: selectedRowsRef?.current.toString(),
                COMP_CD: authState?.companyID ?? "",
              },
            })
          }
          onlySingleSelectionAllow={true}
          onClickActionEvent={(index, id, data) => {
            if (id === "SIGN_PATH") {
              mysubdtlRef.current = data;
              setIsChequeSign(true);
            } else if (id === "POST_CONF") {
              const postData = {
                COMP_CD: data?.COMP_CD ?? "",
                BRANCH_CD: data?.BRANCH_CD ?? "",
                ACCT_TYPE: data?.ACCT_TYPE ?? "",
                ACCT_CD: data?.ACCT_CD ?? "",
                ERROR_STATUS: data?.ERR_STATUS ?? "",
                SCREEN_REF: "TRN/650",
                ENTERED_BY: data?.ENTERED_BY ?? "",
                ENTERED_BRANCH_CD: data?.ENTERED_BRANCH_CD ?? "",
                REMARKS: data?.REMARKS ?? "",
                CHEQUE_DATE: data?.CHEQUE_DT ?? "",
                CHEQUE_NO: data?.CHEQUE_NO ?? "",
                AMOUNT: data?.AMOUNT ?? "",
                TRAN_CD: data?.TRAN_CD ?? "",
                MICR_TRAN_CD: data?.MICR_TRAN_CD ?? "",
              };
              validatePostData.mutate(postData);
            } else if (id === "RETURN") {
              mysubdtlRef.current = data;
              setIsChequeReturnPost(true);
            }
          }}
        />
      </>
      <>
        {isChequeSign ? (
          <ChequeSignForm
            onClose={() => {
              setIsChequeSign(false);
            }}
            reqDataRef={mysubdtlRef}
          />
        ) : null}
      </>

      <>
        {isChequeReturnPost ? (
          <ChequeReturnPostFormWrapper
            onClose={() => {
              setIsChequeReturnPost(false);
            }}
            inwardData={mysubdtlRef}
          />
        ) : null}
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
          paddingTop: "3px",
          paddingBottom: "3px",
        }}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
      >
        {splitNames?.map((names, index) => (
          <span
            style={{
              textAlign: "left",
              flex: index === 2 ? 1.5 : 0.5,
              // padding: ".35rem 0",
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
