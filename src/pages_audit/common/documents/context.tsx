import { createContext, FC } from "react";
import * as API from "./api";

interface DOCCRUDProviderType {
  context: any;
  uploadDocuments: CRUDFNType;
  deleteDocuments: CRUDFNType;
  updateDocument: CRUDFNType;
  getDocumentsGridData: CRUDFNType;
  verifyDocuments: CRUDFNType;
  getDocumentListingGridMetaData: CRUDFNType;
  getDocumentUploadAddtionalFieldsMetaData: CRUDFNType;
  getDocumentEditGridMetaData: CRUDFNType;
  generateDocumentDownloadURL: CRUDFNType;
  previewDocument: CRUDFNType;
  children?: any;
}

export const DOCCRUDContext = createContext<DOCCRUDProviderType>(
  {} as DOCCRUDProviderType
);

interface CRUDFNType {
  fn: any;
  args: any;
}

export const DOCCRUDContextProvider: FC<DOCCRUDProviderType> = ({
  children,
  uploadDocuments,
  deleteDocuments,
  updateDocument,
  verifyDocuments,
  getDocumentsGridData,
  getDocumentListingGridMetaData,
  getDocumentUploadAddtionalFieldsMetaData,
  getDocumentEditGridMetaData,
  generateDocumentDownloadURL,
  previewDocument,
  context,
}) => {
  return (
    <DOCCRUDContext.Provider
      value={{
        uploadDocuments,
        deleteDocuments,
        updateDocument,
        verifyDocuments,
        getDocumentsGridData,
        getDocumentListingGridMetaData,
        getDocumentUploadAddtionalFieldsMetaData,
        getDocumentEditGridMetaData,
        generateDocumentDownloadURL,
        previewDocument,
        context,
      }}
    >
      {children}
    </DOCCRUDContext.Provider>
  );
};

export const DocAPICrudProviderGenerator = (
  moduleType,
  productType,
  docCategory,
  refID,
  serialNo
) => ({
  context: {
    moduleType,
    productType,
    docCategory,
    refID,
    serialNo,
  },
  uploadDocuments: {
    fn: API.uploadDocuments,
    args: { moduleType, productType, refID, serialNo },
  },
  getDocumentsGridData: {
    fn: API.listDocuments,
    args: { moduleType, productType, refID, serialNo },
  },
  deleteDocuments: {
    fn: API.deleteDocuments,
    args: { moduleType, productType, refID, serialNo },
  },
  updateDocument: {
    fn: API.updateDocuments,
    args: { moduleType, productType, refID, serialNo },
  },
  verifyDocuments: {
    fn: API.verifyDocuments,
    args: { moduleType, productType, refID, serialNo },
  },
  getDocumentListingGridMetaData: {
    fn: API.getDocumentMetaData,
    args: { moduleType, productType, metaDataType: "grid" },
  },
  getDocumentUploadAddtionalFieldsMetaData: {
    fn: API.getDocumentMetaData,
    args: { moduleType, productType, metaDataType: "upload" },
  },
  getDocumentEditGridMetaData: {
    fn: API.getDocumentMetaData,
    args: { moduleType, productType, metaDataType: "edit" },
  },
  generateDocumentDownloadURL: {
    fn: API.generateDocumentDownloadURL,
    args: { moduleType, productType },
  },
  previewDocument: {
    fn: API.previewDocument,
    args: { moduleType, productType },
  },
});
