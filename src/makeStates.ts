import { GetRecoilValue, RecoilState, SetterOrUpdater,SetRecoilState, SerializableParam,ReadWriteSelectorFamilyOptions,
    selector, atom, useRecoilCallback, useRecoilValue, atomFamily, selectorFamily } from 'recoil'
import {getUid} from './utils'
import {produce} from 'immer'

type AtomSet<Value> = undefined | ((get?: GetRecoilValue, set?: any, value?: Value, param?: any) => void )
type AtomGet<Value> = ((get: GetRecoilValue, param?: any) => Value)

type UseStateResult<Value> =  [Value, SetterOrUpdater<Value>]

/**
 * 创建primitive atom
 * @param atomGet 
 * @param key 
 * @returns RecoilState
 */
const makeAtomState = <Value, Parameter extends SerializableParam>(
    atomGet: Value | Function,
    key: string
    ): ((param: Parameter) => RecoilState<Value>) => {
    return atomFamily<Value, Parameter>({
        key,
        default: typeof atomGet === 'function'
            ? param => (<Function>atomGet)(param)
            : atomGet
    })
}

/**
 * 创建selector
 * @param atomGet 
 * @param atomSet 
 * @param key 
 * @returns 
 */

function makeSelectState <Value, Parameter extends SerializableParam> (
    atomGet: AtomGet<Value> | Value,
    atomSet: AtomSet<Value>,
    key: string
): ((param: Parameter) => RecoilState<Value>) {
    return selectorFamily<Value, Parameter>(<ReadWriteSelectorFamilyOptions<Value, Parameter>>{
        key,
        get: (param: Parameter) => ({get}: {get: GetRecoilValue}) => {
            if (typeof atomGet === 'function') {
                return (<AtomGet<Value>>atomGet)(get, param)
            } else {
                return atomGet
            }
        },
           set: typeof atomSet !== 'function'
            ? <() => {}><unknown>undefined
            :(param: Parameter) => ({get, set}: {get: GetRecoilValue, set: SetRecoilState}, newValue: Value) => {
                atomSet(get, set, newValue, param)
            }
    })
}

/**
 * 创建存有状态的hook
 * @param myState 
 * @returns 
 */
function makeUseState <Value, Parameter>(
    myState: (param: Parameter) => RecoilState<Value>, 
    stateType: string,
     key: string): (param: Parameter) => UseStateResult<Value> {
    function useState(param: Parameter): 
        UseStateResult<Value> {
        const set = useRecoilCallback(({set}) => newValue => {
            
            if (typeof newValue === 'function') { 
                set<Value>(myState(param), state => produce(state, draft => newValue(draft)) as unknown as Value)
            } else {
                set<Value>(myState(param), newValue as Value)
            }
          })
          return [
            useRecoilValue(myState(param)),
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

function makeStates<Value, Parameter  extends SerializableParam> (
    atomGet: AtomGet<Value> | Value, 
    param2?: AtomSet<Value> | string, 
    param3?: string ): [
        (param: Parameter) => UseStateResult<Value>,
        (param : Parameter) => RecoilState<Value>,
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


    let myState: (param : Parameter) => RecoilState<Value>

    if (stateType === 'primary') {
        myState = makeAtomState<Value, Parameter>(atomGet, myKey)
    } else {
        myState = makeSelectState<Value, Parameter>(atomGet, atomSet, myKey)
    }

    return [
        makeUseState<Value, Parameter>(myState, stateType, myKey),
        myState,
        {
            key: myKey
        }
    ]
}

export default makeStates