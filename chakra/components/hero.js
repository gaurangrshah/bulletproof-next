import React from "react";
import { Image } from "@chakra-ui/react";
import { FlexContainer } from "../../chakra/components/sections/flex-container";
// import { Block } from "../block";

export const Hero = ({ block }) => {
  const { src, ...restBlock } = block;

  return (
    <FlexContainer
      components={[
        // <Block
        //   block={restBlock}
        //   btnLayout={{ mt: "5%", ml: "70%" }}
        //   blockConfig={{
        //     textAlign: ["center", null, "left"],
        //     ml: 12,
        //     p: 6,
        //   }}
        //   minH='50vh'
        //   flexDirection={["column", null, "center"]}
        //   justifyContent='center'
        //   mt={-8}
        // />,
        <Image src={`static${src}`} overflow='hidden' w='full' />,
      ]}
    />
  );
};
