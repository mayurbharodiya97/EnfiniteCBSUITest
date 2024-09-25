import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import { t } from "i18next";
import { IconButton } from "@mui/material";

//logic
import { Fragment, useCallback, useRef, useState, useContext } from "react";
import { useQuery } from "react-query";
// import GridWrapper from "components/dataTableStatic";
import { useSnackbar } from "notistack";
import { AccDetailContext } from "pages_audit/auth";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import * as API from "./api";
import { JointDetailGridMetaData } from "./gridMetadata";
import { GuarantorjointFormMetaData } from "./metaData/GuarantorjointFormMetaData";
import { GuardianjointFormMetadata } from "./metaData/GuardianjointFormMetadata";
import { IntroductorjointFormMetadata } from "./metaData/IntroductorjointFormMetadata";
import { JointDetailFormMetaData } from "./metaData/JointDetailFormMetaData";
import { MortgagejointFormMetaData } from "./metaData/MortgagejointFormMetaData";
import { NomineejointFormMetaData } from "./metaData/NomineejointFormMetaData";
import { SignatoryjointFormMetadata } from "./metaData/SignatoryjointFormMetadata";

import {
  Alert,
  GridWrapper,
  GridMetaDataType,
  ActionTypes,
  FormWrapper,
  MetaDataType,
  GradientButton,
} from "@acuteinfo/common-base";
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
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0); // Index for navigation
  const navigate = useNavigate();

  // Close the dialog
  const handleClose = () => setOpen(false);

  // Fetch joint details from API
  const { data, isLoading, isFetching, refetch, error, isError } = useQuery<
    any,
    any
  >(
    ["getJointDetailsList", { reqData }],
    () => API.getJointDetailsList(reqData),
    {
      onSuccess(data) {},
      onError(err) {
        enqueueSnackbar(err?.error_msg || "Error fetching joint details", {
          variant: "error",
        });
      },
    }
  );

  // Handle the Next/Previous button clicks and index changes
  const changeIndex = (direction) => {
    setCurrentIndex((prevIndex) => {
      const nextIndex =
        direction === "next"
          ? (prevIndex + 1) % data?.length // Loop back to the first if at the end
          : (prevIndex - 1 + data?.length) % data?.length; // Loop back to the last if at the start
      return nextIndex;
    });
  };

  // Action handler for grid
  const setCurrentAction = useCallback((data) => {
    if (data?.name === "close") {
      navigate(-1);
    } else {
      const index = data?.rows?.[0]?.data?.index;
      if (index !== undefined) {
        setCurrentIndex(index);
        setOpen(true); // Open dialog after setting the currentIndex
      }
    }
  }, []);

  // Dynamically set the form label using account details
  const metaData = useMemo(() => {
    switch (data?.[currentIndex]?.J_TYPE) {
      case "J":
        return JointDetailFormMetaData;
      case "N":
        return NomineejointFormMetaData;
      case "G":
        return GuarantorjointFormMetaData;
      case "M":
        return MortgagejointFormMetaData;
      case "U":
        return GuardianjointFormMetadata;
      case "S":
        return SignatoryjointFormMetadata;
      case "I":
        return IntroductorjointFormMetadata;
      default:
        return JointDetailFormMetaData;
    }
  }, [data, currentIndex]);

  if (metaData?.form) {
    // @ts-ignore
    metaData.form.label = `Joint Full view For Account :
          ${reqData?.COMP_CD?.trim()}${reqData?.BRANCH_CD?.trim()}${reqData?.ACCT_TYPE?.trim()}${reqData?.ACCT_CD?.trim()} - ${reqData?.ACCT_NM?.trim()}
           \u00A0 Row ${currentIndex + 1} of ${data?.length}`;
  } else {
    return null;
  }

  return (
    <>
      <div>
        {isError && (
          <Fragment>
            <div style={{ width: "100%", paddingTop: "10px" }}>
              <Alert
                severity={error?.severity ?? "error"}
                errorMsg={error?.error_msg ?? "Error"}
                errorDetail={error?.error_detail ?? ""}
              />
            </div>
          </Fragment>
        )}
        <GridWrapper
          key={`JointDetailGridMetaData`}
          finalMetaData={JointDetailGridMetaData as GridMetaDataType}
          data={data ?? []}
          setData={() => null}
          actions={reqData?.BTN_FLAG === "Y" ? actions2 : actions}
          setAction={setCurrentAction}
          ref={myGridRef}
          refetchData={() => refetch()}
          loading={isLoading || isFetching}
        />
      </div>

      {open ? (
        <Dialog
          open={open}
          // @ts-ignore
          TransitionComponent={Transition}
          PaperProps={{
            style: {
              width: "100%",
              overflow: "auto",
            },
          }}
          maxWidth="lg"
          scroll="body"
          // aria-labelledby="alert-dialog-title"
          // aria-describedby="alert-dialog-description"
        >
          <FormWrapper
            key={`JointDetailDisplayForm_${currentIndex}_${metaData?.form?.label}`}
            metaData={metaData as MetaDataType}
            initialValues={{ ...(data?.[currentIndex] ?? {}) }}
            displayMode={"view"}
            onSubmitHandler={() => {}}
          >
            {({ isSubmitting, handleSubmit }) => (
              <>
                <GradientButton
                  startIcon={<ArrowBackIosNewIcon />}
                  disabled={1 === currentIndex + 1}
                  onClick={() => changeIndex("previous")}
                  color={"primary"}
                >
                  {t("Prev")}
                </GradientButton>
                <GradientButton
                  endIcon={<ArrowForwardIosIcon />}
                  disabled={currentIndex + 1 === data.length}
                  onClick={() => changeIndex("next")}
                  color={"primary"}
                >
                  {t("Next")}
                </GradientButton>
                <GradientButton onClick={handleClose} color={"primary"}>
                  <CloseIcon />
                </GradientButton>
              </>
            )}
          </FormWrapper>
        </Dialog>
      ) : null}
    </>
  );
};
