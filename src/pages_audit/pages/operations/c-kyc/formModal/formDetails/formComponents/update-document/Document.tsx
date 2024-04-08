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
  const deletedDocRef = useRef<any>(null);
  const isDelConfirmRef = useRef<boolean>(false);
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
  // console.log("stateeeeeeee", state);
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
      // handleFormDataonRetrievectx(data[0])
      // let acctTypevalue = data[0]?.PERSONAL_DETAIL.ACCT_TYPE
      // let acctType = AccTypeOptions && AccTypeOptions.filter(op => op.value == acctTypevalue)
      // setAcctTypeState(acctType[0])
      // // handleColTabChangectx(0)
      // // handleFormModalOpenOnEditctx(location?.state)
      //   handleFormDataonRetrievectx(data[0]);
      //   onClosePreventUpdateDialog();
    },
    onError: (error: any) => {},
  });

  // update modification
  const mutation: any = useMutation(API.updateExtDocument, {
    onSuccess: (data) => {
      // console.log("update successssss.,", data, state);
      // if (Array.isArray(data) && data.length > 0) {
      //   setGridData(data[0]?.DOC_MST);
      // }
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

  // const mutation = useMutation(
  //   updateFromSourceConfigDetailsDataWrapperFn(API.updateExtDocument),
  //   {
  //     onError: (error: any, { endSubmit, setLoading }) => {
  //       // setLoading(false);
  //       endSubmit(true, error?.error_msg, error?.error_detail);
  //       onActionCancel();
  //     },
  //     onSuccess: (data, { endSubmit, setLoading }) => {
  //       // setLoading(false);
  //       // endSubmit(true);
  //       enqueueSnackbar("Record Updated successfully.", {
  //         variant: "success",
  //       });
  //       isDataChangedRef.current = true;
  //       ClosedEventCall();
  //     },
  //   }
  // );

  useEffect(() => {
    custDTLMutation.mutate(payload);
  }, []);

  const handleDialogClose = () => {
    if (isDataChangedRef.current === true) {
      isDataChangedRef.current = true;
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
    // {
    //   actionName: "update",
    //   actionLabel: "Update",
    //   multiple: undefined,
    //   rowDoubleClick: false,
    //   alwaysAvailable: false,
    // },
    // {
    //   actionName: "delete",
    //   actionLabel: "Delete",
    //   multiple: false,
    //   rowDoubleClick: false,
    // },
    {
      actionName: "add",
      actionLabel: "Add",
      multiple: undefined,
      rowDoubleClick: false,
      alwaysAvailable: true,
    },
    // {
    //   actionName: "save",
    //   actionLabel: "Save",
    //   multiple: undefined,
    //   rowDoubleClick: false,
    //   alwaysAvailable: true,
    // },
    {
      actionName: "close",
      actionLabel: "Close",
      multiple: undefined,
      rowDoubleClick: false,
      alwaysAvailable: true,
    },
  ];

  // const setCurrentAction = useCallback(
  //     (data) => {
  //       if (data.name === "add") {
  //         setOpenForm(true);
  //         setFormMode("new");
  //         // setRowsData(data?.rows);
  //     //   } else if (data.name === "delete") {
  //     //     setOpenForm(true);
  //     //     // setComponentToShow("Delete")
  //     //     setRowsData(data?.rows);
  //       } else if (data.name === "edit-details") {
  //         // setComponentToShow("view-details")
  //         setFormMode("edit");
  //         // setRowsData(data?.rows);
  //         setOpenForm(true);
  //     //   } else if (data.name === "update") {
  //     //     onUpdate()
  //       } else if (data.name === "close") {
  //         handleFormModalClosectx()
  //         onClose();
  //       } else {
  //         navigate(data?.name, {
  //             state: data?.rows,
  //         });
  //       }
  //     },
  //     [navigate]
  // );

  const setCurrentAction = useCallback(
    (data) => {
      //   if (data.name === "add") {
      //     // setOpenForm(true);
      //     // setFormMode("new");
      //   } else if (data.name === "edit-details") {
      //     // setFormMode("edit");
      //     // setOpenForm(true);
      //   } else
      if (data.name === "close") {
        handleFormModalClosectx();
        onClose();
      }
      // else if (data.name === "save") {
      //   onSaveRecord();
      // }
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

  // const onSaveRecord = async () => {
  //   let { hasError, data: dataold } = await myGridRef.current?.validate();
  //   // console.log(hasError, "wefhiwuehf", dataold);
  //   if (hasError === true) {
  //     if (dataold) {
  //       setGridData(dataold);
  //     }
  //   } else {
  //     let result = myGridRef?.current?.cleanData?.();
  //     // console.log("wefhiwuehf result", result);
  //     if (!Array.isArray(result)) {
  //       // console.log("wefhiwuehf result - is not arr", result);
  //       result = [result];
  //     }
  //     let finalResult = result.filter(
  //       (one) => !(Boolean(one?._hidden) && Boolean(one?._isNewRow))
  //     );
  //     if (finalResult.length === 0) {
  //       onClose();
  //     } else {
  //       finalResult = CreateDetailsRequestData(finalResult);
  //       // console.log("wefhiwuehf finalresult", finalResult);
  //       if (
  //         finalResult?.isDeleteRow?.length === 0 &&
  //         finalResult?.isNewRow?.length === 0 &&
  //         finalResult?.isUpdatedRow?.length === 0
  //       ) {
  //         onClose();
  //       } else if (
  //         finalResult?.isDeleteRow?.length !== 0 &&
  //         finalResult?.isNewRow?.length === 0 &&
  //         finalResult?.isUpdatedRow?.length === 0
  //       ) {
  //         // let reqData = {
  //         //   _isNewRow: false,
  //         //   _UPDATEDCOLUMNS: [],
  //         //   _OLDROWVALUE: {},
  //         //   // ...reqDataRef.current,
  //         //   DETAILS_DATA: {

  //         //   },
  //         // };
  //         let reqData = finalResult?.isDeleteRow.map((deletedRow) => {
  //           // console.log("kwehfiuwehfwef", deletedRow);
  //           return {
  //             TRAN_CD: deletedRow?.TRAN_CD,
  //             SR_CD: deletedRow?.SR_CD,
  //            IS_MAIN_DATA_DEL: true,
  //             DETAILS_DATA: {
  //               isDeleteRow: [],
  //               isNewRow: [],
  //               isUpdatedRow: [],
  //             },
  //           };
  //         });
  //         // console.log(
  //         //   "wefhiwuehf only-del",
  //         //   reqData,
  //         //   finalResult,
  //         //   "-- ",
  //         //   custDTLMutation.data
  //         // );
  //         deletedDocRef.current = [...reqData];
  //         const payload = {
  //           DOC_MST: [...reqData],
  //           REQ_CD: reqCD,
  //           CUSTOMER_ID: custID,
  //           COMP_CD: authState?.companyID ?? "",
  //           BRANCH_CD: authState?.user?.branchCode ?? "",
  //           IS_FROM_MAIN:
  //             custDTLMutation.data?.[0]?.DOC_MST?.[0]?.IS_FROM_MAIN ?? "N",
  //           NEW_FLAG: "N",
  //           REQ_FLAG: "E",
  //         };
  //         // console.log("wefqwdqwdqwdqwdq", payload)
  //         mutation.mutate(payload);
  //       } else {
  //         // console.log("elseeee..", finalResult);
  //         // let reqData = {
  //         //   _isNewRow: false,
  //         //   _UPDATEDCOLUMNS: [],
  //         //   _OLDROWVALUE: {},
  //         //   // ...reqDataRef.current,
  //         //   DETAILS_DATA: finalResult,
  //         // };
  //       }
  //     }
  //   }
  // };

  const onDeleteDocument = () => {
    const payload = {
      DOC_MST: [
        {
          TRAN_CD: currRowRef.current?.TRAN_CD,
          SR_CD: currRowRef.current?.SR_CD,
          REQ_CD: reqCD,
          _isDeleteRow: true,
          IS_FROM_MAIN:
          custDTLMutation.data?.[0]?.DOC_MST?.[0]?.IS_FROM_MAIN ?? "N",
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
          loading={custDTLMutation.isLoading || custDTLMutation.isFetching}
          actions={actions}
          setAction={setCurrentAction}
          // refetchData={() => refetch()}
          ref={myGridRef}
          onClickActionEvent={(index, id, currentData) => {
            // console.log("wefwueifhwieufh", index, id, currentData);
            // console.log(data, "qjwkdjbiqwudqd", index, id, currentData)
            if (id === "_hidden") {
              isDelConfirmRef.current = true;
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
        {isDelConfirm ? (
          <PopupMessageAPIWrapper
            MessageTitle="CONFIRM"
            Message="Do you want to Delete this Document?"
            onActionYes={(rowVal) => {
              onDeleteDocument();
              // let newData: any[] = [];
              // // newData =
              // //   girdData.length > 0 &&
              // //   girdData.filter(
              // //     (row) => row.TRANSR_CD !== currRowRef.current?.TRANSR_CD
              // //   );
              // if(girdData.length > 0) {
              //   newData = girdData.map(row => {
              //     if(row.TRANSR_CD === currRowRef.current?.TRANSR_CD) {
              //       return {...row, _hidden: true}
              //     } else {
              //       return {...row}
              //     }
              //   })
              //   setGridData([...newData]);
              //   onSaveRecord()
              //   // setIsDelConfirm(false)
              // }
            }}
            onActionNo={() => {
              // isDelConfirmRef.current = false;
              setIsDelConfirm(false);
            }}
            rows={{}}
            open={isDelConfirmRef.current}
            loading={mutation.isLoading}
          />
        ) : null}

        <Routes>
          <Route
            path="edit-details/*"
            element={
              //   <FilesGridComp
              //     viewMode={viewMode === "view" ? viewMode : "edit"}
              //   />
              // <DocMasterDTLForm viewMode={viewMode} onClose={onClose} />
              <DocMasterDTLForm
                isDataChangedRef={isDataChangedRef}
                deletedDocRef={deletedDocRef}
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
                deletedDocRef={deletedDocRef}
                ClosedEventCall={handleDialogClose}
                defaultmode={"new"}
                girdData={girdData}
              />
              // <AddDocFormComp
              //   viewMode={viewMode === "view" ? viewMode : "edit"}
              // />
              // <DocMasterDTLForm viewMode={viewMode} />
            }
          />
        </Routes>
      </Grid>
    </Dialog>
  );
};

// // 2nd grid comp
// export const FilesGridComp = ({ viewMode }) => {
//   return <p>SubGrid</p>;
// };

// export const AddDocFormComp = ({ viewMode }) => {
//   return <p>Add Main Document Form</p>;
// };
// // last comp
// export const FilePreviewComp = ({ viewMode }) => {
//   return <p>File Preview Comp</p>;
// };

export default UpdateDocument;
