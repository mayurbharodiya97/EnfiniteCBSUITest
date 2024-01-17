import {
  FC,
  useEffect,
  useRef,
  useState,
  useContext,
  useCallback,
} from "react";
import { useMutation } from "react-query";
import * as API from "./api";
import { ClearCacheContext } from "cache";
import { useSnackbar } from "notistack";
import { SlipDetailFormMetaData, SlipJoinDetailGridMetaData } from "./metaData";
import { makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { SubmitFnType } from "packages/form";
import { AuthContext } from "pages_audit/auth";
import { useLocation, useNavigate } from "react-router-dom";
import GridWrapper from "components/dataTableStatic";
import { format } from "date-fns";
import { ActionTypes } from "components/dataTable";
interface accountSlipJoinDetailDataType {
  ACCT_TYPE: any;
  ACCT_CD: any;
  GD_TODAY_DT: any;
  SCREEN_REF: any;
  COMP_CD: any;
  BRANCH_CD: any;
  endSubmit?: any;
  setFieldError?: any;
}

const accountSlipJoinDetailDataWrapperFn =
  (accountSlipJoinDetailDataType) =>
  async ({
    ACCT_TYPE,
    COMP_CD,
    BRANCH_CD,
    ACCT_CD,
    GD_TODAY_DT,
    SCREEN_REF,
  }: accountSlipJoinDetailDataType) => {
    return accountSlipJoinDetailDataType({
      ACCT_TYPE,
      COMP_CD,
      BRANCH_CD,
      ACCT_CD,
      GD_TODAY_DT,
      SCREEN_REF,
    });
  };
// interface accountSlipJoinDetailDataType {
//   data: object;
//   displayData?: object;
//   endSubmit?: any;
//   setFieldError?: any;
// }
// const accountSlipJoinDetailDataWrapperFn =
//   (updateMasterData) =>
//   async ({ data }: accountSlipJoinDetailDataType) => {
//     return updateMasterData(data);
//   };
export const useDialogStyles = makeStyles((theme: Theme) => ({
  topScrollPaper: {
    alignItems: "center",
  },
  topPaperScrollBody: {
    verticalAlign: "top",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--white)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
  },
}));
const actions: ActionTypes[] = [
  {
    actionName: "view-details",
    actionLabel: "Edit Detail",
    multiple: undefined,
    rowDoubleClick: true,
  },
];
export const SlipDetailForm: FC<{
  formDataRef?: any;
  myRef?: any;
  setCurrentTab?: any;
  defaultView?: any;
  result?: any;
  mutation?: any;
  slipJointDetailRef?: any;
}> = ({
  formDataRef,
  setCurrentTab,
  myRef,
  defaultView,
  result,
  mutation,
  slipJointDetailRef,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { authState } = useContext(AuthContext);
  const mySlipRef = useRef<any>(null);
  const navigate = useNavigate();
  const setCurrentAction = useCallback(
    (data) => {
      slipJointDetailRef.current = data?.rows?.[0]?.data?.REF_PERSON_NAME;
      setCurrentTab("chequedetail");
    },
    [slipJointDetailRef]
  );
  // useEffect(() => {
  //   const gridData = {
  //     ...formDataRef.current,
  //     ACCT_NAME: mutation?.data?.[0].ACCT_NAME,
  //     TRAN_BAL: mutation?.data?.[0].TRAN_BAL,
  //   };
  // }, [mutation?.data]);
  const ClickEventManage = () => {
    let event: any = { preventDefault: () => {} };
    mySlipRef?.current?.handleSubmit(event, "BUTTON_CLICK");
    mySlipRef?.current?.handleSubmit(event, "AC_NAME");
    myRef?.current?.handleSubmit(event, "BUTTON_CLICK");
  };

  const onSubmitHandlerSlip: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit,
    setFieldErrors,
    value,
    event
  ) => {
    //@ts-ignore

    endSubmit(true);
    data = {
      ...data,
      PROCESSED: "N",
      SKIP_ENTRY: "N",
      COMP_CD: authState?.companyID ?? "",
      _isNewRow: true,
    };
    let Apireq = {
      COMP_CD: authState?.companyID,
      ACCT_CD: data?.ACCT_CD.padStart(6, "0").padEnd(20, " "),
      ACCT_TYPE: data?.ACCT_TYPE,
      BRANCH_CD: authState?.user?.branchCode,
      GD_TODAY_DT: format(new Date(), "dd/MMM/yyyy"),
      SCREEN_REF: authState?.menulistdata[4]?.children?.[6]?.user_code,
    };

    if (value === "AC_NAME") {
      mutation.mutate(Apireq, {
        onSuccess: (data) => {
          console.log("Mutation successful. Data:", data);
          if (Array.isArray(data) && data.length) {
            endSubmit(true, "");
            setFieldErrors({
              ACCT_CD: data?.[0]?.RESTRICT_MESSAGE || data?.[0]?.MESSAGE1 || "",
            });
            return;
          }
        },
      });
    }

    if (value === "BUTTON_CLICK") {
      formDataRef.current = data;
    }
  };

  const updatedMetaData = {
    ...SlipDetailFormMetaData,
    fields: SlipDetailFormMetaData.fields[0]._fields.map((field) => {
      if (field.name === "BRANCH_CD") {
        return {
          ...field,
          defaultValue: authState?.user?.branchCode ?? "",
        };
      } else if (field.name === "COMP_CD") {
        return {
          ...field,
          defaultValue: authState?.companyID ?? "",
        };
      }

      return field;
    }),
  };
  return (
    <>
      <div
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            let target: any = e?.target;
            if (
              (target?.name ?? "") ===
              updatedMetaData.form.name + "/AMOUNT"
              // +
              //   updatedMetaData.fields[0].name +
              //   "[0].AMOUNT"
            ) {
              ClickEventManage();

              setCurrentTab("chequedetail");
            }
          }
          if (e.key === "Tab") {
            let target: any = e?.target;
            if (
              (target?.name ?? "") ===
              updatedMetaData.form.name + "/ACCT_CD"
              // +
              //   updatedMetaData.fields[0].name +
              //   "[0].AMOUNT"
            ) {
              ClickEventManage();
            }
          }
        }}
      >
        <FormWrapper
          key={
            `${Date.now()}-SlipDetailFormMetaData`
            //   + mutation?.data?.length &&
            // Boolean(mutation?.isSuccess)
            //   ? mutation?.data
            //   : ""
          }
          metaData={updatedMetaData as MetaDataType}
          // displayMode={formMode}
          onSubmitHandler={onSubmitHandlerSlip}
          initialValues={
            {
              ...formDataRef.current,
              ACCT_NAME: mutation?.data?.[0].ACCT_NAME,
              TRAN_BAL: mutation?.data?.[0].TRAN_BAL,
            }
            // mutationOutward.isSuccess
            //   ? {}
            //   : {
            //       ...formDataRef.current,
            //       ACCT_NAME: mutation?.data?.[0].ACCT_NAME,
            //       TRAN_BAL: mutation?.data?.[0].TRAN_BAL,
            //     }
          }
          // initialValues={formDataRef.current ?? {}}
          hideHeader={true}
          displayMode={defaultView}
          formStyle={{
            background: "white",
          }}
          ref={mySlipRef}
        />
      </div>

      <div
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            let target: any = e?.target;
            //   if (
            //     (target?.name ?? "") ===
            //     updatedMetaData.form.name + "/AMOUNT"
            //     // +
            //     //   updatedMetaData.fields[0].name +
            //     //   "[0].AMOUNT"
            //   ) {
            //     ClickEventManage();

            //     setCurrentTab("chequedetail");
            //   }
          }
        }}
      >
        {mutation?.data?.[0]?.ACCT_JOIN_DETAILS &&
        mutation?.data?.[0]?.ACCT_JOIN_DETAILS.length ? (
          <GridWrapper
            key={"SlipJoinDetailGridMetaData" + mutation?.data}
            finalMetaData={SlipJoinDetailGridMetaData}
            data={mutation?.data?.[0]?.ACCT_JOIN_DETAILS ?? []}
            setData={() => null}
            // loading={isLoading || isFetching}
            actions={actions}
            setAction={setCurrentAction}
            // refetchData={() => refetch()}
            // ref={myGridRef}
            // defaultSortOrder={[{ id: "TRAN_CD", desc: false }]}
          />
        ) : null}
      </div>
    </>
  );
};
