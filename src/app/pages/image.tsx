import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import axios from "axios";
import Image from "next/image";
import { toast } from "react-toastify";
import { MIDJOURNEYIMAGURL, MIDJOURNEYURL } from "../../config/api";
import ProgressBar from "@/components/progress";

interface Chat {
  type: string;
  content: string;
}

const ImageAI = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [imageHistory, setImageHistory] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);

  const getContent = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);

    const userQuery = { type: "question", content: searchQuery };
    setImageHistory(prev => [...prev, userQuery]);

    try {
      const data = {
        prompt: searchQuery,
        aspect_ratio: "4:3",
        process_mode: "fast",
        webhook_endpoint: "",
        webhook_secret: "",
      };

      const GOAPI_KEY = process.env.NEXT_PUBLIC_GOAPI_KEY;

      const headers = {
        "X-API-KEY": GOAPI_KEY,
      };

      const keyResponse = await axios.post(MIDJOURNEYIMAGURL, data, {
        headers,
      });

      if (keyResponse.data.status === "success") {
        setTimeout(async () => {
          await getImageFunc(keyResponse.data.task_id);
        }, 10000);
      }
    } catch (error: any) {
      console.log(error)
      toast.error("Insufficient token", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      setLoading(false);
    }
  };

  const getImageFunc = async (id: string) => {
    try {
      const imageResponse = await axios.post(MIDJOURNEYURL, { task_id: id });
      if (
        imageResponse.data.status === "pending" ||
        imageResponse.data.status === "processing"
      ) {
        setTimeout(async () => {
          await getImageFunc(imageResponse.data.task_id);
        }, 10000);
      }

      if (imageResponse.data.status === "finished") {
        const { error } = await supabase
          .from('chat_activities')
          .insert({
            title: "Image Inquiry",
            iconpath: "/path/to/image-icon.svg",
            time: new Date().toISOString(),
            description: searchQuery
          });
        
        console.log(error);

        setImageHistory(prev => [...prev, {
          type: "answer",
          content: imageResponse.data.task_result.image_url,
        }]);

        setSearchQuery("");
        setLoading(false);
      }
    } catch (error: any) {
      toast.error("Network Error!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setLoading(false);
    }
  };

  return (
    <div className="w-full pt-4">
      {imageHistory.length > 0 ? (
        imageHistory.map((item, key) => (
          <div
            key={key}
            className={`ml-4 md:ml-16 ${
              key === imageHistory.length - 1 ? "pb-20" : ""
            }`}
          >
            <div className="flex items-center">
              <Image
                className="text-left mb-4 mt-4 pr-4"
                src={item.type == "question" ? "/me.png" : "/agai.png"}
                height={30}
                width={30}
                alt=""
              />
              <div className="text-fuchsia-500">
                {item.type == "question" ? "Me" : "Agai"}
              </div>
            </div>
            {item.type == "question" ? (
              <p className="text-[16px] text-justify pr-8  mb-4 pl-8">
                {item.content}
              </p>
            ) : (
              <Image
                className="m-auto mt-4"
                src={item.content}
                height={300}
                width={300}
                alt=""
              />
            )}

            {loading && key === imageHistory.length - 1 && 
            <>
              <ProgressBar  time={60}/>
            </>
            }
          </div>
        ))
      ) : (
        <div>
          <Image
            className="m-auto mt-32"
            src={"/logo.svg"}
            height={200}
            width={200}
            alt=""
          />
          <h2 className="text-center text-2xl">How can we help you?</h2>
        </div>
      )}
      <div
        className={` md:max-w-[60%] ml-[2%] md:ml-[10%]  m-x-auto flex search-btn text-left fixed bottom-5 w-[96%] md:w-3/4`}
      >
        <input
          className="inline-block md:p-[14px] bg-transparent text-[14px] search-txt w-full"
          type="text"
          name="text"
          placeholder="What are you looking for?"
          onChange={(e: any) => setSearchQuery(e.target.value)}
          disabled={loading}
          value={searchQuery}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !loading) {
              getContent();
            }
          }}
        />
        <div className="inline-block float-right cursor-pointer">
          {loading ? (
            <button className="send-btn">Loading ...</button>
          ) : (
            <button
              className="send-btn flex items-center p-[15px]"
              onClick={() => getContent()}
            >
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
              {!loading ? "Send" : "Loading..."}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageAI;
