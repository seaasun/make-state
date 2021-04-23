import React from 'react'
import {makeStates} from '../src'

const [useCount] = makeStates<Number | undefined, number>(undefined, 'count')

function Demo () {
    const [data1, setData1] = useCount(1)
    const [data2, setData2] = useCount(2)

    return <div>
      {data1}
      <button onClick = {() => {
          setData1(1)
      }}>add</button>

      <br />

      {data2}
      <button onClick = {() => {
          setData2(2)
      }}>add</button>

    </div>
}

export default Demo