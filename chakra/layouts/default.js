import { DefaultSeo } from 'next-seo'
import { Box, Flex } from '@chakra-ui/react'
import useColor from '../hooks/use-color'

import { Header, ModeToggle } from '../components';
import {AuthButton} from '../../components/auth/auth-buttons'
import CustomLink from '../../components/custom-link'
import { NavProvider } from '../contexts/nav-context'
import { useToastState } from '../contexts/toast-context'
import { LogoIcon } from '@/components';

import data from '../../config/setup.json'

function DefaultLayout({ title, SEO, config, children }) {
  const { color } = useColor()
  const { msg, toast } = useToastState()
  React.useEffect(() => {
    if (!msg) return
    toast(msg)
  }, [msg])

  return (
    <>
      <DefaultSeo {...SEO} />
      <ModeToggle />
      <Flex className="wrapper" layerStyle="wrapper">
        <NavProvider>
          <Header
            title="Proto UI"
            pages={data?.pages}
            controls={[AuthButton, CustomLink]}
            headerShow={config?.headerShow}
            bg={color('barBg')}
            Logo={LogoIcon}
          />
        </NavProvider>
        <Box as="main" layerStyle="main">
          {children}
        </Box>
        <Flex
          as="footer"
          bg={color('barBg')}
          layerStyle="footer"
          display={config?.footerShow ? 'flex' : 'none'}
        >
          <Box layerStyle="footer.body">Footer</Box>
        </Flex>
      </Flex>
    </>
  );
}

export default DefaultLayout
