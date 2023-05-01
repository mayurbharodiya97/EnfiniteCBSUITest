import { FC, CSSProperties, useRef } from "react";
import { NativeTypes } from "react-dnd-html5-backend";
import { useDrop } from "react-dnd";
import { TargetBoxType } from "./type";
import { useStyles } from "./style";
import { Button, Typography } from "@mui/material";

const style = ({ disabled }): CSSProperties => ({
  pointerEvents: disabled ? "none" : "all",
  opacity: disabled ? 0.5 : 1,
});

export const UploadTarget: FC<TargetBoxType> = (props) => {
  const classes = useStyles();
  const { onDrop, disabled, existingFiles } = props;
  const fileUploadControl = useRef<any | null>(null);
  const handleFileSelect = (e) => {
    const files = e.target.files;
    const filesArray = Array.from(files);
    onDrop(filesArray as File[], existingFiles);
  };
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: [NativeTypes.FILE],
    drop(item, monitor) {
      if (typeof onDrop === "function") {
        const files = Array.from((monitor as any).getItem().files) as File[];
        onDrop(files, existingFiles);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActive = canDrop && isOver;
  return (
    <div
      ref={drop}
      style={style({ disabled: Boolean(disabled) })}
      className={classes.uploadWrapper}
    >
      {isActive ? (
        <Typography>Drop Files here</Typography>
      ) : (
        <>
          <Typography>Drag and Drop or</Typography>
          <Button
            color="secondary"
            onClick={() => fileUploadControl?.current?.click()}
          >
            Browse
          </Button>
          <input
            type="file"
            multiple
            style={{ display: "none" }}
            ref={fileUploadControl}
            onChange={handleFileSelect}
            onClick={(e) => {
              //to clear the file uploaded state to reupload the same file (AKA allow our handler to handle duplicate file)
              //@ts-ignore
              e.target.value = "";
            }}
          />
        </>
      )}
    </div>
  );
};
