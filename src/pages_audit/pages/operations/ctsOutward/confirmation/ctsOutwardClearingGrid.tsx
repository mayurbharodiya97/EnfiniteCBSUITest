import {
  useRef,
  useCallback,
  useContext,
  Fragment,
  useState,
  useEffect,
} from "react";
import GridWrapper from "components/dataTableStatic";
import { Alert } from "components/common/alert";
import { ActionTypes } from "components/dataTable";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import * as API from "./api";
import { CtsOutwardClearingConfirmForm } from "./CtsOutwardClearingForm";
import {
  CtsOutwardClearingConfirmGridMetaData,
  RetrieveFormConfigMetaData,
} from "./ConfirmationMetadata";
import { AuthContext } from "pages_audit/auth";
import { SubmitFnType } from "packages/form";
import { format } from "date-fns";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { AppBar } from "@mui/material";
import { ClearCacheContext, ClearCacheProvider, queryClient } from "cache";
const actions: ActionTypes[] = [
  {
    actionName: "view-detail",
    actionLabel: "View Detail",
    multiple: false,
    rowDoubleClick: true,
  },
];

const CtsOutwardClearingGrid = ({ zoneTranType }) => {
  const { authState } = useContext(AuthContext);
  const formRef = useRef<any>(null);
  const indexRef = useRef(0);
  const navigate = useNavigate();
  const isDataChangedRef = useRef(false);
  const [formData, setFormData] = useState<any>();
  const { getEntries } = useContext(ClearCacheContext);
  const { data, isLoading, isError, error } = useQuery<any, any>(
    ["getBussinessDate"],
    () => API.getBussinessDate()
  );
  const mutation: any = useMutation(
    "getRetrievalClearingData",
    API.getRetrievalClearingData,
    {
      onSuccess: (data) => {},
      onError: (error: any) => {},
    }
  );
  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getBussinessDate"]);
      let entries = getEntries() as any[];
      if (Array.isArray(entries) && entries.length > 0) {
        entries.forEach((one) => {
          queryClient.removeQueries(one);
        });
      }
      queryClient.removeQueries(["getRetrievalClearingData", zoneTranType]);
    };
  }, [getEntries]);

  const setCurrentAction = useCallback((data) => {
    if (data?.name === "view-detail") {
      // console.log("data", data);
      indexRef.current = Number(data?.rows?.[0].id);
      navigate("view-detail", {
        state: {
          gridData: data?.rows?.[0]?.data,
          index: indexRef.current,
          formMode: "view",
        },
      });
    }
  }, []);

  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    delete data["RETRIEVE"];
    data["COMP_CD"] = authState.companyID;
    data["BRANCH_CD"] = authState.user.branchCode;
    if (Boolean(data["FROM_TRAN_DT"])) {
      data["FROM_TRAN_DT"] = format(
        new Date(data["FROM_TRAN_DT"]),
        "dd/MMM/yyyy"
      );
    }
    if (Boolean(data["TO_TRAN_DT"])) {
      data["TO_TRAN_DT"] = format(new Date(data["TO_TRAN_DT"]), "dd/MMM/yyyy");
    }
    data["BANK_CD"] = data["BANK_CD"].padEnd(10, " ");
    if (actionFlag === "RETRIEVE") {
      data = {
        ...data,
        TRAN_TYPE: zoneTranType,
        CONFIRMED: "N",
      };
      mutation.mutate(data);
      endSubmit(true);
    } else if (actionFlag === "VIEW_ALL") {
      data = {
        ...data,
        TRAN_TYPE: zoneTranType,
        CONFIRMED: "0",
      };
      mutation.mutate(data);
      endSubmit(true);
    }
    setFormData(data);
  };
  const handleDialogClose = () => {
    if (isDataChangedRef.current === true) {
      isDataChangedRef.current = true;
      mutation.mutate({
        ...formData,
      });
      isDataChangedRef.current = false;
    }
    navigate(".");
  };
  const handlePrev = useCallback(() => {
    navigate(".");
    const index = (indexRef.current -= 1);
    console.log("index prev", index);
    setTimeout(() => {
      setCurrentAction({
        name: "view-detail",
        rows: [
          {
            data: mutation?.data[index - 1],
            id: String(index - 1),
          },
        ],
      });
      console.log("mutation?.data[index]", mutation?.data[index - 1]);
    }, 0);
  }, [mutation?.data]);
  const handleNext = useCallback(() => {
    navigate(".");
    const index = indexRef.current++;
    console.log("index next", index);
    setTimeout(() => {
      setCurrentAction({
        name: "view-detail",
        rows: [
          {
            data: mutation?.data[index + 1],
            id: String(index + 1),
          },
        ],
      });
    }, 0);
  }, [mutation?.data]);

  if (zoneTranType === "R") {
    RetrieveFormConfigMetaData.fields[2].defaultValue = "10  ";
    RetrieveFormConfigMetaData.form.label =
      "Inward Return Retrieve Information";
  } else if (zoneTranType === "S") {
    RetrieveFormConfigMetaData.fields[2].defaultValue = "0   ";
    RetrieveFormConfigMetaData.form.label = "CTS O/W Retrieve Information";
  } else if (zoneTranType === "W") {
    RetrieveFormConfigMetaData.fields[2].defaultValue = "18  ";
    RetrieveFormConfigMetaData.form.label =
      "Outward Return Retrieve Information";
  }
  return (
    <Fragment>
      {isLoading ? (
        <div style={{ height: 100, paddingTop: 10 }}>
          <div style={{ padding: 10 }}>
            <LoaderPaperComponent />
          </div>
        </div>
      ) : isError ? (
        <>
          <div
            style={{
              paddingRight: "10px",
              paddingLeft: "10px",
              height: 100,
              paddingTop: 10,
            }}
          >
            <AppBar position="relative" color="primary">
              <Alert
                severity="error"
                errorMsg={error?.error_msg ?? "Unknow Error"}
                errorDetail={error?.error_detail ?? ""}
                color="error"
              />
            </AppBar>
          </div>
        </>
      ) : (
        <>
          <FormWrapper
            key={`retrieveForm` + zoneTranType}
            metaData={
              (zoneTranType === "S"
                ? RetrieveFormConfigMetaData
                : RetrieveFormConfigMetaData) as unknown as MetaDataType
            }
            initialValues={{
              FROM_TRAN_DT:
                zoneTranType === "S"
                  ? data?.[0]?.TRAN_DATE
                  : authState?.workingDate,
              TO_TRAN_DT:
                zoneTranType === "S"
                  ? data?.[0]?.TRAN_DATE
                  : authState?.workingDate,
            }}
            onSubmitHandler={onSubmitHandler}
            formStyle={{
              background: "white",
            }}
            onFormButtonClickHandel={(id) => {
              let event: any = { preventDefault: () => {} };
              // if (mutation?.isLoading) {
              if (id === "RETRIEVE") {
                formRef?.current?.handleSubmit(event, "RETRIEVE");
              } else if (id === "VIEW_ALL") {
                formRef?.current?.handleSubmit(event, "VIEW_ALL");
              }
              // }
            }}
            formState={{ ZONE_TRAN_TYPE: zoneTranType }}
            ref={formRef}
          />
          <Fragment>
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
            {/* {mutation?.data ? ( */}
            <GridWrapper
              key={"CtsOutwardClearingConfirmGrid" + zoneTranType}
              finalMetaData={
                zoneTranType === "S"
                  ? CtsOutwardClearingConfirmGridMetaData
                  : CtsOutwardClearingConfirmGridMetaData
              }
              data={mutation?.data ?? []}
              setData={() => null}
              loading={mutation.isLoading || mutation.isFetching}
              actions={actions}
              setAction={setCurrentAction}
            />

            {/* ) : null} */}
          </Fragment>
        </>
      )}
      <Routes>
        <Route
          path="view-detail/*"
          element={
            <CtsOutwardClearingConfirmForm
              zoneTranType={zoneTranType}
              handleDialogClose={handleDialogClose}
              handlePrev={handlePrev}
              handleNext={handleNext}
              currentIndexRef={indexRef}
              totalData={mutation?.data?.length ?? 0}
              isDataChangedRef={isDataChangedRef}
            />
          }
        />
      </Routes>
    </Fragment>
  );
};
export const CtsOutwardClearingConfirmGrid = ({ zoneTranType }) => {
  return (
    <ClearCacheProvider>
      <CtsOutwardClearingGrid
        key={zoneTranType + "-CtsOutwardClearingGrid"}
        zoneTranType={zoneTranType}
      />
    </ClearCacheProvider>
  );
};
