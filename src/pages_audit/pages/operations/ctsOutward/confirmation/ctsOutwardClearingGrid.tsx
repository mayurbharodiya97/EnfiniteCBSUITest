import {
  useRef,
  useCallback,
  useContext,
  Fragment,
  useState,
  useEffect,
} from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import * as API from "./api";
import { CtsOutwardClearingConfirmForm } from "./CtsOutwardClearingForm";
import {
  CtsOutwardClearingConfirmGridMetaData,
  RetrieveFormConfigMetaData,
} from "./ConfirmationMetadata";
import { AuthContext } from "pages_audit/auth";
import { format } from "date-fns";
import { AppBar } from "@mui/material";
import { t } from "i18next";
import {
  utilFunction,
  ClearCacheContext,
  ClearCacheProvider,
  queryClient,
  LoaderPaperComponent,
  MetaDataType,
  FormWrapper,
  SubmitFnType,
  ActionTypes,
  Alert,
  GridWrapper,
} from "@acuteinfo/common-base";
import getDynamicLabel from "components/common/custom/getDynamicLabel";

const actions: ActionTypes[] = [
  {
    actionName: "view-detail",
    actionLabel: t("ViewDetail"),
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
  let currentPath = useLocation().pathname;

  const { data, isLoading, isError, error } = useQuery<any, any>(
    ["getBussinessDate"],
    () => API.getBussinessDate(),
    {
      onSuccess: (data) => {
        mutation.mutate({
          FROM_TRAN_DT:
            zoneTranType === "S"
              ? format(new Date(data[0]?.TRAN_DATE), "dd/MMM/yyyy")
              : format(new Date(authState.workingDate), "dd/MMM/yyyy"),
          TO_TRAN_DT:
            zoneTranType === "S"
              ? format(new Date(data?.[0]?.TRAN_DATE), "dd/MMM/yyyy")
              : format(new Date(authState?.workingDate), "dd/MMM/yyyy"),
          COMP_CD: authState.companyID,
          BRANCH_CD: authState.user.branchCode,
          TRAN_TYPE: zoneTranType,
          CONFIRMED: "0",
          BANK_CD: "",
          ZONE:
            zoneTranType === "S"
              ? "0   "
              : zoneTranType === "R"
              ? "10  "
              : "18  ",
          SLIP_CD: "",
          CHEQUE_NO: "",
          CHEQUE_AMOUNT: "",
        });
      },
    }
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

    data = {
      ...data,
      COMP_CD: authState.companyID,
      BRANCH_CD: authState.user.branchCode,
      TRAN_TYPE: zoneTranType,
      CONFIRMED: actionFlag === "RETRIEVE" ? "N" : "0",
    };
    mutation.mutate(data);
    endSubmit(true);
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

  const typeDefaults = {
    R: { defaultValue: "10  ", label: "Inward Return Retrieve Information" },
    S: { defaultValue: "0   ", label: "CTS O/W Retrieve Information" },
    W: { defaultValue: "18  ", label: "Outward Return Retrieve Information" },
  };

  const defaultValues = typeDefaults[zoneTranType];
  if (defaultValues) {
    RetrieveFormConfigMetaData.fields[2].defaultValue =
      defaultValues.defaultValue;
    RetrieveFormConfigMetaData.form.label = defaultValues.label;
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
              formLabel={utilFunction.getDynamicLabel(
                currentPath,
                authState?.menulistdata,
                true
              )}
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
