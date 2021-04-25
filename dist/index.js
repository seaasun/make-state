import { atom, selector, useRecoilCallback, useRecoilValue, atomFamily, selectorFamily } from 'recoil';
import { v4 } from 'uuid';
import { produce } from 'immer';

function getUid() {
    return v4();
}

/**
 * 创建primitive atom
 * @param atomGet
 * @param key
 * @returns RecoilState
 */
const makeAtomState$1 = (atomGet, key) => {
    return atom({
        key,
        default: typeof atomGet === 'function'
            ? atomGet()
            : atomGet
    });
};
/**
 * 创建selector
 * @param atomGet
 * @param atomSet
 * @param key
 * @returns
 */
const makeSelectState$1 = (atomGet, atomSet, key) => {
    return selector({
        key,
        get: ({ get }) => {
            if (typeof atomGet === 'function') {
                return atomGet(get);
            }
            else {
                return atomGet;
            }
        },
        set: typeof atomSet !== 'function'
            ? undefined
            : ({ get, set }, newValue) => {
                atomSet(get, set, newValue);
            }
    });
};
/**
 * 创建存有状态的hook
 * @param myState
 * @returns
 */
function makeUseState$1(myState, stateType, key) {
    function useState() {
        const set = useRecoilCallback(({ set }) => newValue => {
            if (typeof newValue === 'function') {
                set(myState, state => produce(state, draft => newValue(draft)));
            }
            else {
                set(myState, newValue);
            }
        });
        return [
            useRecoilValue(myState),
            stateType === 'read-only' ? (value) => {
                throw new Error(` Attempt to set read-only RecoilValue: ${key}(set new Value: ${value})`);
            } : set
        ];
    }
    return useState;
}
/**
 * 创造一个数组，第一个值是个hook， 第二个值是RecoilState
 * @param atomGet
 * @param param2
 * @param param3
 * @returns [useState, recoilState]
 */
function makeState(atomGet, param2, param3) {
    let atomSet;
    let myKey = 'make-state-' + getUid();
    let stateType;
    if (param3) {
        if (typeof param2 === 'function') {
            stateType = 'read-write';
            atomSet = param2;
        }
        else {
            stateType = 'read-only';
        }
        myKey = param3;
    }
    else if (typeof param2 === 'function') {
        stateType = 'read-write';
        atomSet = param2;
    }
    else if (typeof atomGet === 'function') {
        stateType = 'read-only';
    }
    else {
        stateType = 'primary';
        if (param2 === 'string') {
            myKey = param2;
        }
    }
    let myState;
    if (stateType === 'primary') {
        myState = makeAtomState$1(atomGet, myKey);
    }
    else {
        myState = makeSelectState$1(atomGet, atomSet, myKey);
    }
    return [
        makeUseState$1(myState, stateType, myKey),
        myState,
        {
            key: myKey
        }
    ];
}

/**
 * 创建primitive atom
 * @param atomGet
 * @param key
 * @returns RecoilState
 */
const makeAtomState = (atomGet, key) => {
    return atomFamily({
        key,
        default: typeof atomGet === 'function'
            ? param => atomGet(param)
            : atomGet
    });
};
/**
 * 创建selector
 * @param atomGet
 * @param atomSet
 * @param key
 * @returns
 */
function makeSelectState(atomGet, atomSet, key) {
    return selectorFamily({
        key,
        get: (param) => ({ get }) => {
            if (typeof atomGet === 'function') {
                return atomGet(get, param);
            }
            else {
                return atomGet;
            }
        },
        set: typeof atomSet !== 'function'
            ? undefined
            : (param) => ({ get, set }, newValue) => {
                atomSet(get, set, newValue, param);
            }
    });
}
/**
 * 创建存有状态的hook
 * @param myState
 * @returns
 */
function makeUseState(myState, stateType, key) {
    function useState(param) {
        const set = useRecoilCallback(({ set }) => newValue => {
            if (typeof newValue === 'function') {
                set(myState(param), state => produce(state, draft => newValue(draft)));
            }
            else {
                set(myState(param), newValue);
            }
        });
        return [
            useRecoilValue(myState(param)),
            stateType === 'read-only' ? (value) => {
                throw new Error(` Attempt to set read-only RecoilValue: ${key}(set new Value: ${value})`);
            } : set
        ];
    }
    return useState;
}
/**
 * 创造一个数组，第一个值是个hook， 第二个值是RecoilState
 * @param atomGet
 * @param param2
 * @param param3
 * @returns [useState, recoilState]
 */
function makeStates(atomGet, param2, param3) {
    let atomSet;
    let myKey = 'make-state-' + getUid();
    let stateType;
    if (param3) {
        if (typeof param2 === 'function') {
            stateType = 'read-write';
            atomSet = param2;
        }
        else {
            stateType = 'read-only';
        }
        myKey = param3;
    }
    else if (typeof param2 === 'function') {
        stateType = 'read-write';
        atomSet = param2;
    }
    else if (typeof atomGet === 'function') {
        stateType = 'read-only';
    }
    else {
        stateType = 'primary';
        if (param2 === 'string') {
            myKey = param2;
        }
    }
    let myState;
    if (stateType === 'primary') {
        myState = makeAtomState(atomGet, myKey);
    }
    else {
        myState = makeSelectState(atomGet, atomSet, myKey);
    }
    return [
        makeUseState(myState, stateType, myKey),
        myState,
        {
            key: myKey
        }
    ];
}

export { makeState, makeStates };
