import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { AcctMSTContext } from "../AcctMSTContext";
import { Grid } from "@mui/material";
import { mobileReg_tab_metadata } from "../tabMetadata/mobileRegMetadata";
import TabNavigate from "../TabNavigate";
import _ from "lodash";

const MobileRegTab = () => {
  const {
    AcctMSTState,
    handleStepStatusctx,
    handleCurrFormctx,
    handleSavectx,
    handleFormDataonSavectx,
    handleModifiedColsctx,
  } = useContext(AcctMSTContext);
  const formRef = useRef<any>(null);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const [formStatus, setFormStatus] = useState<any[]>([]);
  const formFieldsRef = useRef<any>([]); // array, all form-field to compare on update

  const handleSave = (e) => {
    handleCurrFormctx({
      isLoading: true,
    });
    const refs = [formRef.current.handleSubmitError(e, "save", false)];
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
      if (data?.MOBILE_REG) {
        let filteredCols: any[] = [];
        filteredCols = Object.keys(data.MOBILE_REG[0]);
        filteredCols = filteredCols.filter(
          (field) => !field.includes("_ignoreField")
        );
        if (AcctMSTState?.isFreshEntryctx) {
          filteredCols = filteredCols.filter(
            (field) => !field.includes("SR_CD")
          );
        }
        let newFormatOtherAdd = data?.MOBILE_REG?.map((formRow, i) => {
          let formFields = Object.keys(formRow);
          formFields = formFields.filter(
            (field) => !field.includes("_ignoreField")
          );
          const formData = _.pick(data?.MOBILE_REG[i], formFields);
          return {
            ...formData,
            IsNewRow: !AcctMSTState?.req_cd_ctx ? true : false,
          };
        });
        newData["MOBILE_REG_DTL"] = [...newFormatOtherAdd];
        handleFormDataonSavectx(newData);
        if (!AcctMSTState?.isFreshEntryctx) {
          let tabModifiedCols: any = AcctMSTState?.modifiedFormCols;
          tabModifiedCols = {
            ...tabModifiedCols,
            MOBILE_REG_DTL: [...filteredCols],
          };
          handleModifiedColsctx(tabModifiedCols);
        }
      } else {
        newData["MOBILE_REG_DTL"] = [];
        handleFormDataonSavectx(newData);
        if (!AcctMSTState?.isFreshEntryctx) {
          let tabModifiedCols: any = AcctMSTState?.modifiedFormCols;
          tabModifiedCols = {
            ...tabModifiedCols,
            MOBILE_REG_DTL: [],
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
      ? AcctMSTState?.formDatactx["MOBILE_REG_DTL"]?.length > 0
        ? {
            MOBILE_REG: [
              ...(AcctMSTState?.formDatactx["MOBILE_REG_DTL"] ?? []),
            ],
          }
        : { MOBILE_REG: [{}] }
      : AcctMSTState?.formDatactx["MOBILE_REG_DTL"]
      ? { MOBILE_REG: [...(AcctMSTState?.formDatactx["MOBILE_REG_DTL"] ?? [])] }
      : {
          MOBILE_REG: [
            ...(AcctMSTState?.retrieveFormDataApiRes["MOBILE_REG_DTL"] ?? []),
          ],
        };
  }, [
    AcctMSTState?.isFreshEntryctx,
    AcctMSTState?.retrieveFormDataApiRes["MOBILE_REG_DTL"],
    AcctMSTState?.formDatactx["MOBILE_REG_DTL"],
  ]);

  return (
    <Grid sx={{ mb: 4 }}>
      <FormWrapper
        ref={formRef}
        onSubmitHandler={onFormSubmitHandler}
        // initialValues={AcctMSTState?.formDatactx["PERSONAL_DETAIL"] ?? {}}
        initialValues={initialVal}
        key={"acct-mst-mobile-reg-tab-form" + initialVal}
        metaData={mobileReg_tab_metadata as MetaDataType}
        formStyle={{}}
        formState={{ GPARAM155: AcctMSTState?.gparam155 }}
        hideHeader={true}
        displayMode={AcctMSTState?.formmodectx}
        controlsAtBottom={false}
      ></FormWrapper>
      <TabNavigate
        handleSave={handleSave}
        displayMode={AcctMSTState?.formmodectx ?? "new"}
        isNextLoading={isNextLoading}
      />
    </Grid>
  );
};

export default MobileRegTab;
