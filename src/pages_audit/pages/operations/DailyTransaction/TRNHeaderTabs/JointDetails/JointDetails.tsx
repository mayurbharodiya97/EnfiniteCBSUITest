//UI
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";

//logic
import { Fragment, useCallback, useRef, useState, useContext } from "react";
import { useQuery } from "react-query";
import { JointDetailGridMetaData } from "./gridMetadata";
// import GridWrapper from "components/dataTableStatic";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import { Alert } from "components/common/alert";
import { ActionTypes } from "components/dataTable/types";
import { GridMetaDataType } from "components/dataTableStatic/types";
import * as API from "./api";
import { AccDetailContext } from "pages_audit/auth";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

export const JointDetails = ({ reqData }) => {
  const actions: ActionTypes[] = [
    {
      actionName: "scroll",
      actionLabel: "Scroll",
      multiple: false,
      rowDoubleClick: true,
      actionTextColor: "var(--theme-color3)",
      alwaysAvailable: false,
      actionBackground: "inherit",
    },
  ];
  const actions2: ActionTypes[] = [
    {
      actionName: "close",
      actionLabel: "Close",
      multiple: false,
      rowDoubleClick: false,
      alwaysAvailable: true,
    },
  ];

  const { enqueueSnackbar } = useSnackbar();
  const myGridRef = useRef<any>(null);
  const { tempStore } = useContext(AccDetailContext);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();

  // //api define

  // const getJointDetails = useMutation(API.getJointDetailsList, {
  //   onSuccess: (data) => {
  //     console.log(data, " joint detailssss");
  //     setRows(data);
  //   },
  //   onError: (error: any) => {
  //     enqueueSnackbar(error?.error_msg, {
  //       variant: "error",
  //     });
  //   },
  // });

  // useEffect(() => {
  //   tempStore?.accInfo?.ACCT_CD && getJointDetails.mutate(tempStore.accInfo);
  // }, [tempStore]);

  const { data, isLoading, isFetching, refetch, error, isError } = useQuery<
    any,
    any
  >(["getJointDetailsList", { reqData }], () =>
    API.getJointDetailsList(reqData)
  );

  const setCurrentAction = useCallback((data) => {
    if (data?.name === "close") {
      navigate(-1);
    } else {
      setOpen(true);
    }
  }, []);

  return (
    <>
      <div>
        {isError ? (
          <Fragment>
            <div style={{ width: "100%", paddingTop: "10px" }}>
              <Alert
                severity={error?.severity ?? "error"}
                errorMsg={error?.error_msg ?? "Error"}
                errorDetail={error?.error_detail ?? ""}
              />
            </div>
          </Fragment>
        ) : null}
        <GridWrapper
          key={`JointDetailGridMetaData`}
          finalMetaData={JointDetailGridMetaData as GridMetaDataType}
          data={data ?? []}
          setData={() => null}
          actions={reqData?.BTN_FLAG === "Y" ? actions2 : actions}
          setAction={setCurrentAction}
          // refetchData={() => {}}
          ref={myGridRef}
          loading={isLoading || isFetching}
        />
      </div>

      <Dialog
        PaperProps={{
          style: {
            width: "100%",
            minHeight: "46vh",
          },
        }}
        open={open}
        maxWidth="md"
        scroll="body"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Joint Full View for: Test Customer
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <div
            style={{
              boxShadow: "0px 1px 4px -1px #999999",
              borderRadius: "5px",
              margin: "10px",
              padding: "10px",
            }}
          >
            in progress
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
