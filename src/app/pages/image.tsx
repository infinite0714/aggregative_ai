import TextSend from "@/components/text-send";
import React, { useCallback, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { MIDJOURNEYIMAGURL, MIDJOURNEYURL } from "../../config/api";

interface Chat {
  type: string;
  content: string;
}

const ImageAI = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [imageHistory, setImageHistory] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);

  const getContent = async () => {
    setImageHistory([
      ...imageHistory,
      {
        type: 'question',
        content: searchQuery
      }
    ]);
    
    try {
      const data = {
        prompt: searchQuery,
        aspect_ratio: '16:9',
        process_mode: 'mixed',
        webhook_endpoint: '',
        webhook_secret: '',
      };

      const GOAPI_KEY = process.env.NEXT_PUBLIC_GOAPI_KEY;

      console.log('--- goapikey ---', GOAPI_KEY);
      const headers = {
        'X-API-KEY': GOAPI_KEY,
      };

      const keyResponse = await axios.post(MIDJOURNEYIMAGURL, data, { headers });

      if (keyResponse.data.status === 'success') {
        setTimeout(async () => {
          await getImageFunc(keyResponse.data.task_id);
        }, 3000);
        
      }
    } catch (error) {
      console.error('Error generating key:', error);
    }
  };


  const getImageFunc = async (id: string) => {
    try {
      const imageResponse = await axios.post(MIDJOURNEYURL, { task_id: id });

      if ( imageResponse.data.status === 'pending' || imageResponse.data.status === 'processing' ) {
        await getImageFunc(imageResponse.data.task_id);
      }

      if (imageResponse.data.status === 'finished') {
        setImageHistory([
          ...imageHistory,
          {
            type: 'answer',
            content: imageResponse.data.task_result.image_url
          }
        ]);
      }      
    } catch (error) {
      console.error('Error getting image:', error);
    }
  };

  return (
      <div className="w-full">
        {
          imageHistory.length > 0 ? imageHistory.map((item, key) => (
            <div key={key}>
              <div className="border-[1px] border-gray-700 rounded-[16px] p-3 mt-2 mb-2 flex flex-col gap-3">
                <p className="text-[16px]">{item.type}</p>
                <div className="text-gray-600 flex text-[16px] gap-1 justify-between">
                  <div className="flex gap-1">
                    <span className="w-full">{item.content}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
          :
          <Image className="m-auto mt-32" src={"/logo.svg"} height={300} width={300} alt="" />
        }
        <div className={`flex search-btn text-left absolute bottom-10 w-3/4 m-auto`}>
          <input
            className="inline-block p-[14px] bg-transparent text-[14px] search-txt w-full"
            type="text"
            name="text"
            placeholder="What are you looking for?"
            onChange={(e: any) => setSearchQuery(e.target.value)}
            disabled={loading}
          />
          <div className="inline-block float-right cursor-pointer">
            {
              loading ? 
                <button className="send-btn">Loading ...</button>
              :
                <button className="send-btn flex items-center p-[15px]" onClick={()=> getContent()}>
                  <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.5698 8.50989L10.0098 4.22989C4.25978 1.34989 1.89978 3.70989 4.77978 9.45989L5.64978 11.1999C5.89978 11.7099 5.89978 12.2999 5.64978 12.8099L4.77978 14.5399C1.89978 20.2899 4.24978 22.6499 10.0098 19.7699L18.5698 15.4899C22.4098 13.5699 22.4098 10.4299 18.5698 8.50989ZM15.3398 12.7499H9.93977C9.52978 12.7499 9.18977 12.4099 9.18977 11.9999C9.18977 11.5899 9.52978 11.2499 9.93977 11.2499H15.3398C15.7498 11.2499 16.0898 11.5899 16.0898 11.9999C16.0898 12.4099 15.7498 12.7499 15.3398 12.7499Z" fill="white"/>
                  </svg>
                  Send
                </button>
            }
          </div>
        </div>
      </div>
  );
};

export default ImageAI;