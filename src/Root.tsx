import React from "react";
import { Composition } from "remotion";
import { WebAgencyIntro }   from "./Composition";
import { StorefrontVideo }  from "./MainComposition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Original 16:9 cinematic composition */}
      <Composition
        id="WebAgencyIntro"
        component={WebAgencyIntro}
        durationInFrames={900}
        fps={60}
        width={1920}
        height={1080}
        defaultProps={{}}
      />

      {/* New 9:16 vertical Storefront video */}
      <Composition
        id="StorefrontVideo"
        component={StorefrontVideo}
        durationInFrames={720}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
    </>
  );
};
