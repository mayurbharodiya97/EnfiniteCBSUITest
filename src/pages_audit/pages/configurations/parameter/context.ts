import * as ServerGridAPI from "pages_audit/common/serverGrid/api";
import * as API from "./api";

export const serverGridContextGenerator = (gridCode) => ({
  getGridMetaData: { fn: API.getGridFormMetaData, args: { gridCode } },
  getGridData: { fn: ServerGridAPI.getGridData, args: { gridCode } },
});
