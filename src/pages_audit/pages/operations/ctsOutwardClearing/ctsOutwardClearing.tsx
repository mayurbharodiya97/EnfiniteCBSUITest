import { Fragment, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { CtsOutwardClearingMetadata } from "./metaData";
import { CtsoutwardGridMetaData } from "./gridMetadata";
import GridWrapper from "components/dataTableStatic";
import { Alert } from "components/common/alert";
import { GridMetaDataType } from "components/dataTable/types";
import { ClearCacheProvider, queryClient } from "cache";
import * as API from "./api";
import { FormWrapper } from "components/dyanmicForm/formWrapper";

import { useContext } from "react";
import { InitialValuesType, SubmitFnType } from "packages/form";
import { MasterDetailsForm } from "components/formcomponent";
import {
  Button,
  CircularProgress,
  Toolbar,
  Typography,
  AppBar,
  Theme,
  Grid,
} from "@mui/material";
import { AuthContext } from "pages_audit/auth";
import { MasterDetailsMetaData } from "components/formcomponent/masterDetails/types";
import { cloneDeep } from "lodash";
import { makeStyles } from "@mui/styles";
import { CreateDetailsRequestData, utilFunction } from "components/utils";
import { GradientButton } from "components/styledComponent/button";
import { useSnackbar } from "notistack";
import { ClearingBankMaster } from "./clearingBankMaster";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
const useTypeStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    background: "var(--theme-color5)",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--theme-color2)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
  },
  refreshiconhover: {},
}));
const CtsOutwardClearing = ({ zoneTranType }) => {
  const myGridRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const isErrorFuncRef = useRef<any>(null);
  const [girdData, setGridData] = useState<any>([]);
  const [formData, setFormData] = useState<any>({});
  const [isBankAdding, setisBankAdding] = useState<any>(false);
  const { enqueueSnackbar } = useSnackbar();
  const myRef = useRef<any>(null);
  const headerClasses = useTypeStyles();
  const addNewRowCalled = useRef(false);
  const [isOpenSave, setIsOpenSave] = useState(false);
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getChequeLeavesList88888"], () => API.getChequeLeavesList88888());
  const ClickEventManage = () => {
    let event: any = { preventDefault: () => {} };
    myRef?.current?.handleSubmit(event, "BUTTON_CLICK");
  };
  useEffect(() => {
    if (!addNewRowCalled.current) {
      AddNewRow();
      addNewRowCalled.current = true;
    }
  }, []);
  console.log("girdData", girdData);
  const AddNewRow = async () => {
    let { hasError, data: dataold } = await myGridRef.current?.validate();

    if (hasError === true) {
      if (dataold) {
        setGridData(dataold);
      }
    } else {
      // Calculate the sum of existing item amounts

      let totalItemAmount = girdData.reduce((accu, item) => {
        // Check if item and item.AMOUNT exist before attempting to parse
        if (item && item.AMOUNT !== undefined && item.AMOUNT !== null) {
          return accu + parseFloat(item.AMOUNT);
        }

        return accu;
      }, 0);

      console.log("totalItemAmount", totalItemAmount);

      // if (
      //   !formData?.AMOUNT ||
      //   (Number(formData?.AMOUNT) < 1 &&
      //     girdData.length > 1 &&
      //     (Number(totalItemAmount) == Number(formData?.AMOUNT) || (Number(formData?.AMOUNT) < 1 || !formData?.AMOUNT ||)))
      // ) {
      //   return;
      // }

      // if (girdData && girdData.length < 2) {
      //   if (!Boolean(formData?.AMOUNT) || Number(formData?.AMOUNT) < 1) {
      //     return;
      //   }
      // }
      console.log("test", Number(totalItemAmount), Number(formData?.AMOUNT));
      if (girdData && girdData.length == 1) {
        if (!Boolean(formData?.AMOUNT) || Number(formData?.AMOUNT) < 1) {
          return;
        }
      }
      if (Number(totalItemAmount) == Number(formData?.AMOUNT)) {
        return;
      }
      // else {
      setGridData((old) => {
        if (!Array.isArray(old)) {
          return [
            {
              id: 1,
              // _isNewRow: true,
              CHEQUE_DATE: new Date(),
            },
          ];
        } else {
          let srCount = utilFunction.GetMaxCdForDetails(old, "TRAN_CD");
          const myNewRowObj = {
            id: srCount,
            CHEQUE_DATE: new Date(),
            TRAN_CD: String(srCount),
            // _isNewRow: true,
          };
          return [...old, myNewRowObj];
        }
      });
      // }
    }
  };

  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    value
  ) => {
    //@ts-ignore
    endSubmit(true, "Please enter any value");
    if (value === "BUTTON_CLICK") {
      setFormData(data);
    }
    // } else {
    //   let { hasError, data: dataold } = await myGridRef.current?.validate();
    //   if (hasError === true) {
    //     if (dataold) {
    //       setGridData(dataold);
    //     }
    //   } else {
    //     let result = myGridRef?.current?.cleanData?.();
    //     if (!Array.isArray(result)) {
    //       result = [result];
    //     }
    //     console.log("result", result);
    //     isErrorFuncRef.current = {
    //       data,
    //       endSubmit,
    //       setFieldError,
    //     };
    //     console.log(" isErrorFuncRef.current", isErrorFuncRef.current);
    //   }
    // }
  };
  const onPopupYes = (rows) => {
    setisBankAdding(true);
  };
  const onActionCancel = () => {
    setIsOpenSave(false);
  };
  if (CtsOutwardClearingMetadata?.fields?.[1]) {
    CtsOutwardClearingMetadata.fields[1].requestProps = zoneTranType ?? "";
  }
  const updatedMetaData = {
    ...CtsOutwardClearingMetadata,
    fields: CtsOutwardClearingMetadata.fields.map((field) => {
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
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            // myRef?.current?.click?.();
            let target: any = e?.target;
            if (
              (target?.name ?? "") ===
              CtsOutwardClearingMetadata.form.name + "/AMOUNT"
            ) {
              ClickEventManage();
            }
          }
        }}
      >
        {/* {getData.isError && (
          <Alert
            severity={getData.error?.severity ?? "error"}
            errorMsg={getData.error?.error_msg ?? "Something went to wrong.."}
            errorDetail={getData.error?.error_detail}
            color="error"
          />
        )} */}
        <AppBar position="relative" color="secondary">
          <Toolbar variant="dense">
            <Typography
              className={headerClasses.title}
              color="inherit"
              variant={"h6"}
              component="div"
            >
              CTS O/W Clearing
            </Typography>
          </Toolbar>
        </AppBar>
        <FormWrapper
          key={"CtsoutwardForm"}
          metaData={updatedMetaData}
          // loading={getData.isLoading}
          // hideHeader={true}
          initialValues={[]}
          ref={myRef}
          onSubmitHandler={onSubmitHandler}
          tabindex={0}
          hideHeader={true}
          //@ts-ignore
          displayMode={"new"}
          formStyle={{
            background: "white",
            width: "100%",
          }}
        ></FormWrapper>
      </div>
      <div
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            // myRef?.current?.click?.();
            let target: any = e?.target;
            if ((target?.name ?? "") === "AMOUNT") {
              // onSaveRecord();
              AddNewRow();
            }
          }
        }}
      >
        <AppBar
          position="relative"
          color="secondary"
          style={{ marginBottom: "10px" }}
        >
          <Toolbar variant="dense">
            <Typography
              className={headerClasses.title}
              color="inherit"
              variant={"h6"}
              component="div"
            >
              Cheque Detail
            </Typography>
            {/* {isLoading || isFetching || isError ? null : ( */}
            <>
              <GradientButton
                onClick={AddNewRow}
                color="primary"
                // disabled={mutation.isLoading}
              >
                Add Row
              </GradientButton>
              {/* <Button
                  onClick={onSaveRecord}
                  color="primary"
                  disabled={mutation.isLoading}
                  endIcon={
                    mutation.isLoading ? <CircularProgress size={20} /> : null
                  }
                >
                  Save
                </Button> */}
            </>
            {/* // )} */}
          </Toolbar>
        </AppBar>

        <GridWrapper
          key={`CtsoutwardGrid`}
          finalMetaData={CtsoutwardGridMetaData as GridMetaDataType}
          data={girdData}
          setData={setGridData}
          // loading={getData.isLoading}
          // setAction={setCurrentAction}
          refetchData={() => {}}
          onClickActionEvent={(index, id, data) => {
            if (id === "BANK_NAME") {
              setIsOpenSave(true);
            }
          }}
          ref={myGridRef}
        />

        {isOpenSave ? (
          <PopupMessageAPIWrapper
            MessageTitle="Confirmation"
            Message="Are You sure To Add Bank?"
            onActionYes={(rowVal) => onPopupYes(rowVal)}
            onActionNo={() => onActionCancel()}
            rows={isErrorFuncRef.current?.data}
            open={isOpenSave}
            // loading={mutation.isLoading}
          />
        ) : null}
        {isBankAdding ? (
          <ClearingBankMaster
            isOpen={isBankAdding}
            onClose={() => {
              setisBankAdding(false);
              setIsOpenSave(false);
            }}
          />
        ) : null}
      </div>
    </>
  );
};
export const CtsOutwardClearingForm = ({ zoneTranType }) => {
  return (
    <ClearCacheProvider>
      <CtsOutwardClearing zoneTranType={zoneTranType} />
    </ClearCacheProvider>
  );
};
