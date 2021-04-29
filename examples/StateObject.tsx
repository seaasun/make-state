import React from 'react'
import {makeState} from '../src'

type User = {
  name: string
}
const user: User = {
  name: 'Tom'
}
const [useCount, userState] = makeState(user)

const [useName] = makeState(
  (get) => get(userState).name,
  (get, set, newValue) => {
    // 支持可变语法
    set(userState, (user: User) => {
      user.name = newValue;
    });
  }
)

const Demo2 = () => {
  const [name, setName] = useName();

  return (
    <input
      value={name}
      onChange={(e) => {
        setName(e.target.value)
      }}
    />
  )
}

function Demo () {
    const [data, setData] = useCount()
    return <div>
      {data.name}
      <button onClick = {e => {
          setData((data: User) => {data.name = 'Lisa'})
      }}>add</button>
      <Demo2 />
    </div>
}

export default Demo