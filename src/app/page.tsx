import CardWithImage from "@/components/card-with-image";
import Header from "@/components/main/header";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import SuggestionCard from "@/components/suggestion-card/suggestion-card";
import React from "react";

const Home = () => {
  return (
    <div className="flex">
      <div className="w-[478px] relative">
        <Sidebar />
      </div>

      <div className="w-full">
        <Navbar />
        <Header />

        <div className="flex flex-col gap-1 ml-6 mt-10">
          <h1 className="text-2xl">What do you need?</h1>
          <p className="text-gray-500">
            All services are available and you can use with your current
            account!
          </p>

          <div className="flex flex-wrap mt-6">
            <CardWithImage cardName="Text AI" cardImage="/images/pic1.png" />
            <CardWithImage cardName="Image AI" cardImage="/images/pic2.png" />
            <CardWithImage cardName="Voice AI" cardImage="/images/pic3.png" />
            <CardWithImage cardName="Text AI" cardImage="/images/pic4.png" />
          </div>
        </div>

        <div className="flex flex-wrap">
        <SuggestionCard />
        </div>
      </div>
    </div>
  );
};

export default Home;
