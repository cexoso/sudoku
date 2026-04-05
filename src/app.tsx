import { ReactNode, FC } from 'react'
import { Container } from './container'
import UIApp from './ui/app'

export const Player: FC<{
  children?: ReactNode
  onInit?: () => Promise<any> | unknown
}> = (props) => {
  // 这里做成支持异步的方式
  props.onInit?.()
  return props.children
}

export const App: FC<{ onInit?: () => Promise<any> | void }> = (props) => (
  <Container>
    <Player onInit={props.onInit}>
      <UIApp />
    </Player>
  </Container>
)
