import React, {useEffect} from 'react'
import {atom, selector, useRecoilState, useRecoilValue} from 'recoil'
import { makeState } from '../src'

// const b = selector({
//     key: 'b',
//     get: 'b'
// })

// const a = atom({
//     default: b,
//     key: 'a'
// })

function Lab () {
    // const text= useRecoilValue(b)
    // // useEffect(()=> {
    // //     setText(4)
    // // })
    // console.log(text)
    return <div>
        {/* {text} */}
    </div>
}

export default Lab