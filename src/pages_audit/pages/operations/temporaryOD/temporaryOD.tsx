import React, { useContext, useEffect, useRef, useState } from "react";
import { temporaryODentryMetadata } from "./tempODentryMetadata";
import { MasterDetailsForm } from "components/formcomponent";
import { AppBar, Box, Button, Container, Grid, Tab, Tabs } from "@mui/material";
import { cloneDeep } from "lodash";
import { MasterDetailsMetaData } from "components/formcomponent/masterDetails/types";
import { LinearProgressBarSpacer } from "components/dataTable/linerProgressBarSpacer";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import { GridMetaDataType } from "components/dataTableStatic";
import { useMutation } from "react-query";
import * as API from "./api";
import { Alert } from "components/common/alert";
import { AuthContext } from "pages_audit/auth";
import { temporaryODGridMetaData } from "./temporaryGridMetaData";
import { usePopupContext } from "components/custom/popupContext";

export const TemporaryOD = () => {
  const myRef = useRef<any>(null);
  const [value, setValue] = useState("tab1");
  const { MessageBox } = usePopupContext();
  const [gridDetailData, setGridDetailData] = useState<any>([]);
  const [isVisible, setIsVisible] = useState<any>(false);
  const [closeAlert, setCloseAlert] = useState<any>(true);

  const temporaryODDetail: any = useMutation(
    "lienGridDetail",
    API.temporaryODdetails,
    {
      onSuccess: (data) => {
        setGridDetailData(data);
      },
      onError: (error: any) => {
        setCloseAlert(true);
      },
    }
  );

  const AddNewRow = async () => {
    myRef.current?.addNewRow(true);
  };

  // useEffect(() => {
  //   console.log("<<<myref", myRef.current);

  //   myRef.current?.setGridData((old) => {
  //     console.log("<<<old", old);
  //     if (!Array.isArray(old)) {
  //       return [
  //         {
  //           _isNewRow: true,
  //           ACTIVE: "Y",
  //         },
  //       ];
  //     }
  //     //   else {
  //     //     return [...old];
  //     //   }
  //   });
  //   // myRef.current?.addNewRow(true);
  // }, []);

  const onSubmitHandler = ({ data, displayData, endSubmit, setFieldError }) => {
    console.log("<<<onsub", data);
    //@ts-ignore
    endSubmit(true);
  };

  let metadata: MasterDetailsMetaData = {} as MasterDetailsMetaData;
  metadata = cloneDeep(temporaryODentryMetadata) as MasterDetailsMetaData;

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Tabs
          value={value}
          sx={{ ml: "25px" }}
          onChange={(event, newValue) => {
            setValue(newValue);
            setGridDetailData([]);
            setCloseAlert(false);
          }}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab value="tab1" label="Temporary-OD Entry" />
          {isVisible && <Tab value="tab2" label="Temporary-OD Detail" />}
        </Tabs>
      </Box>

      <Container>
        <Grid
          sx={{
            backgroundColor: "var(--theme-color2)",
            padding: "0px",
            borderRadius: "10px",
            boxShadow:
              "rgba(136, 165, 191, 0.48) 6px 2px 16px 0px, rgba(255, 255, 255, 0.8) -6px -2px 16px 0px;",
          }}
        >
          {temporaryODDetail?.isError && closeAlert ? (
            <div style={{ paddingRight: "10px", paddingLeft: "10px" }}>
              <AppBar position="relative" color="primary">
                <Alert
                  severity="error"
                  errorMsg={
                    temporaryODDetail?.error?.error_msg ?? "Unknow Error"
                  }
                  errorDetail={temporaryODDetail?.error?.error_detail ?? ""}
                  color="error"
                />
              </AppBar>
            </div>
          ) : (
            <LinearProgressBarSpacer />
          )}

          {value === "tab1" ? (
            <MasterDetailsForm
              key={"temporaryODentry"}
              metaData={metadata}
              initialData={{}}
              onSubmitData={onSubmitHandler}
              isNewRow={false}
              onClickActionEvent={(index, id, data) => {}}
              formState={{ MessageBox: MessageBox }}
              setDataOnFieldChange={(action, payload) => {
                if (action === "IS_VISIBLE") {
                  setIsVisible(payload.IS_VISIBLE);
                }
              }}
              ref={myRef}
              formStyle={{
                background: "white",
                height: "30vh",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              {({ isSubmitting, handleSubmit }) => {
                return (
                  <>
                    <Button
                      onClick={AddNewRow}
                      // disabled={isSubmitting}
                      //endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                      color={"primary"}
                    >
                      Add New Document
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      // disabled={isSubmitting}
                      // endIcon={
                      //   isSubmitting ? <CircularProgress size={20} /> : null
                      // }
                      color={"primary"}
                    >
                      Save
                    </Button>
                  </>
                );
              }}
            </MasterDetailsForm>
          ) : value === "tab2" ? (
            <>
              <GridWrapper
                key={`temporary-Grid-data`}
                finalMetaData={temporaryODGridMetaData as GridMetaDataType}
                data={gridDetailData ?? []}
                setData={() => {}}
                loading={temporaryODDetail.isLoading}
                // actions={actions}
                // setAction={setCurrentAction}
                // refetchData={() => {}}
                // ref={myGridQuickRef}
              />
            </>
          ) : null}
        </Grid>
      </Container>
    </>
  );
};
