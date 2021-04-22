import { GetRecoilValue, RecoilState, SetterOrUpdater,
    selector, atom, useRecoilCallback, useRecoilValue } from 'recoil'
import {getUid} from './utils'
import {produce} from 'immer'

type AtomSet = (get?: any, set?: any, value?: any) => void

const makeAtomState = <T>(
    atomGet: T,
    key: string
    ): RecoilState<T> => {
    return atom<T>({
        key,
        default: atomGet
    })
}

const makeSelectState =  <T>(
    atomGet: T,
    atomSet: AtomSet | undefined,
    key: string
): RecoilState<T> => {
    return selector({
        key,
        get: ({get}) => {
            if (typeof atomGet === 'function') {
                return atomGet(get)
            } else {
                return atomGet
            }
        },
        set: typeof atomSet !== 'function' 
            ? (<AtomSet><unknown>undefined)
            : ({get, set}, newValue) => {
                atomSet(get, set, newValue)
            }
    })
}

function makeUseState <Value>(myState: RecoilState<Value>): () => [Value, SetterOrUpdater<Value>] {
    function useState(): 
        [Value, SetterOrUpdater<Value>] {
        const set = useRecoilCallback(({set}) => newValue => {
            if (typeof newValue === 'function') { 
                set<Value>(myState, state => produce(state, draft => newValue(draft)) as unknown as Value)
            } else {
                set<Value>(myState, newValue as Value)
            }
          })
          return [
            useRecoilValue(myState),
            set
          ]
    }
    return useState
}


function makeState<Value> (
    atomGet: any, 
    param2?: AtomSet | string, 
    param3?: string ): [
        () => [Value, SetterOrUpdater<Value>],
        RecoilState<Value>
        ]
    {

    let atomSet: AtomSet | undefined
    let myKey: string = getUid()

    if (param3) {
        myKey = param3
    } else if (param2 ) {
        if (typeof param2 === 'string') {
            myKey = param2
        } else if (typeof param2 === 'function'){
            atomSet = param2
        }
    }

    let myState: RecoilState<Value>
    if (typeof atomGet !== 'function') {
        myState = makeAtomState<Value>(atomGet, myKey)
    } else {
        myState = makeSelectState<Value>(atomGet, atomSet, myKey)
    }

    return [
        makeUseState<Value>(myState),
        myState
    ]
}


export default makeState