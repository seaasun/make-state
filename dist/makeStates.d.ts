import { GetRecoilValue, RecoilState, SetterOrUpdater, SerializableParam } from 'recoil';
declare type AtomSet<Value> = undefined | ((get: GetRecoilValue, set: any, value: Value, param?: any) => void);
declare type AtomGet<Value> = ((get: GetRecoilValue, param?: any) => Value);
declare type UseStateResult<Value> = [Value, SetterOrUpdater<Value>];
/**
 * 创造一个数组，第一个值是个hook， 第二个值是RecoilState
 * @param atomGet
 * @param param2
 * @param param3
 * @returns [useState, recoilState]
 */
declare function makeStates<Value, Parameter extends SerializableParam>(atomGet: AtomGet<Value> | Value, param2?: AtomSet<Value> | string, param3?: string): [
    (param: Parameter) => UseStateResult<Value>,
    (param: Parameter) => RecoilState<Value>,
    {
        key: string;
    }
];
export default makeStates;
