import React, {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as API from "../../../../api";
import { AuthContext } from "pages_audit/auth";
import { CkycContext } from "pages_audit/pages/operations/c-kyc/CkycContext";
import { useMutation, useQuery } from "react-query";
import { GridMetaDataType } from "components/dataTableStatic";
import { DocumentGridMetadata } from "./documentGridMetadata";
import { useNavigate } from "react-router-dom";
import ExtDocumentForm from "./ExtDocumentForm";
import { utilFunction } from "components/utils";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import { t } from "i18next";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import { addMonths, format } from "date-fns";
import _ from "lodash";
const ExtDocument = ({
  // isCustomerData,
  // setIsCustomerData,
  // isLoading,
  // setIsLoading,
  open,
  onClose,
  viewMode,
  // from,
}) => {
  const { authState } = useContext(AuthContext);
  const {
    state,
    handleColTabChangectx,
    handleStepStatusctx,
    handleFormDataonSavectx,
    handleModifiedColsctx,
  } = useContext(CkycContext);
  const navigate = useNavigate();
  const [openForm, setOpenForm] = useState(false);
  const [rowsData, setRowsData] = useState([]);
  const [data, setData] = useState<any>([]);
  const [formMode, setFormMode] = useState<any>("");
  const [isNextLoading, setIsNextLoading] = useState(false);
  const isDataChangedRef = useRef(false);
  const handleDialogClose = () => {
    if (isDataChangedRef.current === true) {
      // isDataChangedRef.current = true;
      // refetch();
      isDataChangedRef.current = false;
    }
    navigate(".");
  };
  const myGridRef = useRef<any>(null);

  // useEffect(() => {
  //   console.log('rowsData change', rowsData)
  // }, [rowsData])

  const initValues = useMemo(() => {
    return state?.isFreshEntryctx
      ? state?.formDatactx["DOC_MST"]
        ? state?.formDatactx["DOC_MST"]
        : []
      : state?.retrieveFormDataApiRes
      ? state?.retrieveFormDataApiRes["DOC_MST"]
      : [];
  }, [state?.isFreshEntryctx, state?.retrieveFormDataApiRes]);
  useEffect(() => {
    setData(initValues);
  }, [initValues]);

  const mutation: any = useMutation(API.getKYCDocumentGridData, {
    onSuccess: (data) => {
      setData(data);
    },
    onError: (error: any) => {},
  });

  useEffect(() => {
    // console.log(state?.formDatactx["DOC_MST"], "wadqwdwq. doc", state?.retrieveFormDataApiRes["DOC_MST"])
    if (
      state?.isFreshEntryctx &&
      !(
        Boolean(state?.formDatactx["DOC_MST"]) ||
        Boolean(state?.retrieveFormDataApiRes["DOC_MST"])
      )
    ) {
      let payload = {
        COMP_CD: authState?.companyID ?? "",
        BRANCH_CD: authState?.user?.branchCode ?? "",
        CUST_TYPE: state?.entityTypectx,
        CONSTITUTION_TYPE: state?.constitutionValuectx ?? "",
      };
      mutation.mutate(payload);
    }
  }, []);

  const afterFormSubmit = (formData, submitFormMode) => {
    // console.log(formData, "wadqwdwq. doc afterFormSubmit", submitFormMode)
    if (submitFormMode === "new") {
      setData((old) => {
        // console.log(formData, "wadqwdwq. doc afterFormSubmit new",old)
        if (!Array.isArray(old)) {
          return [
            {
              ...formData,
              SR_CD: 1,
              IsNewRow: true,
            },
          ];
        } else {
          let srCount = utilFunction.GetMaxCdForDetails(old, "SR_CD");
          const myNewRowObj = {
            ...formData,
            SR_CD: String(srCount),
            // _isNewRow: true,
            IsNewRow: true,
          };
          return [...old, myNewRowObj];
        }
      });
    } else {
      setData((old) => {
        // console.log(formData, "wadqwdwq. doc afterFormSubmit old",old)
        return old.map((item) => {
          if (item.SR_CD === formData.SR_CD) {
            let { SR_CD, ...other } = formData;
            return { ...item, ...other };
          } else {
            return item;
          }
        });
      });
    }

    setOpenForm(false);
  };

  const actions = [
    {
      actionName: "view-details",
      actionLabel: "View Details",
      multiple: false,
      rowDoubleClick: true,
    },
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
      rowDoubleClick: true,
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
      if (data.name === "add") {
        setOpenForm(true);
        setFormMode("new");
        setRowsData(data?.rows);
      } else if (data.name === "delete") {
        setOpenForm(true);
        // setComponentToShow("Delete")
        setRowsData(data?.rows);
      } else if (data.name === "view-details") {
        // setComponentToShow("view-details")
        setFormMode("edit");
        setRowsData(data?.rows);
        setOpenForm(true);
      } else if(data.name === "close") {
        onClose()
      }
      // navigate(data?.name, {
      //   state: data?.rows,
      // });
    },
    [navigate]
  );

  const onSave = () => {
    // console.log("wadqwdwq. doc save", data)
    if (data && data.length > 0) {
      let newDocData: any[] = [];

      newDocData = data.map((doc) => {
        // console.log("wadqwdwq. doc save newdoc", doc);
        const {
          TEMPLATE_CD,
          SUBMIT,
          VALID_UPTO,
          DOC_NO,
          DOC_IMAGE,
          DOC_DESCRIPTION,
          SR_CD,
          DOC_WEIGHTAGE,
        } = doc;
        let newObj = {
          IsNewRow: true,
          TEMPLATE_CD: TEMPLATE_CD,
          // SUBMIT: Boolean(SUBMIT) ? "Y" : "N",
          SUBMIT: SUBMIT === true ? "Y" : "N",
          VALID_UPTO: VALID_UPTO ?? "",
          // VALID_UPTO: VALID_UPTO
          //   ? format(new Date(doc?.VALID_UPTO ?? ""), "dd-MMM-yyyy")
          //   : format(new Date(addMonths(new Date(), 9999)), "dd-MMM-yyyy"),
          DOC_NO: DOC_NO ?? "",
          DOC_DESCRIPTION: DOC_DESCRIPTION,
          DOC_IMAGE: DOC_IMAGE ?? "",
          DOC_TYPE: "KYC",
          DOC_AMOUNT: "",
          DOC_WEIGHTAGE: DOC_WEIGHTAGE ?? "",
          SR_CD: SR_CD ?? "",
          // ACTIVE : "Y",
        };
        // console.log("wadqwdwq. doc save newdoc --after", newObj);
        return newObj;
      });

      let newData = state?.formDatactx;
      newData["DOC_MST"] = [...newDocData];
      handleFormDataonSavectx(newData);
      handleStepStatusctx({
        status: "completed",
        coltabvalue: state?.colTabValuectx,
      });
      handleColTabChangectx(state?.colTabValuectx + 1);
    } else {
      let newData = state?.formDatactx;
      newData["DOC_MST"] = [];
      handleFormDataonSavectx(newData);
      handleStepStatusctx({
        status: "completed",
        coltabvalue: state?.colTabValuectx,
      });
      handleColTabChangectx(state?.colTabValuectx + 1);
    }
  };

  const onUpdate = () => {
    setIsNextLoading(true);
    // console.log("qweqweqweo", data, data.OTHER_ADDRESS)
    if (data) {
      // setCurrentTabFormData(formData => ({...formData, "declaration_details": data }))
      // console.log("wadqwdwq. doc update data", data);
      let newData = state?.formDatactx;
      const commonData = {
        IsNewRow: true,
        COMP_CD: authState?.companyID ?? "",
        BRANCH_CD: authState?.user?.branchCode ?? "",
        REQ_FLAG: "F",
        // REQ_CD: state?.req_cd_ctx,
        // SR_CD: "3",
        CONFIRMED: "N",
        ENT_COMP_CD: authState?.companyID ?? "",
        ENT_BRANCH_CD: authState?.user?.branchCode ?? "",
      };
      if (data && data.length > 0) {
        let filteredCols: any[] = [
          "VALID_UPTO",
          "DOC_IMAGE",
          "SUBMIT",
          "TEMPLATE_CD",
          "DOC_NO",
          "DOC_DESCRIPTION",
          "SR_CD",
          "TRAN_CD",
        ];

        let newFormatOtherAdd = data.map((formRow, i) => {
          // console.log("wadqwdwq. doc update formRow", formRow)
          return {
            ...data[i],
            ...commonData,
            SUBMIT: Boolean(formRow?.SUBMIT) ? "Y" : "N",
          };
        });
        // console.log("new", newFormatOtherAdd, "wadqwdwq. doc update old", data)

        newData["DOC_MST"] = [...newFormatOtherAdd];
        handleFormDataonSavectx(newData);

        if (!state?.isFreshEntryctx) {
          let tabModifiedCols: any = state?.modifiedFormCols;
          tabModifiedCols = {
            ...tabModifiedCols,
            DOC_MST: [...filteredCols],
          };
          handleModifiedColsctx(tabModifiedCols);
        }
      } else {
        newData["DOC_MST"] = [];
        handleFormDataonSavectx(newData);
        if (!state?.isFreshEntryctx) {
          let tabModifiedCols: any = state?.modifiedFormCols;
          tabModifiedCols = {
            ...tabModifiedCols,
            DOC_MST: [],
          };
          handleModifiedColsctx(tabModifiedCols);
        }
      }

      // newData["OTHER_ADDRESS"] = {...newData["OTHER_ADDRESS"], ...newFormatOtherAdd}
      handleStepStatusctx({
        status: "completed",
        coltabvalue: state?.colTabValuectx,
      });
      handleColTabChangectx(state?.colTabValuectx + 1);
    }
    //  else {
    //     handleStepStatusctx({status: "error", coltabvalue: state?.colTabValuectx})
    // }
    setIsNextLoading(false);
  };

  const SaveUpdateBTNs = useMemo(() => {
    if (viewMode) {
      return viewMode == "new" ? (
        <Fragment>
          <Button
            sx={{ mr: 2, mb: 2 }}
            color="secondary"
            variant="contained"
            disabled={isNextLoading}
            onClick={onSave}
          >
            {t("Next")}
            {/* {t("Save & Next")} */}
          </Button>
        </Fragment>
      ) : viewMode == "edit" ? (
        <Fragment>
          <Button
            sx={{ mr: 2, mb: 2 }}
            color="secondary"
            variant="contained"
            disabled={isNextLoading}
            onClick={onUpdate}
          >
            {t("Update & Next")}
          </Button>
        </Fragment>
      ) : (
        viewMode == "view" && (
          <Fragment>
            <Button
              sx={{ mr: 2, mb: 2 }}
              color="secondary"
              variant="contained"
              disabled={isNextLoading}
              onClick={(e) => {
                handleStepStatusctx({
                  status: "completed",
                  coltabvalue: state?.colTabValuectx,
                });
                handleColTabChangectx(state?.colTabValuectx + 1);
              }}
            >
              {t("Next")}
            </Button>
          </Fragment>
        )
      );
    }
  }, [viewMode, data]);

  const ActionBTNs = React.useMemo(() => {
    return (
      <React.Fragment>
        <Button
          onClick={() => {
            // handlePhotoOrSignctx(null, null, "photo")
            // handlePhotoOrSignctx(null, null, "sign")
            onClose();
          }}
        >
          Close
        </Button>
      </React.Fragment>
    );
  }, []);














  

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
      {/* <DialogContent sx={{ px: "0" }}> */}
        <Grid
          container
          // style={{
          //   position: "absolute",
          //   paddingRight: !state?.isFreshEntryctx ? "113px" : "12px",
          // }}
        >
          <GridWrapper
            key={`operatorMasterGrid` + data + setData}
            finalMetaData={DocumentGridMetadata as GridMetaDataType}
            data={data ?? []}
            setData={setData}
            loading={mutation.isLoading}
            actions={actions}
            setAction={setCurrentAction}
            // refetchData={() => refetch()}
            ref={myGridRef}
            onClickActionEvent={(index, id, currentData) => {
              // console.log(data, "qjwkdjbiqwudqd", index, id, currentData)
              let newData: any[] = [];
              newData =
                data.length > 0 &&
                data.filter((row) => row.SR_CD !== currentData.SR_CD);
              setData([...newData]);
            }}
          />

          {/* <Grid container item sx={{ justifyContent: "flex-end" }}>
            <Button
              sx={{ mr: 2, mb: 2 }}
              color="secondary"
              variant="contained"
              disabled={isNextLoading}
              onClick={(e) => {
                // handleColTabChangectx(1)
                handleColTabChangectx(state?.colTabValuectx - 1);
              }}
            >
              {t("Previous")}
            </Button>
            {SaveUpdateBTNs}
          </Grid> */}

          {openForm ? (
            <ExtDocumentForm
              isDataChangedRef={isDataChangedRef}
              ClosedEventCall={handleDialogClose}
              formMode={formMode}
              afterFormSubmit={afterFormSubmit}
              open={openForm}
              onClose={() => setOpenForm(false)}
              gridData={data}
              rowsData={rowsData}
            />
          ) : null}
        </Grid>
      {/* </DialogContent> */}
    </Dialog>
  );
};

export default ExtDocument;
