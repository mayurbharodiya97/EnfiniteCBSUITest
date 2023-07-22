import {
  Box,
  Collapse,
  Dialog,
  Grid,
  IconButton,
  Popover,
  Tooltip,
  Typography,
} from "@mui/material";
import { Alert } from "components/common/alert";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";

import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import "jspdf-autotable";
import * as API from "./api";
import { useQuery } from "react-query";
import { GradientButton } from "components/styledComponent/button";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import BackupTableIcon from "@mui/icons-material/BackupTable";
import { ExcelForStatementExport } from "components/report/export/statementExcel";
import { AuthContext } from "pages_audit/auth";
import RetrieveIcon from "assets/icons/retrieveIcon";
import { ViewStatement } from "pages_audit/acct_Inquiry/viewStatement";
import SimpleType from "./simpleType";
import GridType from "./gridType";
import SimpleGridType from "./simpleGridType";
import Title from "./title";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import ExportToPDF from "components/report/export/statementPdf";
import { format } from "date-fns";
import { isValidDate } from "components/utils/utilFunctions/function";
const AccountDetails = () => {
  const [open, setOpen] = useState(false);
  const [openViewStatement, setOpenViewStatement] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openBoxes, setOpenBoxes] = useState<any>([false]);
  const [reqPara, setReqPara] = useState<any>([]);

  const authState = useContext(AuthContext);

  const rowsDataRef: any = useRef([]);

  useEffect(() => {
    const dataString = sessionStorage.getItem("myData");
    if (dataString) {
      const rowsData = JSON.parse(dataString);
      rowsDataRef.current = rowsData;
    }
  }, []);

  const { data, isLoading, isFetching, refetch, error, isError } = useQuery<
    any,
    any
  >(["StatementDetailsData"], () =>
    API.StatementDetailsData({
      COMP_CD: authState?.authState?.companyID ?? "",
      ACCT_CD: rowsDataRef.current?.[0]?.data?.ACCT_CD ?? "",
      ACCT_TYPE: rowsDataRef.current?.[0]?.data?.ACCT_TYPE ?? "",
      FROM_DT: isValidDate(rowsDataRef.current?.FROM_DT)
        ? format(new Date(rowsDataRef.current?.FROM_DT), "dd-MMM-yyyy") ?? ""
        : format(new Date(), "dd-MMM-yyyy"),
      TO_DT: isValidDate(rowsDataRef.current?.TO_DT)
        ? format(new Date(rowsDataRef.current?.TO_DT), "dd-MMM-yyyy") ?? ""
        : format(new Date(), "dd-MMM-yyyy"),
      METADATA: "STMT",
      // ACCT_TYPE: "001",
      // ACCT_CD: "008993",
      // FROM_DT: "01-APR-2002",
      // TO_DT: "30-APR-2023",
      // METADATA: "STMT",
    })
  );

  const openPopover = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleBoxToggle = (index) => {
    setOpenBoxes((prevOpenBoxes) => {
      const updatedOpenBoxes = [...prevOpenBoxes];
      updatedOpenBoxes[index] = !updatedOpenBoxes[index];
      return updatedOpenBoxes;
    });
  };

  const handleExpandAll = () => {
    setOpenBoxes((prevOpenBoxes) => prevOpenBoxes.map(() => true));
  };

  const handleCollapseAll = () => {
    setOpenBoxes((prevOpenBoxes) => prevOpenBoxes.map(() => false));
  };

  useEffect(() => {
    if (data) {
      const defaultOpenSections = data.map(
        (info) => info?.IS_DEFAULT_OPEN || false
      );
      setOpenBoxes(defaultOpenSections);
    }
  }, [data]);

  const companyName = authState?.authState?.companyName;
  const generatedBy = authState?.authState?.user?.id;
  const RequestingBranchCode = authState?.authState?.user?.branchCode;

  return (
    <Dialog fullScreen={true} open={true}>
      {isError || error ? (
        <Fragment>
          <div style={{ width: "100%", paddingTop: "10px" }}>
            <Alert
              severity={error?.severity ?? "error"}
              errorMsg={error?.error_msg ?? "Error"}
              errorDetail={error?.error_detail ?? ""}
            />
          </div>
        </Fragment>
      ) : null}
      <Grid
        container
        sx={{
          minHeight: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Grid
          item
          sx={{
            minHeight: "100vh",
            width: "90%",
            padding: "10px 0px",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              fontFamily: "Roboto, sans-serif",
              backgroundColor: "var(--theme-color3)",
              padding: "10px",
              textAlign: "center",
              marginBottom: "20px",
              color: "var(--theme-color2)",
              borderRadius: "10px",
              display: "flex",
              fontSize: "24px",
            }}
          >
            <Grid
              item
              xs={11}
              sm={11}
              md={11}
              lg={11}
              xl={11}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              onClick={
                openBoxes.every((value) => value === true)
                  ? handleCollapseAll
                  : handleExpandAll
              }
            >
              Account Statement{" "}
            </Grid>
            {isError || isLoading || isFetching || error ? null : (
              <Grid
                item
                xs={1}
                sm={1}
                md={1}
                lg={1}
                xl={1}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "end",
                }}
              >
                {" "}
                <Tooltip title="Retrieve">
                  <IconButton
                    onClick={() => {
                      setOpenViewStatement(true);
                    }}
                  >
                    <RetrieveIcon />
                  </IconButton>
                </Tooltip>
                {openViewStatement && (
                  <ViewStatement
                    open={openViewStatement}
                    onClose={() => setOpenViewStatement(false)}
                    rowsData={null}
                    screenFlag={"STATEMENT"}
                  />
                )}
                <Tooltip title="Download">
                  <IconButton onClick={handleClick}>
                    <DownloadRoundedIcon
                      sx={{ color: "var(--theme-color2)" }}
                    />
                  </IconButton>
                </Tooltip>
                {/**/}
                {openBoxes.every((value) => value === true) ? (
                  <Tooltip title="Collapse All">
                    <IconButton
                      sx={{ color: "var(--theme-color2)" }}
                      onClick={handleCollapseAll}
                    >
                      <KeyboardDoubleArrowUpIcon />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="Expand All">
                    <IconButton
                      sx={{ color: "var(--theme-color2)" }}
                      onClick={handleExpandAll}
                    >
                      <KeyboardDoubleArrowDownIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {/**/}
                <Popover
                  id={id}
                  open={openPopover}
                  anchorEl={anchorEl}
                  onClose={() => setAnchorEl(null)}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  // sx={styles.popover}
                  PaperProps={{
                    style: {
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                      padding: "6px",
                    },
                  }}
                >
                  <GradientButton
                    onClick={() =>
                      ExportToPDF(
                        data,
                        companyName,
                        generatedBy,
                        RequestingBranchCode
                      )
                    }
                    endIcon={<PictureAsPdfIcon />}
                  >
                    PDF
                  </GradientButton>
                  <GradientButton
                    onClick={() =>
                      ExcelForStatementExport({
                        data,
                        companyName,
                        generatedBy,
                        RequestingBranchCode,
                      })
                    }
                    endIcon={<BackupTableIcon />}
                  >
                    EXCEL
                  </GradientButton>
                </Popover>
              </Grid>
            )}
          </Typography>
          {isLoading || isFetching ? (
            <>
              <LoaderPaperComponent />
            </>
          ) : (
            data?.map((info, index) => (
              <>
                <Title
                  data={info}
                  index={index}
                  openBoxes={openBoxes}
                  handleBoxToggle={handleBoxToggle}
                />

                <Collapse
                  in={
                    openBoxes[index] ||
                    openBoxes.every((value) => value === true)
                  }
                >
                  {info.DISPLAY_TYPE === "simple" ? (
                    <SimpleType data={info} />
                  ) : info.DISPLAY_TYPE === "grid" ? (
                    <GridType data={info} />
                  ) : info.DISPLAY_TYPE === "simpleGrid" ? (
                    <SimpleGridType data={info} />
                  ) : null}
                </Collapse>
              </>
            ))
          )}
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default AccountDetails;
