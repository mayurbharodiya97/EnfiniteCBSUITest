import React from "react";
import { ReactComponent as AirForce } from "./svgFiles/air-force.svg";
import { ReactComponent as FighterHelicopter } from "./svgFiles/fighter-helicopter.svg";
import { ReactComponent as AccountIcon } from "./svgFiles/SVG_animate-4032.svg";
import { ReactComponent as JointAccount } from "./svgFiles/jointAcct.svg";
import { ReactComponent as TodaysTran } from "./svgFiles/event-planning.svg";
import { ReactComponent as Snapshot } from "./svgFiles/snapshot.svg";
import { ReactComponent as Document } from "./svgFiles/document.svg";
import { ReactComponent as StandingInstruction } from "./svgFiles/standingInstructions.svg";
import { ReactComponent as LienIcons } from "./svgFiles/lienIcon.svg";
import { ReactComponent as O_wChq_OBC_IBC } from "./svgFiles/Ow-Chq-OBC-IBC.svg";
import { ReactComponent as WorkInProgressIcons } from "./svgFiles/work-in-progress.svg";

const CommonSvgIcons = ({ iconName }) => {
  const iconsConfig = {
    // airForce: AirForce,
    // fighterHeli: FighterHelicopter,
    accountIcon: AccountIcon,
    jointAcct: JointAccount,
    todaysTran: TodaysTran,
    snapshot: Snapshot,
    document: Document,
    standingInstruction: StandingInstruction,
    lienIcons: LienIcons,
    o_wChq_OBC_IBC: O_wChq_OBC_IBC,
    workInProgressIcons: WorkInProgressIcons,
  };

  // Check if iconName is falsy or not defined, then default to "workInProgressIcons"
  const SelectedIcon =
    iconName && iconsConfig[iconName]
      ? iconsConfig[iconName]
      : WorkInProgressIcons;

  return <SelectedIcon />;
};

export default CommonSvgIcons;
