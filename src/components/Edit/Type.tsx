import React from "react";

interface IProps {
  setType: any;
  type: string;
}

export default function Type({ setType, type }: IProps) {
  const handleClick = (e: any) => {
    const newType = e.target.dataset.type;
    setType(newType);
  };

  return (
    <section className="w-full flex items-center gap-4">
      <h4 className="text-[#800080] font-semibold text-lg w-8 md:text-xl md:text-end md:w-16">
        Type
      </h4>
      <div className="flex flex-1">
        <div
          onClick={handleClick}
          className={`w-1/4 py-2 border-t-2 border-x-2 border-b-8 border-[#800080] hover:bg-purple-300 text-center font-medium  transition cursor-pointer ${
            type && type === "piano"
              ? "bg-[#800080] text-white"
              : "text-[#800080]"
          }`}
          data-type="piano"
        >
          Piano
        </div>
        <div
          onClick={handleClick}
          className={`w-1/4 py-2 border-t-2 border-x-2 border-b-8 border-[#800080] hover:bg-purple-300 text-center font-medium  transition cursor-pointer ${
            type && type === "french"
              ? "bg-[#800080] text-white"
              : "text-[#800080]"
          }`}
          data-type={"french"}
        >
          French Horn
        </div>
        <div
          onClick={handleClick}
          className={`w-1/4 py-2 border-t-2 border-x-2 border-b-8 border-[#800080] hover:bg-purple-300 text-center font-medium  transition cursor-pointer ${
            type && type === "guitar"
              ? "bg-[#800080] text-white"
              : "text-[#800080]"
          }`}
          data-type={"guitar"}
        >
          Guitar
        </div>
        <div
          onClick={handleClick}
          className={`w-1/4 py-2 border-t-2 border-x-2 border-b-8 border-[#800080] hover:bg-purple-300 text-center font-medium  transition cursor-pointer ${
            type && type === "drums"
              ? "bg-[#800080] text-white"
              : "text-[#800080]"
          }`}
          data-type={"drums"}
        >
          Drums
        </div>
      </div>
    </section>
  );
}
