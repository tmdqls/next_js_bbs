"use client";

import Image from "next/image";
import React from "react";


const Loading = () => {
  return (
    <div className="absolute inset-0 bg-gray-300 bg-opacity-50 z-10 flex items-center justify-center min-h-[300px] rounded-xl">
      <div className="relative w-32 h-32">
        <Image
          src="/isloading.gif"
          alt="Loading..."
          fill
          className="object-contain"
          sizes="(max-width: 768px) 50vw, 25vw"
          priority
        />
      </div>
    </div>
  );
};

export default Loading;