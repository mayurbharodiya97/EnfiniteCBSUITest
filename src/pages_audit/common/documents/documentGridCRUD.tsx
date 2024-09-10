import {
  useState,
  Fragment,
  useRef,
  useCallback,
  useEffect,
  useContext,
  FC,
} from "react";
import { ActionTypes } from "components/dataTable";
import { queryClient } from "cache";
import { MyGridWrapper } from "./gridWrapper";
import { DeleteAction } from "./delete";
import { VerifyDocumentAction } from "./verify";
import { UpdateDocumentData } from "./update";
import { UploadDocumentsApiWrapper } from "./upload";
import { Download } from "./download";
import { PreviewWrapper } from "./view";
import { InvalidAction } from "pages_audit/common/invalidAction";
import { DOCCRUDContext } from "./context";
import { Dialog } from "@mui/material";

const actions: ActionTypes[] = [
  {
    actionName: "Verify",
    actionLabel: "Verify",
    multiple: true,
    shouldExclude: (rows) => {
      let exclude = false;
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].data?.status !== "Pending") {
          exclude = true;
          break;
        }
      }
      return exclude;
    },
  },
  {
    actionName: "View",
    actionLabel: "View",
    multiple: false,
    rowDoubleClick: true,
  },
  {
    actionName: "Download",
    actionLabel: "Download",
    multiple: true,
  },
  {
    actionName: "Delete",
    actionLabel: "Delete",
    multiple: true,
  },
  {
    actionName: "Update",
    actionLabel: "Update",
    multiple: false,
  },
];

export const DocumentGridCRUD: FC<{ disableActions?: any }> = ({
  disableActions,
}) => {
  const { context } = useContext(DOCCRUDContext);
  const allActions = useRef<any>(null);
  if (allActions.current === null) {
    let newAddActions = context.docCategory.map((one) => ({
      actionName: `Add_${one.type}`,
      actionLabel: one.label,
      multiple: undefined,
      alwaysAvailable: true,
    }));
    allActions.current = [...newAddActions, ...actions];
    let disableActionsArray: string[];
    if (typeof disableActions === "string") {
      disableActionsArray = [disableActions];
    } else if (Array.isArray(disableActions)) {
      disableActionsArray = disableActions;
    } else {
      disableActionsArray = [];
    }
    if (Array.isArray(disableActionsArray)) {
      allActions.current = allActions.current.filter((one) => {
        if (
          disableActionsArray.indexOf("Add") >= 0 &&
          one.actionName?.indexOf("Add") >= 0
        ) {
          return false;
        } else {
          return disableActionsArray?.indexOf(one.actionName) >= 0
            ? false
            : true;
        }
      });
    }
  }
  const [currentAction, setCurrentAction] = useState<any>(null);
  const gridRef = useRef<any>(null);
  const dataChangedRef = useRef(false);
  const closeMyDialog = useCallback(() => {
    setCurrentAction(null);
    if (dataChangedRef.current === true) {
      gridRef.current?.refetch?.();
      dataChangedRef.current = false;
    }
  }, [setCurrentAction]);
  //Remove Bank List from caching - when upload unmounts
  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getBankListForLeadDocuments"], {
        exact: false,
      });
    };
  }, []);
  let selectedAction = currentAction?.name ?? "";

  return (
    <Fragment>
      <MyGridWrapper
        ref={gridRef}
        key={`documentListing`}
        actions={allActions.current}
        setAction={setCurrentAction}
      />
      <Dialog
        open={Boolean(currentAction)}
        maxWidth="xl"
        PaperProps={{
          style:
            selectedAction.indexOf("Add") >= 0 || selectedAction === "View"
              ? { width: "100%", height: "100%" }
              : selectedAction === "Verify"
              ? { width: "40%" }
              : {},
        }}
      >
        {selectedAction.indexOf("Add") >= 0 ? (
          <UploadDocumentsApiWrapper
            onClose={closeMyDialog}
            editableFileName={false}
            dataChangedRef={dataChangedRef}
            currentAction={selectedAction.slice(
              selectedAction.indexOf("Add_") + "Add_".length
            )}
          />
        ) : selectedAction === "Update" ? (
          <UpdateDocumentData
            row={currentAction?.rows[0]}
            closeDialog={closeMyDialog}
            dataChangedRef={dataChangedRef}
          />
        ) : selectedAction === "Delete" ? (
          <DeleteAction
            docUUID={currentAction?.rows.map((one) => one.id)}
            closeDialog={closeMyDialog}
            dataChangedRef={dataChangedRef}
          />
        ) : selectedAction === "Verify" ? (
          <VerifyDocumentAction
            docUUID={currentAction?.rows.map((one) => one.id)}
            closeDialog={closeMyDialog}
            dataChangedRef={dataChangedRef}
          />
        ) : selectedAction === "Download" ? (
          <Download
            closeDialog={closeMyDialog}
            docData={currentAction?.rows.map((one) => ({
              id: one.id,
              name: one.data?.fileName,
            }))}
          />
        ) : selectedAction === "View" ? (
          <PreviewWrapper
            closeDialog={closeMyDialog}
            docUUID={currentAction?.rows[0]?.id}
            fileName={currentAction?.rows[0]?.data?.fileName}
            fileType={currentAction?.rows[0]?.data?.fileType}
          />
        ) : (
          <InvalidAction closeDialog={closeMyDialog} />
        )}
      </Dialog>
    </Fragment>
  );
};
