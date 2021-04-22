import React from 'react'
import {makeState} from '../src'

const [useCount] = makeState(5)

function Demo () {
    const [data, setData] = useCount()
    return <div>
      {data}
      <button onClick = {e => {
          setData((data: number) => data + 1)
      }}>add</button>
    </div>
}

export default Demo