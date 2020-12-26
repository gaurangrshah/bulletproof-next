import {
  Box,
  Button,
  chakra,
  Flex,
  Link as ChakraLink,
  shouldForwardProp,
} from "@chakra-ui/react";
import Link from 'next/link'

import React from 'react'

const NextLink = chakra(Link, {
  shouldForwardProp: (prop) => {
    // don't forward Chakra's props
    const isChakraProp = !shouldForwardProp(prop);
    if (isChakraProp) return false;

    // else, only forward `sample` prop
    return ["href", 'passHref', 'children'].includes(prop);
  },
});

export const SimpleNextLink = ({ href, children, rest }) => {
  return (
    <NextLink href={href} passHref>
      <Box
        as={ChakraLink}
        // _hover={{
        //   textDecoration: 'none',
        // }}
        {...rest}
      >
        {children}
      </Box>
    </NextLink>
  )
}

export const SimpleNextButtonLink = ({
  href,
  children,
  layout = { maxW: '100px' },
  rest,
}) => {
  return (
    <Flex {...layout}>
      <NextLink href={href} passHref>
        <Button
          as={ChakraLink}
          _hover={{
            textDecoration: 'none',
          }}
          {...rest}
        >
          {children}
        </Button>
      </NextLink>
    </Flex>
  )
}
