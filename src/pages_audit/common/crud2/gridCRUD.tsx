import { useContext, useRef, useState, Fragment, FC } from "react";
import { ActionTypes } from "components/dataTable";
import { FormNew } from "./formNew";
import { FormViewEdit } from "./formViewEdit";
import { DeleteAction } from "./delete";
import { MyGridWrapper } from "./gridWrapper";
import { CRUDContext } from "./context";
import { DocumentGridCRUD } from "../documents/documentsTab";
import { SimpleCRUD } from "./simpleCRUD";
import { InvalidAction } from "pages_audit/common/invalidAction";
import { CRUDContextProvider, crudAPIContextGenerator } from "./context";
import { useDialogStyles } from "../dialogStyles";
import { Dialog, DialogProps } from "@mui/material";
const actions: ActionTypes[] = [
  {
    actionName: "View",
    actionLabel: "View Details",
    multiple: false,
    rowDoubleClick: true,
  },
  {
    actionName: "Delete",
    actionLabel: "Delete",
    multiple: true,
    rowDoubleClick: false,
  },
  {
    actionName: "Add",
    actionLabel: "Add Detail",
    multiple: undefined,
    alwaysAvailable: true,
  },
];

export const GridCRUD: FC<{
  isDataChangedRef: any;
  showDocuments?: boolean;
  disableActions?: string | string[];
  setEditFormStateFromInitValues?: any;
  secondaryProduct?: string;
  secondaryProductDataExist?: boolean;
  secondaryProductDisableCache?: boolean;
  maxWidth?: DialogProps["maxWidth"];
  dialogAlignTop?: boolean;
  formStyle?: any;
  readOnly?: any;
}> = ({
  isDataChangedRef,
  showDocuments,
  disableActions,
  setEditFormStateFromInitValues,
  secondaryProduct,
  secondaryProductDataExist,
  secondaryProductDisableCache,
  maxWidth = "xl",
  dialogAlignTop = false,
  formStyle,
  readOnly,
}) => {
  let allActions = useRef<any>(null);
  if (allActions.current === null) {
    allActions.current = [...actions];
    if (Boolean(showDocuments)) {
      allActions.current.push({
        actionName: "Document",
        actionLabel: "Document Details",
        multiple: false,
        rowDoubleClick: false,
      });
    }
    if (Boolean(secondaryProduct)) {
      allActions.current.push({
        actionName: "Detail",
        actionLabel: "Master",
        multiple: undefined,
        alwaysAvailable: true,
      });
    }
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
        return disableActionsArray?.indexOf(one.actionName) >= 0 ? false : true;
      });
    }
  }
  const [currentAction, setCurrentAction] = useState<any>(null);
  const gridRef = useRef<any>(null);
  const isMyDataChangedRef = useRef(false);
  const { context } = useContext(CRUDContext);
  const closeMyDialog = () => {
    setCurrentAction(null);
    if (isMyDataChangedRef.current === true) {
      isDataChangedRef.current = true;
      gridRef.current?.refetch?.();
      isMyDataChangedRef.current = false;
    }
  };
  const classes = useDialogStyles();
  const dialogClasses = {
    scrollPaper: classes.topScrollPaper,
    paperScrollBody: classes.topPaperScrollBody,
  };
  return (
    <Fragment>
      <MyGridWrapper
        ref={gridRef}
        key="grid"
        actions={allActions.current}
        setAction={setCurrentAction}
      />
      <Dialog
        open={Boolean(currentAction)}
        maxWidth={maxWidth}
        PaperProps={
          currentAction?.name === "Delete"
            ? {}
            : {
                style: {
                  width: "100%",
                  height: dialogAlignTop ? undefined : "100%",
                },
              }
        }
        classes={dialogAlignTop ? dialogClasses : {}}
      >
        {(currentAction?.name ?? "") === "Add" ? (
          <FormNew
            successAction={closeMyDialog}
            cancelAction={closeMyDialog}
            isDataChangedRef={isMyDataChangedRef}
            formStyle={formStyle}
          />
        ) : (currentAction?.name ?? "") === "View" ? (
          <FormViewEdit
            isDataChangedRef={isMyDataChangedRef}
            closeDialog={closeMyDialog}
            serialNo={currentAction?.rows[0]?.id}
            setEditFormStateFromInitValues={setEditFormStateFromInitValues}
            formStyle={formStyle}
            readOnly={readOnly}
          />
        ) : (currentAction?.name ?? "") === "Delete" ? (
          <DeleteAction
            serialNo={currentAction?.rows.map((one) => one.id)}
            closeDialog={closeMyDialog}
            isDataChangedRef={isMyDataChangedRef}
          />
        ) : (currentAction?.name ?? "") === "Document" ? (
          <DocumentGridCRUD
            refID={context?.refID}
            productType={context?.productType}
            moduleType={context?.moduleType}
            serialNo={currentAction?.rows[0]?.id}
            onClose={closeMyDialog}
            //readOnly={readOnly}
          />
        ) : (currentAction?.name ?? "") === "Detail" ? (
          <CRUDContextProvider
            {...crudAPIContextGenerator(
              context?.moduleType,
              secondaryProduct,
              context?.refID
            )}
          >
            <SimpleCRUD
              isDataChangedRef={isMyDataChangedRef}
              dataAlwaysExists={secondaryProductDataExist}
              closeDialog={closeMyDialog}
              readOnly={readOnly}
              disableCache={secondaryProductDisableCache}
            />
          </CRUDContextProvider>
        ) : (
          <InvalidAction closeDialog={closeMyDialog} />
        )}
      </Dialog>
    </Fragment>
  );
};
