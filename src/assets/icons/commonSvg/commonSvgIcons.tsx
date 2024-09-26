import { ReactComponent as WorkInProgressIcons } from "./svgFiles/work-in-progress.svg";
import { ReactComponent as Standing } from "./svgFiles/STANDING INSTRUCTIONS.svg";
import { ReactComponent as Lien } from "./svgFiles/LIEN.svg";
import { ReactComponent as OwChqOBCIBC } from "./svgFiles/OUTWARD CHEQUE OBC IBC.svg";
import { ReactComponent as TempODAgainst } from "./svgFiles/TEMP. OD AGAINST.svg";
import { ReactComponent as ATMCard } from "./svgFiles/ATM CARD.svg";
import { ReactComponent as IMPS } from "./svgFiles/IMPS 1.svg";
import { ReactComponent as ASBA } from "./svgFiles/ASBA.svg";
import { ReactComponent as ACHIW } from "./svgFiles/ACH INWARD.svg";
import { ReactComponent as ACHOW } from "./svgFiles/ACH OUTWARD.svg";
import { ReactComponent as SpInstruction } from "./svgFiles/SP. INSTRUCTIONS.svg";
import { ReactComponent as GroupAcs } from "./svgFiles/GROUP ACCOUNT.svg";
import { ReactComponent as APY } from "./svgFiles/APY.svg";
import { ReactComponent as APBS } from "./svgFiles/APBS.svg";
import { ReactComponent as PMBY } from "./svgFiles/PMSBY.svg";
import { ReactComponent as Account } from "./svgFiles/ACCOUNT.svg";
import { ReactComponent as Joint } from "./svgFiles/JOINT.svg";
import { ReactComponent as Todays } from "./svgFiles/TODAY'S TRANSACTION.svg";
import { ReactComponent as Cheques } from "./svgFiles/CHEQUES.svg";
import { ReactComponent as Snapshot } from "./svgFiles/SNAPSHOT.svg";
import { ReactComponent as HoldCharges } from "./svgFiles/HOLD CHARGE.svg";
import { ReactComponent as Documents } from "./svgFiles/DOCUMENT.svg";
import { ReactComponent as StopPayment } from "./svgFiles/STOP PAYMENT.svg";
import { ReactComponent as Insurance } from "./svgFiles/INSURANCE.svg";
import { ReactComponent as Disbursement } from "./svgFiles/DISBURSEMENT DETAIL.svg";
import { ReactComponent as Subsidy } from "./svgFiles/SUBSIDY.svg";
import { ReactComponent as Search } from "./svgFiles/IMPS.svg";
import { ReactComponent as Limits } from "./svgFiles/LIMITS.svg";
import { ReactComponent as Stock } from "./svgFiles/STOCK.svg";

// import * as Icons from "./svgFiles";

const CommonSvgIcons = ({ iconName }) => {
  const iconsConfig = {
    SI: Standing,
    LIEN: Lien,
    OUTWARD: OwChqOBCIBC,
    TEMPOD: TempODAgainst,
    ATM: ATMCard,
    IMPS: IMPS,
    ASBA: ASBA,
    ACHIW: ACHIW,
    ACHOW: ACHOW,
    SPINST: SpInstruction,
    GRPAC: GroupAcs,
    APY: APY,
    APBS: APBS,
    PMBY: PMBY,
    ACCOUNT: Account,
    JOINT: Joint,
    TODAYS: Todays,
    CHQ: Cheques,
    SNAPSHOT: Snapshot,
    HOLDCHRG: HoldCharges,
    DOCS: Documents,
    STOP: StopPayment,
    INSU: Insurance,
    DISBDTL: Disbursement,
    SUBSIDY: Subsidy,
    LIMIT: Limits,
    STOCK: Stock,
  };

  // Check if iconName is falsy or not defined, then default to "workInProgressIcons"
  const SelectedIcon =
    iconName && iconsConfig[iconName]
      ? iconsConfig[iconName]
      : WorkInProgressIcons;

  return <SelectedIcon />;
};

export default CommonSvgIcons;
