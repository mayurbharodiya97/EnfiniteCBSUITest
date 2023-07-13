// import { MdDeleteForever } from "react-icons/md";
// import DeleteIcon from "@mui/icons-material/Delete";

import { useState } from "react";
import AddNote from "./AddNote";

const Note = ({
  id,
  title,
  text,
  date,
  handleDeleteNote,
  logo,
  handleAddNote,
  closeDialog,
  color,
  tranCD,
  flag,
  data,
  refetch,
}) => {
  const [isOpenNote, setIsOpenNote] = useState(false);
  const [selectedItemData, setSelectedItemData] = useState(null);
  console.log("data112232", selectedItemData);
  const handleDialogClose = () => {
    setIsOpenNote(false);
    refetch();
  };
  // console.log("data123", data);
  // const colors = ["#fe9b72", "#fec971", " #00d4fe", "#b693fd", "#e4ee91"];
  // const randomColorIndex = Math.floor(Math.random() * colors.length);
  return (
    <>
      <div
        className="note"
        style={{ backgroundColor: color }}
        onClick={(e) => {
          setSelectedItemData({ id, title, text, tranCD, date, color, flag });
          setIsOpenNote(true);
        }}
      >
        <div>{logo}</div>
        <div
          style={{
            marginBottom: "20px",
            fontSize: "25px",
            fontWeight: "bold",
            width: "100%",
            // height: "15%",
          }}
        >
          {title}
        </div>
        <div
          style={{
            marginBottom: "12px",
            fontSize: "15px",
            width: "100%",
            height: "50%",
            overflow: "auto",
          }}
        >
          {text}
        </div>
        <div className="note-footer">
          <small>{date}</small>
          {/* <DeleteIcon
          onClick={() => handleDeleteNote(id)}
          className="delete-icon"
          size="1.3em"
        /> */}
        </div>
      </div>
      {isOpenNote ? (
        <AddNote
          handleAddNote={handleAddNote}
          closeDialog={handleDialogClose}
          data={selectedItemData}
          tranCD={tranCD}
          defualtView={"edit"}
        />
      ) : null}
    </>
  );
};

export default Note;
