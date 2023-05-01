import { useMutation } from "react-query";
import { useSnackbar } from "notistack";
import { cloneDeep } from "lodash-es";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import * as API from "../api";
import { chargeTempMasterDetailsMetaData } from "../metadata/form";
import { MasterDetailsForm } from "components/formcomponent";
import { MasterDetailsMetaData } from "components/formcomponent/masterDetails/types";
import { useContext, useRef, useState } from "react";
import { format } from "date-fns/esm";
import { AuthContext } from "pages_audit/auth";
interface addMasterDataType {
  data: object;
  displayData?: object;
  endSubmit?: any;
  setFieldError?: any;
  SetLoadingOWN?: any;
}

const addMasterFormDataFnWrapper =
  (addMasterFn) =>
  async ({ data }: addMasterDataType) => {
    return addMasterFn(data);
  };

const AddChargeTempMaster = ({ isDataChangedRef, closeDialog }) => {
  const { enqueueSnackbar } = useSnackbar();
  const myRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const [isLoading, setLoading] = useState(false);
  const mutation = useMutation(
    addMasterFormDataFnWrapper(API.insertMastersData()),
    {
      onError: (error: any, { endSubmit, SetLoadingOWN }) => {
        SetLoadingOWN(false, error?.error_msg, error?.error_detail ?? "");
      },
      onSuccess: (data, { endSubmit, SetLoadingOWN }) => {
        SetLoadingOWN(true, "");
        isDataChangedRef.current = true;
        enqueueSnackbar(data, {
          variant: "success",
        });
        closeDialog();
      },
    }
  );
  const AddNewRow = () => {
    myRef.current?.addNewRow(true);
  };
  const onSubmitHandler = ({
    data,
    resultValueObj,
    resultDisplayValueObj,
    endSubmit,
    setFieldErrors,
    actionFlag,
  }) => {
    setLoading(true);
    const SetLoadingOWN = (isLoading, error_msg = "", error_detail = "") => {
      setLoading(isLoading);
      endSubmit(isLoading, error_msg, error_detail);
    };
    if (Boolean(data["EFFECTIVE_DT"])) {
      data["EFFECTIVE_DT"] = format(
        new Date(data["EFFECTIVE_DT"]),
        "dd/MM/yyyy"
      );
    }
    data["COMP_CD"] = authState.companyID;
    data["BRANCH_CD"] = authState.user.branchCode;
    mutation.mutate({ data, SetLoadingOWN, endSubmit });
  };

  let metadata: MasterDetailsMetaData = {} as MasterDetailsMetaData;

  metadata = cloneDeep(
    chargeTempMasterDetailsMetaData
  ) as MasterDetailsMetaData;

  const renderResult = (
    <MasterDetailsForm
      metaData={metadata}
      ref={myRef}
      initialData={{ _isNewRow: true, DETAILS_DATA: [] }}
      displayMode={"New"}
      isLoading={isLoading}
      onSubmitData={onSubmitHandler}
      isNewRow={true}
      containerstyle={{
        paddingRight: "10px",
        paddingLeft: "10px",
        paddingTop: "5px",
      }}
      formStyle={{
        background: "white",
        height: "15vh",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      {({ isSubmitting, handleSubmit }) => {
        return (
          <>
            <Button
              onClick={AddNewRow}
              disabled={isSubmitting}
              //endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              color={"primary"}
            >
              Add Row
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              color={"primary"}
            >
              Save
            </Button>
            <Button
              onClick={closeDialog}
              disabled={isSubmitting}
              color={"primary"}
            >
              Cancel
            </Button>
          </>
        );
      }}
    </MasterDetailsForm>
  );

  return renderResult;
};

export const AddChargeTempMasterWrapper = ({
  isDataChangedRef,
  closeDialog,
}) => {
  return (
    <Dialog open={true} maxWidth="lg" fullWidth>
      <AddChargeTempMaster
        isDataChangedRef={isDataChangedRef}
        closeDialog={closeDialog}
      />
    </Dialog>
  );
};
