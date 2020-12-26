import Link from "next/link";
import NextImage from "next/image";
import { chakra, Image as ChImage } from "@chakra-ui/react";
import Markdown from "markdown-to-jsx";

import Theme from "../components/Theme";
import { getPageSections } from "@/lib/data";
import { FlexContainer } from "@/chakra/components/flex-container";
import { extractLinks, extractImages } from "@/lib/extract-from-md";
import { SimpleNextButtonLink } from "@/chakra/components/link/next-chakra-link";

const HeroImage = chakra(NextImage);
const CHMarkdown = chakra(Markdown);

export default function Home({ sections }) {
  console.log("🚀 ~ file: index.js ~ line 8 ~ Home ~ sections", sections);

  sections.map(section => {
    section.image = extractImages(section.content);
    return section
  })

  console.log(sections)
  return (
    <Theme>
      <div className='content'>
        <FlexContainer
          minH='50vh'
          flexDirection={["column", null, "center"]}
          justifyContent='center'
          components={[
            <HeroImage
              src={sections[0].image}
              overflow='hidden'
              layout='fill'
              mt={6}
              zIndex={0}
            />,
            <CHMarkdown
              options={{
                overrides: {
                  a: { component: SimpleNextButtonLink },
                },
              }}
              zIndex={1}
              sx={{
                "& p": {
                  fontSize: "lg",
                  fontWeight: 600,
                  color: "blue.200",
                },
                "& h2": {
                  fontSize: "4xl",
                  fontWeight: 600,
                  color: "blue.500",
                },
                "& img": {
                  display: "none",
                },
              }}
            >
              {sections[0].content}
            </CHMarkdown>,
          ]}
        />
      </div>
    </Theme>
  );
}

export async function getStaticProps() {
  let sections;
  try {
     sections = await getPageSections("home")
  } catch (err) {
    if(err.status !== 404) {
      throw err;
    }
  }



  return {
    props: {
      sections,
    },
    revalidate: 2,
  };
}
