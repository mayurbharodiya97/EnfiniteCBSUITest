import { Grid } from "@mui/material";
import {
  FilterFormMetaType,
  FormComponentView,
} from "components/formcomponent";
import { RetrieveDataFilterForm, ckyc_retrieved_meta_data } from "./metadata";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import { GridMetaDataType } from "components/dataTableStatic";
import { ActionTypes } from "components/dataTable";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useCallback, useContext, useEffect, useState } from "react";
import { useMutation } from "react-query";
import { AuthContext } from "pages_audit/auth";
import * as API from "./api";
import { Alert } from "components/common/alert";
import FormModal from "./formModal/formModal";
import { DeactivateCustomer } from "./DeactivateCustomer";
import { PhotoSignUpdateDialog } from "./formModal/formDetails/formComponents/individualComps/PhotoSignCopy2";
import InsuranceComp from "./InsuranceComp";
import BankDTLComp from "./BankDTLComp";
import CreditCardDTLComp from "./CreditCardDTLComp";
import OffencesDTLComp from "./OffencesDTLComp";
import AssetDTLComp from "./AssetDTLComp";
import FinancialDTLComp from "./FinancialDTLComp";
import Dependencies from "pages_audit/acct_Inquiry/dependencies";
import ControllingPersonComp from "./ControllingPersonComp";
import PhotoSignatureCpyDialog from "./formModal/formDetails/formComponents/individualComps/PhotoSignCopyDialog";

