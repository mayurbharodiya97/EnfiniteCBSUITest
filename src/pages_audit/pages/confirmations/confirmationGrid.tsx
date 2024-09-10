import {
  Fragment,
  useEffect,
  useContext,
  useRef,
  useCallback,
  StrictMode,
  useState,
} from "react";
import { ClearCacheProvider, ClearCacheContext, queryClient } from "cache";
import { Routes, Route, useNavigate } from "react-router-dom";
import { usePopupContext } from "components/custom/popupContext";
import { GridMetaDataType } from "components/dataTable/types";
import GridWrapper from "components/dataTableStatic";
import { ActionTypes } from "components/dataTable";
import { Alert } from "components/common/alert";
import { AuthContext } from "pages_audit/auth";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import * as API from "./api";
import { chequeBkConfirmGridMetaData } from "./MetaData/chequebkConfirmGridMetadata";
import { limitConfirmGridMetaData } from "./MetaData/limitConfirmGridMetadata";
import { stockConfirmGridMetaData } from "./MetaData/stockConfirmGridMetadata";
import { stopPayConfirmGridMetaData } from "./MetaData/stopPayConfirmGridMetadata";
import { lienConfirmGridMetaData } from "./MetaData/lienConfirmGridMetadata";
import { tempODConfirmGridMetaData } from "./MetaData/temporaryODGridMetadata";
import { RetrieveData } from "../operations/chequeBookTab/confirm/retrieveData";
import { ChequebookCfmForm } from "../operations/chequeBookTab/confirm/confirmationForm";
import { LimitConfirmationForm } from "../operations/limit-entry/confirm/confirmationForm";
import { StockConfirmationForm } from "../operations/stockEntry/confirm/confirmationForm";
import { StopPayConfirmationForm } from "../operations/stopPaymentEntry/confirm/confirmationForm";
import { LienConfirmationForm } from "../operations/lienEntry/confirm/confirmationForm";
import { TempODConfirmationForm } from "../operations/temporaryOD/confirm/confirmationForm";
import { insuranceEntryConfirmGridMetaData } from "./MetaData/insuranceConfirmGridMetadata";
import { InsuranceConfirmationFormWrapper } from "../operations/insuranceEntry/confirmation/insuranceConfirmationForm";

export const Confirmations = ({ screenFlag }) => {
  const actions: ActionTypes[] = [
    {
      actionName: "view-details",
      actionLabel: "ViewDetails",
      multiple: false,
      rowDoubleClick: true,
    },
  ];

  const myGridRef = useRef<any>(null);
  const [isOpen, setIsOpen] = useState<any>(false);
  const { getEntries } = useContext(ClearCacheContext);
  const { authState } = useContext(AuthContext);
  const { MessageBox } = usePopupContext();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const setCurrentAction = useCallback(
    (data) => {
      if (data?.rows?.[0]?.data?.LAST_ENTERED_BY === authState?.user?.id) {
        MessageBox({
          messageTitle: t("Alert"),
          message: t("ConfirmRestrictMsg"),
          buttonNames: ["Ok"],
        });
      } else if (data?.name === "retrieve") {
        setIsOpen(true);
      } else {
        navigate(data?.name, {
          state: data?.rows,
        });
      }
    },
    [navigate]
  );

  const result: any = useMutation(API.getConfirmationGridData, {});

  useEffect(() => {
    result.mutate({
      screenFlag: screenFlag,
      COMP_CD: authState.companyID,
      BRANCH_CD: authState?.user?.branchCode,
      workingDate: authState?.workingDate,
    });
    return () => {
      let entries = getEntries() as any[];
      if (Array.isArray(entries) && entries.length > 0) {
        entries.forEach((one) => {
          queryClient.removeQueries(one);
        });
      }
      queryClient.removeQueries(["getConfirmationGridData"]);
    };
  }, [getEntries]);

  const ClosedEventCall = useCallback(() => {
    setIsOpen(false);
    navigate(".");
  }, [navigate]);

  let gridMetaData = chequeBkConfirmGridMetaData;
  if (screenFlag === "chequebookCFM") {
    gridMetaData = chequeBkConfirmGridMetaData;
    actions.push({
      actionName: "retrieve",
      actionLabel: "Retrieve",
      multiple: undefined,
      rowDoubleClick: false,
      alwaysAvailable: true,
    });
  } else if (screenFlag === "limitCFM") {
    gridMetaData = limitConfirmGridMetaData;
  } else if (screenFlag === "stockCFM") {
    gridMetaData = stockConfirmGridMetaData;
  } else if (screenFlag === "stopPaymentCFM") {
    gridMetaData = stopPayConfirmGridMetaData;
  } else if (screenFlag === "lienCFM") {
    gridMetaData = lienConfirmGridMetaData;
  } else if (screenFlag === "tempOdCFM") {
    gridMetaData = tempODConfirmGridMetaData;
  } else if (screenFlag === "insuranceCFM") {
    gridMetaData = insuranceEntryConfirmGridMetaData;
  }

  return (
    <StrictMode>
      <Fragment>
        {result.isError && (
          <Alert
            severity="error"
            errorMsg={result.error?.error_msg ?? "Something went to wrong."}
            errorDetail={result.error?.error_detail}
            color="error"
          />
        )}
        <GridWrapper
          key={`ConfirmationReqGrid-` + screenFlag}
          finalMetaData={gridMetaData as GridMetaDataType}
          data={result.data ?? []}
          setData={() => null}
          loading={result.isLoading}
          actions={actions}
          setAction={setCurrentAction}
          // refetchData={() =>
          //   result.mutate({
          //     screenFlag: screenFlag,
          //     compCode: authState.companyID,
          //     branchCd: authState?.user?.branchCode,
          //     workingDate: authState?.workingDate,
          //   })
          // }
          ref={myGridRef}
        />
        <Routes>
          <Route
            path="view-details/*"
            element={
              screenFlag === "chequebookCFM" ? (
                <ChequebookCfmForm
                  closeDialog={ClosedEventCall}
                  result={result}
                />
              ) : screenFlag === "limitCFM" ? (
                <LimitConfirmationForm
                  closeDialog={ClosedEventCall}
                  result={result}
                />
              ) : screenFlag === "stockCFM" ? (
                <StockConfirmationForm
                  closeDialog={ClosedEventCall}
                  result={result}
                />
              ) : screenFlag === "stopPaymentCFM" ? (
                <StopPayConfirmationForm
                  closeDialog={ClosedEventCall}
                  result={result}
                />
              ) : screenFlag === "lienCFM" ? (
                <LienConfirmationForm
                  closeDialog={ClosedEventCall}
                  result={result}
                />
              ) : screenFlag === "tempOdCFM" ? (
                <TempODConfirmationForm
                  closeDialog={ClosedEventCall}
                  result={result}
                />
              ) : screenFlag === "insuranceCFM" ? (
                <InsuranceConfirmationFormWrapper
                  closeDialog={ClosedEventCall}
                  result={result}
                />
              ) : (
                <></>
              )
            }
          />
        </Routes>

        {screenFlag === "chequebookCFM" && isOpen && (
          <RetrieveData
            closeDialog={ClosedEventCall}
            result={result}
            isOpen={isOpen}
          />
        )}
      </Fragment>
    </StrictMode>
  );
};

export const ConfirmationGridWrapper = ({ screenFlag }) => {
  return (
    <ClearCacheProvider>
      <Confirmations
        key={screenFlag + "-Confirmation"}
        screenFlag={screenFlag}
      />
    </ClearCacheProvider>
  );
};
