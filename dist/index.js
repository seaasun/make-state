import{atom as t,selector as e,useRecoilCallback as o,useRecoilValue as n,atomFamily as r,selectorFamily as i}from"recoil";export{RecoilRoot}from"recoil";import{v4 as f}from"uuid";import{produce as u}from"immer";function y(){return f()}function c(t,e,r){return function(){const i=o((({set:e})=>o=>{e(t,"function"==typeof o?t=>u(t,(t=>o(t))):o)}));return[n(t),"read-only"===e?t=>{throw new Error(` Attempt to set read-only RecoilValue: ${r}(set new Value: ${t})`)}:i]}}function a(o,n,r){let i,f,u,a="make-state-"+y();return r?("function"==typeof n?(f="read-write",i=n):f="read-only",a=r):"function"==typeof n?(f="read-write",i=n):"function"==typeof o?f="read-only":(f="primary","string"===n&&(a=n)),u="primary"===f?((e,o)=>t({key:o,default:"function"==typeof e?e():e}))(o,a):((t,o,n)=>e({key:n,get:({get:e})=>"function"==typeof t?t(e):t,set:"function"!=typeof o?void 0:({get:t,set:e},n)=>{o(t,e,n)}}))(o,i,a),[c(u,f,a),u,{key:a}]}function p(t,e,r){return function(i){const f=o((({set:e})=>o=>{e(t(i),"function"==typeof o?t=>u(t,(t=>o(t))):o)}));return[n(t(i)),"read-only"===e?t=>{throw new Error(` Attempt to set read-only RecoilValue: ${r}(set new Value: ${t})`)}:f]}}function l(t,e,o){let n,f,u,c="make-state-"+y();return o?("function"==typeof e?(f="read-write",n=e):f="read-only",c=o):"function"==typeof e?(f="read-write",n=e):"function"==typeof t?f="read-only":(f="primary","string"===e&&(c=e)),u="primary"===f?((t,e)=>r({key:e,default:"function"==typeof t?e=>t(e):t}))(t,c):function(t,e,o){return i({key:o,get:e=>({get:o})=>"function"==typeof t?t(o,e):t,set:"function"!=typeof e?void 0:t=>({get:o,set:n},r)=>{e(o,n,r,t)}})}(t,n,c),[p(u,f,c),u,{key:c}]}export default a;export{a as makeState,l as makeStates};
