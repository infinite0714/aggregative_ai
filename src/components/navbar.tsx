import React from "react";
import { Button } from "./ui/button";

const Navbar = ({setCardType, cardType}: any) => {
  return (
    <div className="w-full bg-gray-900 border-b border-gray-800 p-6 pl-10 pr-10 h-[70px] flex items-center justify-between sticky top-0 z-10">
      <h1>Good Morning!</h1>
        {cardType !== "" ?
        <Button onClick={()=>setCardType("")} className="bg-fuchsia-700 rounded-[12px] hover:bg-fuchsia-800">
        Go back
      </Button>
      : "" }
      
    </div>
  );
};

export default Navbar;
