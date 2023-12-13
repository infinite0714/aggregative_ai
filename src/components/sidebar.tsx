import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import { chatData } from "./chat/chat-data";

type SidebarProps = {
  onClick?: () => void;
  setCardType: React.Dispatch<React.SetStateAction<string>>;
};

const Sidebar = ({ onClick, setCardType }: SidebarProps) => {
  return (
    <div className="p-6 w-[20%] justify-center min-h-screen bg-gray-900 border-r border-gray-800  fixed">
      <div onClick={()=>setCardType("")} className="flex gap-2 mb-6 cursor-pointer ">
        <Image src={"logo.svg"} width={60} height={60} alt="Aggregator AI" />
        <div className="flex flex-col font-bold tracking-wide text-xl tracking-widest">
          <div className="flex ">
            <span className="text-fuchsia-700">AG</span>GREGATOR
          </div>
          <span className="text-fuchsia-700">AI</span>
        </div>
        <div className="border-b border-gray-400"></div>
      </div>

      <div className="h-[1px] bg-gray-800 mb-10"></div>

      <Button
        className="bg-fuchsia-700 hover:bg-fuchsia-800 rounded-[16px] w-full flex items-center gap-1 text-lg p-6 mb-6"
        onClick={onClick}
      >
        <Image src={"/icons/plus.svg"} height={30} width={30} alt="+" /> New
        Chat
      </Button>

      <p className="text-lg mb-3">Activity</p>
      <p className="text-gray-600 mb-4">Today</p>
      {chatData.map((chat) => (
        <div key={chat.id}>
          <div className="border-[1px] border-gray-700 rounded-[16px] p-3 mt-2 mb-2 flex flex-col gap-3">
            <p className="text-[16px]">{chat.title}</p>
            <div className="text-gray-600 flex text-[16px] gap-1 justify-between">
              <div className="flex gap-1">
                <Image src={chat.iconPath} height={16} width={16} alt="T" />
                <span className="max-w-[100px] truncate">{chat.desc}</span>
              </div>
              <span className="text-gray-400 text-[14px]">{chat.time}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
