import { createContext, FC } from "react";
import * as API from "./api";

interface CRUDProviderType {
  context: any;
  insertFormData: CRUDFNType;
  checkFormDataExist: CRUDFNType;
  deleteFormData: CRUDFNType;
  updateFormData: CRUDFNType;
  getFormMetaData: CRUDFNType;
  getFormData: CRUDFNType;
  getGridFormMetaData: CRUDFNType;
  getGridFormData: CRUDFNType;
  children?: any;
}

export const CRUDContext = createContext<CRUDProviderType>(
  {} as CRUDProviderType
);

interface CRUDFNType {
  fn: any;
  args: any;
}

export const CRUDContextProvider: FC<CRUDProviderType> = ({
  children,
  insertFormData,
  checkFormDataExist,
  deleteFormData,
  updateFormData,
  getFormData,
  getGridFormData,
  getFormMetaData,
  getGridFormMetaData,
  context,
}) => {
  return (
    <CRUDContext.Provider
      value={{
        context,
        insertFormData,
        checkFormDataExist,
        deleteFormData,
        updateFormData,
        getFormData,
        getGridFormData,
        getFormMetaData,
        getGridFormMetaData,
      }}
    >
      {children}
    </CRUDContext.Provider>
  );
};

export const crudAPIContextGenerator = (moduleType, productType, refID) => ({
  context: { moduleType, productType, refID },
  // call to save form data
  insertFormData: {
    fn: API.insertFormData,
    args: { moduleType, productType, refID },
  },
  // to check if form data exist or not
  checkFormDataExist: {
    fn: API.checkFormDataExist,
    args: { moduleType, productType, refID },
  },
  // delete record from the grid for a particular form record
  deleteFormData: {
    fn: API.deleteFormData,
    args: { moduleType, productType, refID },
  },
  // update form data
  updateFormData: {
    fn: API.updateFormData,
    args: { moduleType, productType, refID },
  },
  // get form data for (View and Edit)
  getFormData: {
    fn: API.getFormData,
    args: { moduleType, productType, refID },
  },
  // get grid listing data
  getGridFormData: {
    fn: API.getGridFormData,
    args: { moduleType, productType, refID },
  },
  // get form metaData for (new/view/edit)
  getFormMetaData: {
    fn: API.getFormMetaData,
    args: { moduleType, productType, refID },
  },
  // get grid metaData
  getGridFormMetaData: {
    fn: API.getGridFormMetaData,
    args: { moduleType, productType, refID },
  },
});
