import React from 'react'
import {makeState} from '../src'

const [useCount] = makeState<Number | undefined>(undefined)

function Demo () {
    const [data, setData] = useCount()
    return <div>
      {data}
      <button onClick = {e => {
          setData(1)
      }}>add</button>
    </div>
}

export default Demo