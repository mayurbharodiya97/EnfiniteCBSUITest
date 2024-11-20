import {
  Fragment,
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { editloginShift, loginShift } from "./metaData/metaDataForm";
import { SecurityContext } from "../context/SecuityForm";
import { AuthContext } from "pages_audit/auth";
import { useQuery } from "react-query";
import * as API from "./api/api";
import { LinearProgress } from "@mui/material";
import {
  LoaderPaperComponent,
  usePopupContext,
  GradientButton,
  SubmitFnType,
  extractMetaData,
  utilFunction,
  FormWrapper,
  MetaDataType,
  Alert,
} from "@acuteinfo/common-base";
import { t } from "i18next";

const LoginShift = forwardRef<any, any>(
  ({ defaultView, username, userId }, ref) => {
    const { MessageBox } = usePopupContext();
    const Usernames = username?.USER_NAME;
    const { authState } = useContext(AuthContext);
    const { userState, setActiveStep, dispatchCommon } =
      useContext(SecurityContext);
    const Username = userState.formData?.USER_NAME;
    const {
      data: APIData,
      isLoading,
      isFetching,
      isError,
      error,
      refetch,
    } = useQuery<any, any>(["getLoginShiftAccess", Username], () => {
      if (defaultView === "edit") {
        return API.getLoginShiftAccess({
          userid: Usernames,
          comp_cd: authState?.companyID,
        });
      }
    });
    const onSubmitHandler: SubmitFnType = (
      data: any,
      displayData,
      endSubmit,
      setFieldError,
      actionFlag
    ) => {
      endSubmit(true);
      if (defaultView === "new") {
        if (Array.isArray(data?.LOGINSHIFT)) {
          const multipleData = data.LOGINSHIFT.map((item) => ({
            USER_NAME: Username,
            COMP_CD: authState?.companyID,
            SHIFT_TRAN_CD: item?.SHIFT_TRAN_CD,
            START_TIME: item?.START_TIME,
            END_TIME: item?.END_TIME,
            ACTIVE: item?.ACTIVE,
          }));
          const updatedData = {
            DETAILS_DATA: {
              isNewRow: multipleData,
              isUpdateRow: [],
              isDeleteRow: [],
            },
          };
          dispatchCommon("commonType", {
            grid4: updatedData,
          });
        }
        setActiveStep(userState.activeStep + 1);
      } else if (defaultView === "edit") {
        const newData = Array.isArray(data?.EDITLOGINSHIFT)
          ? data.EDITLOGINSHIFT.map((item) => ({
              USER_NAME: Usernames,
              COMP_CD: authState?.companyID,
              SHIFT_TRAN_CD: item?.SHIFT_TRAN_CD,
              SR_CD: item?.DATA,
              DESCRIPTION: item?.DESCRIPTION,
              ACTIVE: item?.ACTIVE ? "Y" : "N",
            }))
          : [];
        const oldData = Array.isArray(APIData)
          ? APIData.map((item) => ({
              USER_NAME: item.USER_NAME,
              COMP_CD: item.COMP_CD,
              SHIFT_TRAN_CD: item.SHIFT_TRAN_CD,
              SR_CD: item.SR_CD,
              DESCRIPTION: item.DESCRIPTION,
              ACTIVE: item.ACTIVE ? "Y" : "N",
            }))
          : [];
        const upd = utilFunction.transformDetailDataForDML(
          oldData ?? [],
          newData ?? [],
          ["SR_CD"]
        );
        dispatchCommon("commonType", {
          grid4: upd,
        });
        dispatchCommon("commonType", {
          oldData4: upd,
        });
        setActiveStep(userState.activeStep + 1);
      }
    };
    let metaData = defaultView === "new" ? loginShift : editloginShift;
    const combinedData =
      defaultView === "edit" && userState?.oldData4?.isNewRow?.length > 0
        ? [...APIData, ...userState.oldData4.isNewRow]
        : APIData;
    const MainData =
      defaultView === "new" &&
      userState?.grid4?.DETAILS_DATA?.isNewRow?.length > 0
        ? [...userState?.grid4?.DETAILS_DATA?.isNewRow]
        : [{ ACTIVE: "Y" }];
    return (
      <Fragment>
        {isLoading && <LinearProgress color="secondary" />}
        {isError && (
          <Alert
            severity="error"
            errorMsg={error?.error_msg ?? t("Somethingwenttowrong")}
            errorDetail={error?.error_detail}
            color="error"
          />
        )}
        <FormWrapper
          key={"LoginShift" + combinedData + MainData}
          metaData={extractMetaData(metaData, defaultView) as MetaDataType}
          displayMode={defaultView}
          initialValues={
            defaultView === "edit"
              ? { EDITLOGINSHIFT: combinedData }
              : { LOGINSHIFT: MainData }
          }
          onSubmitHandler={onSubmitHandler}
          formState={{ MessageBox: MessageBox }}
          ref={ref}
        />
      </Fragment>
    );
  }
);

export default LoginShift;
