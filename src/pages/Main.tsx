import { useEffect, useState } from "react";
import Song from "../components/Home/Song";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

interface ISample {
  id: string;
  api_key: string;
  name: string;
  recording_data: string;
  type: string;
  datetime: string;
}

const baseUrl = "https://comp2140.uqcloud.net/api/";
const apiKey = "txxMiqsotk";

export default function Home() {
  const [samples, setSamples] = useState<ISample[]>([]);

  const getSamples = async () => {
    const url = `${baseUrl}sample/?api_key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    setSamples(data);
  };

  useEffect(() => {
    getSamples();
  }, []);

  return (
    <div className="flex flex-col items-center w-screen min-h-screen relative ">
      <Navbar isHome />
      <main
        id="content"
        className="w-full max-w-[1500px] px-6 pb-10 pt-36 flex flex-1 flex-col gap-6"
      >
        <h2 className="text-4xl font-bold text-[#800080]">Your Song Samples</h2>
        <section className="w-full p-6 flex items-center justify-center border-[#8000807a] border-2 border-b-8">
          <Link
            to={"/edit"}
            className="bg-[#800080] text-white font-medium px-6 py-2 hover:bg-[#4e1d4e] transition"
          >
            Create Sample
          </Link>
        </section>
        <section>
          {samples.length
            ? samples.map((sample) => {
                return <Song sample={sample} key={sample.id} />;
              })
            : ""}
        </section>
        <section className="w-full p-6 flex items-center justify-center border-[#8000807a] border-2 border-b-8">
          <Link
            to={"/edit"}
            className="bg-[#800080] text-white font-medium px-6 py-2 hover:bg-[#4e1d4e] transition"
          >
            Create Sample
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
