import React from 'react'
import {makeState} from '../src'

const [useCount, count] = makeState(5)
const [useDouble, double] = makeState(
  (get) => get(count) + 'hi',
  'doubleRead'
)
console.log(double)

function Demo () {
    const [data, setData] = useCount()
    const [data2, setData2] = useDouble()
    return <div>
      {data}, {data2}
      <button onClick = {e => {
          setData((data: number) => data + 1)
      }}>add</button>

<button onClick = {e => {
          setData2('g3')
      }}>wrong</button>
    </div>
}

export default Demo