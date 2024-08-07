import { Dialog, DialogActions, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import { useContext, useMemo, useRef, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useSnackbar } from "notistack";
import { AuthContext } from "pages_audit/auth";
import { WORKER_STATUS } from "@koale/useworker";
import { exportReportFormMetaData } from "./ExportReportForm/metaData";
import { useWorkerContext } from "./context/exportWorkerContext";
import { useTranslation } from "react-i18next";

import {
  FormWrapper,
  GradientButton,
  components,
  GridMetaDataType,
  ActionTypes,
  queryClient,
} from "@acuteinfo/common-base";

// classes
const useStyles = makeStyles((theme: Theme) => ({
  dataGrid: {
    fontWeight: 500,
    fontFamily: '"Roboto", "Helvetica", "Arial", "sans-serif" !important',
    fontSize: "0.9rem",
    letterSpacing: "0.01071em",

    "& .MuiDataGrid-columnHeaderTitle": {
      color: "var(--theme-color1)",
      fontWeight: 700,
    },

    "& .Mui-checked": {
      color: "var(--theme-color1)",
    },
    "& .MuiCheckbox-indeterminate": {
      color: theme.palette.text.secondary,
    },
  },
}));

const ReportExportScreen = ({
  globalFilter = "",
  filters,
  queryFilters = [],
  onClose,
  rows,
  columns,
  title,
}) => {
  console.log("globalFilter", globalFilter, "queryFilters", queryFilters);
  const {
    pdfExporter,
    excelExporter,
    csvExporter,
    textExporter,
    htmlExporter,
    xmlExporter,
    setWorkerQueue,
    status,
    markComplete,
  } = useWorkerContext();

  // storing status in ref to access real time status in submit function
  const statusRef = useRef<any>(null);
  statusRef.current = status;

  const refSelectedRows = useRef<any>([]);
  const classes = useStyles();
  const refData = useRef<any>(null);
  const { enqueueSnackbar } = useSnackbar();
  const { authState } = useContext(AuthContext);
  const { t } = useTranslation();
  //   // filter columns where cell type is button
  columns = useMemo(
    () =>
      columns.filter((column) => {
        return (
          column?.Cell?.name !== "ButtonRowCell" &&
          column?.Cell !== components.ButtonRowCell
        );
      }),
    []
  );

  //   // get {accessor: columnName} objects for filter displayname
  const columnLabel = useMemo(() => {
    return columns.reduce((accu, item) => {
      return { ...accu, [item?.accessor]: item?.columnName };
    }, {});
  }, []);

  //   // get all columns name
  const columnData = useMemo(
    () =>
      columns.map((column, index) => {
        return {
          id: index + 1,
          cname: column.columnName,
          [column.accessor]: column.accessor,
          cellType:
            column?.Cell === components.DateTimeCell ||
            column?.componentType === "dateTime"
              ? "DateTimeCell"
              : column?.Cell === components.DateCell ||
                column?.componentType === "date"
              ? "DateCell"
              : column?.Cell === components.TimeCell ||
                column?.componentType === "time"
              ? "TimeCell"
              : "",
          format: column?.format ?? "",
        };
      }),
    []
  );

  console.log(columnData);

  //   // state to track user selected column to export
  const [selectionModel, setSelectionModel] = useState<any>(() =>
    columnData.map((c: { id: number }) => c.id)
  );
  refSelectedRows.current = selectionModel;

  //   // get all rows data
  const rowData = useMemo(
    () => rows.map((row: Array<object>) => row?.values),
    []
  );

  const addInQueue = (title = "example") => {
    const id = new Date().getTime();
    const newRow = {
      id,
      title,
      isCompleted: false,
    };

    setWorkerQueue((prev) => [newRow, ...prev]);
    return id;
  };

  // submit function
  const onSubmitHandler = (data, displayData, endSubmit, setFieldError) => {
    endSubmit(true);

    // error handling
    if (rowData.length === 0) {
      enqueueSnackbar("No data found to export!", { variant: "error" });
      return;
    }
    if (refSelectedRows.current.length === 0) {
      enqueueSnackbar("Please select atleast one column!", {
        variant: "error",
      });
      return;
    }

    // options to pass in exporting functions
    const exportOptions = {
      columns: columnData,
      rows: rowData,
      title,
      columnsSelected: refSelectedRows.current,
      data,
      auth: authState,
      retrievalParams: queryFilters,
      filters,
      globalFilter,
      columnLabel,
    };

    // call export and show custom notification popup
    enqueueSnackbar("Report Export Status", {
      variant: "exportReportSnackbar",
      preventDuplicate: true,
      persist: true,
      anchorOrigin: { horizontal: "right", vertical: "bottom" },
    });
    switch (data.export_type) {
      case "EXCEL":
        if (statusRef.current.excelStatus === WORKER_STATUS.RUNNING) {
          console.log("excel in operation");
          return;
        }
        let exportExcelId = addInQueue(`${title} - Excel`);
        excelExporter(exportOptions).then((result: any) => {
          const url = URL.createObjectURL(result.blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = result.downloadTitle;
          a.click();

          URL.revokeObjectURL(url);
          markComplete(exportExcelId);
        });
        break;
      case "CSV":
        if (statusRef.current.csvStatus === WORKER_STATUS.RUNNING) {
          console.log("csv in operation");
          return;
        }
        let exportCSVId = addInQueue(`${title} - Csv`);
        csvExporter(exportOptions).then((result: any) => {
          const url = URL.createObjectURL(result.blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = result.downloadTitle;
          a.click();

          URL.revokeObjectURL(url);
          markComplete(exportCSVId);
        });
        break;
      case "PDF":
        if (statusRef.current.pdfStatus === WORKER_STATUS.RUNNING) {
          console.log("pdf in operation");
          return;
        }
        let exportPDFId = addInQueue(`${title} - Pdf`);
        pdfExporter({
          ...exportOptions,
          banklogo: `${new URL(window.location.href).origin}/bank-logo.png`,
        }).then((result) => {
          const a = document.createElement("a");
          a.href = result.blob;
          a.download = result.downloadTitle;
          a.click();
          markComplete(exportPDFId);
        });
        break;
      case "TEXT":
        if (statusRef.current.textStatus === WORKER_STATUS.RUNNING) {
          console.log("text in operation");
          return;
        }
        let exportTextId = addInQueue(`${title} - Text`);
        textExporter(exportOptions).then((result: any) => {
          const url = URL.createObjectURL(result.blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = result.downloadTitle;
          a.click();

          URL.revokeObjectURL(url);
          markComplete(exportTextId);
        });
        break;
      case "XML":
        if (statusRef.current.xmlStatus === WORKER_STATUS.RUNNING) {
          console.log("xml in operation");
          return;
        }
        let exportXMLId = addInQueue(`${title} - Xml`);
        xmlExporter(exportOptions).then((result: any) => {
          const url = URL.createObjectURL(result.blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = result.downloadTitle;
          a.click();

          URL.revokeObjectURL(url);
          markComplete(exportXMLId);
        });
        break;
      case "HTML":
        if (statusRef.current.htmlStatus === WORKER_STATUS.RUNNING) {
          console.log("html in operation");
          return;
        }
        let exportHTMLId = addInQueue(`${title} - Html`);
        htmlExporter(exportOptions).then((result: any) => {
          const url = URL.createObjectURL(result.blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = result.downloadTitle;
          a.click();

          URL.revokeObjectURL(url);
          markComplete(exportHTMLId);
        });
        break;
      default:
        break;
    }
    onClose();
  };

  return (
    <Dialog
      open={true}
      PaperProps={{
        style: {
          width: "65%",
        },
      }}
      maxWidth="lg"
    >
      <FormWrapper
        key={"ExportReportForm"}
        metaData={exportReportFormMetaData}
        // initialValues={(rows?.[0]?.data ?? {}) as InitialValuesType}
        onSubmitHandler={onSubmitHandler}
        //@ts-ignore
        displayMode={null}
        formStyle={{
          background: "white",
        }}
        ref={refData}
      />
      {/* typography to display total data length to be exported */}
      <Typography
        style={{ paddingLeft: ".75rem" }}
        variant="caption"
        display="block"
        gutterBottom
      >
        {rowData.length === 0
          ? `${"NoDataFound"}`
          : `${rowData.length} row(s) will be exported.`}
      </Typography>

      <div style={{ height: "50vh", width: "100%" }}>
        <DataGrid
          className={classes.dataGrid}
          rows={columnData}
          rowHeight={36}
          columnHeaderHeight={40}
          columns={[
            { field: "id", headerName: "Sr. no.", width: 100 },
            { field: "cname", headerName: "Columns to Export", width: 300 },
          ]}
          paginationModel={{ page: 0, pageSize: 50 }}
          checkboxSelection
          disableRowSelectionOnClick
          disableColumnMenu={true}
          rowSelectionModel={selectionModel}
          onRowSelectionModelChange={setSelectionModel}
          hideFooter={true}
          style={{ fontWeight: 500 }}
        />
      </div>

      <DialogActions style={{ display: "flex", justifyContent: "center" }}>
        <GradientButton
          onClick={(e) => {
            refData.current?.handleSubmit(e);
          }}
        >
          {t("Export")}
        </GradientButton>

        <GradientButton onClick={onClose}>{t("Close")}</GradientButton>
      </DialogActions>
    </Dialog>
  );
};

export default ReportExportScreen;
