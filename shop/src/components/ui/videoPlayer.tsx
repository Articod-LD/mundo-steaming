import { useState } from "react";
import Image from "./image";

const VideoPlayer = ({ videoSrc, previewImage }: any) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <div className="relative w-full mx-auto ">
      {!isPlaying ? (
        <div
          className="w-full h-full relative cursor-pointer"
          onClick={handlePlay}
        >
          <Image
            className="-z-10"
            src="/sobreNosotrospng.png"
            layout="fill"
            objectFit="cover"
            quality={100}
            alt="img banner"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <svg
              className="w-16 h-16 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1.5-5.59V7.59l5.5 2.41-5.5 2.41z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      ) : (
        <div className="w-full h-0 pb-[56.25%] relative">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={videoSrc}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube video player"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;