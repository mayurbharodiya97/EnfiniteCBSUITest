import { SubmitFnType } from "packages/form";
import { useMutation } from "react-query";
import * as API from "../api";
import { t } from "i18next";
import { useCallback, useContext, useRef, useState } from "react";
import { AuthContext } from "pages_audit/auth";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import { GridMetaDataType } from "components/dataTableStatic";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { usePopupContext } from "components/custom/popupContext";
import { retrieveForm, RetrieveGrid } from "./retrieveFormMetadata";
import FdPrintDynamicNew from "../fdPrintDynamicNew";

const actionSequence = [
  { name: "view-new", label: "View Only New", filter: "ONLY_NEW" },
  { name: "view-only-renew", label: "View only Renew", filter: "ONLY_RENEW" },
  {
    name: "view-manual-renew",
    label: "View Manual Renew",
    filter: "MANUAL_RENEW",
  },
  { name: "view-auto-renew", label: "View Auto Renew", filter: "AUTO_RENEW" },
  { name: "view-all", label: "View All" },
  { name: "view-pending", label: "View Pending", filter: "PENDING" },
];

const actions = [
  {
    actionName: "print",
    actionLabel: "OK",
    multiple: true,
    rowDoubleClick: true,
    alwaysAvailable: false,
  },
  {
    actionName: actionSequence[0].name,
    actionLabel: actionSequence[0].label,
    multiple: false,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
];

const FdPrintingRetrieve = () => {
  const { authState } = useContext(AuthContext);
  const [gridData, setGridData] = useState<any>([]);
  const formRef = useRef<any>(null);
  const dataRef = useRef<any>([]);
  const [selectedRowsData, setSelectedRowsData] = useState([]);
  const [dilogueOpen, setDilogueOpen] = useState(false);
  const [componentToShow, setComponentToShow] = useState("");
  const { MessageBox } = usePopupContext();
  const navigate = useNavigate();

  const mutation = useMutation(
    "getPaySlipRetrieveData",
    API.retrieveFdPrintData,
    {
      onSuccess: (data, { endSubmit }) => {
        if (data?.length <= 0) {
          endSubmit(
            false,
            MessageBox({
              message: "No Transaction Found!",
              messageTitle: "Validation",
              buttonNames: ["Ok"],
            })
          );
        } else {
          dataRef.current = data;
          setGridData(data.filter((item) => item.PENDING === "Y"));
        }
      },
      onError: (error: any, { endSubmit }) => {
        endSubmit(
          false,
          error?.error_msg ?? t("UnknownErrorOccured"),
          error?.error_detail ?? ""
        );
      },
    }
  );

  const updateActions = (currentAction) => {
    const actionIndex = actionSequence.findIndex(
      (a) => a.name === currentAction.name
    );
    const nextAction =
      actionSequence[(actionIndex + 1) % actionSequence.length];
    actions[1] = {
      actionName: nextAction.name,
      actionLabel: nextAction.label,
      multiple: false,
      rowDoubleClick: false,
      alwaysAvailable: true,
    };
    if (nextAction.filter) {
      setGridData(
        dataRef.current.filter((item) => item[nextAction.filter] === "Y")
      );
    } else {
      setGridData(dataRef.current);
    }
  };

  const setCurrentAction = useCallback((data) => {
    if (data.name === "print") {
      setComponentToShow("ViewDetail");
      setDilogueOpen(true);
      setSelectedRowsData(data.rows);
    } else {
      updateActions(data);
    }
  }, []);

  const onSubmitHandler: SubmitFnType = (data: any, displayData, endSubmit) => {
    console.log("data", data);
    let apiReq = {
      COMP_CD: authState?.companyID,
      BRANCH_CD: authState?.user?.branchCode,
      FROM_DT: data?.FROM ? format(new Date(data?.FROM), "dd-MMM-yyyy") : "",
      TO_DT: data?.TO ? format(new Date(data?.TO), "dd-MMM-yyyy") : "",
    };
    mutation.mutate({
      ...apiReq,
      endSubmit,
    });
    endSubmit(true);
  };
  const resetAction = () => {
    actions[1] = {
      actionName: actionSequence[0].name,
      actionLabel: actionSequence[0].label,
      multiple: false,
      rowDoubleClick: false,
      alwaysAvailable: true,
    };
    setGridData(dataRef.current.filter((item) => item.PENDING === "Y"));
  };
  return (
    <>
      <FormWrapper
        key="retrieve-Form"
        metaData={retrieveForm as MetaDataType}
        initialValues={[]}
        onSubmitHandler={onSubmitHandler}
        formStyle={{ background: "white" }}
        onFormButtonClickHandel={() => {
          let event: any = { preventDefault: () => {} };
          formRef?.current?.handleSubmit(event, "BUTTON_CLICK");
          resetAction();
        }}
        ref={formRef}
      />
      <GridWrapper
        key={"retrieve-grid-" + actions[1].actionLabel}
        finalMetaData={RetrieveGrid as GridMetaDataType}
        data={gridData ?? []}
        setData={() => null}
        loading={mutation.isLoading}
        actions={actions}
        setAction={setCurrentAction}
      />
      {componentToShow === "ViewDetail" && dilogueOpen && (
        <FdPrintDynamicNew
          SelectedRowData={selectedRowsData}
          handleClose={() => setDilogueOpen(false)}
          navigate={navigate}
        />
      )}
    </>
  );
};

export default FdPrintingRetrieve;
