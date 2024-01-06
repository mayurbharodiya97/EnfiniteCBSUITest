import React, { Fragment, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import * as API from "../../../../api";
import { AuthContext } from "pages_audit/auth";
import { CkycContext } from "pages_audit/pages/operations/c-kyc/CkycContext";
import { useQuery } from "react-query";
import { GridMetaDataType } from "components/dataTableStatic";
import {DocumentGridMetadata} from "./documentGridMetadata"
import { useNavigate } from "react-router-dom";
import KYCDocumentMasterDetails from "./KYCDocumentMasterDetails";
import { utilFunction } from "components/utils";
import { Button, Grid } from "@mui/material";
import { t } from "i18next";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
const Document = ({isCustomerData, setIsCustomerData, isLoading, setIsLoading, displayMode}) => {
    const { authState } = useContext(AuthContext);
    const {state, handleColTabChangectx, handleStepStatusctx} = useContext(CkycContext);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [rowsData, setRowsData] = useState([]);
    const [data, setData] = useState<any>([]);
    const [formMode, setFormMode] = useState<any>("");
    const [isNextLoading, setIsNextLoading] = useState(false)
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

    const { data:DocGridData, isError, isLoading:isDocGridLoading, error, refetch } = useQuery<any, any>(
        ["getKYCDocumentGridData"],
        () => API.getKYCDocumentGridData({
            COMP_CD: authState?.companyID ?? "", 
            BRANCH_CD: authState?.user?.branchCode ?? "", 
            CUST_TYPE: state?.entityTypectx, 
            CONSTITUTION_TYPE: state?.constitutionValuectx ?? ""
        })
    );

    useEffect(() => {
        // console.log("existingDataexistingData", myGridRef.current)
      // myGridRef.current.setGridData
      if(!isDocGridLoading && DocGridData) {
        setData(DocGridData)
        // setTimeout(() => {
        //   setData([])
          // console.log("aqwsqwsq", myGridRef.current?.cleanData?.())
        // }, 5000);
      }
    }, [DocGridData, isDocGridLoading])

    const afterFormSubmit = (formData,submitFormMode) => {
      if(submitFormMode==='new'){
        setData((old) => {
          if(!Array.isArray(old)) {
            return [
              {
                ...formData, SR_CD: 1
              }
            ]
          } else {
            let srCount = utilFunction.GetMaxCdForDetails(old, "SR_CD");
            const myNewRowObj = {
              ...formData,
              SR_CD: String(srCount),
              _isNewRow: true,
            };
            return [...old, myNewRowObj];
          }
        })
      }else{
        setData((old) => {
          return old.map(item=>{
            if(item.SR_CD === formData.SR_CD){
              let {SR_CD,...other} = formData;
              return {...item,...other};
            }else{
              return item;
            }
          });
        }) 
      }
      
      setOpen(false)
    }

    const actions = [
        {
          actionName: "view-details",
          actionLabel: "View Details",
          multiple: false,
          rowDoubleClick: true,
        },
        {
          actionName: "delete",
          actionLabel: "Delete",
          multiple: false,
          rowDoubleClick: false,
        },
        {
          actionName: "add",
          actionLabel: "Add",
          multiple: undefined,
          rowDoubleClick: true,
          alwaysAvailable: true,
        },
    ];

    const setCurrentAction = useCallback(
        (data) => {
          if(data.name === "add") {
            setOpen(true)
            setFormMode("new")
            setRowsData(data?.rows);
          } else if(data.name === "delete") {
            setOpen(true)
            // setComponentToShow("Delete")
            setRowsData(data?.rows);
          } else if(data.name === "view-details") {
            // setComponentToShow("view-details")
            setFormMode("edit")
            setRowsData(data?.rows);
            setOpen(true)
          }
          // navigate(data?.name, {
          //   state: data?.rows,
          // });
        },
        [navigate]
    );
    
    const SaveUpdateBTNs = useMemo(() => {
      if(displayMode) {
          return displayMode == "new"
          ? <Fragment>
              <Button
              sx={{ mr: 2, mb: 2 }}
              color="secondary"
              variant="contained"
              disabled={isNextLoading}
              onClick={() => {
                handleStepStatusctx({
                  status: "completed",
                  coltabvalue: state?.colTabValuectx,
                })
                handleColTabChangectx(state?.colTabValuectx + 1)
              }}
              >
              {t("Save & Next")}
              </Button>
          </Fragment>
          : displayMode == "edit"
              ? <Fragment>
                  <Button
                  sx={{ mr: 2, mb: 2 }}
                  color="secondary"
                  variant="contained"
                  disabled={isNextLoading}
                  onClick={() => {
                    handleStepStatusctx({
                      status: "completed",
                      coltabvalue: state?.colTabValuectx,
                    })
                    handleColTabChangectx(state?.colTabValuectx + 1)
                  }}
                  >
                  {t("Update & Next")}
                  </Button>
              </Fragment>
              : displayMode == "view" && <Fragment>
                  <Button
                  sx={{ mr: 2, mb: 2 }}
                  color="secondary"
                  variant="contained"
                  disabled={isNextLoading}
                  onClick={(e) => {
                    handleStepStatusctx({
                      status: "completed",
                      coltabvalue: state?.colTabValuectx,
                    })
                    handleColTabChangectx(state?.colTabValuectx + 1)
                  }}
                  >
                  {t("Next")}
                  </Button>
              </Fragment>
      }
    }, [displayMode])

    
    return (
      <Grid container style={{position:"absolute", paddingRight: !state?.isFreshEntryctx ? "113px" : "12px"}}>
            <GridWrapper
                key={`operatorMasterGrid` + data}
                finalMetaData={DocumentGridMetadata as GridMetaDataType}
                data={data ?? []}
                setData={setData}
                loading={isDocGridLoading}
                actions={actions}
                setAction={setCurrentAction}
                // refetchData={() => refetch()}
                ref={myGridRef}
                // onClickActionEvent= {(index, id, data) => {
                //   // console.log("qjwkdjbiqwudqd", index, id, data)

                //   // DELETE_BTN
                // }}
            />

            <Grid container item sx={{justifyContent: "flex-end"}}>
                <Button sx={{mr:2, mb:2}} color="secondary" variant="contained" disabled={isNextLoading}
                    onClick={(e) => {
                        // handleColTabChangectx(1)
                        handleColTabChangectx(state?.colTabValuectx-1)
                    }}
                >{t("Previous")}</Button>
                {SaveUpdateBTNs}
            </Grid>


            {open
              ? <KYCDocumentMasterDetails
                  isDataChangedRef={isDataChangedRef}
                  ClosedEventCall={handleDialogClose}
                  formMode={formMode}
                  afterFormSubmit={afterFormSubmit}
                  open={open}
                  onClose={() => setOpen(false)}
                  gridData={data}
                  rowsData={rowsData}
                />
              :null}
    </Grid>
    )
}

export default Document