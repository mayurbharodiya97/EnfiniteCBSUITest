import { WORKER_STATUS, useWorker } from "@koale/useworker";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import exportToPdf from "../ExportReportForm/pdfexport";
import { exportToExcel } from "../ExportReportForm/excelexport";
import { exportToCsv } from "../ExportReportForm/csvexport";
import { exportToText } from "../ExportReportForm/textexport";
import { exportToHtml } from "../ExportReportForm/htmlexport";
import { exportToXml } from "../ExportReportForm/xmlexport";

type StatusType = {
  excelStatus: string;
  pdfStatus: string;
  csvStatus: string;
  xmlStatus: string;
  htmlStatus: string;
  textStatus: string;
};

interface WorkerContextType {
  status: StatusType;
  workerQueue: any;
  pdfExporter: Function;
  excelExporter: Function;
  csvExporter: Function;
  textExporter: Function;
  htmlExporter: Function;
  xmlExporter: Function;
  setWorkerQueue: Function;
  markComplete: Function;
}

export const WorkerContext = createContext<WorkerContextType>({
  status: {
    excelStatus: "",
    pdfStatus: "",
    csvStatus: "",
    xmlStatus: "",
    htmlStatus: "",
    textStatus: "",
  },
  workerQueue: [],
  setWorkerQueue: () => {},
  pdfExporter: () => {},
  excelExporter: () => {},
  csvExporter: () => {},
  textExporter: () => {},
  htmlExporter: () => {},
  xmlExporter: () => {},
  markComplete: () => {},
});

export const WorkerContextProvider = ({ children }) => {
  const [workerQueue, setWorkerQueue] = useState<any>([]);
  const statusRef = useRef<any>();

  const markComplete = (id) => {
    setWorkerQueue((oldData) => {
      return oldData.map((item) => {
        if (item.id === id) {
          return { ...item, isCompleted: true };
        }
        return item;
      });
    });
    setTimeout(() => {
      setWorkerQueue((oldData) => {
        return oldData.filter((item) => {
          return item?.id !== id;
        });
      });
    }, 5000);
  };

  // for pdf file
  const [pdfExporter, { status: pdfStatus }] = useWorker(exportToPdf, {
    remoteDependencies: [
      "https://cdnjs.cloudflare.com/ajax/libs/date-fns/1.30.1/date_fns.js",
      "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.js",
      "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.7.0/jspdf.plugin.autotable.min.js",
      `${new URL(window.location.href).origin}/exportUtility.js`,
    ],
  });

  // for excel file
  const [excelExporter, { status: excelStatus }] = useWorker(exportToExcel, {
    remoteDependencies: [
      "https://cdnjs.cloudflare.com/ajax/libs/date-fns/1.30.1/date_fns.js",
      "https://cdnjs.cloudflare.com/ajax/libs/xlsx-populate/1.21.0/xlsx-populate.min.js",
      `${new URL(window.location.href).origin}/exportUtility.js`,
    ],
  });

  // for csv file
  const [csvExporter, { status: csvStatus }] = useWorker(exportToCsv, {
    remoteDependencies: [
      "https://cdnjs.cloudflare.com/ajax/libs/date-fns/1.30.1/date_fns.js",
      "https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js",
      `${new URL(window.location.href).origin}/exportUtility.js`,
    ],
  });

  // for text file
  const [textExporter, { status: textStatus }] = useWorker(exportToText, {
    remoteDependencies: [
      "https://cdnjs.cloudflare.com/ajax/libs/date-fns/1.30.1/date_fns.js",
      `${new URL(window.location.href).origin}/exportUtility.js`,
    ],
  });

  //for html file
  const [htmlExporter, { status: htmlStatus }] = useWorker(exportToHtml, {
    remoteDependencies: [
      "https://cdnjs.cloudflare.com/ajax/libs/date-fns/1.30.1/date_fns.js",
      `${new URL(window.location.href).origin}/exportUtility.js`,
    ],
  });

  // for xml file
  const [xmlExporter, { status: xmlStatus }] = useWorker(exportToXml, {
    remoteDependencies: [
      "https://cdnjs.cloudflare.com/ajax/libs/date-fns/1.30.1/date_fns.js",
      "https://cdn.jsdelivr.net/npm/jstoxml@3.2.8/dist/jstoxml.min.js",
      `${new URL(window.location.href).origin}/exportUtility.js`,
    ],
  });

  statusRef.current = {
    pdfStatus,
    excelStatus,
    csvStatus,
    textStatus,
    htmlStatus,
    xmlStatus,
  };

  useEffect(() => {
    const handleUnload = (e: BeforeUnloadEvent) => {
      if (
        statusRef.current?.excelStatus === WORKER_STATUS.RUNNING ||
        statusRef.current?.pdfStatus === WORKER_STATUS.RUNNING ||
        statusRef.current?.csvStatus === WORKER_STATUS.RUNNING ||
        statusRef.current?.textStatus === WORKER_STATUS.RUNNING ||
        statusRef.current?.htmlStatus === WORKER_STATUS.RUNNING ||
        statusRef.current?.xmlStatus === WORKER_STATUS.RUNNING
      ) {
        e.preventDefault();
        const confirmMsg = "Export is still running";
        e.returnValue = confirmMsg;
        return confirmMsg;
      }
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  return (
    <WorkerContext.Provider
      value={{
        workerQueue,
        setWorkerQueue,
        pdfExporter,
        excelExporter,
        csvExporter,
        textExporter,
        htmlExporter,
        xmlExporter,
        markComplete,
        status: {
          pdfStatus,
          excelStatus,
          csvStatus,
          textStatus,
          htmlStatus,
          xmlStatus,
        },
      }}
    >
      {children}
    </WorkerContext.Provider>
  );
};

export const useWorkerContext = () => {
  return useContext(WorkerContext);
};
