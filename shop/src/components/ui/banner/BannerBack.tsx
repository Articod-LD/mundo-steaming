import React from "react";
import { Title } from "../tittleSections";
import Image from "../image";
import image from "../image";
function BannerBack({
  title,
  isBack,
  textBack,
  img,
}: {
  title: string;
  isBack: boolean;
  textBack: string;
  img: string;
}) {
  return (
    <div className="relative w-full h-[192px] py-14">
      <Image
        src={`${img}`}
        layout="fill"
        objectFit="cover"
        quality={100}
        alt="img banner"
      />

      <Title title={title} isBack={isBack} textBack={textBack} />
    </div>
  );
}

export default BannerBack;
