import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";

import * as API from "./api";
import { queryClient } from "cache";
import {
  AppBar,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  Grid,
  Toolbar,
  Typography,
} from "@mui/material";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { Box } from "@mui/system";
import { List } from "reactstrap";
import { ListItemData } from "components/dashboard/messageBox/messageBox";
import { GradientButton } from "components/styledComponent/button";
import { langWiseMsgMetaData } from "./metaData";
import { useNavigate } from "react-router-dom";
import {
  PopupMessageAPIWrapper,
  PopupRequestWrapper,
} from "components/custom/popupMessage";
import { MasterDetailsForm } from "components/formcomponent";
import { enqueueSnackbar } from "notistack";

interface editMasterDataType {
  data: object;
  displayData?: object;
  endSubmit?: any;
  setFieldError?: any;
  SetLoadingOWN?: any;
}
const editMasterFormDataFnWrapper =
  (editMasterData) =>
  async ({ data }: editMasterDataType) => {
    return editMasterData(data);
  };
export const CommunMSTConfig = () => {
  //  const actionClasses = useStyles();
  const [open, setOpen] = useState(true);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [isOpenSave, setIsOpenSave] = useState<any>(false);
  const [openAccept, setopenAccept] = useState(false);
  const navigate = useNavigate();
  const myRef = useRef<any>(null);
  const isErrorFuncRef = useRef<any>(null);

  const { data, isLoading, isFetching } = useQuery(["getMiscListData"], () =>
    API.getMiscListData()
  );
  const miscGridData: any = useMutation(API.getProMiscData, {
    onSuccess: (data) => {},
    onError: (error: any) => {},
  });

  const mutation = useMutation(
    editMasterFormDataFnWrapper(API.editMiscMSTconfig()),
    {
      onError: (error: any) => {
        let errorMsg = "Unknown Error occured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        if (isErrorFuncRef.current == null) {
          enqueueSnackbar(errorMsg, {
            variant: "error",
          });
        } else {
          isErrorFuncRef.current?.endSubmit(
            false,
            errorMsg,
            error?.error_detail ?? ""
          );
        }
        onActionCancel();
      },
      onSuccess: (data) => {
        enqueueSnackbar(data, {
          variant: "success",
        });
        onActionCancel();
        miscGridData.mutate({ categoryCD: selectedRows?.[0] });
      },
    }
  );
  const onPopupYesAccept = (rows) => {
    mutation.mutate({
      data: { ...rows, CATEGORY_CD: selectedRows?.[0] },
    });
  };

  const onSubmitHandler = ({ data, displayData, endSubmit, setFieldError }) => {
    //@ts-ignore
    endSubmit(true);
    isErrorFuncRef.current = { data, displayData, endSubmit, setFieldError };
    setopenAccept(true);
  };

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getMiscListData"]);
      queryClient.removeQueries(["getProMiscData"]);
    };
  }, []);

  const handleRowClick = (event: any, name: string) => {
    if (event.ctrlKey) {
      setSelectedRows([...selectedRows, name]);
    } else {
      setSelectedRows([name]);
    }
  };
  const AddNewRow = () => {
    myRef.current?.addNewRow(true);
  };
  const onClickButton = (rows, buttonName) => {
    setIsOpenSave(false);
  };
  const onActionCancel = () => {
    setopenAccept(false);
  };
  return (
    <>
      <Dialog
        open={open}
        //@ts-ignore
        PaperProps={{
          style: {
            width: "100%",
            // minHeight: "36vh",
            // height: "36vh",
          },
        }}
        maxWidth="sm"
        classes={
          {
            // scrollPaper: classes.topScrollPaper,
            // paperScrollBody: classes.topPaperScrollBody,
          }
        }
      >
        <AppBar
          position="relative"
          color="secondary"
          style={{ marginBottom: "5px" }}
        >
          <Toolbar variant={"dense"}>
            <Typography
              // className={headerClasses.title}
              color="inherit"
              variant={"h6"}
              component="div"
            >
              Misc Master Configuration
            </Typography>
          </Toolbar>
        </AppBar>
        <>
          {isLoading || isFetching ? (
            <LoaderPaperComponent />
          ) : (
            <Grid item xs={12} sm={12} md={12} style={{ padding: "10px" }}>
              <Box
                sx={{
                  width: "100%",
                  // maxWidth: 400,
                  bgcolor: "background.paper",
                  height: "35vh",
                  overflow: "scroll",
                  border: "ridge",
                  borderRadius: "3",
                }}
              >
                <nav aria-label="main mailbox folders">
                  <List style={{ paddingTop: "0px", paddingBottom: "0px" }}>
                    {data?.map((item) => (
                      <ListItemData
                        key={item?.value}
                        name={item?.label}
                        disabled={false}
                        selected={selectedRows.includes(item?.value)}
                        onClick={(event) => handleRowClick(event, item?.value)}
                      />
                    ))}
                  </List>
                </nav>
              </Box>
            </Grid>
          )}
          {isOpenSave ? (
            <PopupRequestWrapper
              MessageTitle="Data Validation"
              Message="Please Select One Row"
              onClickButton={(rows, buttonName) =>
                onClickButton(rows, buttonName)
              }
              buttonNames={["Ok"]}
              rows={[]}
              open={isOpenSave}
            />
          ) : null}
        </>
        <DialogActions
          // className={actionClasses.verifybutton}
          style={{ marginTop: "2px", marginBottom: "2px" }}
        >
          <>
            <GradientButton
              onClick={(e) => {
                if (selectedRows.length === 0) {
                  setIsOpenSave(true);
                } else {
                  miscGridData.mutate({
                    categoryCD: selectedRows?.[0],
                  });
                  setOpen(false);
                }
              }}
            >
              Ok
            </GradientButton>

            <GradientButton
              // disabled={result.isLoading || isLocalLoding}
              onClick={() => {
                setOpen(false);
                navigate("/cbsenfinity/configuration/");
              }}
            >
              Cancel
            </GradientButton>
          </>
        </DialogActions>
      </Dialog>

      {miscGridData.isLoading || miscGridData.isFetching ? (
        <LoaderPaperComponent />
      ) : (
        <>
          <MasterDetailsForm
            key={"leavesMaster"}
            metaData={langWiseMsgMetaData}
            ref={myRef}
            initialData={{
              _isNewRow: false,
              // ...reqData[0].data,
              DETAILS_DATA: miscGridData?.data,
            }}
            // displayMode={formMode}
            isLoading={false}
            onSubmitData={onSubmitHandler}
            // isNewRow={true}
            // isNewRow={formMode === "new"}
            formStyle={{
              background: "white",
              // height: "20vh",
              overflowY: "auto",
              overflowX: "hidden",
            }}
            containerstyle={{ padding: "10px" }}
          >
            {({ isSubmitting, handleSubmit }) => {
              return (
                <>
                  <Button
                    onClick={() => setOpen(true)}
                    disabled={isSubmitting}
                    color={"primary"}
                  >
                    Retrieve
                  </Button>
                  <Button
                    onClick={AddNewRow}
                    disabled={isSubmitting}
                    color={"primary"}
                  >
                    Add Row
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    endIcon={
                      isSubmitting ? <CircularProgress size={20} /> : null
                    }
                    color={"primary"}
                  >
                    Save
                  </Button>
                </>
              );
            }}
          </MasterDetailsForm>
          {openAccept ? (
            <PopupMessageAPIWrapper
              MessageTitle="Confirmation"
              Message="Do you want to save this Request?"
              onActionYes={(rowVal) => onPopupYesAccept(rowVal)}
              onActionNo={() => onActionCancel()}
              rows={isErrorFuncRef.current?.data}
              open={openAccept}
              loading={mutation.isLoading}
            />
          ) : null}
        </>
      )}
    </>
  );
};
