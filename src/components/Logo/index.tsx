import Image from "next/image";
import React from "react";

const Logo = () => {
  return (
    <Image
      src="/images/oro-gold.svg"
      alt="Logo"
      width={72}
      height={72}
      style={{
        height: "auto",
        maxWidth: "200px",
      }}
    />
  );
};

export default Logo;