const RetrieveCustomer = () => {
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);
  const [rowsData, setRowsData] = useState<any[]>([]);

  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isCustomerData, setIsCustomerData] = useState(true);
  const [formMode, setFormMode] = useState("new");

  useEffect(() => {
    if (isLoadingData) {
      setTimeout(() => {
        setIsLoadingData(false);
        setIsCustomerData(true);
      }, 5000);
    }
  }, [isLoadingData]);

  const actions: ActionTypes[] = [
    {
      actionName: "view-detail",
      actionLabel: "View Detail",
      multiple: false,
      rowDoubleClick: true,
    },
    // {
    //   actionName: "inactive-customer",
    //   actionLabel: "Inactivate Customer",
    //   multiple: false,
    //   rowDoubleClick: false,
    // },
    // {
    //   actionName: "change-category",
    //   actionLabel: "Change Category",
    //   multiple: false,
    //   rowDoubleClick: false,
    // },
    {
      actionName: "document",
      actionLabel: "Document",
      multiple: false,
      rowDoubleClick: false,
    },
    {
      actionName: "photo-signature",
      actionLabel: "Photo/Signature",
      multiple: false,
      rowDoubleClick: false,
    },
    {
      actionName: "other-address",
      actionLabel: "Other Address",
      multiple: false,
      rowDoubleClick: false,
    },
    // {
    //   actionName: "insurance",
    //   actionLabel: "Insurance",
    //   multiple: false,
    //   rowDoubleClick: false,
    // },
    // {
    //   actionName: "bank-details",
    //   actionLabel: "Bank Details",
    //   multiple: false,
    //   rowDoubleClick: false,
    // },
    // {
    //   actionName: "credit-card",
    //   actionLabel: "Credit Card",
    //   multiple: false,
    //   rowDoubleClick: false,
    // },
    // {
    //   actionName: "offences-details",
    //   actionLabel: "Offences",
    //   multiple: false,
    //   rowDoubleClick: false,
    // },
    // {
    //   actionName: "asset-details",
    //   actionLabel: "Asset Details",
    //   multiple: false,
    //   rowDoubleClick: false,
    // },
    // {
    //   actionName: "financial-details",
    //   actionLabel: "Financial Details",
    //   multiple: false,
    //   rowDoubleClick: false,
    // },
    // {
    //   actionName: "tds-exemption",
    //   actionLabel: "TDS Exemption",
    //   multiple: false,
    //   rowDoubleClick: false,
    // },
    // {
    //   actionName: "dependencies",
    //   actionLabel: "Dependencies",
    //   multiple: false,
    //   rowDoubleClick: false,
    // },
    // {
    //   actionName: "controlling-person-details",
    //   actionLabel: "Controlling Person",
    //   multiple: false,
    //   rowDoubleClick: false,
    // },
  ];

  const setCurrentAction = useCallback(
    (data) => {
      // console.log(authState, "wekjkbfiweifw", data)
      const confirmed = data?.rows?.[0]?.data?.CONFIRMED ?? "";
      const maker = data?.rows?.[0]?.data?.MAKER ?? "";
      const loggedinUser = authState?.user?.id;
      if(Boolean(confirmed)) {
        if(confirmed.includes("P")) {
          if(maker === loggedinUser) {
            setFormMode("edit")
          } else {
            setFormMode("view")
          }
        } else if(confirmed.includes("M")) {
          setFormMode("edit")
        } else {
          setFormMode("view")
        }
      }


      setRowsData(data?.rows);
      navigate(data?.name, {
        state: data?.rows,
      });
    },
    [navigate]
  );

  const mutation: any = useMutation(API.getRetrieveData, {
    onSuccess: (data) => {},
    onError: (error: any) => {},
  });

  return (
    <Grid>
      {mutation.isError && (
        <Alert
          severity={mutation.error?.severity ?? "error"}
          errorMsg={mutation.error?.error_msg ?? "Something went to wrong.."}
          errorDetail={mutation.error?.error_detail}
          color="error"
        />
      )}
      <Grid
        sx={{
          backgroundColor: "var(--theme-color2)",
          padding: (theme) => theme.spacing(1),
          boxSizing: "border-box",
          border: (theme) => `2px dashed ${theme.palette.grey[500]}`,
          borderRadius: "20px",
        }}
        my={(theme) => theme.spacing(3)}
        container
        direction={"column"}
      >
        {/* <Grid item>
                <Typography sx={{color: "var(--theme-color1)", paddingBottom: (theme) => theme.spacing(2)}} variant="h6" >Fetch Data</Typography>
            </Grid> */}
        {/* <Grid item container direction={"column"}>
                <label htmlFor="customer_id" style={{color:"grey"}}>Customer ID</label>
                <StyledSearchField sx={{maxWidth: "300px"}} id={"customer_id"} placeholder="Customer ID" />
            </Grid> */}

        <FormComponentView
          key={"retrieveCustForm"}
          finalMetaData={RetrieveDataFilterForm as FilterFormMetaType}
          onAction={(colomnValue, initialVisibleColumn) => {
            let newObj: any = {};
            let newArr = Object.keys(colomnValue).filter((key) =>
              Boolean(colomnValue[key])
            );
            if (newArr && newArr.length === 0) {
              return;
            } else {
              newArr.forEach((key) => {
                newObj[key] = colomnValue[key];
              });
              let data = {
                COMP_CD: authState?.companyID ?? "",
                SELECT_COLUMN: newObj,
              };
              mutation.mutate(data);
            }
          }}
          loading={false}
          data={{}}
          submitSecondAction={() => {}}
          submitSecondButtonName="Save"
          submitSecondButtonHide={true}
          submitThirdButtonHide={true}
          submitSecondLoading={false}
          propStyles={{
            titleStyle: { color: "var(--theme-color3) !important" },
            toolbarStyles: { background: "var(--theme-color2) !important" },
            IconButtonStyle: { variant: "secondary" },
            paperStyle: { boxShadow: "none" },
          }}
        ></FormComponentView>

        {/* <Grid item py={2} sx={{textAlign: "right"}}>
                <Button color="secondary" variant="contained">Retrieve</Button>
            </Grid> */}
      </Grid>

      <GridWrapper
        key={`RetrieveCustEntries` + mutation.data}
        finalMetaData={ckyc_retrieved_meta_data as GridMetaDataType}
        data={mutation.data ?? []}
        setData={() => null}
        loading={mutation.isLoading || mutation.isFetching}
        actions={actions}
        setAction={setCurrentAction}
        // refetchData={() => refetch()}
        // ref={myGridRef}
      />

      <Routes>
        <Route
          path="view-detail/*"
          element={
            <FormModal
              isLoadingData={isLoadingData}
              setIsLoadingData={setIsLoadingData}
              isCustomerData={isCustomerData}
              setIsCustomerData={setIsCustomerData}
              onClose={() => navigate(".")}
              formmode={formMode ?? "edit"}
              from={"retrieve-entry"}
            />
          }
        />

        <Route
          path="inactive-customer/*"
          element={
            <DeactivateCustomer
              rowdata={rowsData}
              onClose={() => {
                navigate(".");
              }}
            />
          }
        />

        <Route
          path="photo-signature/*"
          element={
            <PhotoSignatureCpyDialog
              open={true}
              onClose={() => {
                navigate(".");
              }}
              viewMode={formMode ?? "edit"}
            />
          }
        />

        <Route
          path="insurance/*"
          element={
            <InsuranceComp
              // rowsData={rowsData}
              open={true}
              onClose={() => {
                // setInsuranceOpen(false)
                navigate(".");
              }}
            />
          }
        />
        <Route
          path="bank-details/*"
          element={
            <BankDTLComp
              // rowsData={rowsData}
              open={true}
              onClose={() => {
                navigate(".");
              }}
            />
          }
        />

        <Route
          path="credit-card/*"
          element={
            <CreditCardDTLComp
              // rowsData={rowsData}
              open={true}
              onClose={() => {
                navigate(".");
              }}
            />
          }
        />

        <Route
          path="offences-details/*"
          element={
            <OffencesDTLComp
              // rowsData={rowsData}
              open={true}
              onClose={() => {
                navigate(".");
              }}
            />
          }
        />

        <Route
          path="asset-details/*"
          element={
            <AssetDTLComp
              // rowsData={rowsData}
              open={true}
              onClose={() => {
                navigate(".");
              }}
            />
          }
        />

        <Route
          path="financial-details/*"
          element={
            <FinancialDTLComp
              // rowsData={rowsData}
              open={true}
              onClose={() => {
                navigate(".");
              }}
            />
          }
        />

        <Route
          path="dependencies/*"
          element={
            <Dependencies
              rowsData={rowsData}
              open={true}
              onClose={() => {
                navigate(".");
              }}
            />
          }
        />

        <Route
          path="controlling-person-details/*"
          element={
            <ControllingPersonComp
              // rowsData={rowsData}
              open={true}
              onClose={() => {
                navigate(".");
              }}
            />
          }
        />
      </Routes>
    </Grid>
  );
};

export default RetrieveCustomer;
