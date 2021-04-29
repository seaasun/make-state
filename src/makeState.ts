import { GetRecoilValue, RecoilState, SetterOrUpdater,SetRecoilState,
    selector, atom, useRecoilCallback, useRecoilValue, } from 'recoil'
import {getUid} from './utils'
import {produce} from 'immer'

type Set<Value> = (state: RecoilState<Value>, cb: Cb<Value>) => void

type AtomSet<Value> = undefined | ((get: GetRecoilValue, set: any, value: Value) => void )
type AtomGet<Value> = ((get: GetRecoilValue) => Value)

type UseStateResult<Value> =  [Value, SetterOrUpdater<Value>]

/**
 * 创建primitive atom
 * @param atomGet 
 * @param key 
 * @returns RecoilState
 */
const makeAtomState = <Value>(
    atomGet: Value | Function,
    key: string
    ): RecoilState<Value> => {
    return atom<Value>({
        key,
        default: typeof atomGet === 'function'
            ? (<Function>atomGet)()
            : atomGet
    })
}

type Cb<Value> = (draft: Value) => void | Value

/**
 * 创建selector
 * @param atomGet 
 * @param atomSet 
 * @param key 
 * @returns 
 */
const makeSelectState =  <Value>(
    atomGet: AtomGet<Value> | Value,
    atomSet: AtomSet<Value>,
    key: string
): RecoilState<Value> => {
    return selector<Value>({
        key,
        get: ({get}: {get: GetRecoilValue}) => {
            if (typeof atomGet === 'function') {
                return (<AtomGet<Value>>atomGet)(get)
            } else {
                return atomGet
            }
        },
        set: typeof atomSet !== 'function'
            ? <() => {}><unknown>undefined
            : ({get, set}: {get: GetRecoilValue, set: SetRecoilState}, newValue) => {
                const mySet = (state: RecoilState<Value>, cb: Cb<Value>): void => {
                    set(state, typeof cb === 'function'
                        ? state => produce(state, (draft: Value) => cb(draft)) as unknown as Value
                        : cb
                    )
                }
                atomSet(get, mySet, <Value>newValue)
            }
    })
}

/**
 * 创建存有状态的hook
 * @param myState 
 * @returns 
 */
function makeUseState <Value>(myState: RecoilState<Value>, stateType: string, key: string): () => UseStateResult<Value> {
    function useState(): 
        UseStateResult<Value> {
        const set = useRecoilCallback(({set}) => newValue => {
            
            if (typeof newValue === 'function') { 
                set<Value>(myState, state => produce(state, draft => newValue(draft)) as unknown as Value)
            } else {
                set<Value>(myState, newValue as Value)
            }
          })
          return [
            useRecoilValue(myState),
            stateType === 'read-only' ? (value) => {
                throw new Error(` Attempt to set read-only RecoilValue: ${key}(set new Value: ${value})`)
            } : set
          ]
    }
    return useState
}

/**
 * 创造一个数组，第一个值是个hook， 第二个值是RecoilState
 * @param atomGet 
 * @param param2 
 * @param param3 
 * @returns [useState, recoilState]
 */

function makeState<Value> (
    atomGet: AtomGet<Value> | Value, 
    param2?: AtomSet<Value> | string, 
    param3?: string ): [
        () => UseStateResult<Value>,
        RecoilState<Value>,
        {
            key: string
        }
        ]
    {

    let atomSet: AtomSet<Value>
    let myKey: string = 'make-state-' + getUid()
    let onlyRead = false
    let stateType: 'primary' | 'read-only' | 'read-write'

    if (param3) {
        if (typeof param2 === 'function') {
            stateType = 'read-write'
            atomSet = param2
        } else {
            stateType = 'read-only'
        }
        myKey = param3
    } else if (typeof param2 === 'function') {
        stateType = 'read-write'
        atomSet = param2
    } else if (typeof atomGet === 'function') {
        stateType = 'read-only'
    } else {
        stateType = 'primary'
        if (param2 === 'string') {
            myKey = param2
        }
    } 

    let myState: RecoilState<Value>
    if (stateType === 'primary') {
        myState = makeAtomState<Value>(atomGet, myKey)
    } else {
        myState = makeSelectState<Value>(atomGet, atomSet, myKey)
    }

    return [
        makeUseState<Value>(myState, stateType, myKey),
        myState,
        {
            key: myKey
        }
    ]
}

export default makeState



const cb = (): void => {}

const run = (cb: (a:string) => void) => {
    cb('b')
}

run (cb)