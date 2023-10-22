import { useContext } from "react";
import { instrumentsContext } from "../../App";

interface INotesProps {
  notes: any[];
  setNotes: any;
  type: string;
}

interface ISequenceProps {
  note: any;
  i: number;
  tone: string;
  handleClick: any;
}

interface IBarProps {
  position: string;
  handleClick: any;
  value: boolean;
}

function Bar({ position, handleClick, value }: IBarProps) {
  return (
    <div
      data-position={position}
      onClick={handleClick}
      key={position}
      className={`flex-1 border border-b-8 h-10 border-[#800080] hover:bg-purple-300 transition cursor-pointer ${
        value ? "bg-[#800080]" : ""
      }`}
    />
  );
}

function Sequence({ note, i, tone, handleClick }: ISequenceProps) {
  return (
    <div key={tone} className="w-full flex gap-4">
      <h4 className="w-8 text-end md:w-16 font-semibold text-[#800080]">
        {tone}
      </h4>
      <div className="flex flex-1">
        {note[tone].map((val: boolean, j: number) => {
          return (
            <Bar handleClick={handleClick} position={`${i},${j}`} value={val} />
          );
        })}
      </div>
    </div>
  );
}

export default function Notes({ notes, setNotes, type }: INotesProps) {
  const { piano, drum, french, guitar } = useContext(instrumentsContext);

  const triggerNote = (bar: any, letter: string) => {
    // only trigger when turned on bar
    if (bar) {
      if (type === "piano") {
        piano.triggerAttackRelease(letter + "3", 0.5);
      } else if (type === "drums") {
        drum.triggerAttackRelease(letter + "3", 0.5);
      } else if (type === "guitar") {
        guitar.triggerAttackRelease(letter + "3", 0.5);
      } else {
        french.triggerAttackRelease(letter + "3", 0.5);
      }
    }
  };

  const handleBarClick = (e: any) => {
    const [i, j] = e.target.dataset.position.split(",");
    const newNotes = [...notes];
    const letter = Object.keys(newNotes[i])[0];
    newNotes[i][letter][j] = !newNotes[i][letter][j];
    triggerNote(newNotes[i][letter][j], letter);
    setNotes([...newNotes]);
  };

  return (
    <section className="flex flex-col gap-4">
      {notes.map((note, i) => {
        const key = Object.keys(note)[0];
        return (
          <Sequence handleClick={handleBarClick} i={i} tone={key} note={note} />
        );
      })}
    </section>
  );
}
