import { useState, Fragment, useMemo, useRef } from "react";
import Grid from "components/dataTableStatic";
import { ActionTypes } from "components/dataTable";
import { GridColumnType } from "components/dataTableStatic";
import metaData from "./metaData";
import { transformMetaDataByMutating } from "./utils";
import { FileObjectType } from "./type";
import { PDFViewer, ImageViewer, NoPreview } from "./preView";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
} from "@mui/material";

const actions: ActionTypes[] = [
  {
    actionName: "View",
    actionLabel: "View File",
    multiple: false,
    rowDoubleClick: false,
  },
];

export const FileViewerGrid = ({
  additionalColumns,
  editableFileName,
  fileData,
  onClose,
  gridProps,
}: {
  additionalColumns?: GridColumnType[];
  editableFileName?: boolean;
  fileData: any;
  onClose?: any;
  gridProps?: any;
}) => {
  /*eslint-disable  react-hooks/exhaustive-deps*/
  const transformedFilesMetaData = useMemo(
    () =>
      transformMetaDataByMutating(
        metaData,
        additionalColumns,
        editableFileName
      ),
    []
  );
  const [files, setFiles] = useState<FileObjectType[]>(fileData ?? []);
  const [action, setAction] = useState<any>(null);
  const gridRef = useRef<any>(null);

  return (
    <Fragment>
      <Card>
        <CardContent>
          <CardHeader
            title="File Viewer"
            action={
              <CardActions>
                <div style={{ flexGrow: 2 }} />
                {typeof onClose === "function" ? (
                  <Button
                    disabled={false}
                    onClick={() => onClose()}
                    size="small"
                    color="secondary"
                  >
                    Close
                  </Button>
                ) : null}
              </CardActions>
            }
          />
          <Grid
            finalMetaData={transformedFilesMetaData}
            data={files}
            setData={setFiles}
            actions={actions}
            setAction={setAction}
            loading={false}
            ref={gridRef}
            gridProps={gridProps}
          />
        </CardContent>
      </Card>
      <Dialog
        open={Boolean(action)}
        maxWidth="lg"
        onClose={() => setAction(null)}
        PaperProps={{
          style: { width: "100%", height: "100%" },
        }}
      >
        {action?.rows[0]?.data?._mimeType?.includes("pdf") ? (
          <PDFViewer
            blob={action?.rows[0]?.data?.blob}
            fileName={action?.rows[0]?.data?.name}
            onClose={() => setAction(null)}
          />
        ) : action?.rows[0]?.data?._mimeType?.includes("image") ? (
          <ImageViewer
            blob={action?.rows[0]?.data?.blob}
            fileName={action?.rows[0]?.data?.name}
            onClose={() => setAction(null)}
          />
        ) : (
          <NoPreview fileName={action?.rows[0]?.data?.name} />
        )}
      </Dialog>
    </Fragment>
  );
};
