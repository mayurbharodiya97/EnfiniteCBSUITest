import { AppBar, Dialog, Grid, IconButton } from "@mui/material";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import { DocumentGridMetadata } from "./docGridmetadata";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { GridMetaDataType } from "components/dataTableStatic";
import { CkycContext } from "pages_audit/pages/operations/c-kyc/CkycContext";
import { useMutation } from "react-query";
import * as API from "../../../../api";
import { AuthContext } from "pages_audit/auth";
import { DocMasterDTLForm } from "./DocMasterDTLForm";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { Alert } from "components/common/alert";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import { CreateDetailsRequestData } from "components/utils";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { enqueueSnackbar } from "notistack";

const UpdateDocument = ({ open, onClose, viewMode }) => {
  const navigate = useNavigate();
  const isDataChangedRef = useRef(false);
  const myGridRef = useRef<any>(null);
  const [isDelConfirm, setIsDelConfirm] = useState<boolean>(false);
  const currRowRef = useRef<any>(false);
  const { handleFormModalClosectx } = useContext(CkycContext);
  const [girdData, setGridData] = useState<any>([]);
  const { authState } = useContext(AuthContext);
  const { state } = useLocation();
  let payload: {
    COMP_CD?: string;
    BRANCH_CD: string;
    REQUEST_CD?: string;
    CUSTOMER_ID?: string;
  } = {
    // COMP_CD: authState?.companyID ?? "",
    BRANCH_CD: authState?.user?.branchCode ?? "",
  };
  const reqCD = state?.CUSTOMER_DATA?.[0]?.data.REQUEST_ID ?? "";
  const custID = state?.CUSTOMER_DATA?.[0]?.data.CUSTOMER_ID ?? "";
  if (Boolean(reqCD)) {
    payload["REQUEST_CD"] = reqCD;
  }
  if (Boolean(custID)) {
    payload["CUSTOMER_ID"] = custID;
  }

  // useEffect(() => {
  //   console.log("on state change", state, state?.[0]?.data.REQUEST_ID, state?.[0]?.data.CUSTOMER_ID)
  // }, [state])

  // get customer form details
  const custDTLMutation: any = useMutation(API.getCustomerDetailsonEdit, {
    onSuccess: (data) => {
      // console.log("on successssss.,", data, state);
      if (Array.isArray(data) && data.length > 0) {
        if (Boolean(data[0]?.DOC_MST) && Array.isArray(data[0]?.DOC_MST)) {
          let newData: any[] = data[0]?.DOC_MST;
          newData = newData.map((doc) => {
            return { ...doc, TRANSR_CD: `${doc.TRAN_CD}${doc.SR_CD}`, SUBMIT: doc.SUBMIT === "Y" ? true : false };
          });
          // console.log("on successssss., wedqw", newData);
          setGridData([...newData]);
        }
      }
    }
  });

  // update modification
  const mutation: any = useMutation(API.updateExtDocument, {
    onSuccess: (data) => {
      // console.log("update successssss.,", data, state);
      custDTLMutation.mutate(payload);
      setIsDelConfirm(false);
      enqueueSnackbar("Record Deleted successfully.", {
        variant: "success",
      });
    },
    onError: (error: any) => {
      setIsDelConfirm(false);
    },
  });

  useEffect(() => {
    // console.log(">>doc stateeeeeeee", state);
    custDTLMutation.mutate(payload);
  }, []);

  const handleDialogClose = () => {
    if (isDataChangedRef.current === true) {
      // isDataChangedRef.current = true;
      custDTLMutation.mutate(payload);
      isDataChangedRef.current = false;
    }
    navigate(".", {state: {...state}});
    // handleFormModalClosectx();
    // onClose();
  };

  const actions = [
    {
      actionName: "edit-details",
      actionLabel: "View Details",
      multiple: false,
      rowDoubleClick: true,
    },
    {
      actionName: "add",
      actionLabel: "Add",
      multiple: undefined,
      rowDoubleClick: false,
      alwaysAvailable: true,
    },
    {
      actionName: "close",
      actionLabel: "Close",
      multiple: undefined,
      rowDoubleClick: false,
      alwaysAvailable: true,
    },
  ];

  const setCurrentAction = useCallback(
    (data) => {
      if (data.name === "close") {
        handleFormModalClosectx();
        onClose();
      }
      else {
        // console.log("qwefhweufhiuwheiufhwef", data?.rows)
        navigate(data?.name, {
          state: { ...state, rows: data?.rows, 
            // REQ_CD: reqCD, CUSTOMER_ID: custID 
          },
        });
      }
    },
    [navigate]
  );

  const onDeleteDocument = () => {
    const payload = {
      DOC_MST: [
        {
          TRAN_CD: currRowRef.current?.TRAN_CD,
          SR_CD: currRowRef.current?.SR_CD,
          REQ_CD: reqCD,
          _isDeleteRow: true,
          IS_FROM_MAIN:
          currRowRef.current?.IS_FROM_MAIN ?? "N",
          NEW_FLAG: "N",  
          DETAILS_DATA: {
            isDeleteRow: [],
            isNewRow: [],
            isUpdatedRow: [],
          },
          // _isNewRow: false,
        },
      ],
      REQ_CD: reqCD,
      CUSTOMER_ID: custID,
      COMP_CD: authState?.companyID ?? "",
      BRANCH_CD: authState?.user?.branchCode ?? "",
      REQ_FLAG: "E",
      IsNewRow: Boolean(reqCD) ? false : true
    };
    mutation.mutate(payload);
    // console.log("qwieuhdiqwhd", currRowRef.current)
  };

  return (
    <Dialog
      open={open}
      maxWidth="lg"
      PaperProps={{
        style: {
          minWidth: "70%",
          width: "80%",
          // maxWidth: "90%",
        },
      }}
    >
      <Grid container>
        {custDTLMutation.isError ? (
          <Alert
            severity={custDTLMutation.error?.severity ?? "error"}
            errorMsg={
              custDTLMutation.error?.error_msg ?? "Something went to wrong.."
            }
            errorDetail={custDTLMutation.error?.error_detail}
            color="error"
          />
        ) : mutation.isError ? (
          <Alert
            severity={mutation.error?.severity ?? "error"}
            errorMsg={mutation.error?.error_msg ?? "Something went to wrong.."}
            errorDetail={mutation.error?.error_detail}
            color="error"
          />
        ) : null}
        <GridWrapper
          key={`operatorMasterGrid` + girdData + setGridData}
          finalMetaData={DocumentGridMetadata as GridMetaDataType}
          data={girdData ?? []}
          setData={setGridData}
          loading={custDTLMutation.isLoading || custDTLMutation.isFetching || mutation.isLoading}
          actions={actions}
          setAction={setCurrentAction}
          // refetchData={() => refetch()}
          ref={myGridRef}
          onClickActionEvent={(index, id, currentData) => {
            // console.log(">>doc onClickActionEvent", index, id, currentData);
            if (id === "_hidden") {
              setIsDelConfirm(true);
              currRowRef.current = currentData;
              // let newData: any[] = [];
              // newData =
              //   girdData.length > 0 &&
              //   girdData.filter(
              //     (row) => row.TRANSR_CD !== currentData.TRANSR_CD
              //   );
              // setGridData([...newData]);
            } else if (id === "VIEW_DTL") {
              // console.log(currentData, "qwefhweufhiuwheiufhwef")
              navigate("edit-details", {
                state: {
                  ...state,
                  rows: [{ data: { ...currentData } }],
                  // REQ_CD: reqCD,
                  // CUSTOMER_ID: custID,
                },
              });
            }
          }}
        />
          <PopupMessageAPIWrapper
            MessageTitle="CONFIRM"
            Message="Do you want to delete this Document?"
            onActionYes={(rowVal) => {
              onDeleteDocument();
            }}
            onActionNo={() => {
              setIsDelConfirm(false);
            }}
            rows={{}}
            open={isDelConfirm}
            loading={mutation.isLoading}
          />

        <Routes>
          <Route
            path="edit-details/*"
            element={
              <DocMasterDTLForm
                isDataChangedRef={isDataChangedRef}
                ClosedEventCall={handleDialogClose}
                defaultmode={"view"}
                girdData={girdData}
              />
            }
          />
          <Route
            path="add/*"
            element={
              <DocMasterDTLForm
                isDataChangedRef={isDataChangedRef}
                ClosedEventCall={handleDialogClose}
                defaultmode={"new"}
                girdData={girdData}
              />
            }
          />
        </Routes>
      </Grid>
    </Dialog>
  );
};

export default UpdateDocument;
