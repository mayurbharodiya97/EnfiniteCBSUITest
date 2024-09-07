import { FileUploadControl } from "components/fileUpload";
import { Dialog } from "@mui/material";

export default function UploadImageDialogue({ onClose, onUpload }) {
  return (
    <div>
      <Dialog fullWidth maxWidth="md" open={true}>
        <FileUploadControl
          key={"positivePayEntryImage"}
          onClose={() => {
            onClose();
          }}
          editableFileName={false}
          defaultFileData={[]}
          onUpload={async (
            formDataObj,
            proccessFunc,
            ResultFunc,
            base64Object,
            result
          ) => {
            onUpload(base64Object);
            onClose();
          }}
          gridProps={{}}
          allowedExtensions={[
            "png",
            "jpeg",
            "jpg",
            "tiff",
            "gif",
            "bmp",
            "pdf",
          ]}
          onUpdateFileData={(files) => {}}
        />
      </Dialog>
    </div>
  );
}
