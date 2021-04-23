import React from 'react'
import {makeStates} from '../src'

type User = {
    name: string
  }

const [useCount, count, {key}] = makeStates<User, string>({
    name: 'Tom'
}, 'count')

function Demo () {
    const [data1, setData1] = useCount('a')
    const [data2, setData2] = useCount('b')

    return <div>
      {data1.name}
      <button onClick = {() => {
          setData1((data) => {data.name = 'Lisa'})
      }}>add</button>

      <br />

      {data2.name}
      <button onClick = {() => {
          setData2((data) => {data.name = 'Hi'})
      }}>add</button>

    </div>
}

export default Demo