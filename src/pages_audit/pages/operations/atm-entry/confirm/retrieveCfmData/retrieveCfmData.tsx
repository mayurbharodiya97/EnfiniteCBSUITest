import {
  FC,
  useRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useMutation } from "react-query";
import { ClearCacheProvider } from "cache";
import { Dialog } from "@mui/material";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { SubmitFnType } from "packages/form";
import { AuthContext } from "pages_audit/auth";
import GridWrapper from "components/dataTableStatic";
import { GradientButton } from "components/styledComponent/button";
import { Alert } from "components/common/alert";
import { ActionTypes } from "components/dataTable";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { RetrieveGridMetaData } from "./retrieveCfmGridMetadata";
import { retrieveFormMetaData } from "./retrieveFormMetadata";
import { getCfmRetrieveData } from "../../api";
import { format } from "date-fns";
const actions: ActionTypes[] = [
  {
    actionName: "view-details",
    actionLabel: "ViewDetails",
    multiple: false,
    rowDoubleClick: true,
  },
  {
    actionName: "view-details",
    actionLabel: "ViewDetails",
    multiple: true,
    rowDoubleClick: false,
  },
];
export const RetrieveCfmDataCustom = ({ onClose, navigate, setRowsData }) => {
  const { authState } = useContext(AuthContext);
  const formRef = useRef<any>(null);
  const { t } = useTranslation();
  const [retrieve, setRetrieve] = useState<any>();
  const [filterRetData, setFilterRetData] = useState<any>();
  const [flag, setFlag] = useState<any>("filter");

  const setCurrentAction = useCallback((data) => {
    console.log("<<<setcurr", data);
    // onClose();
    navigate(".", { state: data?.rows });
    setRowsData(data?.rows);
  }, []);

  const mutation: any = useMutation("cfmRetrieveData", getCfmRetrieveData, {
    onSuccess: (data) => {
      if (Array.isArray(data) && data.length) {
        let updateData = data.filter(
          (item) => item.CONFIRMED !== "Y" && item.CONFIRMED !== "R"
        );
        setFlag("filter");
        setRetrieve(data);
        setFilterRetData(updateData);
      }
    },
    onError: (error: any) => {},
  });

  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    endSubmit(true);
    mutation.mutate({
      FROM_DT: format(new Date(data?.FROM_DT), "dd/MMM/yyyy"),
      TO_DT: format(new Date(data?.TO_DT), "dd/MMM/yyyy"),
      COMP_CD: authState.companyID,
      BRANCH_CD: authState.user.branchCode,
    });
  };
  // useEffect(() => {
  //   mutation.mutate({
  //     FROM_DT: authState?.workingDate,
  //     TO_DT: authState?.workingDate,
  //     COMP_CD: authState.companyID,
  //     BRANCH_CD: authState.user.branchCode,
  //   });
  // }, []);
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        formRef?.current?.handleSubmit({ preventDefault: () => {} }, "Save");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <>
        <Dialog
          open={true}
          PaperProps={{
            style: {
              overflow: "hidden",
            },
          }}
          maxWidth="xl"
        >
          <FormWrapper
            key={`retrieveForm`}
            metaData={retrieveFormMetaData as MetaDataType}
            initialValues={{}}
            onSubmitHandler={onSubmitHandler}
            formStyle={{
              background: "white",
            }}
            onFormButtonClickHandel={(id) => {
              console.log("<<<id", id);

              if (id === "RETRIEVE") {
                let event: any = { preventDefault: () => {} };
                formRef?.current?.handleSubmit(event, "RETRIEVE");
              } else if (id === "VIEW_ALL") {
                setFlag("all");
              }
            }}
            ref={formRef}
          >
            {({ isSubmitting, handleSubmit }) => (
              <>
                <GradientButton
                  onClick={() => {
                    onClose();
                  }}
                >
                  {t("Close")}
                </GradientButton>
              </>
            )}
          </FormWrapper>
          {mutation.isError && (
            <Alert
              severity="error"
              errorMsg={
                mutation.error?.error_msg ?? "Something went to wrong.."
              }
              errorDetail={mutation.error?.error_detail}
              color="error"
            />
          )}
          <GridWrapper
            key={"atm-cfm-RetrieveGridData" + flag}
            finalMetaData={RetrieveGridMetaData}
            data={
              flag === "filter"
                ? filterRetData ?? []
                : flag === "all"
                ? retrieve ?? []
                : []
            }
            setData={() => null}
            loading={mutation.isLoading || mutation.isFetching}
            actions={actions}
            setAction={setCurrentAction}
          />
        </Dialog>
      </>
    </>
  );
};

export const RetrieveCfmData = ({ onClose, navigate, setRowsData }) => {
  return (
    <ClearCacheProvider>
      <RetrieveCfmDataCustom
        onClose={onClose}
        navigate={navigate}
        setRowsData={setRowsData}
      />
    </ClearCacheProvider>
  );
};
