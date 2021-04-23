import React from 'react'
import {makeStates} from '../src'

const [useCount,count] = makeStates(1, 'count')

const [useDouble] = makeStates(
    (get,props) => get(count(props)) + props
)


function Demo () {
    const [,setData1] = useCount(2)
    const [,setData2] = useCount(4)
    const [data1, setDataWrong] = useDouble(2)
    const [data2] = useDouble(4)

    return <div>
      {data1}
      <button onClick = {() => {
          setData1((data: number) => data + 1)
      }}>add</button>

      <br />

      {data2}
      <button onClick = {() => {
          setData2((data: number) => data + 1)
      }}>add</button>

      <br />
      <button onClick = {() => {
          setDataWrong((data: number) => data + 1)
      }}>add</button>
    </div>
}

export default Demo