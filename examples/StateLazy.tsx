import React from 'react'
import {makeState} from '../src'

const [,init] = makeState(() => {
  console.log(9)
  return 5
})

const [useCount, count] = makeState<any>(init)

function Demo () {
    const [data, setData] = useCount()
    console.log(data)
    return <div>
      11{data}
      <button onClick = {e => {
          setData(3)
      }}>add</button>

  </div>
  // return <div>33</div>
}

export default Demo