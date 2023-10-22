import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import Edit from "./pages/Edit";
import Share from "./pages/Share";
import {
  drumPart,
  frenchPart,
  guitarPart,
  pianoPart,
  toneObject,
  toneTransport,
  piano,
  french,
  guitar,
  drum,
} from "./data";
import Create from "./pages/Create";
import { createContext } from "react";

export const instrumentsContext = createContext<any>({});
const contextValue = {
  drumPart,
  frenchPart,
  guitarPart,
  pianoPart,
  toneObject,
  toneTransport,
  piano,
  french,
  guitar,
  drum,
};

function App() {
  return (
    <instrumentsContext.Provider value={contextValue}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/edit" element={<Create />} />
          <Route path="/edit/:id" element={<Edit />} />
          <Route path="/share/:id" element={<Share />} />
        </Routes>
      </BrowserRouter>
    </instrumentsContext.Provider>
  );
}

export default App;
