import React, { FC } from 'react'
import { TitleComponent } from './styled-components'

const Title: FC = ({ children }) => {
  return <TitleComponent>{children}</TitleComponent>
}

export default Title