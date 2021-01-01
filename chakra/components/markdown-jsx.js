import { chakra, Text, Heading } from "@chakra-ui/react";
import Markdown from "markdown-to-jsx";

import { SimpleNextButtonLink } from "@/chakra/components/link/next-chakra-link";

const CHMarkdown = chakra(Markdown);

const MarkdownJSX = ({ section, overrides, ...rest }) => {
  return (
    <CHMarkdown
      className='md-jsx'
      {...rest}
      options={{
        overrides: {
          a: (props) => (
            <SimpleNextButtonLink
              size='xs'
              variant='ghost'
              color='gray.400'
              my={6}
              {...props}
            />
          ),
          h2: (props) => <Heading textStyle='mdh2' {...props} />,
          h5: (props) => <Heading textStyle='mdh5' {...props} />,
          h6: (props) => <Heading textStyle='mdh6' {...props} />,
          p: (props) => <Text textStyle='mdp' {...props} />,
          ...overrides,
        },
      }}
      sx={{
        "& img": {
          display: "none",
        },
      }}
    >
      {section}
    </CHMarkdown>
  );
};

export default MarkdownJSX;
//
