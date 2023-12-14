import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { OPENAIURL } from "../../config/api";

interface Chat {
  type: string;
  content: string;
}

const TextAI = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);

  const getContent = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    const userQuery = { type: "question", content: searchQuery };
    setChatHistory(prev => [...prev, userQuery]);

    try {
      const data = {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: searchQuery }],
      };

      const OPENAI_TOKEN = process.env.NEXT_PUBLIC_OPENAI_TOKEN;
      const headers = { Authorization: `Bearer ${OPENAI_TOKEN}` };
      const response = await axios.post(OPENAIURL, data, { headers });

      if (response.data.choices && response.data.choices.length > 0) {
        const aiResponseContent = response.data.choices[0].message.content;
        const aiResponse = { type: "answer", content: aiResponseContent };

       await supabase.from('chat_activities').insert([
      { title: "User Query", iconPath: "/path/to/user-icon.svg", time: new Date().toISOString(), desc: searchQuery }
    ]);

        setChatHistory(prev => [...prev, aiResponse]);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {chatHistory.length > 0 && chatHistory.map((chat, key) => (
        <div key={key} className={`ml-16 ${key === chatHistory.length - 1 ? 'pb-20' : ''}`}>
          <div className="flex items-center">
            <Image
              className="text-left mb-4 mt-4 pr-4"
              src={chat.type === "question" ? "/me.png" : "/agai.png"}
              height={30}
              width={30}
              alt=""
            />
            <p className="text-fuchsia-500">{chat.type === "question" ? "Me" : "Agai"}</p>
          </div>
          <p className="text-[16px] mb-4 pl-8">{chat.content}</p>
        </div>
      ))}

      <div className={`max-w-[60%] ml-[8%] m-x-auto flex search-btn text-left fixed bottom-5 w-3/4`}>
        <input
          className="inline-block p-[14px] bg-transparent text-[14px] search-txt w-full"
          type="text"
          name="text"
          placeholder="What are you looking for?"
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={loading}
        />
        <div className="inline-block float-right cursor-pointer">
          {loading ? (
            <button className="send-btn">Loading ...</button>
          ) : (
            <button className="send-btn flex items-center p-[15px]" onClick={getContent}>
              <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* SVG Path */}
              </svg>
              Send
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextAI;
