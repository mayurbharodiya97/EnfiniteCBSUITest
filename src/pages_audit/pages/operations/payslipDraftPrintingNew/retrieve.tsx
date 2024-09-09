import { retrievePayslip } from "./retrieveMetadata";
import { SubmitFnType } from "packages/form";
import { useMutation, useQuery } from "react-query";
import * as API from "./api";
import { t } from "i18next";
import { useCallback, useContext, useRef, useState } from "react";
import { AuthContext } from "pages_audit/auth";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import { RetrieveGridMetadata } from "./retrieveGridMetadata";
import { GridMetaDataType } from "components/dataTableStatic";
import { format } from "date-fns";
import { ActionTypes } from "components/dataTable";
import { useNavigate } from "react-router-dom";
import PlaySlipDraftPrintingNew from "./ddPrinting/playslipDraftPrinting";
import { usePopupContext } from "components/custom/popupContext";
import i18n from "components/multiLanguage/languagesConfiguration";

const actions: ActionTypes[] = [
  {
    actionName: "print",
    actionLabel: "OK",
    multiple: true,
    rowDoubleClick: true,
    alwaysAvailable: false,
  },
  {
    actionName: "view-all",
    actionLabel: "View All",
    multiple: false,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
];
const PlaySlipRetrieve = () => {
  const { authState } = useContext(AuthContext);
  const [gridData, setGridData] = useState<any>([]);
  const formRef = useRef<any>(null);
  const [selectedRowsData, setSelectedRowsData] = useState([]);
  const navigate = useNavigate();
  const paraRef = useRef<any>([]);
  const [dilogueOpen, setDilogueOpen] = useState(false);
  const [componentToShow, setComponentToShow] = useState("");
  const { MessageBox } = usePopupContext();
  const updateFnWrapper =
    (update) =>
    async ({ data }) => {
      return update({
        ...data,
      });
    };
  const {
    data: para,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery<any, any>(
    ["getDDPrintPara"],
    () =>
      API.getDDPrintPara({
        comp_cd: authState?.companyID,
        branch_cd: authState?.user?.branchCode,
        user_level: authState?.role,
      }),
    {
      onSuccess: (data) => {
        // Update the ref when data is successfully fetched
        paraRef.current = data;
      },
    }
  );
  console.log("paraRef", paraRef.current);
  const mutation: any = useMutation(
    "getPaySlipRetrieveData",
    updateFnWrapper(API.retrieveData),
    {
      onSuccess: (data, { endSubmit }: any) => {
        if (data?.length <= 0) {
          endSubmit(
            false,
            MessageBox({
              message: "No Transaction Found!",
              messageTitle: "Validation",
              buttonNames: ["Ok"],
            })
          );
        } else if (Array.isArray(data) && data?.length > 0) {
          const filteredData = data.filter((item) => !item.PRINT_CNT);
          setGridData(filteredData);
        }
      },
      onError: (error: any, { endSubmit }) => {
        let errorMsg = t("UnknownErrorOccured");
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        endSubmit(false, errorMsg, error?.error_detail ?? "");
      },
    }
  );
  const setCurrentAction = useCallback(
    (data) => {
      if (data.name === "print") {
        setComponentToShow("ViewDetail");
        setDilogueOpen(true);
        setSelectedRowsData(data?.rows);
        // rowsDataRef.current = data?.rows?.[0]?.data;
      } else if (data.name === "view-all") {
      } else {
        navigate(data?.name, {
          state: data?.rows,
        });
      }
    },
    [navigate]
  );
  const onSubmitHandler: SubmitFnType = (data: any, displayData, endSubmit) => {
    let apiReq = {
      COMP_CD: authState?.companyID,
      BRANCH_CD: authState?.user?.branchCode,
      DEF_TRAN_CD: data?.TYPE,
      FROM_DT: data?.FROM ? format(new Date(data?.FROM), "dd-MMM-yyyy") : "",
      TO_DT: data?.TO ? format(new Date(data?.TO), "dd-MMM-yyyy") : "",
      USER_LEVEL: authState?.role,
      ALLOW_DUPLICATE: paraRef?.current?.[0]?.ALLOW_DUPLICATE,
      A_LANG: i18n.resolvedLanguage,
    };
    mutation.mutate({
      data: apiReq,
      endSubmit,
    });
    endSubmit(true);
  };
  const handleClose = () => {
    setDilogueOpen(false);
  };
  return (
    <>
      <FormWrapper
        key={`retrieve-Form`}
        metaData={retrievePayslip as MetaDataType}
        initialValues={[]}
        onSubmitHandler={onSubmitHandler}
        formStyle={{
          background: "white",
        }}
        formState={{ para: para }}
        onFormButtonClickHandel={() => {
          let event: any = { preventDefault: () => {} };
          formRef?.current?.handleSubmit(event, "BUTTON_CLICK");
        }}
        ref={formRef}
      >
        {({ isSubmitting, handleSubmit }) => <></>}
      </FormWrapper>
      <GridWrapper
        key={`retrieve-grid`}
        finalMetaData={RetrieveGridMetadata as GridMetaDataType}
        data={gridData ?? []}
        setData={() => null}
        loading={mutation.isLoading}
        actions={actions}
        setAction={setCurrentAction}
        headerToolbarStyle={{
          fontSize: "1.20rem",
        }}
      />
      {componentToShow === "ViewDetail" && Boolean(dilogueOpen) ? (
        <PlaySlipDraftPrintingNew
          SelectedRowData={selectedRowsData}
          handleClose={handleClose}
          navigate={navigate}
        />
      ) : null}
    </>
  );
};
export default PlaySlipRetrieve;
