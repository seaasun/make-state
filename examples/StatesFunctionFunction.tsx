import React from 'react'
import makeState, {makeStates} from '../src'

const [useCount,count] = makeStates(1, 'count')

const [useDouble] = makeStates(
    props => (get) => props + get(count(props)),
    props => (get, set, newValue, ) => set(count(props), newValue)
)


function Demo () {
    const [data1, setData1] = useDouble(1)
    const [data2, setData2] = useDouble(4)

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

    </div>
}

export default Demo