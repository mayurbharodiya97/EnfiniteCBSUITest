// import {
//   Box,
//   Collapse,
//   Dialog,
//   Grid,
//   IconButton,
//   Popover,
//   Tooltip,
//   Typography,
// } from "@mui/material";

// import { useContext, useCallback, useEffect, useState } from "react";
// import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
// import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";

// import { AccountDetailsGridMetaData } from "./gridMetaData";
// import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
// import "jspdf-autotable";
// import * as API from "./api";
// import { useQuery } from "react-query";
// import { GradientButton } from "components/styledComponent/button";
// import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
// import BackupTableIcon from "@mui/icons-material/BackupTable";
// import { ExcelForStatementExport } from "components/report/export/statementExcel";
// import { AuthContext } from "pages_audit/auth";
// import RetrieveIcon from "assets/icons/retrieveIcon";
// import { ViewStatement } from "pages_audit/acct_Inquiry/viewStatement";
// import SimpleType from "./simpleType";
// import GridType from "./gridType";
// import NoneType from "./noneType";
// import SimpleGridType from "./simpleGridType";
// import Title from "./title";
// const AccountDetails = () => {
//   const [openBoxes, setOpenBoxes] = useState([false]);
//   const [expandAll, setExpandAll] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [openViewStatement, setOpenViewStatement] = useState(false);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [state, setState] = useState([]);

//   const authState = useContext(AuthContext);

//   const handleBoxToggle = (index) => {
//     setOpenBoxes((prevOpenBoxes) => {
//       const updatedOpenBoxes = [...prevOpenBoxes];
//       updatedOpenBoxes[index] = !updatedOpenBoxes[index];
//       return updatedOpenBoxes;
//     });
//   };

//   const handleExpandAll = () => {
//     const isAllExpanded = openBoxes.every((isOpen) => isOpen);

//     setOpenBoxes((prevOpenBoxes) => prevOpenBoxes.map(() => !isAllExpanded));
//     setExpandAll(!isAllExpanded);
//   };

//   const { data, isLoading, isFetching, refetch, error, isError } = useQuery<
//     any,
//     any
//   >(["StatementDetailsData"], () => API.StatementDetailsData());

//   useEffect(() => {
//     const setFalseCount = Array.from(
//       { length: data?.length || 0 },
//       () => false
//     );
//     setOpenBoxes(setFalseCount);
//   }, [data]);
//   useEffect(() => {
//     if (data) {
//       const updatedOpenBoxes = data.map((item) =>
//         item?.isDefaultOpen ? true : false
//       );
//       setOpenBoxes(updatedOpenBoxes);
//     }
//   }, [data, openBoxes]);

