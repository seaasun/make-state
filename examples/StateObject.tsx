import React from 'react'
import {makeState} from '../src'

type User = {
  name: string
}

const [useCount] = makeState<User>({
  name: 'TOM'
})

function Demo () {
    const [data, setData] = useCount()
    return <div>
      {data.name}
      <button onClick = {e => {
          setData((data: User) => {data.name = 'Lisa'})
      }}>add</button>
    </div>
}

export default Demo