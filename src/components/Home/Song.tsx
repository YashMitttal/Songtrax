import { Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { instrumentsContext } from "../../App";

interface ISample {
  id: string;
  api_key: string;
  name: string;
  recording_data: string;
  type: string;
  datetime: string;
}

interface IProps {
  sample: ISample;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  // Define months array for month names
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Get the components of the date
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Convert hours to am/pm format
  const amPm = hours >= 12 ? "pm" : "am";
  const formattedHours = hours % 12 || 12;

  // return the formatted string
  return `${formattedHours < 10 ? "0" : ""}${formattedHours}:${
    minutes < 10 ? "0" : ""
  }${minutes} ${amPm} on ${day} ${month} ${year}`;
};

export default function Sample({ sample }: IProps) {
  const [previewing, setPreviewing] = useState(false);
  const {
    toneObject,
    toneTransport,
    guitarPart,
    pianoPart,
    frenchPart,
    drumPart,
  } = useContext(instrumentsContext);

  const previewSample = async (e: any) => {
    // remove default behavior of button
    e.preventDefault();
    await toneObject.start();
    toneTransport.stop();

    if (previewing) {
      setPreviewing(false);
      console.log("Preview stopped manually.");
    } else {
      setPreviewing(true);
      console.log("Preview started.");
      toneTransport.start();
    }
  };

  useEffect(() => {
    guitarPart.clear();
    pianoPart.clear();
    frenchPart.clear();
    drumPart.clear();
    toneTransport.cancel();
    let timeStamp = 0;
    JSON.parse(sample.recording_data).forEach((note: any) => {
      const key = Object.keys(note)[0];
      const sequence = note[key];
      const filtered = sequence.filter((bar: boolean) => bar);

      filtered.forEach((b: any) => {
        if (sample.type === "guitar") {
          guitarPart.add(timeStamp, key + "3");
        }

        if (sample.type === "piano") {
          pianoPart.add(timeStamp, key + "3");
        }
        if (sample.type === "french") {
          frenchPart.add(timeStamp, key + "3");
        }
        if (sample.type === "drums") {
          drumPart.add(timeStamp, key + "3");
        }
        // add a 0.5s (tone duration) interval between each tone
        timeStamp += 0.5;
      });
    });

    toneTransport.schedule((time: any) => {
      setPreviewing(false);
      console.log("Preview stopped automatically.");
    }, (16 * 7) / 2);
  });

  return (
    <div className="w-full p-6 flex flex-col gap-4 md:flex-row justify-between items-center border-[#800080] border-2 border-b-8 mt-6">
      <div className="flex flex-col gap-2 self-start">
        <h3 className="text-2xl font-semibold text-[#800080]">{sample.name}</h3>
        <p className="text-[#80008075]">{formatDate(sample.datetime)}</p>
      </div>
      <div className="flex gap-2 font-medium text-[#800080] self-end">
        <Link
          to={`/share/${sample.id}`}
          className="px-4 py-2 border-2 border-[#800080] hover:bg-purple-200 transition"
        >
          Share
        </Link>
        <button
          onClick={previewSample}
          className="px-4 py-2 border-2 border-[#800080] hover:bg-purple-200 transition"
        >
          {previewing ? "Stop Previewing" : "Preview"}
        </button>
        <Link
          to={`/edit/${sample.id}`}
          className="px-4 py-2 border border-[#800080] bg-[#800080] text-white hover:bg-purple-800 transition"
        >
          Edit
        </Link>
      </div>
    </div>
  );
}
