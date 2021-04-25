import { GetRecoilValue, RecoilState, SetterOrUpdater } from 'recoil';
declare type AtomSet<Value> = undefined | ((get?: GetRecoilValue, set?: any, value?: Value) => void);
declare type AtomGet<Value> = ((get: GetRecoilValue) => Value);
declare type UseStateResult<Value> = [Value, SetterOrUpdater<Value>];
/**
 * 创造一个数组，第一个值是个hook， 第二个值是RecoilState
 * @param atomGet
 * @param param2
 * @param param3
 * @returns [useState, recoilState]
 */
declare function makeState<Value>(atomGet: AtomGet<Value> | Value, param2?: AtomSet<Value> | string, param3?: string): [
    () => UseStateResult<Value>,
    RecoilState<Value>,
    {
        key: string;
    }
];
export default makeState;
