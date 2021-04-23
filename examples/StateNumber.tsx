import React from 'react'
import {makeState} from '../src'

const [useCount, count, {key}] = makeState(5, 'count')

console.log(333, key)

function Demo () {
    const [data, setData] = useCount()
    return <div>
      {data}
      <button onClick = {() => {
          setData((data) => data + 1)
      }}>add</button>
    </div>
}

export default Demo