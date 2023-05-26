import { Fragment, useRef, useCallback, useState, useMemo } from "react";
import { useMutation } from "react-query";
import { FormComponentView } from "components/formcomponent";
// import { ChequebookentryFilterForm } from "./metaData";
// import { ChequebookentryGridMetaData } from "./gridMetadata";
import GridWrapper from "components/dataTableStatic";
import { Alert } from "components/common/alert";
import { useNavigate } from "react-router-dom";
import { GridMetaDataType } from "components/dataTable/types";
import { FilterFormMetaType } from "components/formcomponent/filterform";
import { ClearCacheProvider } from "cache";
// import * as API from "./api";
import { UpdateRequestDataVisibleColumn } from "components/utils";
import { useSnackbar } from "notistack";

// export const ChequeBookEntryForm = () => {
//   return (
//     <ClearCacheProvider>
//       <ChequeBookEntry />
//     </ClearCacheProvider>
//   );
// };
export const Ckyc = () => {
  return (
    <h1>sdfvds</h1>
  );
};
