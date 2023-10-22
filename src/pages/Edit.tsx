/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useContext } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";
import Type from "../components/Edit/Type";
import Notes from "../components/Edit/Notes";
import { instrumentsContext } from "../App";

const baseUrl = "https://comp2140.uqcloud.net/api/";
const apiKey = "txxMiqsotk";

interface ISample {
  id: string;
  api_key: string;
  name: string;
  recording_data: string[];
  type: string;
  datetime: string;
}

export default function Edit() {
  const [sample, setSample] = useState<ISample>();
  const [type, setType] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState<any[]>([
    {
      B: [
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ],
    },
    {
      A: [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ],
    },
    {
      G: [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ],
    },
    {
      F: [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ],
    },
    {
      E: [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ],
    },
    {
      D: [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ],
    },
    {
      C: [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ],
    },
  ]);
  const { id } = useParams();
  const [name, setName] = useState("");
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

  const getSample = async () => {
    const url = `${baseUrl}sample/${id}/?api_key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    setSample(data);
    setName(data.name);
    setType(data.type);
    setNotes(JSON.parse(data.recording_data));
  };

  // edit sample on api
  const updateSample = async (e: any) => {
    e.preventDefault();
    if (!name) {
      setError("Sample name is required");
      return;
    }
    setError("");
    setLoading(true);
    const url = `${baseUrl}sample/${id}/?api_key=${apiKey}`;
    const bodyData = JSON.stringify({
      type,
      name,
      recording_data: JSON.stringify(notes),
      api_key: apiKey,
    });

    const response = await fetch(url, {
      method: "put",
      body: bodyData,
      headers: {
        "Content-Type": "application/json",
      },
    });
    await response.json();
    setLoading(false);
  };

  useEffect(() => {
    getSample();
  }, []);

  useEffect(() => {
    guitarPart.clear();
    pianoPart.clear();
    frenchPart.clear();
    drumPart.clear();
    toneTransport.cancel();

    let timeStamp = 0;
    notes.forEach((note) => {
      const key = Object.keys(note)[0];
      const sequence = note[key];
      const filtered = sequence.filter((bar: boolean) => bar);

      filtered.forEach((b: any) => {
        if (type === "guitar") {
          guitarPart.add(timeStamp, key + "3");
        }

        if (type === "piano") {
          pianoPart.add(timeStamp, key + "3");
        }
        if (type === "french") {
          frenchPart.add(timeStamp, key + "3");
        }
        if (type === "drums") {
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
    <div className="w-screen min-h-screen flex flex-col relative items-center">
      <Navbar isHome={false} />
      <main
        id="content"
        className="w-full max-w-[1500px] px-6 pb-10 pt-36 flex flex-1 flex-col gap-6"
      >
        <h2 className="text-4xl font-bold text-[#800080]">
          Editing this sample
        </h2>
        <form
          onSubmit={updateSample}
          className="w-full px-10 py-6 flex flex-col md:flex-row md:items-center gap-6 border-[#800080] border-2 border-b-8"
        >
          <div className="flex flex-1 flex-col gap-1">
            <input
              className="bg-[#80008054] outline-none flex-1 p-3 rounded-lg text-[#800080] font-bold text-xl"
              type="text"
              name="name"
              id="name"
              defaultValue={sample?.name}
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            {error && <p className="text-red-500">{error}</p>}
          </div>
          <div className="flex self-end md:self-auto gap-4">
            <button
              onClick={previewSample}
              className="px-4 py-2 border-2 border-[#800080] text-[#800080] font-semibold hover:bg-purple-300 transition"
            >
              {previewing ? "Stop Previewing" : "Preview"}
            </button>
            <button
              type="submit"
              className="px-4 py-2 flex items-center gap-2 border-2 bg-[#800080] border-[#800080] font-semibold text-white hover:bg-purple-800 transition"
            >
              Save{" "}
              {loading && (
                <div
                  className="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent  text-gray-400 rounded-full"
                  role="status"
                  aria-label="loading"
                >
                  <span className="sr-only">Loading...</span>
                </div>
              )}
            </button>
          </div>
        </form>
        <Type setType={setType} type={type || sample?.type || ""} />
        <Notes notes={notes} setNotes={setNotes} type={type} />
      </main>
      <Footer />
    </div>
  );
}
