import {
  Box,
  Container,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";


import { getAllSections } from '@/lib/data';
import WaveDiv from "@/components/shapes/waves-div";
import MarkdownJSX from "@/chakra/components/markdown-jsx";
import { Hero } from "@/chakra/components/hero";


export default function Home({ sections }) {
  console.log("🚀 ~ file: index.js ~ line 10 ~ Home ~ sections", sections);
  return (
    <Box className='content'>
      <Hero bgimg={sections[0].image} zIndex={3}>
        <MarkdownJSX pt={12} textAlign='left' section={sections[0].content} />
      </Hero>
      <WaveDiv color='white' />
      <Container layerStyle='flexCenter' py={12} className='container'>
        <MarkdownJSX textAlign='center' section={sections[1].content} />
      </Container>
      <Container layerStyle='responsive' mb={24}>
        <Stack
          direction={["column", "row"]}
          spacing={["64px", "24px"]}
          mx='auto'
        >
          {sections[2].map((section) => (
            <Box key={section.data.title} shadow='default' borderRadius='5px'>
              <Image
                src={section.image}
                alt='Illustration by Freepik Storyset'
                boxSize='100'
              />
              <MarkdownJSX
                px={6}
                pb={6}
                textAlign='left'
                section={section.content}
                overrides={{
                  p: (props) => (
                    <Text textStyle='mdptrunc' noOfLines={3} {...props} />
                  ),
                }}
              />
            </Box>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}

export async function getStaticProps() {
  let sections;
  try {
    sections = await getAllSections("home");
  } catch (err) {
    if (err.status !== 404) {
      throw err;
    }
  }

  return {
    props: {
      sections
    },
    revalidate: 2,
  };
}
