// import { MdDeleteForever } from "react-icons/md";
import DeleteIcon from "@mui/icons-material/Delete";
const Note = ({ id, text, date, handleDeleteNote }) => {
  const colors = ["#fe9b72", "#fec971", " #00d4fe", "#b693fd", "#e4ee91"];
  const randomColorIndex = Math.floor(Math.random() * colors.length);
  return (
    <div className="note" style={{ backgroundColor: colors[randomColorIndex] }}>
      <span>{text}</span>
      <div className="note-footer">
        <small>{date}</small>
        <DeleteIcon
          onClick={() => handleDeleteNote(id)}
          className="delete-icon"
          size="1.3em"
        />
      </div>
    </div>
  );
};

export default Note;
