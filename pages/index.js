import Link from "next/link";
import Image from 'next/image'
import Theme from "../components/Theme";
import { getPageSections } from "../lib/data";
import { matter } from "gray-matter";
import Markdown from "markdown-to-jsx";
import Youtube from "../components/Youtube"

const NextLink = (href, label) => {
  return (
    <Link {...href} test="test">
      <a>{label}</a>
    </Link>
  );
};

const NextImage = (src, alt) => {
  <Image
    {...src}
    {...alt}
    layout="fill"
    objectFit="cover"
    style={{maxHeight: '60vh'}}
  />
}

export default function Home({ sections }) {
  console.log("🚀 ~ file: index.js ~ line 8 ~ Home ~ sections", sections);
  return (
    <Theme>
      <div className='content'>
        <Markdown
          options={{
            overrrides: {
              a: { component: NextLink, props: { passHref: true } },
              Youtube: { component: Youtube },
              img: {component: NextImage}
            },
          }}
        >
          {sections[0].content}
        </Markdown>
      </div>
    </Theme>
  );
}

export async function getStaticProps() {
  const sections = await getPageSections("home");

  return {
    props: {
      sections,
    },
    revalidate: 2,
  };
}
