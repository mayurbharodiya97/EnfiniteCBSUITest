import Note from "./Note";
import AddNote from "./AddNote";

const NotesList = ({ notes, handleAddNote, data, refetch }) => {
  console.log("notes", notes);
  return (
    <div className="notes-list">
      {notes.map((note, index) => (
        <Note
          key={note.id}
          id={note.id}
          title={note.title}
          text={note.text}
          date={note.date}
          logo={note.logo}
          color={note.color}
          handleAddNote={handleAddNote}
          tranCD={note.tranCD}
          flag={note.flag}
          refetch={refetch}
          // handleDeleteNote={handleDeleteNote}
        />
      ))}
    </div>
  );
};

export default NotesList;
