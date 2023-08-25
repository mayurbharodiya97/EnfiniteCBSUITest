import React, { Fragment, useCallback, useEffect, useRef } from "react";
import { Button, Dialog } from "@mui/material";
import { MasterDetailsForm } from "components/formcomponent";
import { useDialogStyles } from "pages_audit/common/dialogStyles";
import { cloneDeep } from "lodash";
import { documentMasterDetailsMetaData } from "./metadata/documentMasterDetailsMetaData";
import KYCDocumentMasterDetails from "./KYCDocumentMasterDetails";
import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import { Route, Routes, useNavigate } from "react-router-dom";
import { KycDocumentMetadata } from "./metadata/KycDocumentMetadata";
import EditDoc from "./EditDoc";




const KYCDocument = ({data:gridData, isLoading}) => {
    const classes = useDialogStyles();
    const myRef = useRef<any>(null);
    const navigate = useNavigate();

    const isDataChangedRef = useRef(false);
    const handleDialogClose = () => {
        if (isDataChangedRef.current === true) {
        // isDataChangedRef.current = true;
        // refetch();
        isDataChangedRef.current = false;
        }
        navigate(".");
    };    


    let metadataold = {};
    metadataold = cloneDeep(
      documentMasterDetailsMetaData
    );

    const data = [
        {
            id: "1",
            DOCUMENT: "wef",
            // SUBMIT: "",
            DOCUMENT_NO :"123",
            VALID_TILL_DATE: "12/12/2023",
            ENTERED_DATE: "12-12-2023"
        },
        {
            id: "2",
            DOCUMENT: "fewf",
            // SUBMIT: "",
            DOCUMENT_NO :"456",
            // VALID_TILL_DATE: "",
            // ENTERED_DATE: ""
        },
      ]

      const actions = [
        {
          actionName: "view-details",
          actionLabel: "Edit Detail",
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
            console.log("wefwedfwef", data)
          navigate(data?.name, {
            state: data?.rows,
          });
        },
        [navigate]
    );
  
    return (
        <Fragment>
            <GridWrapper
                key={`operatorMasterGrid`}
                finalMetaData={KycDocumentMetadata as GridMetaDataType}
                data={gridData ?? []}
                setData={() => null}
                loading={isLoading}
                actions={actions}
                setAction={setCurrentAction}
                // refetchData={() => refetch()}
                // ref={myGridRef}
            />
        {/* <KYCDocumentMasterDetails /> */}

            <Routes>
                <Route
                path="add"
                element={
                    <KYCDocumentMasterDetails
                        isDataChangedRef={isDataChangedRef}
                        ClosedEventCall={handleDialogClose}
                        defaultmode={"new"}
                    />
                }
                />
                <Route
                path="view-details"
                element={
                    <KYCDocumentMasterDetails
                    isDataChangedRef={isDataChangedRef}
                    ClosedEventCall={handleDialogClose}
                    defaultmode={"edit"}
                />
                }
                />
                {/* <Route
                path="delete"
                element={
                    <DeleteOperatorMaster
                    isDataChangedRef={isDataChangedRef}
                    closeDialog={handleDialogClose}
                    isOpen={true}
                    />
                }
                /> */}
            </Routes>
        </Fragment>
    )
}

export default KYCDocument;