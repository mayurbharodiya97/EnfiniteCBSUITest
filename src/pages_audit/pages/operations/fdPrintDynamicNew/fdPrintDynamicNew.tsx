import { Fragment, useEffect, useRef, useState } from "react";
import { Box, Dialog, DialogTitle, DialogActions } from "@mui/material";
import { GradientButton } from "@acuteinfo/common-base";
import { t } from "i18next";
import { useReactToPrint } from "react-to-print";

interface PrintingItem {
  COL_NAME: string;
  COLVALUE: string;
  X_POS: string;
  Y_POS: string;
  COL_HEIGHT: string;
  COL_WIDTH: string;
  PAGE_HEIGHT?: string;
  PAGE_WIDTH?: string;
}

const FdPrintDynamicNew = ({ handleClose, PrintingData }) => {
  const printRef = useRef<any>(null);
  const [groupedData, setGroupedData] = useState<PrintingItem[][]>([]);

  useEffect(() => {
    const nameCount: Record<string, number> = {};
    const dataByName: Record<string, PrintingItem[]> = {};

    PrintingData.forEach((item) => {
      const name = item.COL_NAME;
      if (!dataByName[name]) {
        dataByName[name] = [];
      }
      dataByName[name].push(item);
    });

    const paginatedData: any = [];
    for (const [name, items] of Object.entries(dataByName)) {
      items.forEach((item) => {
        const pageIndex = nameCount[name] || 0;
        if (!paginatedData[pageIndex]) {
          paginatedData[pageIndex] = [];
        }
        paginatedData[pageIndex].push(item);
        nameCount[name] = pageIndex + 1;
      });
    }

    setGroupedData(paginatedData);
  }, [PrintingData]);

  useEffect(() => {
    const renderCanvas = () => {
      if (printRef.current && groupedData.length > 0) {
        const { PAGE_HEIGHT, PAGE_WIDTH } = PrintingData[0] || {};
        const padding = 8;
        printRef.current.innerHTML = "";

        groupedData.forEach((currentItems) => {
          const canvas: any = document.createElement("canvas");
          const context = canvas.getContext("2d");

          canvas.width = parseInt(PAGE_WIDTH) || 9864;
          canvas.height = parseInt(PAGE_HEIGHT) || 575;

          context.clearRect(0, 0, canvas.width, canvas.height);
          context.font = "bold 10px Courier";
          context.fillStyle = "black";

          currentItems.forEach((item) => {
            context.save();
            context.rect(
              parseInt(item.X_POS) + padding,
              parseInt(item.Y_POS) - parseInt(item.COL_HEIGHT) + padding,
              parseInt(item.COL_WIDTH),
              parseInt(item.COL_HEIGHT)
            );
            context.clip();
            context.fillText(
              item.COLVALUE,
              parseInt(item.X_POS) + padding,
              parseInt(item.Y_POS) + padding
            );
            context.restore();
          });
          printRef.current.appendChild(canvas);
        });
      }
    };

    renderCanvas();
  }, [PrintingData, groupedData]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onBeforeGetContent: () => {
      printRef.current.style.overflow = "hidden";
      return Promise.resolve();
    },
    onAfterPrint: () => {
      printRef.current.style.overflow = "scroll";
    },
  });

  const handleCloseDialog = () => {
    handleClose();
    setGroupedData([]);
  };

  return (
    <Fragment>
      {PrintingData && PrintingData.length > 0 ? (
        <Dialog
          open={true}
          PaperProps={{
            style: {
              height: "auto",
              width: "auto",
            },
          }}
          maxWidth="xl"
        >
          <DialogTitle>Print Data</DialogTitle>
          <Box
            ref={printRef}
            style={{ overflowY: "scroll", maxHeight: "80vh", padding: 16 }}
          ></Box>
          <DialogActions>
            <GradientButton onClick={handleCloseDialog}>
              Retrieve
            </GradientButton>
            <GradientButton
              onClick={handlePrint}
              style={{ marginLeft: "10px" }}
            >
              Print
            </GradientButton>
          </DialogActions>
        </Dialog>
      ) : (
        <Box
          style={{
            textAlign: "center",
            fontStyle: "italic",
            fontWeight: "bold",
            color: "rgba(133, 130, 130, 0.8)",
          }}
        >
          {t("NoDataFound")}
        </Box>
      )}
    </Fragment>
  );
};

export default FdPrintDynamicNew;
