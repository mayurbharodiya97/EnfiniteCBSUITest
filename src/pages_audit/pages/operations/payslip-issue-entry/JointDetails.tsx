import { ActionTypes } from "components/dataTable";
import { GridMetaDataType } from "components/dataTableStatic";
import GridWrapper from "components/dataTableStatic/";
import { SlipJoinDetailGridMetaData } from "./paySlipMetadata";
import { useCallback } from "react";
import { LoaderPaperComponent } from "components/common/loaderPaper";

const actions: ActionTypes[] = [
  {
    actionName: "Close",
    actionLabel: "Close",
    multiple: false,
    alwaysAvailable: true,
    rowDoubleClick: false,
  },

];


function JointDetails({ data, onClose, loading }) {

  const setCurrentAction = useCallback(
    async (data) => {
      if (data.name === "Close") {
        onClose(false)
      }

    },
    []
  );
  return (
    <div>
      {
        !loading ? (<GridWrapper
          key={"modeMasterGrid"}
          finalMetaData={SlipJoinDetailGridMetaData as GridMetaDataType}
          data={data ?? []}
          setData={() => null}
          loading={loading}
          setAction={setCurrentAction}
          actions={actions}
        />) : <LoaderPaperComponent />
      }
    </div>
  )
}

export default JointDetails

