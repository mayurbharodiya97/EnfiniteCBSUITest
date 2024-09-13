import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import { utilFunction } from "components/utils";
import { useEffect, useMemo, useState } from "react";
//import { boolean } from "yup";
import { CellWrapper } from "./cellWrapper";

export const IconRowCellRenderer = (props) => {
  const {
    value,
    column: {
      showTooltip = false,
      transform = (value) => value,
      isAutoSequence = false,
      isImageURL = false,
      shouldExclude,
    },
    row,
  } = props;

  const [ProfilePictureURL, setProfilePictureURL] = useState<any | null>(null);
  let newValue;
  if (isAutoSequence) {
    newValue = Number(row?.index ?? 0) + 1;
  } else {
    newValue = transform(value);
  }

  const isShouldExclude = useMemo(() => {
    if (typeof shouldExclude === "function") {
      return shouldExclude(newValue, row?.original);
    }
    return false;
  }, [newValue, row.original]);

  useEffect(() => {
    if (Boolean(newValue)) {
      let url = "";
      if (isImageURL) {
        url = newValue;
      } else {
        let blob = utilFunction.base64toBlob(newValue);

        url =
          typeof blob === "object" && Boolean(blob)
            ? URL.createObjectURL(blob)
            : "";
      }
      setProfilePictureURL(url);
    }
  }, [newValue]);

  if (isShouldExclude) {
    return <CellWrapper showBorder {...props}></CellWrapper>;
  }

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
