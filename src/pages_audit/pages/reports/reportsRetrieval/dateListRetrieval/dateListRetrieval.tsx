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
import { PaymentDetailsRetrievalMetadata } from "./metaData";
import { Grid, InputAdornment } from "@mui/material";
import { format } from "date-fns";
import { useStyles } from "pages_audit/auth/style";
import * as API from "../../staticReports/api";
import DialogActions from "@mui/material/DialogActions";
import { Box, Divider, List, ListItem, ListItemText } from "@mui/material";
import { useQuery } from "react-query";
import { LoaderPaperComponent } from "@acuteinfo/common-base";
import { useSnackbar } from "notistack";
import SearchIcon from "@mui/icons-material/Search";
import { useTranslation } from "react-i18next";
const DateListRetrieval: FC<{
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
  const [selectedRows, setSelectedRows] = useState<any>(
    defaultData?.selectedRows ?? []
  );
  const [selectedRowsData, setSelectedRowsData] = useState<any>(
    defaultData?.selectedRowsData ?? []
  );
  const [selectAll, setSelectAll] = useState<any>(
    defaultData?.selectAll ?? false
  );
  const selectAllRef = useRef<boolean>(selectAll);
  selectAllRef.current = selectAll;
  const isDetailFormRef = useRef<any>(null);
  const selectedRowsRef = useRef<any>(null);
  const selectedRowsLabelRef = useRef<any>(null);
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading, isFetching, status } = useQuery<any, any>(
    ["GetMiscValue"],
    () => {
      if (retrievalType === "PAYMENTDETAILS") {
        return API.GetMiscValue("PAY_RPT");
      } else if (retrievalType === "DATEAPUSERSLIST") {
        return API.getSecurityUserListData();
      } else if (retrievalType === "CARDACTIVEPIN") {
        return API.GetMiscValue("CARD_STATUS_RPT");
      }
    }
  );
  const [filteredData, setFilteredData] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState("");
  // const [isOpenSave, setIsOpenSave] = useState<any>(false);
  useEffect(() => {
    if (!isLoading && !isFetching) {
      setFilteredData(data);
    }
  }, [isLoading, isFetching]);

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["GetMiscValue"]);
      queryClient.removeQueries(["getSecurityUserListData"]);
    };
  }, []);

  // useEffect to toggle button label
  useEffect(() => {
    if (status === "success" && selectedRows.length === filteredData.length)
      setSelectAll(true);
  }, [selectedRows]);

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

    let retrievalValues: any = [
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
    ];
    if (retrievalType === "DATEAPUSERSLIST") {
      retrievalValues = [
        ...retrievalValues,
        {
          id: "USER_NAME",
          value: {
            condition: "equal",
            value: selectedRowsRef?.current
              .map((key) => {
                return key.toString();
              })
              .join(","),

            columnName: "USER_NAME",
            label: "UserList",
            displayValue: selectedRowsLabelRef?.current
              .map((key) => {
                const splitNames = key.toString().split("|");
                return splitNames?.[0];
              })
              .join(","),
          },
        },
      ];
    } else if (retrievalType === "CARDACTIVEPIN") {
      retrievalValues = [
        ...retrievalValues,
        {
          id: "A_STATUS",
          value: {
            condition: "equal",
            value: selectedRowsRef?.current
              .map((key) => {
                return key.toString();
              })
              .join(","),

            columnName: "status",
            label: "Status",
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
        ...retrievalValues,
        {
          id: "A_TRN_TYPE",
          value: {
            condition: "equal",
            value: selectedRowsRef?.current
              .map((key) => {
                return key.toString();
              })
              .join(","),

            columnName: "tranType",
            label: "TransactionType",
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
      selectAll: selectAllRef.current,
      selectedRows: selectedRowsRef.current,
      selectedRowsData: selectedRowsLabelRef.current,
    });
  };

  const handleListItemDoubleClick = (e) => {
    if (selectedRows.length === 0 || selectedRowsData.length === 0) {
      // setIsOpenSave(true);
    } else {
      selectedRowsRef.current = selectedRows;
      selectedRowsLabelRef.current = selectedRowsData;
      isDetailFormRef.current?.handleSubmit(e, "save");
    }
  };
  return (
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
      <>
        <FormWrapper
          key={"PaymentDetailsRetrieval"}
          metaData={PaymentDetailsRetrievalMetadata as MetaDataType}
          initialValues={defaultData as InitialValuesType}
          onSubmitHandler={onSubmitHandler}
          //@ts-ignore
          formStyle={{
            background: "white",
            // height: "calc(42vh - 100px)",
            // overflowY: "auto",
            // overflowX: "hidden",
          }}
          // controlsAtBottom={true}
          containerstyle={{ padding: "10px" }}
          ref={isDetailFormRef}
        ></FormWrapper>
        <>
          <TextField
            // {...others}
            // key={fieldKey}
            placeholder={String(t("Search"))}
            id=""
            name={"Search"}
            value={searchQuery}
            onChange={handleSearchInputChange}
            style={{ width: "96%", margin: "0px 11px auto" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            //@ts-ignore
          />

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
                      flex: 1,
                      padding: ".75rem",
                      fontWeight: 500,
                      fontFamily: "Roboto, Helvetica",
                      background: "var(--theme-color1)",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      zIndex: 9,
                      "& span": {
                        flex: 1,
                      },
                    }}
                  >
                    {retrievalType === "DATEAPUSERSLIST" ? (
                      <>
                        <span>{t("UserID")}</span>
                        <span>{t("GroupName")}</span>
                        <span>{t("Description")}</span>
                      </>
                    ) : retrievalType === "CARDACTIVEPIN" ? (
                      <span>{t("Status")}</span>
                    ) : (
                      <span>{t("TransactionType")}</span>
                    )}
                  </Box>
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
                          selectAll ||
                          selectedRows.includes(item?.value) ||
                          selectedRowsData.includes(item.label)
                        }
                        onClick={(event) =>
                          handleRowClick(event, item?.value, item?.label)
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
                if (!isLoading && !selectAll) {
                  setSelectedRows(filteredData.map((item) => item?.value));
                  setSelectedRowsData(filteredData.map((item) => item?.label));
                  setSelectAll(true);
                } else if (!isLoading) {
                  setSelectedRows([]);
                  setSelectedRowsData([]);
                  setSelectAll(false);
                }
              }}
            >
              {status === "success" && selectAll
                ? t("DeselectAll")
                : t("SelectAll")}
            </GradientButton>
            <GradientButton
              onClick={(e) => {
                if (
                  selectedRows.length === 0 ||
                  selectedRowsData.length === 0
                ) {
                  // setIsOpenSave(true);
                  enqueueSnackbar(t("Pleaseselectatleastonerow"), {
                    variant: "error",
                  });
                } else {
                  selectedRowsRef.current = selectedRows;
                  selectedRowsLabelRef.current = selectedRowsData;
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
      </>
    </div>
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
  const splitNames = name.split("|");
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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        onClick={onClick}
        disabled={false}
        selected={selected}
        onDoubleClick={onDoubleClick}
      >
        {/* <ListItemText primary={name} /> */}
        {splitNames.map((names) => (
          <span
            style={{
              textAlign: "left",
              flex: 1,
              padding: ".35rem 0",
              fontWeight: 400,
              fontFamily: "Roboto, Helvetica",
            }}
          >
            {names}
          </span>
        ))}
      </ListItem>
      <Divider />
    </div>
  );
};
export const DateListRetrievalWrapper = ({
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
        <DateListRetrieval
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
