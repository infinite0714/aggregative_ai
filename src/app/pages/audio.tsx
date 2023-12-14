import React, { useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import PremiumCard from "@/components/premium";

const AudioAI = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);

    try {
      //  Here you can add any logic related to audio processing
      // 
      // Sending user's text input to Supabase
      await supabase.from('chat_activities').insert([
        {
          title: "Audio Inquiry",
          iconPath: "/path/to/audio-icon.svg",
          time: new Date().toISOString(),
          desc: searchQuery
        }
      ]);

      setSearchQuery("");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Image className="m-auto mt-32" src={"/logo.svg"} height={200} width={200} alt="" />
      
      <div className={`flex search-btn text-left absolute bottom-10 w-3/4 m-auto`}>
        <input
          className="inline-block p-[14px] bg-transparent text-[14px] search-txt w-full"
          type="text"
          name="text"
          placeholder="What are you looking for?"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={loading}
        />
        <div className="inline-block float-right cursor-pointer">
          <button className="send-btn flex items-center p-[15px]" onClick={handleSend}>
            <svg
                  width="25"
                  height="24"
                  viewBox="0 0 25 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.5698 8.50989L10.0098 4.22989C4.25978 1.34989 1.89978 3.70989 4.77978 9.45989L5.64978 11.1999C5.89978 11.7099 5.89978 12.2999 5.64978 12.8099L4.77978 14.5399C1.89978 20.2899 4.24978 22.6499 10.0098 19.7699L18.5698 15.4899C22.4098 13.5699 22.4098 10.4299 18.5698 8.50989ZM15.3398 12.7499H9.93977C9.52978 12.7499 9.18977 12.4099 9.18977 11.9999C9.18977 11.5899 9.52978 11.2499 9.93977 11.2499H15.3398C15.7498 11.2499 16.0898 11.5899 16.0898 11.9999C16.0898 12.4099 15.7498 12.7499 15.3398 12.7499Z"
                    fill="white"
                  />
                </svg>
            Send
          </button>
        </div>
      </div>

      <PremiumCard />
    </div>
  );
};

export default AudioAI;
