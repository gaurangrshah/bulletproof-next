// import React, {useState, useEffect} from 'react'
// import { Button } from '@chakra-ui/react'

// const ToggleButton = ({
//   actions,
//   condition,
//   labels,
//   variant = 'outline',
//   ...rest
// }) => {

//   const [activated, setActivated] = useState(false)

//   useEffect(() => {
//     condition ? setActivated(true) : setActivated(false)
//     return () => {
//       setActivated(false)
//     }
//   }, [condition])

//   return (
//     <Button
//       variant={variant}
//       onClick={activated ? actions[0]() : actions[1]()}
//       {...rest}
//     >
//       {activated ? labels[0] : labels[1]}
//     </Button>
//   )
// }

// export default ToggleButton

// // TODO: create a ToggleLink with next/link
