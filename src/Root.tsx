import React from "react";
import { Composition } from "remotion";
import { WebAgencyIntro } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="WebAgencyIntro"
        component={WebAgencyIntro}
        durationInFrames={150}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
