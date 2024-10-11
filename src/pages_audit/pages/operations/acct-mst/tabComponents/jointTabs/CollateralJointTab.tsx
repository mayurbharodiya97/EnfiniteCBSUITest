import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Grid } from "@mui/material";
import {
  FormWrapper,
  MetaDataType,
  usePopupContext,
} from "@acuteinfo/common-base";
import { AcctMSTContext } from "../../AcctMSTContext";
import { AuthContext } from "pages_audit/auth";
import { collateraljoint_tab_metadata } from "../../tabMetadata/collateralJointMetadata";
import TabNavigate from "../../TabNavigate";
import _ from "lodash";

const CollateralJointTab = () => {
  const {
    AcctMSTState,
    handleCurrFormctx,
    handleSavectx,
    handleStepStatusctx,
    handleFormDataonSavectx,
    handleModifiedColsctx,
  } = useContext(AcctMSTContext);
  const { MessageBox } = usePopupContext();
  const { authState } = useContext(AuthContext);
  const formRef = useRef<any>(null);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const [formStatus, setFormStatus] = useState<any[]>([]);

  const handleSave = (e) => {
    handleCurrFormctx({
      isLoading: true,
    });
    const refs = [formRef.current.handleSubmit(e, "save", false)];
    handleSavectx(e, refs);
  };
  useEffect(() => {
    let refs = [formRef];
    handleCurrFormctx({
      currentFormRefctx: refs,
      colTabValuectx: AcctMSTState?.colTabValuectx,
      currentFormSubmitted: null,
      isLoading: false,
    });
  }, []);

  useEffect(() => {
    if (
      Boolean(
        AcctMSTState?.currentFormctx.currentFormRefctx &&
          AcctMSTState?.currentFormctx.currentFormRefctx.length > 0
      ) &&
      Boolean(formStatus && formStatus.length > 0)
    ) {
      if (
        AcctMSTState?.currentFormctx.currentFormRefctx.length ===
        formStatus.length
      ) {
        setIsNextLoading(false);
        let submitted;
        submitted = formStatus.filter((form) => !Boolean(form));
        if (submitted && Array.isArray(submitted) && submitted.length > 0) {
          submitted = false;
        } else {
          submitted = true;
          handleStepStatusctx({
            status: "completed",
            coltabvalue: AcctMSTState?.colTabValuectx,
          });
        }
        handleCurrFormctx({
          currentFormSubmitted: submitted,
          isLoading: false,
        });
        setFormStatus([]);
      }
    }
  }, [formStatus]);

  const onFormSubmitHandler = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag,
    hasError
  ) => {
    if (data && !hasError) {
      let newData = AcctMSTState?.formDatactx;
      if (data?.JOINT_HYPOTHICATION_DTL) {
        let filteredCols: any[] = [];
        filteredCols = Object.keys(data.JOINT_HYPOTHICATION_DTL[0]);
        filteredCols = filteredCols.filter(
          (field) => !field.includes("_ignoreField")
        );
        if (AcctMSTState?.isFreshEntryctx) {
          filteredCols = filteredCols.filter(
            (field) => !field.includes("SR_CD")
          );
        }
        let newFormatOtherAdd = data?.JOINT_HYPOTHICATION_DTL?.map(
          (formRow, i) => {
            let formFields = Object.keys(formRow);
            formFields = formFields.filter(
              (field) => !field.includes("_ignoreField")
            );
            const formData = _.pick(
              data?.JOINT_HYPOTHICATION_DTL[i],
              formFields
            );
            return {
              ...formData,
              J_TYPE: "M",
              CUSTOMER_ID: AcctMSTState?.customerIDctx,
            };
          }
        );
        newData["JOINT_HYPOTHICATION_DTL"] = [...newFormatOtherAdd];
        handleFormDataonSavectx(newData);
        if (!AcctMSTState?.isFreshEntryctx) {
          let tabModifiedCols: any = AcctMSTState?.modifiedFormCols;
          tabModifiedCols = {
            ...tabModifiedCols,
            JOINT_HYPOTHICATION_DTL: [...filteredCols],
          };
          handleModifiedColsctx(tabModifiedCols);
        }
      } else {
        newData["JOINT_HYPOTHICATION_DTL"] = [];
        handleFormDataonSavectx(newData);
        if (!AcctMSTState?.isFreshEntryctx) {
          let tabModifiedCols: any = AcctMSTState?.modifiedFormCols;
          tabModifiedCols = {
            ...tabModifiedCols,
            JOINT_HYPOTHICATION_DTL: [],
          };
          handleModifiedColsctx(tabModifiedCols);
        }
      }
      setFormStatus((old) => [...old, true]);
    } else {
      handleStepStatusctx({
        status: "error",
        coltabvalue: AcctMSTState?.colTabValuectx,
      });
      setFormStatus((old) => [...old, false]);
    }
    endSubmit(true);
  };

  const initialVal = useMemo(() => {
    return AcctMSTState?.isFreshEntryctx
      ? AcctMSTState?.formDatactx["JOINT_HYPOTHICATION_DTL"]?.length > 0
        ? {
            JOINT_HYPOTHICATION_DTL: [
              ...(AcctMSTState?.formDatactx["JOINT_HYPOTHICATION_DTL"] ?? []),
            ],
          }
        : { JOINT_HYPOTHICATION_DTL: [{}] }
      : AcctMSTState?.formDatactx["JOINT_HYPOTHICATION_DTL"]
      ? {
          JOINT_HYPOTHICATION_DTL: [
            ...(AcctMSTState?.formDatactx["JOINT_HYPOTHICATION_DTL"] ?? []),
          ],
        }
      : {
          JOINT_HYPOTHICATION_DTL: [
            ...(AcctMSTState?.retrieveFormDataApiRes[
              "JOINT_HYPOTHICATION_DTL"
            ] ?? []),
          ],
        };
  }, [
    AcctMSTState?.isFreshEntryctx,
    AcctMSTState?.retrieveFormDataApiRes["JOINT_HYPOTHICATION_DTL"],
    AcctMSTState?.formDatactx["JOINT_HYPOTHICATION_DTL"],
  ]);

  return (
    <Grid sx={{ mb: 4 }}>
      <FormWrapper
        key={"acct-mst-joint-hypothication-form" + initialVal}
        ref={formRef}
        metaData={collateraljoint_tab_metadata as MetaDataType}
        onSubmitHandler={onFormSubmitHandler}
        formState={{
          PARAM320: AcctMSTState?.param320,
          ACCT_TYPE: AcctMSTState?.accTypeValuectx,
          MessageBox: MessageBox,
        }}
        // initialValues={AcctMSTState?.formDatactx["PERSONAL_DETAIL"] ?? {}}
        initialValues={initialVal}
        hideHeader={true}
        displayMode={AcctMSTState?.formmodectx}
      ></FormWrapper>
      <TabNavigate
        handleSave={handleSave}
        displayMode={AcctMSTState?.formmodectx ?? "new"}
        isNextLoading={isNextLoading}
      />
    </Grid>
  );
};

export default CollateralJointTab;