//   const openPopover = Boolean(anchorEl);
//   const id = open ? "simple-popover" : undefined;

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   return (
//     <Dialog fullScreen={true} open={true}>
//       <Grid
//         container
//         sx={{
//           minHeight: "auto",
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//         }}
//       >
//         <Grid
//           item
//           sx={{
//             minHeight: "100vh",
//             width: "90%",
//             padding: "10px 0px",
//           }}
//         >
//           <Typography
//             variant="h4"
//             sx={{
//               fontWeight: "bold",
//               fontFamily: "Roboto, sans-serif",
//               backgroundColor: "var(--theme-color3)",
//               padding: "10px",
//               textAlign: "center",
//               marginBottom: "20px",
//               color: "var(--theme-color2)",
//               borderRadius: "10px",
//               display: "flex",
//               fontSize: "24px",
//             }}
//           >
//             <Grid
//               item
//               xs={11}
//               sm={11}
//               md={11}
//               lg={11}
//               xl={11}
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 cursor: "pointer",
//               }}
//               onClick={handleExpandAll}
//             >
//               Account Statement{" "}
//             </Grid>
//             <Grid
//               item
//               xs={1}
//               sm={1}
//               md={1}
//               lg={1}
//               xl={1}
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "end",
//               }}
//             >
//               {" "}
//               <Tooltip title="Retrieve">
//                 <IconButton
//                   onClick={() => {
//                     setOpenViewStatement(true);
//                   }}
//                 >
//                   <RetrieveIcon />
//                 </IconButton>
//               </Tooltip>
//               {openViewStatement && (
//                 <ViewStatement
//                   open={openViewStatement}
//                   onClose={() => setOpenViewStatement(false)}
//                   rowsData={null}
//                 />
//               )}
//               <Tooltip title="Download">
//                 <IconButton onClick={handleClick}>
//                   <DownloadRoundedIcon sx={{ color: "var(--theme-color2)" }} />
//                 </IconButton>
//               </Tooltip>
//               {expandAll ? (
//                 <Tooltip title="Collapse All">
//                   <IconButton
//                     onClick={handleExpandAll}
//                     sx={{ color: "var(--theme-color2)" }}
//                   >
//                     <KeyboardDoubleArrowUpIcon />
//                   </IconButton>
//                 </Tooltip>
//               ) : (
//                 <Tooltip title="Expand All">
//                   <IconButton
//                     onClick={handleExpandAll}
//                     sx={{ color: "var(--theme-color2)" }}
//                   >
//                     <KeyboardDoubleArrowDownIcon />
//                   </IconButton>
//                 </Tooltip>
//               )}
//               <Popover
//                 id={id}
//                 open={openPopover}
//                 anchorEl={anchorEl}
//                 onClose={() => setAnchorEl(null)}
//                 anchorOrigin={{
//                   vertical: "bottom",
//                   horizontal: "left",
//                 }}
//                 transformOrigin={{
//                   vertical: "top",
//                   horizontal: "left",
//                 }}
//                 // sx={styles.popover}
//                 PaperProps={{
//                   style: {
//                     display: "flex",
//                     flexDirection: "column",
//                     gap: "6px",
//                     padding: "6px",
//                   },
//                 }}
//               >
//                 <GradientButton
//                   // onClick={generatePDF}
//                   endIcon={<PictureAsPdfIcon />}
//                 >
//                   PDF
//                 </GradientButton>
//                 <GradientButton
//                   onClick={() =>
//                     ExcelForStatementExport({
//                       data: data,
//                       columns: AccountDetailsGridMetaData?.columns,
//                       companyName: authState.authState.companyName,
//                     })
//                   }
//                   endIcon={<BackupTableIcon />}
//                 >
//                   EXCEL
//                 </GradientButton>
//               </Popover>
//             </Grid>
//           </Typography>
//           {data?.map((info, index) => (
//             <>
//               <Title
//                 handleBoxToggle={handleBoxToggle}
//                 openBoxes={openBoxes}
//                 data={info}
//                 index={index}
//               />

//               <Collapse in={openBoxes[index]}>
//                 {info?.displayType === "simple" ? (
//                   <SimpleType data={info} />
//                 ) : info?.displayType === "grid" ? (
//                   <GridType data={info} />
//                 ) : info?.displayType === "simpleGrid" ? (
//                   <SimpleGridType data={info} />
//                 ) : null}
//               </Collapse>
//             </>
//           ))}
//         </Grid>
//       </Grid>
//     </Dialog>
//   );
// };

// export default AccountDetails;

import {
  Box,
  Button,
  Collapse,
  Dialog,
  Grid,
  IconButton,
  Popover,
  SvgIcon,
  Tooltip,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useContext, useState } from "react";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import { AccountDetailsGridMetaData } from "./gridMetaData";
import { GridMetaDataType } from "components/dataTable/types";
import AccountDetailsChild from "./accountDetailsChild";
import BranchDetails from "./branchDetails";
import AccountStatementDetails from "./accountStatementDetails";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as API from "./api";
import { useQuery } from "react-query";
import ProjectLogo from "assets/images/easy_bankcore_Logo.png";
import { GradientButton } from "components/styledComponent/button";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import BackupTableIcon from "@mui/icons-material/BackupTable";
import { ExcelForStatementExport } from "components/report/export/statementExcel";
import { AuthContext } from "pages_audit/auth";
import RetrieveIcon from "assets/icons/retrieveIcon";
import { ViewStatement } from "pages_audit/acct_Inquiry/viewStatement";
const AccountDetails = () => {
  const [openBoxes, setOpenBoxes] = useState([false, false, false, true]);
  const [expandAll, setExpandAll] = useState(false);
  const [open, setOpen] = useState(false);
  const [openViewStatement, setOpenViewStatement] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const authState = useContext(AuthContext);

  const handleBoxToggle = (index) => {
    setOpenBoxes((prevOpenBoxes) => {
      const updatedOpenBoxes = [...prevOpenBoxes];
      updatedOpenBoxes[index] = !updatedOpenBoxes[index];
      return updatedOpenBoxes;
    });
  };

  const handleExpandAll = () => {
    const isAllExpanded = openBoxes.every((isOpen) => isOpen);

    setOpenBoxes((prevOpenBoxes) => prevOpenBoxes.map(() => !isAllExpanded));
    setExpandAll(!isAllExpanded);
  };

  var openBoxesFirstThree = [openBoxes[0], openBoxes[1], openBoxes[2]];
  const anyTrue = openBoxesFirstThree.some((item) => {
    return item;
  });

  const typographyTitleStyle = {
    fontFamily: "Roboto, sans-serif",
    backgroundColor: "var(--theme-color4)",
    padding: "12px",
    color: "var(--theme-color1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "10px",
    textTransform: "capitalize",
    fontWeight: "bold",
    fontSize: "1.3rem",
    borderRadius: "10px",
    cursor: "pointer",
  };

  const collapseableBox = {
    height: "auto",
    width: "100%",
    // marginBottom: "10px",
    // padding: "10px",
    display: "flex",
    margin: "10px 0px",
  };

  const openTypography = {
    padding: "12px",
  };

  const defaultOpendTypography = {
    ...typographyTitleStyle,
    ...openTypography,
  };

  const halfMainGrid = {
    height: "auto",
    // padding: "10px",
    display: "flex",
  };
  const childGridFour = {
    // padding: "10px",
    display: "flex",
    flexDirection: "column",
  };
  const childGridEight = {
    padding: "0",
  };

  const typographyLable = {
    fontFamily: "Roboto, sans-serif",
    fontWeight: "900",
  };

  const typographyGridForLable = {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px",
  };
  const typographyForValue = {
    padding: "10px",
    fontFamily: "Roboto, sans-serif",
  };

  const colonStyle = {
    fontWeight: "bold",
  };

  const statementData = [
    {
      label: "Opening Balance",
      value: "13,934.55",
      currency: "INR",
    },
    {
      label: "Debit Amount",
      value: "76,307.32",
      currency: "INR",
    },
    {
      label: "Credit Amount",
      value: "88,059.00",
      currency: "INR",
    },
    {
      label: "Closing Balance",
      value: "25,686.23",
      currency: "INR",
    },
    {
      label: "Debit Count",
      value: "25",
    },
    {
      label: "Credit Count",
      value: "3",
    },
  ];

  const accountDetailsData = [
    {
      label: "Customer Name",
      value: "Sachawala Mohd Sajid",
    },
    { label: "Joint holder name 1", value: "Not Applicable" },
    { label: "Joint holder name 2", value: "Not Applicable" },
    { label: "Currency", value: "INR" },
    { label: "Nominee", value: "Registered" },
    { label: "Account Number", value: "1234567890" },
    { label: "Account opened on", value: "6th May 2011" },
    { label: "Account Status", value: "Account Open Regular" },
    { label: "Limit", value: "0.00" },
    { label: "Hold balance", value: "0.00" },
    { label: "Type Of Account", value: "Saving Account" },
  ];

  const branchDetailsData = [
    { label: "Branch Name", value: "Navarangpura" },
    {
      label: "Branch Address",
      value:
        "Astral tower,Near Mithakali Six Road,Navarangpura,Ahmedabad - 380 009",
    },
    { label: "Branch Phone Number", value: "18001234567" },
    { label: "IFSC code", value: "AFDC0000006" },
    { label: "MICR code", value: "3802420052" },
  ];

  const { data, isLoading, isFetching, refetch, error, isError } = useQuery<
    any,
    any
  >(["StatementDetailsData"], () => API.StatementDetailsData());

  const generatePDF = () => {
    const doc: any = new jsPDF();
    const margin = 10;
    let x = margin;
    let y = margin + 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    // Add the bank logo
    const logoWidth = 30;
    const logoHeight = 30;
    const logoX = margin;
    const logoY = margin;
    doc.addImage(ProjectLogo, "PNG", logoX, logoY, 0, 0);

    // Add the bank name and address
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    const bankNameX = logoX + logoWidth + 30;
    const bankNameY = logoY + 7;
    const bankName = doc.splitTextToSize("DEMO BANK ABC PVT.LTD");
    doc.text(bankName, bankNameX, bankNameY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const bankAddressX = bankNameX;
    const bankAddressY = bankNameY + 6;
    doc.text("123 Bank Street, City", bankAddressX, bankAddressY);

    // Draw a horizontal line
    const lineY = bankAddressY + 8;
    const lineWidth = pageWidth - margin * 2;
    const lineX = margin;
    doc.setLineWidth(0.5);
    doc.line(lineX, lineY, lineX + lineWidth, lineY);

    y += 20;
    //add account details
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("", x, y);
    y += 1;

    const header = [["ACCOUNT DETAILS"]];

    const halfLengthAccountDetailsData = Math.ceil(
      accountDetailsData.length / 2
    );
    const accountDetailsDataLeft = accountDetailsData.slice(
      0,
      halfLengthAccountDetailsData
    );
    const accountDetailsDataRight = accountDetailsData.slice(
      halfLengthAccountDetailsData
    );

    doc.autoTable({
      startX: x,
      startY: y,
      head: [[{ content: header, colSpan: 4, styles: { halign: "center" } }]],
      body: accountDetailsDataLeft.map((item, index) => [
        item.label,
        item.value,
        accountDetailsDataRight[index]?.label || "",
        accountDetailsDataRight[index]?.value || "",
      ]),
      theme: "grid",
      headStyles: {
        fillColor: [67, 70, 84],
        textColor: [255, 255, 255],
        fontSize: 10,
        halign: "center",
        columnWidth: [100],
      },
      bodyStyles: {
        textColor: [80, 80, 80],
        fontSize: 10,
      },
      margin: { top: 10 },
      didDrawCell: (data) => {
        if (data.section === "body" && data.row.index % 2 === 0) {
          data.cell.styles.fillColor = [240, 240, 240];
        }
      },
      tableWidth: doc.internal.pageSize.width - margin * 2 - 10,
      tableHeight: "auto",
    });

    y += 43;

    //Add branch details
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("", x, y);
    y += 20;

    const branchheader = [["BRANCH DETAILS"]];

    const halfLengthBranchDetailsData = Math.ceil(branchDetailsData.length / 2);
    const branchDetailsDataLeft = branchDetailsData.slice(
      0,
      halfLengthBranchDetailsData
    );
    const branchDetailsDataRight = branchDetailsData.slice(
      halfLengthBranchDetailsData
    );

    doc.autoTable({
      startX: x,
      startY: y,
      head: [
        [{ content: branchheader, colSpan: 4, styles: { halign: "center" } }],
      ],
      body: branchDetailsDataLeft.map((item, index) => [
        item.label,
        item.value,
        branchDetailsDataRight[index]?.label || "",
        branchDetailsDataRight[index]?.value || "",
      ]),
      theme: "grid",
      headStyles: {
        fillColor: [67, 70, 84],
        textColor: [255, 255, 255],
        fontSize: 10,
        halign: "center",
      },
      bodyStyles: {
        textColor: [80, 80, 80],
        fontSize: 10,
      },
      margin: { top: 10 },
      didDrawCell: (data) => {
        if (data.section === "body" && data.row.index % 2 === 0) {
          data.cell.styles.fillColor = [240, 240, 240];
        }
      },
      tableWidth: doc.internal.pageSize.width - margin * 2 - 10,
      tableHeight: "auto",
    });

    y += 35;

    //Add STATEMENT details

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("", x, y);
    y += 20;

    const statementHeader = [["STATEMENT DETAILS"]];

    const halfLengthStatementData = Math.ceil(statementData.length / 2);
    const statementDetailsDataLeft = statementData.slice(
      0,
      halfLengthStatementData
    );
    const statementDetailsDataRight = statementData.slice(
      halfLengthStatementData
    );

    doc.autoTable({
      startX: x,
      startY: y,
      head: [
        [
          {
            content: statementHeader,
            colSpan: 4,
            styles: { halign: "center" },
          },
        ],
      ],
      body: statementDetailsDataLeft.map((item, index) => [
        item.label,
        item.value,
        statementDetailsDataRight[index]?.label || "",
        statementDetailsDataRight[index]?.value || "",
      ]),
      theme: "grid",
      headStyles: {
        fillColor: [67, 70, 84],
        textColor: [255, 255, 255],
        fontSize: 10,
        halign: "center",
      },
      bodyStyles: {
        textColor: [80, 80, 80],
        fontSize: 10,
      },
      margin: { top: 10 },
      didDrawCell: (data) => {
        if (data.section === "body" && data.row.index % 2 === 0) {
          data.cell.styles.fillColor = [240, 240, 240];
        }
      },
      tableWidth: doc.internal.pageSize.width - margin * 2 - 10,
      tableHeight: "auto",
    });

    y += 35;

    // // Add statement details
    // doc.setFont("helvetica", "bold");
    // doc.setFontSize(12);
    // doc.text("", x, y);
    // y += 20;

    // const statementDetailsData = [
    //   ["", "ACCOUNT STATEMENT DETAILS", "", ""],
    //   ["Opening Balance", "Debit Amount", "Credit Amount", "Closing Balance"],
    //   [
    //     statementData[0].value,
    //     statementData[1].value,
    //     statementData[2].value,
    //     statementData[3].value,
    //   ],
    //   ["", "Debit Count", "Credit Count", ""],
    //   ["", statementData[1].value, statementData[2].value, ""],
    // ];

    // // Create the statement details table
    // doc.autoTable({
    //   startY: y,
    //   head: statementDetailsData.slice(0, 1),
    //   body: statementDetailsData.slice(1),
    //   theme: "grid",
    //   headStyles: {
    //     fillColor: [0, 0, 0],
    //     textColor: [255, 255, 255],
    //     fontSize: 10,
    //     halign: "center",
    //   },
    //   bodyStyles: {
    //     textColor: [80, 80, 80],
    //     fontSize: 10,
    //   },
    //   margin: { top: 10 },
    //   didDrawCell: (data) => {
    //     if (data.section === "body" && data.row.index % 2 === 0) {
    //       data.cell.styles.fillColor = [240, 240, 240];
    //     }
    //   },
    //   tableWidth: doc.internal.pageSize.width - margin * 2 - 10,
    //   tableHeight: "auto",
    // });
    const tableHeaders = AccountDetailsGridMetaData.columns.map(
      (item) => item.columnName
    );

    const tableData = data.map((item) => {
      const rowData: any[] = [];
      AccountDetailsGridMetaData.columns.forEach((column) => {
        const accessor = column.accessor;
        rowData.push(item[accessor]);
      });
      return rowData;
    });

    doc.autoTable({
      head: [tableHeaders],
      body: tableData,
      startY: 210,
      headStyles: {
        fillColor: [67, 70, 84],
        textColor: [255, 255, 255],
      },
    });

    // Save the PDF document
    doc.save("statement_of_account.pdf");
  };

  const openPopover = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <Dialog fullScreen={true} open={true}>
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
              onClick={handleExpandAll}
            >
              Account Statement{" "}
            </Grid>
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
              {/* <Tooltip title="Retrieve">
                <IconButton
                  onClick={() => {
                    setOpenViewStatement(true);
                  }}
                >
                  <RetrieveIcon />
                </IconButton>
              </Tooltip> */}
              {openViewStatement && (
                <ViewStatement
                  open={openViewStatement}
                  onClose={() => setOpenViewStatement(false)}
                  rowsData={null}
                />
              )}
              <Tooltip title="Download">
                <IconButton onClick={handleClick}>
                  <DownloadRoundedIcon sx={{ color: "var(--theme-color2)" }} />
                </IconButton>
              </Tooltip>
              {expandAll ? (
                <Tooltip title="Collapse All">
                  <IconButton
                    onClick={handleExpandAll}
                    sx={{ color: "var(--theme-color2)" }}
                  >
                    <KeyboardDoubleArrowUpIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title="Expand All">
                  <IconButton
                    onClick={handleExpandAll}
                    sx={{ color: "var(--theme-color2)" }}
                  >
                    <KeyboardDoubleArrowDownIcon />
                  </IconButton>
                </Tooltip>
              )}
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
                <Tooltip title="Pdf">
                  <GradientButton
                    onClick={generatePDF}
                    endIcon={<PictureAsPdfIcon />}
                  >
                    PDF
                  </GradientButton>
                </Tooltip>
                <Tooltip title="Excel">
                  <GradientButton
                    onClick={() =>
                      ExcelForStatementExport({
                        data: data,
                        columns: AccountDetailsGridMetaData?.columns,
                        companyName: authState.authState.companyName,
                      })
                    }
                    endIcon={<BackupTableIcon />}
                  >
                    EXCEL
                  </GradientButton>
                </Tooltip>
              </Popover>
            </Grid>
          </Typography>

          <Typography
            onClick={() => handleBoxToggle(0)}
            variant="h5"
            sx={{ ...typographyTitleStyle }}
          >
            Account Details
            {!openBoxes[0] ? (
              <Tooltip title="Expand Account Details" placement="left">
                <KeyboardArrowDownIcon />
              </Tooltip>
            ) : (
              <Tooltip title="Collapse Account Details" placement="left">
                <KeyboardArrowUpIcon />
              </Tooltip>
            )}
          </Typography>
          <Collapse in={openBoxes[0]}>
            <AccountDetailsChild
              collapseableBox={collapseableBox}
              halfMainGrid={halfMainGrid}
              childGridFour={childGridFour}
              typographyGridForLable={typographyGridForLable}
              typographyLable={typographyLable}
              colonStyle={colonStyle}
              childGridEight={childGridEight}
              typographyForValue={typographyForValue}
              accountDetailsData={accountDetailsData}
            />
          </Collapse>

          <Typography
            onClick={() => handleBoxToggle(1)}
            variant="h5"
            sx={typographyTitleStyle}
          >
            Branch Details
            {!openBoxes[1] ? (
              <Tooltip title="Expand Branch Details" placement="left">
                <KeyboardArrowDownIcon />
              </Tooltip>
            ) : (
              <Tooltip title="Collapse Branch Details" placement="left">
                <KeyboardArrowUpIcon />
              </Tooltip>
            )}
          </Typography>
          <Collapse in={openBoxes[1]}>
            <BranchDetails
              collapseableBox={collapseableBox}
              halfMainGrid={halfMainGrid}
              childGridFour={childGridFour}
              typographyGridForLable={typographyGridForLable}
              typographyLable={typographyLable}
              colonStyle={colonStyle}
              childGridEight={childGridEight}
              typographyForValue={typographyForValue}
              branchDetailsData={branchDetailsData}
            />
          </Collapse>
          <Typography
            onClick={() => handleBoxToggle(2)}
            variant="h5"
            sx={typographyTitleStyle}
          >
            Account Statement Details
            {!openBoxes[2] ? (
              <Tooltip
                title="Expand Account Statement Details"
                placement="left"
              >
                <KeyboardArrowDownIcon />
              </Tooltip>
            ) : (
              <Tooltip
                title="Collapse Account Statement Details"
                placement="left"
              >
                <KeyboardArrowUpIcon />
              </Tooltip>
            )}
          </Typography>

          <Collapse in={openBoxes[2]}>
            <AccountStatementDetails
              collapseableBox={collapseableBox}
              statementData={statementData}
            />
          </Collapse>

          <Box
            sx={{
              height: "fit-content",
              width: "100%",
              marginBottom: "20px",
              backgroundColor: "var(--theme-color4)",
              borderRadius: "10px",
              padding: "10px",
            }}
          >
            <GridWrapper
              key={`statementdetails`}
              finalMetaData={AccountDetailsGridMetaData as GridMetaDataType}
              data={data ?? []}
              setData={() => null}
              headerToolbarStyle={{
                background: "inherit",
                color: "black",
              }}
            />
          </Box>
          <Typography
            variant="h5"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "var(--theme-color4)",
              padding: "12px",
              marginBottom: "10px",
              borderRadius: "12px",
            }}
          >
            <Typography
              sx={{
                fontSize: "1.3rem",
                fontFamily: "Roboto,sans-serif",
                textTransform: "capitalize",
                fontWeight: "bold",
                color: "var(--theme-color1)",
              }}
            >
              {" "}
              Total Withdrawable Balance :{" "}
            </Typography>
            <Typography
              sx={{
                fontSize: "1.3rem",
                fontFamily: "Roboto,sans-serif",
                textTransform: "capitalize",
                fontWeight: "bold",
                color: "green",
              }}
            >
              &#8377;25,686.23
            </Typography>
          </Typography>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default AccountDetails;
