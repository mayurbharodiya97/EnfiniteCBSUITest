import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { Fragment, forwardRef, useContext, useEffect, useRef, useState } from "react";
import { editloginShift, loginShift } from "./metaData/metaDataForm";
import { usePopupContext } from "components/custom/popupContext";
import { SecurityContext } from "../context/SecuityForm";
import { SubmitFnType } from "packages/form";
import { AuthContext } from "pages_audit/auth";
import { useQuery } from "react-query";
import * as API from "./api/api"
import { extractMetaData, utilFunction } from "components/utils";
import { LinearProgress } from "@mui/material";

 const LoginShift = forwardRef<any, any>(
  ({defaultView,username,userId}, ref) => {
    const { MessageBox } = usePopupContext();
    const Usernames = username?.USER_NAME
    const {authState} = useContext(AuthContext);
    const formAllFieldsValue = useRef<any>([])
    const {
      userState,
      setActiveStep,
      dispatchCommon
    } = useContext(SecurityContext);
    const Username = userState.formData?.USER_NAME;
    const { data:APIData, isLoading, isFetching, isError, error, refetch } = useQuery<any, any>(
        ["getLoginShiftAccess",Username],
        () => {
            if(defaultView === "edit"){
            return API.getLoginShiftAccess({
         userid : Usernames,
         comp_cd : authState?.companyID
        })}}
      );
    const onSubmitHandler: SubmitFnType = (
      data: any,
      displayData,
      endSubmit,
      setFieldError,
      actionFlag
    ) => {
      endSubmit(true);
      if(defaultView === "new"){
      if (Array.isArray(data?.LOGINSHIFT)) {
        const multipleData = data.LOGINSHIFT.map(item => ({
          USER_NAME: Username,
          COMP_CD: authState?.companyID,
          SHIFT_TRAN_CD: item?.DESCRIPTION
        }));
        const updatedData = {
          DETAILS_DATA: {
            isNewRow: multipleData,
            isUpdateRow: [],
            isDeleteRow: []
          }
        }
        dispatchCommon("commonType", {
          grid4: updatedData,
        })
      }
      setActiveStep(userState.activeStep + 1);
    }
    else if (defaultView === "edit"){
      const newData = Array.isArray(data?.EDITLOGINSHIFT) ? data.EDITLOGINSHIFT.map((item) => ({
        USER_NAME: Username,
        COMP_CD: authState?.companyID,
        SHIFT_TRAN_CD: item?.DESCRIPTION,
        SR_CD: item?.SR_CD,
        DESCRIPTION: item?.DESCRIPTION,
        ACTIVE: item?.ACTIVE
      })) : [];

      const oldData = Array.isArray(APIData) ? APIData.map((item) => ({
        USER_NAME: item.USER_NAME,
        COMP_CD: item.COMP_CD,
        SHIFT_TRAN_CD: item.SHIFT_TRAN_CD,
        SR_CD: item.SR_CD,
        DESCRIPTION: item.SHIFT_TRAN_CD,
        ACTIVE: item.ACTIVE
      })) : [];
        const upd = utilFunction.transformDetailDataForDML(
          oldData ?? [],
          newData ?? [],
          ["SR_CD"])
          dispatchCommon("commonType", {
            grid4: upd,
          })
          dispatchCommon("commonType", {
            oldData4: upd,
          })
          setActiveStep(userState.activeStep + 1);
        }
        }
        let meteData = defaultView === "new" ? loginShift : editloginShift
        const combinedData =
      defaultView === "edit" && userState?.oldData4?.isNewRow?.length > 0
        ? [...APIData, ...userState.oldData4.isNewRow]
        : APIData;
    return (
      <Fragment>
        {isLoading &&  <LinearProgress color="secondary" />}
        <FormWrapper
          key={
            "LoginShift" + combinedData 
          }
          // metaData={meteData as MetaDataType }
          metaData={
            extractMetaData(meteData, defaultView) as MetaDataType
          }
          displayMode={defaultView}
          initialValues={
            defaultView === "edit" ? 
             { EDITLOGINSHIFT: combinedData}
           :{ LOGINSHIFT : [{ ACTIVE: "Y"}]}
          }
          onSubmitHandler={onSubmitHandler}
          formState={{ MessageBox: MessageBox, formAllFieldsValue: formAllFieldsValue }}
          ref={ref}
        />
      </Fragment>
    );
  }
);

export default LoginShift;