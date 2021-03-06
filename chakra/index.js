import { extendTheme } from '@chakra-ui/react'
import foundations from './foundations'
import layerStyles from './structure/layer-styles'
import textStyles from './structure/text-styles'
import styles from './styles'

const theme = extendTheme({
  ...foundations,
  layerStyles,
  textStyles,
  styles,
})

export default theme
