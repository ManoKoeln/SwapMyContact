import React from "react";
import Svg, { Path } from "react-native-svg";

export default function SparkleStar({ size = 22, color = "#FFD56A" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2.5c.4 2.8 1.4 4.8 3 6.4 1.6 1.6 3.6 2.6 6.4 3-.3.05-.6.1-.9.15-2.4.4-4.2 1.4-5.5 2.7-1.3 1.3-2.3 3.1-2.7 5.5-.05.3-.1.6-.15.9-.4-2.8-1.4-4.8-3-6.4-1.6-1.6-3.6-2.6-6.4-3 2.8-.4 4.8-1.4 6.4-3 1.6-1.6 2.6-3.6 3-6.4Z"
        fill={color}
      />
    </Svg>
  );
}
