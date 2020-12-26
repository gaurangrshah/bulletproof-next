import { extendTheme } from '@chakra-ui/react'
// import chakraTheme from '@chakra-ui/theme'
import foundations from './foundations'
import layerStyles from './structure/layer-styles'
import styles from './styles'

const theme = extendTheme({
  // ...chakraTheme,
  ...foundations,
  layerStyles,
  styles,
})

export default theme
