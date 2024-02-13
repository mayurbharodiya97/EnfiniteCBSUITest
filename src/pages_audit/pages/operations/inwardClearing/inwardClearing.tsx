import { useContext, useEffect, useRef, useState } from "react";
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

export const InwardClearing = () => {
  const [open, setOpen] = useState(true);
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
      // isDataChangedRef.current = true;
      refetch();
    },
    onError: (error: any) => {},
  });
  useEffect(() => {
    if (!isLoading && !isFetching) {
      setFilteredData(data);
    }
  }, [isLoading, isFetching]);

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
        TRAN_DT: "13/FEB/2024",
        // TRAN_DT: new Date() ?? authState?.workingDate,
      },
      endSubmit,
    });
    setOpen(false);
  };
  return (
    <>
      <Dialog
        open={open}
        //@ts-ignore
        PaperProps={{
          style: {
            width: "100%",
            // minHeight: "36vh",
            // height: "36vh",
          },
        }}
        maxWidth="sm"
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
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        zIndex: 9,
                      }}
                    >
                      <>
                        <span>Bank</span>
                        <span
                          style={{
                            marginLeft: "18px",
                          }}
                        >
                          Branch
                        </span>
                        <span
                          style={{
                            display: "flex",
                            flex: 0.5,
                            marginLeft: "12px",
                          }}
                        >
                          Branch Name
                        </span>
                        <span
                          style={{
                            marginRight: "72px",
                          }}
                        >
                          Status
                        </span>
                      </>
                    </Box>
                    <List style={{ paddingTop: "0px", paddingBottom: "0px" }}>
                      {filteredData?.sort()?.map((item) => (
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
                            setOpen(false);
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
                  if (
                    selectedRows.length === 0 ||
                    selectedRowsData.length === 0
                  ) {
                    // setIsOpenSave(true);
                    enqueueSnackbar("Please select at least one row.", {
                      variant: "error",
                    });
                  } else {
                    setOpen(false);
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
                  setOpen(false);
                }}
              >
                Close
              </GradientButton>
            </>
          </DialogActions>
        </>
      </Dialog>
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
          color: "var(--theme-color2)",
          fontSize: "14px",
          backgroundColor: selected ? "var(--theme-color5)" : "transparent",
          border: "0.5px solid #F3F6F9",
        }}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
      >
        {splitNames?.map((names, index) => (
          <span
            style={{
              textAlign: "left",
              flex: index === 2 ? 1 : 0.5,
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
