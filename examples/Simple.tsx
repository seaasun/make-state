import React from 'react'
import {makeState} from '../src'


const [useCount] = makeState<() => number>(() => 5)

function Simple () {
    const [data, setData] = useCount()
    return <div>
      {data}
      <button onClick = {e => {
          setData((data: number) => data + 1)
      }}>add</button>
    </div>
}

export default Simple