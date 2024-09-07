import { Avatar, Tooltip } from "@mui/material";
import { utilFunction } from "components/utils";
import { useEffect, useState } from "react";
//import { boolean } from "yup";
import { CellWrapper } from "./cellWrapper";

export const IconRowCellRenderer = (props) => {
  const {
    value,
    column: {
      showTooltip = false,
      transform = (value) => value,
      isAutoSequence = false,
    },
    row,
  } = props;
  //console.log(isAutoSequence);
  const [ProfilePictureURL, setProfilePictureURL] = useState<any | null>(null);
  let newValue;
  if (isAutoSequence) {
    newValue = Number(row?.index ?? 0) + 1;
  } else {
    newValue = transform(value);
  }
  //console.log(newValue);
  useEffect(() => {
    if (Boolean(newValue)) {
      let blob = utilFunction.base64toBlob(newValue);
      let url =
        typeof blob === "object" && Boolean(blob)
          ? URL.createObjectURL(blob)
          : "";
      setProfilePictureURL(url);
    }
  }, [newValue]);
  let result = showTooltip ? (
    <Tooltip title={newValue}>
      <div>
        <Avatar
          alt="User"
          src={Boolean(ProfilePictureURL) ? ProfilePictureURL : ""}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: 0,
          }}
        ></Avatar>
      </div>
      {/* <span>{newValue}</span> */}
    </Tooltip>
  ) : (
    <div>
      <Avatar
        alt="User"
        src={Boolean(ProfilePictureURL) ? ProfilePictureURL : ""}
        style={{
          width: "40px",
          height: "40px",
          borderRadius: 0,
        }}
      ></Avatar>
    </div>
  );
  return <CellWrapper {...props}>{result}</CellWrapper>;
};
