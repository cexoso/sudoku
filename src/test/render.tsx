import { Container } from '@/container'
import App from '@/ui/app'
import { render as reactRender, cleanup, act } from '@testing-library/react'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { Subject } from 'rxjs'

type ReactRenderArgs = Parameters<typeof reactRender>

type TaskDescription = {
  taskSetup: () => void
  onTaskDone: () => void
}

// taskSetup 在组件 render 阶段执行，此时可以合法调用 hook
function TaskRunner(props: { taskSetup: () => void; onTaskDone: () => void }) {
  props.taskSetup()
  useEffect(() => {
    props.onTaskDone()
  })
  return null
}

// InitRunner 在首次 render 阶段执行 init（可调用 hook），只执行一次
function InitRunner(props: { init: () => void; children: ReactNode }) {
  const ran = useRef(false)
  if (!ran.current) {
    ran.current = true
    props.init()
  }
  return <>{props.children}</>
}

function PlayContainer(props: {
  children: ReactNode
  taskSubject: Subject<TaskDescription>
  init?: () => void
}) {
  const [list, setList] = useState<TaskDescription[]>([])

  useEffect(() => {
    const sub = props.taskSubject.subscribe((task) => setList((prev) => [...prev, task]))
    return () => sub.unsubscribe()
  }, [props.taskSubject])

  const content = props.init ? (
    <InitRunner init={props.init}>{props.children}</InitRunner>
  ) : (
    props.children
  )

  return (
    <>
      {list.map((task, key) => (
        <TaskRunner
          key={key}
          taskSetup={task.taskSetup}
          onTaskDone={() => {
            task.onTaskDone()
            setList((prev) => prev.filter((t) => t !== task))
          }}
        />
      ))}
      {content}
    </>
  )
}

function destroyIfNeed() {
  cleanup()
  document.body.innerHTML = ''
}

export function render(
  maybeComponent?: ReactRenderArgs[0],
  options?: { init?: () => void } & ReactRenderArgs[1],
) {
  destroyIfNeed()
  const { init, ...restOptions } = options ?? {}
  const subject = new Subject<TaskDescription>()
  const Component = maybeComponent ?? <App />
  const dom = document.createElement('div')
  document.body.appendChild(dom)

  const result = reactRender(
    <Container>
      <PlayContainer taskSubject={subject} init={init}>
        {Component}
      </PlayContainer>
    </Container>,
    { ...restOptions, container: dom },
  )

  function play(cb: () => void): Promise<void> {
    return new Promise((resolve) =>
      act(() => {
        subject.next({ taskSetup: cb, onTaskDone: resolve })
      }),
    )
  }

  return { ...result, play }
}
