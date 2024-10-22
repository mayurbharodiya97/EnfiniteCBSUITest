import {
  InitialValuesType,
  SubmitFnType,
  FormWrapper,
  MetaDataType,
  TextField,
  GradientButton,
  queryClient,
} from "@acuteinfo/common-base";
import { FC, useEffect, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import { useDialogStyles } from "@acuteinfo/common-base";
import { Transition } from "@acuteinfo/common-base";
import { dateServiceChannelRetrievalMetadata } from "./metaData";
import {
  AppBar,
  Grid,
  InputAdornment,
  Toolbar,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import { format } from "date-fns";
import { useStyles } from "pages_audit/auth/style";
import * as API from "../../api";
import DialogActions from "@mui/material/DialogActions";
import { Box, Divider, List, ListItem, ListItemText } from "@mui/material";
import { useQueries } from "react-query";
import { LoaderPaperComponent } from "@acuteinfo/common-base";
import SearchIcon from "@mui/icons-material/Search";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
const useTypeStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    background: "var(--theme-color1)",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--white)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
  },
  refreshiconhover: {},
}));

const DateServiceChannelRetrieval: FC<{
  closeDialog?: any;
  metaData: any;
  defaultData: any;
  retrievalParaValues?: any;
  retrievalType: String;
}> = ({
  closeDialog,
  metaData,
  defaultData,
  retrievalParaValues,
  retrievalType,
}) => {
  const actionClasses = useStyles();
  const inputButtonRef = useRef<any>(null);
  const cancleButtonRef = useRef<any>(null);
  const [selectServiceRows, setSelectServiceRows] = useState<any>(
    defaultData?.selectedRows ?? []
  );
  const [selectServiceLabelRows, setSelectServiceLabelRows] = useState<any>(
    defaultData?.selectedRowsData ?? []
  );
  const [selectChannelRow, setSelectChannelRow] = useState<any>(
    defaultData?.selectedChannelRows ?? []
  );
  const [selectChannelLabelRow, setSelectChannelLabelRow] = useState<any>(
    defaultData?.selectedChannelRowsData ?? []
  );
  const [selectServiceAll, setSelectServiceAll] = useState<any>(
    defaultData?.selectServiceAll ?? false
  );
  const selectServiceAllRef = useRef<boolean>(selectServiceAll);
  selectServiceAllRef.current = selectServiceAll;
  const [selectChannelAll, setSelectChannelAll] = useState<any>(
    defaultData?.selectChannelAll ?? true
  );
  const selectChannelAllRef = useRef<boolean>(selectChannelAll);
  selectChannelAllRef.current = selectChannelAll;
  const isDetailFormRef = useRef<any>(null);
  const selectedRowsRef = useRef<any>(null);
  const selectedRowsLabelRef = useRef<any>(null);
  const selectedRowRef = useRef<any>(null);
  const selectedRowLabelRef = useRef<any>(null);
  const headerClasses = useTypeStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const result = useQueries([
    {
      queryKey: ["GetMiscValueone"],
      queryFn: () => API.GetMiscValue("CHANNEL"),
    },
    {
      queryKey: ["GetMiscValuetwo"],
      queryFn: () => API.GetMiscValue("TRAN_TYPE"),
    },
  ]);

  const [filteredData, setFilteredData] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState("");
  // const [isOpenSave, setIsOpenSave] = useState<any>(false);
  const loading = result[0].isLoading || result[0].isFetching;
  const isloading = result[1].isLoading || result[1].isFetching;

  useEffect(() => {
    if (!isloading) {
      setFilteredData(result[1].data);
    }
  }, [isloading]);

  useEffect(() => {
    if (!loading) {
      setSelectChannelRow(
        defaultData?.selectedChannelRows ??
          result?.[0]?.data.map((item) => item?.value)
      );
      setSelectChannelLabelRow(
        defaultData?.selectedChannelRowsData ??
          result?.[0]?.data.map((item) => item?.label)
      );
    }
  }, [result?.[0]?.data]);

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["GetMiscValueone"]);
      queryClient.removeQueries(["GetMiscValuetwo"]);
    };
  }, []);

  const handleServiceRowClick = (event: any, name: string, label: string) => {
    setSelectServiceAll(false);
    if (event.ctrlKey) {
      if (
        selectServiceRows.includes(name) ||
        selectServiceLabelRows.includes(label)
      ) {
        setSelectServiceRows((prev) => prev.filter((row) => row !== name));
        setSelectServiceLabelRows((prev) =>
          prev.filter((rowLabel) => rowLabel !== label)
        );
      } else {
        setSelectServiceRows([...new Set([...selectServiceRows, name])]);
        setSelectServiceLabelRows([
          ...new Set([...selectServiceLabelRows, label]),
        ]);
      }
    } else {
      setSelectServiceRows([name]);
      setSelectServiceLabelRows([label]);
    }
  };
  const handleChannelRowClick = (event: any, name: string, label: string) => {
    setSelectChannelAll(false);
    if (event.ctrlKey) {
      if (
        selectChannelRow.includes(name) ||
        selectChannelLabelRow.includes(label)
      ) {
        setSelectChannelRow((prev) => prev.filter((row) => row !== name));
        setSelectChannelLabelRow((prev) =>
          prev.filter((rowLabel) => rowLabel !== label)
        );
      } else {
        setSelectChannelRow([...new Set([...selectChannelRow, name])]);
        setSelectChannelLabelRow([
          ...new Set([...selectChannelLabelRow, label]),
        ]);
      }
    } else {
      setSelectChannelRow([name]);
      setSelectChannelLabelRow([label]);
    }
  };
  const handleSearchInputChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    const filtered = result[1].data.filter((item) =>
      item.label.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredData(filtered);
  };

  // const onClickButton = (rows, buttonName) => {
  //   setIsOpenSave(false);
  // };
  const onSubmitHandler: SubmitFnType = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    //@ts-ignore
    endSubmit(true);
    let retrievalValues = [
      {
        id: "A_FROM_DT",
        value: {
          condition: "equal",
          value: format(new Date(data?.FROM_DT), "dd/MM/yyyy"),
          columnName: "FromDates",
        },
      },
      {
        id: "A_TO_DT",
        value: {
          condition: "equal",
          value: format(new Date(data?.TO_DT), "dd/MM/yyyy"),
          columnName: "ToDates",
        },
      },
      {
        id: "TRN_TYPE",
        value: {
          condition: "equal",
          value: selectedRowsRef?.current
            .map((key) => {
              return key.toString();
            })
            .join(","),

          columnName: "tranType",
          label: "TranType",
          displayValue: selectedRowsLabelRef?.current
            .map((key) => {
              return key.toString();
            })
            .join(","),
        },
      },
      // {
      //   id: "V_CHANNEL",
      //   value: {
      //     condition: "equal",
      //     value: selectedRowRef?.current
      //       .map((key) => {
      //         return key.toString();
      //       })
      //       .join(","),

      //     columnName: "Channel",
      //     label: "CHANNEL",
      //     displayValue: selectedRowLabelRef?.current
      //       .map((key) => {
      //         return key.toString();
      //       })
      //       .join(","),
      //   },
      // },
      {
        id: "CHANNEL",
        value: {
          condition: "equal",
          value: selectedRowRef?.current
            .map((key) => {
              return key.toString();
            })
            .join(","),

          columnName: "Channel",
          label: "Channel",
          displayValue: selectedRowLabelRef?.current
            .map((key) => {
              return key.toString();
            })
            .join(","),
        },
      },
    ];
    retrievalParaValues(retrievalValues, {
      ...data,
      selectServiceAll: selectServiceAllRef.current,
      selectedRows: selectedRowsRef.current,
      selectedRowsData: selectedRowsLabelRef.current,
      selectChannelAll: selectChannelAllRef.current,
      selectedChannelRows: selectedRowRef.current,
      selectedChannelRowsData: selectedRowLabelRef.current,
    });
  };

  if (retrievalType === "DAILYUSERWISECHANNEL") {
    [0, 1].forEach((index) => {
      dateServiceChannelRetrievalMetadata.fields[index].format = "dd/MM/yyyy";
    });
  } else {
    dateServiceChannelRetrievalMetadata.fields[0].format = "MM/yyyy";
    dateServiceChannelRetrievalMetadata.fields[1].format = "MM/yyyy";
  }

  const handleListItemDoubleClick = (e) => {
    if (selectServiceRows.length === 0 || selectServiceLabelRows.length === 0) {
      // setIsOpenSave(true);
    } else {
      selectedRowsRef.current = selectServiceRows;
      selectedRowsLabelRef.current = selectServiceLabelRows;
      selectedRowRef.current = selectChannelRow;
      selectedRowLabelRef.current = selectChannelLabelRow;
      isDetailFormRef.current?.handleSubmit(e, "save");
    }
  };

  return (
    <>
      <div
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            inputButtonRef?.current?.click?.();
          }
          if (e.key === "Escape") {
            cancleButtonRef?.current?.click?.();
          }
        }}
      >
        <AppBar
          position="relative"
          color="secondary"
          style={{ margin: "8px", width: "auto" }}
        >
          <Toolbar className={headerClasses.root} variant={"dense"}>
            <Typography
              className={headerClasses.title}
              color="inherit"
              variant={"h6"}
              component="div"
            >
              {t("EnterRetrievalParameters")}
            </Typography>
          </Toolbar>
        </AppBar>

        {loading ? (
          <LoaderPaperComponent />
        ) : (
          <Grid item xs={12} sm={12} md={12} style={{ margin: "8px" }}>
            <Box
              sx={{
                width: "100%",
                // maxWidth: 400,
                bgcolor: "background.paper",
                height: "80px",

                border: "ridge",
                borderRadius: "3",
              }}
            >
              <nav aria-label="main mailbox folders">
                <List style={{ paddingTop: "0px", paddingBottom: "0px" }}>
                  {result[0].data.map((item) => (
                    <ListItemData
                      key={item?.value}
                      name={item?.label}
                      disabled={false}
                      // selected={
                      //   item?.label === selectedRow ||
                      //   selectedRows.includes(item?.label)
                      // }
                      selected={
                        selectChannelAll ||
                        // item?.value === selectedRows ||
                        selectChannelRow.includes(item?.value) ||
                        selectChannelLabelRow.includes(item?.label)
                      }
                      onClick={(event) =>
                        handleChannelRowClick(event, item?.value, item?.label)
                      }
                      onDoubleClick={handleListItemDoubleClick}
                    />
                  ))}
                </List>
              </nav>
            </Box>
          </Grid>
        )}
        <DialogActions
          className={actionClasses.verifybutton}
          style={{ padding: "0px", margin: "0px" }}
        >
          <GradientButton
            style={{
              minWidth: "87px",
              marginTop: "3.35rem",
              alignSelf: "start",
              marginLeft: "5px",
            }}
            onClick={() => {
              if (!selectChannelAll) {
                setSelectChannelRow(result[0].data.map((item) => item?.value));
                setSelectChannelLabelRow(
                  result[0].data.map((item) => item?.label)
                );
                setSelectChannelAll(true);
              } else {
                setSelectChannelRow([]);
                setSelectChannelLabelRow([]);
                setSelectChannelAll(false);
              }
            }}
          >
            {result[0].status === "success" && selectChannelAll
              ? t("DeselectAll")
              : t("SelectAll")}
          </GradientButton>
          <FormWrapper
            key={"dateServiceChannelRetrieval"}
            metaData={dateServiceChannelRetrievalMetadata as MetaDataType}
            initialValues={defaultData as InitialValuesType}
            onSubmitHandler={onSubmitHandler}
            hideHeader={true}
            //@ts-ignore
            formStyle={{
              background: "white",
              padding: "0px",
              // height: "calc(42vh - 100px)",
              // overflowY: "auto",
              // overflowX: "hidden",
            }}
            // controlsAtBottom={true}
            containerstyle={{ padding: "10px", margin: "0" }}
            ref={isDetailFormRef}
          ></FormWrapper>
        </DialogActions>

        <>
          <TextField
            // {...others}
            // key={fieldKey}
            placeholder={String(t("Search"))}
            id=""
            name={"Search"}
            value={searchQuery}
            onChange={handleSearchInputChange}
            style={{ width: "96%", margin: "-13px 11px auto" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            //@ts-ignore
          />

          {isloading ? (
            <LoaderPaperComponent />
          ) : (
            <Grid item xs={12} sm={12} md={12} style={{ margin: "8px" }}>
              <Box
                sx={{
                  width: "100%",
                  // maxWidth: 400,
                  bgcolor: "background.paper",
                  height: "250px",
                  overflow: "scroll",
                  border: "ridge",
                  borderRadius: "3",
                }}
              >
                <nav aria-label="main mailbox folders">
                  <List style={{ paddingTop: "0px", paddingBottom: "0px" }}>
                    {filteredData.map((item) => (
                      <ListItemData
                        key={item?.value}
                        name={item?.label}
                        disabled={false}
                        // selected={
                        //   item?.label === selectedRow ||
                        //   selectedRows.includes(item?.label)
                        // }
                        selected={
                          selectServiceAll ||
                          // item?.value === selectedRows ||
                          selectServiceRows.includes(item?.value) ||
                          selectServiceLabelRows.includes(item?.label)
                        }
                        onClick={(event) =>
                          handleServiceRowClick(event, item?.value, item?.label)
                        }
                        onDoubleClick={handleListItemDoubleClick}
                      />
                    ))}
                  </List>
                </nav>
              </Box>
            </Grid>
          )}

          {/* {isOpenSave ? (
              <PopupRequestWrapper
                MessageTitle="Data Validation"
                Message="Please Select One Row"
                onClickButton={(rows, buttonName) =>
                  onClickButton(rows, buttonName)
                }
                buttonNames={["Ok"]}
                rows={[]}
                open={isOpenSave}
              />
            ) : null} */}
        </>
        <DialogActions
          className={actionClasses.verifybutton}
          style={{ marginTop: "2px", marginBottom: "2px" }}
        >
          <>
            <GradientButton
              onClick={() => {
                if (!isloading && !selectServiceAll) {
                  setSelectServiceRows(filteredData.map((item) => item?.value));
                  setSelectServiceLabelRows(
                    filteredData.map((item) => item?.label)
                  );
                  setSelectServiceAll(true);
                } else if (!isloading) {
                  setSelectServiceRows([]);
                  setSelectServiceLabelRows([]);
                  setSelectServiceAll(false);
                }
              }}
            >
              {result[1].status === "success" && selectServiceAll
                ? t("DeselectAll")
                : t("SelectAll")}
            </GradientButton>
            <GradientButton
              onClick={(e) => {
                if (
                  selectChannelRow.length === 0 ||
                  selectChannelLabelRow.length === 0
                ) {
                  // setIsOpenSave(true);
                  enqueueSnackbar(t("PleaseSelectAtLeastOneChannel"), {
                    variant: "error",
                  });
                } else if (
                  selectServiceRows.length === 0 ||
                  selectServiceLabelRows.length === 0
                ) {
                  // setIsOpenSave(true);
                  enqueueSnackbar(t("PleaseSelectAtLeastOneTrnType"), {
                    variant: "error",
                  });
                } else {
                  selectedRowsRef.current = selectServiceRows;
                  selectedRowsLabelRef.current = selectServiceLabelRows;
                  selectedRowRef.current = selectChannelRow;
                  selectedRowLabelRef.current = selectChannelLabelRow;
                  isDetailFormRef.current?.handleSubmit(e, "save");
                }
              }}
              ref={inputButtonRef}
            >
              {t("Ok")}
            </GradientButton>

            <GradientButton
              // disabled={result.isLoading || isLocalLoding}
              onClick={closeDialog}
              ref={cancleButtonRef}
            >
              {t("Close")}
            </GradientButton>
          </>
        </DialogActions>
      </div>
    </>
  );
};
export const ListItemData = ({
  name,
  disabled,
  selected,
  onClick,
  onDoubleClick,
}: {
  name: string;
  disabled: boolean;
  selected: boolean;
  onClick: any;
  onDoubleClick: any;
}) => {
  //@ts-ignore
  return (
    <div>
      <ListItem
        button
        style={{
          paddingTop: "4px",
          paddingBottom: "4px",
          paddingLeft: "10px",
          paddingRight: "10px",
          backgroundColor: selected ? "var(--theme-color1)" : "transparent",
          color: selected ? "white" : "black",
        }}
        onClick={onClick}
        disabled={false}
        selected={selected}
        onDoubleClick={onDoubleClick}
      >
        <ListItemText primary={name} />
      </ListItem>
      <Divider />
    </div>
  );
};
export const DateServiceChannelRetrievalWrapper = ({
  open,
  handleDialogClose,
  metaData,
  defaultData,
  retrievalParaValues,
  retrievalType,
}) => {
  const classes = useDialogStyles();

  return (
    <>
      <Dialog
        open={true}
        //@ts-ignore
        TransitionComponent={Transition}
        PaperProps={{
          style: {
            width: "100%",
            // minHeight: "36vh",
            // height: "36vh",
          },
        }}
        maxWidth="sm"
        classes={{
          scrollPaper: classes.topScrollPaper,
          paperScrollBody: classes.topPaperScrollBody,
        }}
      >
        <DateServiceChannelRetrieval
          metaData={metaData}
          closeDialog={handleDialogClose}
          defaultData={defaultData}
          retrievalParaValues={retrievalParaValues}
          retrievalType={retrievalType}
        />
      </Dialog>
    </>
  );
};
