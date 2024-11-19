import {
  ClearCacheProvider,
  extractMetaData,
  FormWrapper,
  MetaDataType,
  SubmitFnType,
  usePopupContext,
} from "@acuteinfo/common-base";
import { Fragment } from "react/jsx-runtime";
import { lockerTrnsEntryFormMetadata } from "./formMetaData";
import { useContext, useRef, useState } from "react";
import { dataContext } from "./lockerOperationTrns";
const LockerTrnsEntryForm = () => {
  const [formMode, setFormMode] = useState("add");
  const { saveData } = useContext(dataContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData: any,
    endSubmit,
    setFieldError
  ) => {
    endSubmit(true);
    console.log(data, "formData");
  };
  return (
    <Fragment>
      <FormWrapper
        key={"bankifsccodeMasterForm"}
        metaData={
          extractMetaData(lockerTrnsEntryFormMetadata, formMode) as MetaDataType
        }
        initialValues={{}}
        hideHeader={true}
        displayMode={formMode}
        setDataOnFieldChange={(action, payload) => {
          if (action === "VIEWMST_PAYLOAD") {
            saveData(payload);
          }
        }}
        formState={{
          MessageBox: MessageBox,
          Mode: formMode,
          docCd: "RPT/014",
        }}
        onSubmitHandler={onSubmitHandler}
        formStyle={{
          background: "white",
          height: "auto",
        }}
      ></FormWrapper>
    </Fragment>
  );
};
export const LockerTrnsEntry = () => {
  return (
    <Fragment>
      <ClearCacheProvider>
        <LockerTrnsEntryForm />
      </ClearCacheProvider>
    </Fragment>
  );
};
