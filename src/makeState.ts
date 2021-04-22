import { GetRecoilValue, RecoilState,
    selector, atom, useRecoilCallback, useRecoilValue } from 'recoil'
import {getUid} from './utils'
import {produce} from 'immer'

type AtomSet = () => void

const makeAtomState = <T>(
    atomGet: T,
    key: string
    ): RecoilState<T> => {
    return atom<T>({
        key,
        default: atomGet
        // default: typeof atomGet !== 'function'
        //     ? atomGet
        //     : selector({
        //         key: 'make-state-default-' + key,
        //         get: ({get}) => {
        //             // 后续增强功能
        //             // let dripGet = get
        //             // dripGet.get = get
        //             // return atomGet(dripGet)

        //             return atomGet(get)
        //         }
        //     })
    })
}

const makeSelectState =  <T>(
    atomGet: T,
    atomSet: any,
    key: string
): any => {
    const a = {
        a: undefined
    }
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
            ? (<AtomSet>(<any>undefined))
            : ({get, set}, newValue) => {
                atomSet(get, set, newValue)
            }
    })
}

const makeUseState = <T>(myState: RecoilState<T>) => () => {
    const set = useRecoilCallback(({set}) => newValue => {
        if (typeof newValue === 'function') {
            set<T>(myState, state => produce(state, draft => newValue(draft)) as unknown as T)
        } else {
            set<T>(myState, newValue as T)
        }
      })
      return [
        useRecoilValue(myState),
        set
      ]
}



function makeState<T> (
    atomGet: T, 
    param2?: AtomSet | string, 
    param3?: string ):
    [
        () => any, 
        RecoilState<T>
    ] {

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

    let myState: RecoilState<T>
    if (typeof atomGet === 'function') {
        myState = makeAtomState<T>(atomGet, myKey)
    } else {
        myState = makeSelectState<T>(atomGet, atomSet, myKey)
    }

    return [
        makeUseState<T>(myState),
        myState
    ]
}

export default makeState