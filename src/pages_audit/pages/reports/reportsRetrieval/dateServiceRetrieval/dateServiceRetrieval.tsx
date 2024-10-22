import { FC, useEffect, useRef, useState } from "react";
import {
  InitialValuesType,
  SubmitFnType,
  FormWrapper,
  MetaDataType,
  TextField,
  GradientButton,
  queryClient,
} from "@acuteinfo/common-base";
import Dialog from "@mui/material/Dialog";
import { useDialogStyles } from "@acuteinfo/common-base";
import { Transition } from "@acuteinfo/common-base";
import { dateServiceRetrievalMetadata } from "./metaData";
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

const DateServiceRetrieval: FC<{
  closeDialog?: any;
  metaData: any;
  defaultData: any;
  retrievalParaValues?: any;
  retrievalType?: any;
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
  const isDateRange = retrievalType.includes("RANGE");
  const dateDisplayFormat = retrievalType.includes("MONTH")
    ? "MM/yyyy"
    : "dd/MM/yyyy";
  const [selectServiceRows, setSelectServiceRows] = useState<any>(
    defaultData?.selectedRows ?? []
  );
  const [selectServiceLabelRows, setSelectServiceLabelRows] = useState<any>(
    defaultData?.selectedRowsData ?? []
  );
  const [selectServiceAll, setSelectServiceAll] = useState<any>(
    defaultData?.selectServiceAll ?? false
  );
  const selectServiceAllRef = useRef<boolean>(selectServiceAll);
  selectServiceAllRef.current = selectServiceAll;
  const isDetailFormRef = useRef<any>(null);
  const selectedRowsRef = useRef<any>(null);
  const selectedRowsLabelRef = useRef<any>(null);
  const headerClasses = useTypeStyles();
  const { enqueueSnackbar } = useSnackbar();
  const result = useQueries([
    {
      queryKey: ["GetMiscValueone"],
      queryFn: () => API.GetMiscValue("TRAN_TYPE"),
    },
  ]);

  const [filteredData, setFilteredData] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const isloading = result[0].isLoading || result[0].isFetching;
  const { t } = useTranslation();
  useEffect(() => {
    if (!isloading) {
      setFilteredData(result[0].data);
    }
  }, [isloading]);

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["GetMiscValueone"]);
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
  const handleSearchInputChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    const filtered = result[0].data.filter((item) =>
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
    //@ts-ignore
    endSubmit(true);

    let retrievalValues: any = [];
    if (isDateRange) {
      retrievalValues = [
        {
          id: "A_FROM_DT",
          value: {
            condition: "equal",
            value: format(new Date(data?.FROM_DT), "dd/MM/yyyy"),
            displayValue: format(new Date(data?.FROM_DT), dateDisplayFormat),
            columnName: isDateRange ? "From Date" : "As on Date",
          },
        },
        {
          id: "A_TO_DT",
          value: {
            condition: "equal",
            value: format(new Date(data?.TO_DT), "dd/MM/yyyy"),
            displayValue: format(new Date(data?.TO_DT), dateDisplayFormat),
            columnName: "To Date",
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
            label: "Tran Type",
            displayValue: selectedRowsLabelRef?.current
              .map((key) => {
                return key.toString();
              })
              .join(","),
          },
        },
      ];
    } else {
      retrievalValues = [
        {
          id: "A_FROM_DT",
          value: {
            condition: "equal",
            value: format(new Date(data?.FROM_DT), "dd/MM/yyyy"),
            displayValue: format(new Date(data?.FROM_DT), dateDisplayFormat),
            columnName: isDateRange ? "From Date" : "As on Date",
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
            label: "Tran Type",
            displayValue: selectedRowsLabelRef?.current
              .map((key) => {
                return key.toString();
              })
              .join(","),
          },
        },
      ];
    }

    retrievalParaValues(retrievalValues, {
      ...data,
      selectServiceAll: selectServiceAllRef.current,
      selectedRows: selectedRowsRef.current,
      selectedRowsData: selectedRowsLabelRef.current,
    });
  };

  const handleListItemDoubleClick = (e) => {
    if (selectServiceRows.length === 0 || selectServiceLabelRows.length === 0) {
      // setIsOpenSave(true);
    } else {
      selectedRowsRef.current = selectServiceRows;
      selectedRowsLabelRef.current = selectServiceLabelRows;
      isDetailFormRef.current?.handleSubmit(e, "save");
    }
  };

  useEffect(() => {
    // for only one date field
    if (retrievalType === "DATESERVICE" || retrievalType === "MONTHSERVICE") {
      dateServiceRetrievalMetadata.fields[1].shouldExclude = true;
      dateServiceRetrievalMetadata.fields[0].label = "As on date";
      dateServiceRetrievalMetadata.fields[0].GridProps = {
        xs: 12,
        md: 12,
        sm: 12,
      };
    } else {
      dateServiceRetrievalMetadata.fields[1].shouldExclude = false;
      dateServiceRetrievalMetadata.fields[0].label = "From Date";
    }

    // for two date fields
    if (
      retrievalType === "RANGEMONTHSERVICE" ||
      retrievalType === "MONTHSERVICE"
    ) {
      [0, 1].forEach((index) => {
        dateServiceRetrievalMetadata.fields[index].format = "MM/yyyy";
      });
    } else {
      dateServiceRetrievalMetadata.fields[0].format = "dd/MM/yyyy";
      dateServiceRetrievalMetadata.fields[1].format = "dd/MM/yyyy";
    }
  }, [retrievalType]);

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
        <FormWrapper
          key={"dateServiceRetrieval"}
          metaData={dateServiceRetrievalMetadata as MetaDataType}
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
        <>
          <TextField
            // {...others}
            // key={fieldKey}
            placeholder="Search"
            id=""
            name={"Search"}
            value={searchQuery}
            onChange={handleSearchInputChange}
            style={{ width: "96%", margin: "-12px 9px auto" }}
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
        </>
        <DialogActions
          className={actionClasses.verifybutton}
          style={{ marginTop: "2px", marginBottom: "2px" }}
        >
          <>
            <GradientButton
              onClick={() => {
                if (!selectServiceAll) {
                  setSelectServiceRows(filteredData.map((item) => item?.value));
                  setSelectServiceLabelRows(
                    filteredData.map((item) => item?.label)
                  );
                  setSelectServiceAll(true);
                } else {
                  setSelectServiceRows([]);
                  setSelectServiceLabelRows([]);
                  setSelectServiceAll(false);
                }
              }}
            >
              {result[0].status === "success" && selectServiceAll
                ? t("DeselectAll")
                : t("SelectAll")}
            </GradientButton>
            <GradientButton
              onClick={(e) => {
                if (
                  selectServiceRows.length === 0 ||
                  selectServiceLabelRows.length === 0
                ) {
                  // setIsOpenSave(true);
                  enqueueSnackbar(t("Pleaseselectatleastonerow"), {
                    variant: "error",
                  });
                } else {
                  selectedRowsRef.current = selectServiceRows;
                  selectedRowsLabelRef.current = selectServiceLabelRows;
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
export const DateServiceRetrievalWrapper = ({
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
            width:
              retrievalType === "DATESERVICE" ||
              retrievalType === "MONTHSERVICE"
                ? "450px"
                : "550px",
            maxWidth: "100%",
            minHeight: "70vh",
            // height: "36vh",
          },
        }}
        maxWidth="sm"
        classes={{
          scrollPaper: classes.topScrollPaper,
          paperScrollBody: classes.topPaperScrollBody,
        }}
      >
        <DateServiceRetrieval
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
