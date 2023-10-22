/* eslint-disable react-hooks/exhaustive-deps */
import { useParams } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useState, useEffect, useContext } from "react";
import { instrumentsContext } from "../App";

const baseUrl = "https://comp2140.uqcloud.net/api/";
const apiKey = "txxMiqsotk";

interface ISample {
  id: string;
  api_key: string;
  name: string;
  recording_data: string;
  type: string;
  datetime: string;
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

export default function Share() {
  const { id } = useParams();
  const [sample, setSample] = useState<ISample>();
  const [locations, setLocations] = useState([]);
  const [sampleToLocations, setSampleToLocations] = useState<any[]>([]);
  const [previewing, setPreviewing] = useState(false);
  const {
    toneObject,
    toneTransport,
    guitarPart,
    pianoPart,
    frenchPart,
    drumPart,
  } = useContext(instrumentsContext);

  // get sample by id
  const getSample = async () => {
    const url = `${baseUrl}sample/${id}/?api_key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    setSample(data);
  };

  // fetch all locations
  const getLocations = async () => {
    const url = `${baseUrl}location/?api_key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    setLocations(data);
  };

  // fetch the sample to location data
  const getSampleToLocations = async () => {
    const url = `${baseUrl}sampletolocation/?api_key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    setSampleToLocations(data);
  };

  const fetchData = async () => {
    await getSample();
    await getLocations();
    await getSampleToLocations();
  };

  // Share or unshare sample to location
  const updateSampleToLocation = async (
    action: string,
    sampleOrLocationId: string
  ) => {
    if (action === "delete") {
      const url = `${baseUrl}sampletolocation/${sampleOrLocationId}/?api_key=${apiKey}`;
      await fetch(url, {
        method: "delete",
      });
      setSampleToLocations((value) => {
        return value.filter((s: any) => s.id !== sampleOrLocationId);
      });
    } else {
      const url = `${baseUrl}sampletolocation/?api_key=${apiKey}`;
      const response = await fetch(url, {
        method: "post",
        body: JSON.stringify({
          sample_id: id,
          location_id: sampleOrLocationId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      const newSampleToLocations: any = [...sampleToLocations, data];
      setSampleToLocations([...newSampleToLocations]);
    }
  };

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
    fetchData();
  }, []);

  // initialize parts for preview
  useEffect(() => {
    guitarPart.clear();
    pianoPart.clear();
    frenchPart.clear();
    drumPart.clear();
    toneTransport.cancel();

    if (sample) {
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
    }

    toneTransport.schedule((time: any) => {
      setPreviewing(false);
      console.log("Preview stopped automatically.");
    }, (16 * 7) / 2);
  });

  return (
    <div className="w-screen min-h-screen flex flex-col relative items-center">
      <Navbar isHome={false} />
      <div
        id="content"
        className="w-full max-w-[1500px] px-6 pb-10 pt-36 flex flex-1 flex-col gap-6"
      >
        <h2 className="text-3xl font-bold text-[#800080]">Share this sample</h2>
        {sample && (
          <div className="w-full p-6 flex flex-col gap-4 md:flex-row justify-between items-center border-[#800080] border-2 border-b-8 mt-6">
            <div className="flex flex-col gap-2 self-start">
              <h3 className="text-2xl font-semibold text-[#800080]">
                {sample!.name}
              </h3>
              <p className="text-[#8000807c]">{formatDate(sample!.datetime)}</p>
            </div>
            <div className="flex gap-2 font-medium text-white self-end">
              <button
                onClick={previewSample}
                className="px-4 py-2 border-2 bg-[#800080] border-[#800080] hover:bg-[#441844] transition"
              >
                {previewing ? "Stop Previewing" : "Preview"}
              </button>
            </div>
          </div>
        )}
        <div className="w-full flex flex-col gap-3 text-[#800080]">
          {locations &&
            sampleToLocations &&
            locations.map((location: any) => {
              const isShared = sampleToLocations.find(
                (l: any) =>
                  l.sample_id === sample?.id && l.location_id === location.id
              );
              return (
                <div className="w-full flex justify-end gap-4 text-sm md:text-md font-semibold items-center">
                  <h4>{location.name}</h4>
                  <div className="w-4/5 flex h-12 border-b-4 border-[#800080]">
                    <div
                      className={`w-1/2 border-[#800080] border flex justify-center items-center transition cursor-pointer ${
                        isShared
                          ? "bg-[#800080] text-white"
                          : "hover:bg-purple-300"
                      }`}
                      onClick={async () => {
                        if (!isShared) {
                          await updateSampleToLocation("add", location.id);
                        }
                      }}
                    >
                      Shared
                    </div>
                    <div
                      className={`w-1/2 border-[#800080] border flex justify-center items-center transition cursor-pointer ${
                        !isShared
                          ? "bg-[#800080] text-white"
                          : "hover:bg-purple-300"
                      }`}
                      onClick={async () => {
                        if (isShared) {
                          await updateSampleToLocation("delete", isShared.id);
                        }
                      }}
                    >
                      Not Shared
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <Footer />
    </div>
  );
}
