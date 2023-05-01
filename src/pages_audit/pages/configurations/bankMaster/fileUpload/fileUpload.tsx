import { ActionTypes, GridMetaDataType } from "components/dataTable";
import { FileUploadControl } from "components/fileUpload";
import { ConvertExcelToJSONData } from "components/utils";
import { useContext, useState } from "react";
import { BankMasterGridUpdate } from "../bankMasterEdit";
import { BankMasterUploadMetadata } from "./fileUploadMetadata";
import { BankMasterUpdateViewMetaData } from "../gridMetadata";
import { useMutation } from "react-query";
import * as API from "../api";
import { useSnackbar } from "notistack";
import { Alert } from "components/common/alert";
import { LoadingTextAnimation } from "components/common/loader";
import { AuthContext } from "pages_audit/auth";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const actions: ActionTypes[] = [
  {
    actionName: "upload",
    actionLabel: "Upload",
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
interface updateBankMasterDataType {
  data: object;
  displayData?: object;
  endSubmit?: any;
  setFieldError?: any;
}
const updateBankMasterDataWrapperFn =
  (updateMasterData) =>
  async ({ data }: updateBankMasterDataType) => {
    return updateMasterData(data);
  };
export const UploadFileData = ({
  CloseFileUpload,
  data: rowData,
  isDataChangedRef,
}) => {
  const [isFileUploadopen, setFileUpload] = useState(true);
  const [FileData, setFileData] = useState<{ view: any; update: any }>({
    view: [],
    update: {},
  });
  const [openAccept, setOpenAccept] = useState(false);
  const { authState } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const getJsonData = (other, dataJSON, proccessFunc, endIndex) => {
    if (Boolean(other?.ALL)) {
      let insertRow = dataJSON.filter((item) => {
        let filterData = rowData.filter((itemdata) => {
          if (item?.ROUTING_NO === itemdata?.ROUTING_NO) {
            return true;
          } else {
            return false;
          }
        });
        if (filterData.length === 0) {
          return true;
        }
        return false;
      });
      proccessFunc(endIndex - 10);
      let updateRow = dataJSON.filter((item) => {
        let filterData = rowData.filter((itemdata) => {
          if (
            item?.ROUTING_NO === itemdata?.ROUTING_NO &&
            item?.BRANCH_NM !== itemdata?.BRANCH_NM
          ) {
            return true;
          } else {
            return false;
          }
        });
        if (filterData.length > 0) {
          return true;
        }
        return false;
      });
      proccessFunc(endIndex);
      return { TYPE: "ALL", insertRow: insertRow, updateRow: updateRow };
    } else if (Boolean(other?.NPSB_ENABLED)) {
      let NpsbData = dataJSON.map((item) => {
        let filterData = rowData.filter((itemdata) => {
          if (item?.ROUTING_NO === itemdata?.ROUTING_NO) {
            return true;
          } else {
            return false;
          }
        });
        if (filterData.length > 0) {
          return filterData[0];
        }
        return item;
      });
      proccessFunc(endIndex);
      return { TYPE: "NPSB", DATA: NpsbData };
    } else if (Boolean(other?.RTGS_ENABLED)) {
      let RTGSData = dataJSON.map((item) => {
        let filterData = rowData.filter((itemdata) => {
          if (item?.ROUTING_NO === itemdata?.ROUTING_NO) {
            return true;
          } else {
            return false;
          }
        });
        if (filterData.length > 0) {
          return filterData[0];
        }
        return item;
      });
      proccessFunc(endIndex);
      return { TYPE: "RTGS", DATA: RTGSData };
    } else if (Boolean(other?.BEFTN_ENABLED)) {
      let BEFTNData = dataJSON.map((item) => {
        let filterData = rowData.filter((itemdata) => {
          if (item?.ROUTING_NO === itemdata?.ROUTING_NO) {
            return true;
          } else {
            return false;
          }
        });
        if (filterData.length > 0) {
          return filterData[0];
        }
        return item;
      });
      proccessFunc(endIndex);
      return { TYPE: "BEFTN", DATA: BEFTNData };
    }
    return {};
  };

  const processData = async (base64Object, proccessFunc) => {
    proccessFunc(20);
    let mainJSONArr: any = {
      insertRow: [],
      updateRow: [],
      RTGS: [],
      NPSB: [],
      BEFTN: [],
    };
    let insertedJSON = {};
    let proccessLength =
      80 / (base64Object.length > 0 ? base64Object.length : 1);
    base64Object.forEach((element, index) => {
      let jsonData = ConvertExcelToJSONData({
        data: element,
      });
      // console.log(jsonData);
      let { blob, ...other } = element;
      let data: any = getJsonData(
        other,
        jsonData,
        proccessFunc,
        10 + proccessLength * (index + 1)
      );
      //console.log(data);
      if (data?.TYPE === "ALL") {
        mainJSONArr = {
          ...mainJSONArr,
          insertRow: [...(mainJSONArr?.insertRow ?? []), ...data.insertRow],
          updateRow: [...(mainJSONArr?.updateRow ?? []), ...data.updateRow],
        };
      } else if (data?.TYPE === "NPSB") {
        mainJSONArr = {
          ...mainJSONArr,
          NPSB: [...(mainJSONArr?.NPSB ?? []), ...data.DATA],
        };
      } else if (data?.TYPE === "RTGS") {
        mainJSONArr = {
          ...mainJSONArr,
          RTGS: [...(mainJSONArr?.RTGS ?? []), ...data.DATA],
        };
      } else if (data?.TYPE === "BEFTN") {
        mainJSONArr = {
          ...mainJSONArr,
          BEFTN: [...(mainJSONArr?.BEFTN ?? []), ...data.DATA],
        };
      }
    });
    SetGridData(mainJSONArr, proccessFunc);
  };

  const SetGridData = (mainJson, proccessFunc) => {
    let orgData: any = [];
    let index = 0;
    mainJson.insertRow = mainJson.insertRow.map((item) => {
      orgData.push({
        ...item,
        __ROWID: index++,
        __ROWTYPE: "INSERT",
        NPSB_ENABLED_LABEL: item.NPSB_ENABLED === "Y" ? "YES" : "NO",
        BEFTN_ENABLED_LABEL: item.BEFTN_ENABLED === "Y" ? "YES" : "NO",
        RTGS_ENABLED_LABEL: item.RTGS_ENABLED === "Y" ? "YES" : "NO",
        NPSB_BANK_CD: Boolean(item?.NPSB_BANK_CD)
          ? item?.NPSB_BANK_CD
          : "000" + item?.BANK_CD ?? "",
      });

      return {
        ...item,
        NPSB_BANK_CD: Boolean(item?.NPSB_BANK_CD)
          ? item?.NPSB_BANK_CD
          : "000" + item?.BANK_CD ?? "",
      };
    });
    mainJson.updateRow = mainJson.updateRow.map((item) => {
      orgData.push({
        ...item,
        __ROWID: index++,
        __ROWTYPE: "UPDATE",
        NPSB_ENABLED_LABEL: item.NPSB_ENABLED === "Y" ? "YES" : "NO",
        BEFTN_ENABLED_LABEL: item.BEFTN_ENABLED === "Y" ? "YES" : "NO",
        RTGS_ENABLED_LABEL: item.RTGS_ENABLED === "Y" ? "YES" : "NO",
        NPSB_BANK_CD: Boolean(item?.NPSB_BANK_CD)
          ? item?.NPSB_BANK_CD
          : "000" + item?.BANK_CD ?? "",
      });

      return {
        ...item,
        NPSB_BANK_CD: Boolean(item?.NPSB_BANK_CD)
          ? item?.NPSB_BANK_CD
          : "000" + item?.BANK_CD ?? "",
      };
    });
    mainJson.NPSB = mainJson.NPSB.map((item) => {
      orgData.push({
        ...item,
        __ROWID: index++,
        __ROWTYPE: "NPSB",
        NPSB_ENABLED_LABEL: "YES",
        BEFTN_ENABLED_LABEL: "",
        RTGS_ENABLED_LABEL: "",
        NPSB_BANK_CD: Boolean(item?.NPSB_BANK_CD)
          ? item?.NPSB_BANK_CD
          : "000" + item?.BANK_CD ?? "",
      });
      return {
        ...item,
        NPSB_BANK_CD: Boolean(item?.NPSB_BANK_CD)
          ? item?.NPSB_BANK_CD
          : "000" + item?.BANK_CD ?? "",
      };
    });
    mainJson.RTGS = mainJson.RTGS.map((item) => {
      orgData.push({
        ...item,
        __ROWID: index++,
        __ROWTYPE: "RTGS",
        NPSB_ENABLED_LABEL: "",
        BEFTN_ENABLED_LABEL: "",
        RTGS_ENABLED_LABEL: "YES",
        NPSB_BANK_CD: Boolean(item?.NPSB_BANK_CD)
          ? item?.NPSB_BANK_CD
          : "000" + item?.BANK_CD ?? "",
      });
      return {
        ...item,
        NPSB_BANK_CD: Boolean(item?.NPSB_BANK_CD)
          ? item?.NPSB_BANK_CD
          : "000" + item?.BANK_CD ?? "",
      };
    });
    mainJson.BEFTN = mainJson.BEFTN.map((item) => {
      orgData.push({
        ...item,
        __ROWID: index++,
        __ROWTYPE: "BEFTN",
        NPSB_ENABLED_LABEL: "",
        BEFTN_ENABLED_LABEL: "YES",
        RTGS_ENABLED_LABEL: "",
        NPSB_BANK_CD: Boolean(item?.NPSB_BANK_CD)
          ? item?.NPSB_BANK_CD
          : "000" + item?.BANK_CD ?? "",
      });
      return {
        ...item,
        NPSB_BANK_CD: Boolean(item?.NPSB_BANK_CD)
          ? item?.NPSB_BANK_CD
          : "000" + item?.BANK_CD ?? "",
      };
    });
    //console.log(orgData, mainJson);
    proccessFunc(99);
    setFileData({
      view: orgData,
      update: { ...mainJson, COMP_CD: authState.companyID },
    });
    setTimeout(() => {
      setFileUpload(false);
    }, 1000);
    //console.log(mainJson);
  };
  return (
    <div>
      {isFileUploadopen ? (
        <Dialog fullWidth maxWidth="md" open={isFileUploadopen}>
          <FileUploadControl
            key={"BankMasterFileUploadData"}
            onClose={() => {
              CloseFileUpload();
            }}
            additionalColumns={BankMasterUploadMetadata}
            editableFileName={false}
            //dataChangedRef={isDataChangedRef}
            defaultFileData={[]}
            onUpload={(
              formDataObj,
              proccessFunc,
              ResultFunc,
              base64Object,
              result
            ) => {
              if (base64Object.length > 0) {
                proccessFunc(10);
                setTimeout(async () => {
                  try {
                    processData(base64Object, proccessFunc);
                  } catch (error) {
                    ResultFunc({
                      status: "failed",
                      data: {
                        error_msg: "Error in file read " + String(error),
                      },
                    });
                  }
                }, 1000);
              } else {
                ResultFunc({
                  status: "failed",
                  data: { error_msg: "Error in file read" },
                });
              }
              // isFileRef.current = { formDataObj, base64Object, result };
              // CloseFileUpload();
              // if (lastClickRef.current && Array.isArray(base64Object)) {
              //   setIsOpenAccept(true);
              // }
            }}
            gridProps={{}}
            maxAllowedSize={1024 * 1204 * 10} //10Mb file
            allowedExtensions={["xlsx", "csv"]}
            onUpdateFileData={(files) => {}}
          />
        </Dialog>
      ) : (
        <Dialog fullWidth maxWidth="lg" open={!isFileUploadopen}>
          <div style={{ padding: "10px" }}>
            <BankMasterGridUpdate
              key={"BankMasteredit"}
              metadata={BankMasterUpdateViewMetaData as GridMetaDataType}
              ClosedEventCall={() => {
                setFileUpload(true);
              }}
              data={FileData.view}
              isEditableForm={true}
              mode={"edit"}
              actions={actions}
              setCurrentAction={(data) => {
                if (data?.name === "close") {
                  setFileUpload(true);
                  setFileData({ view: [], update: {} });
                } else if (data?.name === "upload") {
                  if (
                    FileData.update?.insertRow?.length === 0 &&
                    FileData.update?.updateRow?.length === 0 &&
                    FileData.update?.NPSB?.length === 0 &&
                    FileData.update?.RTGS?.length === 0 &&
                    FileData.update?.BEFTN?.length === 0
                  ) {
                    enqueueSnackbar("No rows found for update", {
                      variant: "warning",
                    });
                  } else {
                    setOpenAccept(true);
                  }
                }
              }}
            >
              {(props) => {
                return <></>;
              }}
            </BankMasterGridUpdate>
            {openAccept ? (
              <UploadFileSubmitConfirmation
                isOpen={openAccept}
                uploadData={FileData.update}
                CloseFileUpload={CloseFileUpload}
                ClosePopup={() => {
                  setOpenAccept(false);
                }}
                isDataChangedRef={isDataChangedRef}
              />
            ) : null}
          </div>
        </Dialog>
      )}
    </div>
  );
};

const UploadFileSubmitConfirmation = ({
  isOpen,
  uploadData,
  CloseFileUpload,
  ClosePopup,
  isDataChangedRef,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const mutation = useMutation(
    updateBankMasterDataWrapperFn(API.uploadBankMastersDataFile),
    {
      onError: (error: any) => {},
      onSuccess: (data) => {
        enqueueSnackbar(data, {
          variant: "success",
        });
        isDataChangedRef.current = true;
        if (typeof CloseFileUpload === "function") {
          CloseFileUpload();
        }
      },
    }
  );
  return (
    <Dialog open={isOpen} maxWidth="sm">
      <DialogTitle>Do you want to Update Bank Master Data?</DialogTitle>
      <DialogContent>
        {mutation.isLoading ? (
          //   "Deleting..."
          <LoadingTextAnimation key={"loaderforUpdating"} text="Updating..." />
        ) : mutation.isError ? (
          <Alert
            severity="error"
            // I suspect this, mutation.error?.error_msg is misspelt. Try errorMessage
            errorMsg={mutation.error?.error_msg ?? "Unknown Error occured"}
            errorDetail={mutation.error?.error_detail ?? ""}
          />
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={ClosePopup}
          color="secondary"
          disabled={mutation.isLoading}
        >
          No
        </Button>
        <Button
          onClick={() => {
            mutation.mutate({ data: uploadData });
          }}
          color="secondary"
          disabled={mutation.isLoading}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};
