import React from "react";
import { Composition } from "remotion";
import { WebAgencyIntro } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="WebAgencyIntro"
        component={WebAgencyIntro}
        durationInFrames={900}
        fps={60}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
    </>
  );
};
