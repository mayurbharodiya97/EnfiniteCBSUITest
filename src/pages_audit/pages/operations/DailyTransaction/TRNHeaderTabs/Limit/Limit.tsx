import { Fragment, useCallback, useRef, useState } from "react";
import { useQuery } from "react-query";
import { limitEntryTabMetaData, LimitGridMetaData } from "./gridMetadata";
import CloseIcon from "@mui/icons-material/Close";
import { Dialog } from "@mui/material";
import { Alert } from "components/common/alert";
import { ActionTypes } from "components/dataTable/types";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import { GridMetaDataType } from "components/dataTableStatic/types";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { GradientButton } from "components/styledComponent/button";
import { t } from "i18next";
import { AccDetailContext, AuthContext } from "pages_audit/auth";
import { Transition } from "pages_audit/common";
import { limitconfirmFormMetaData } from "pages_audit/pages/operations/limit-entry/confirm/confirmFormMetadata";
import { useContext } from "react";
import * as API from "./api";
import { getLimitDTL } from "pages_audit/pages/operations/limit-entry/api";
import LimitEntry from "pages_audit/pages/operations/limit-entry";
import ConfirmationGridWrapper from "pages_audit/pages/confirmations";

interface LimitRowType {
  COMP_CD: string;
  BRANCH_CD: string;
  ACCT_TYPE: string;
  ACCT_CD: string;
  ACCT_NM: string;
}
const actions: ActionTypes[] = [
  {
    actionName: "view-detail",
    actionLabel: "view-detail",
    multiple: false,
    rowDoubleClick: true,
    // alwaysAvailable: true,
  },
];

export const Limit = ({ reqData }) => {
  const myGridRef = useRef<any>(null);
  const [rows, setRows] = useState<LimitRowType | null>(null);
  const [open, setOpen] = useState(false);
  const { authState } = useContext(AuthContext);

  const handleClose = () => setOpen(false);

  const setCurrentAction = useCallback((data) => {
    if (data?.name === "view-detail") {
      setRows(data?.rows[0]?.data);
      setOpen(true);
    }
  }, []);

  const { data, isLoading, isFetching, refetch, error, isError } = useQuery<
    any,
    any
  >(["getLimitList", { reqData }], () =>
    getLimitDTL({
      ...reqData,
      GD_TODAY_DT: authState?.workingDate,
      USER_LEVEL: authState?.role,
    })
  );

  if (limitconfirmFormMetaData.form) {
    limitconfirmFormMetaData.form.label = `${t(
      "Limit details"
    )}:${reqData?.COMP_CD?.trim()}${reqData?.BRANCH_CD?.trim()}${reqData?.ACCT_TYPE?.trim()}${reqData?.ACCT_CD?.trim()}-${reqData?.ACCT_NM?.trim()}`;
  } else {
    return null;
  }

  return (
    <>
      {/* {isError ? (
        <Fragment>
          <div style={{ width: "100%", paddingTop: "10px" }}>
            <Alert
              severity={error?.severity ?? "error"}
              errorMsg={error?.error_msg ?? "Error"}
              errorDetail={error?.error_detail ?? ""}
            />
          </div>
        </Fragment>
      ) : null} */}
      {/* <GridWrapper
        key={`LimitGridMetaData`}
        finalMetaData={LimitGridMetaData as GridMetaDataType}
        data={data ?? []}
        setData={() => null}
        actions={actions}
        setAction={setCurrentAction}
        ref={myGridRef}
        loading={isLoading || isFetching}
        refetchData={() => refetch()}
        isNewRowStyle={true}
      /> */}

      {/* <LimitEntry screenFlag="limitForTrn" reqData={reqData} /> */}
      <ConfirmationGridWrapper screenFlag="limitForTrn" reqData={data} />

      {open ? (
        <Dialog
          open={open}
          // @ts-ignore
          TransitionComponent={Transition}
          PaperProps={{
            style: {
              width: "100%",
              overflow: "auto",
            },
          }}
          maxWidth="lg"
          scroll="body"
        >
          <FormWrapper
            key={`LimitDisplayForm`}
            // metaData={limitconfirmFormMetaData as MetaDataType}
            metaData={limitEntryTabMetaData as MetaDataType}
            initialValues={rows ?? {}}
            displayMode={"view"}
          >
            {({ isSubmitting, handleSubmit }) => (
              <>
                <GradientButton onClick={handleClose} color={"primary"}>
                  <CloseIcon />
                </GradientButton>
              </>
            )}
          </FormWrapper>
        </Dialog>
      ) : null}
    </>
  );
};
