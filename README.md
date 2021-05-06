# make-state

简单灵活的React状态库，基于并兼容Recoil。


**特点&动机：**

[Recoil](https://github.com/facebookexperimental/Recoil)作为新一代状态管理非常好用，不过稍有点复杂，API略多。受[jotai](https://github.com/pmndrs/jotai)的灵感，简化API，提高易用性：

+ 简单的API，类似useState的用法，无需学习Recoil，5分钟上手。
+ 可以和Recoil共用，支持Recoil几乎所有特性，满足深度使用场景。

**极简示例([CodeSandbox](https://codesandbox.io/s/count-jnsft))：**
```jsx
import ReactDom from 'react-dom'
import makeState, {RecoilRoot} from 'make-state'

const [useCount] = makeState(0) // 创建状态

function Demo () {
    const [count, setCount] = useCount() // 使用状态， 类似useState

    return <div>
        {count /* 读 */}
        <button onClick = {() => {
            setCount(state => state + 1) // 写
        }}> +1
        </button>
    </div>

}

ReactDom.render(
    <RecoilRoot> {/*包裹组件，类似Provider*/}
      <Demo>
    </RecoilRoot>,
    document.getElementById('root)
)
```

## 快速起步
我们将制作一共可以显示字符长度，并拥有删除按钮的文本框。（[CodeSandBox](https://codesandbox.io/s/get-start-7hz9m)）。

### 1. 安装
```
npm i make-state --save

// or yarn
yarn add make-state
```

### 2. 使用RecoilRoot包裹React组件
使用`<RecoilRoot>`包裹应用中的其他组件， 推荐将`<RecoilRoot>`放置在根组件：

```jsx
import {RecoilRoot} from 'make-state'

ReactDOM.render(
  <ReocilRoot >
	{/* 其他内容 */}
  </ReocilRoot >
  document.getElementById('root')
)
```

make-state和Recoil中的[RecoilRoot](https://recoiljs.org/docs/api-reference/core/RecoilRoot)完全一致。如果您的项目已使用Recoil，并已添加RecoilRoot，无需此步。

### 3. 创建原始状态(primary state)
首先创建原始状态，原始状态可以是数字、字符串、对象等类型，可以被多个组件共用。makeState有两个返回值，第一个是类似`useState`的hook，第二个是原始状态。

```jsx
import makeState from 'make-state'

const [useText, textState] = makeState("hello world")

// makeState初始值支持多种类型, 如:
const [useName] = makeState('Tom')
const [useNames] = makeState(['Tom', 'Jerry'])
const [useUser] = makeState({name: 'Tom'})
```
如果你了解Recoil，会发现makeState生成的状态同atom的返回值一样，是一个RecoilState。


### 4. 在组件中使用
`makeState`返回的`useText`和React的`useState`几乎一样：`useText`返回两个值，第一个是状态，第二个是set函数。

```jsx
const Text = () => {
  const [text, setText] = useText()

  return (
    <input
      value={text /* 读 */} 
      onChange={(e) => {
        setText(e.target.value) // 写
      }}
    />
  )
}
```
执行`setText`后，所有用到`textState`的组件都将重新渲染，并返回最新的`textState`。

### 5. 创建驱动状态（drived stated）
通过对原始状态的计算，会产生一共个的状态，将其称为驱动状态（或者称作计算属性，computed data）。向`makeState`传入两个参数，将产生驱动状态。第一个参数是读值函数，通过传参`get`可以获取原始状态、其他驱动状态，第二个参数是写值函数。

下面的例子通过驱动状态计算文本长度，由于不需要写值，第二个参数传null，表示只读驱动状态。
textState是前文`makeState('hello world)`生成的状态。

```jsx
const [useTextLen] = makeState(
  (get) => get(textState).length, // 计算取值
  null // 别忘了null
)

const TextLen = () => {
  const [len] = useTextLen() // 驱动状态的使用方法和原始状态一样

  return <p>Length: {len} </p>
}
```
如果你了解Recoil，会发现此时生成的状态同selector的返回值一样，也是一个RecoilState。

### 6. 创建可写驱动状态(writeable drrived stated)
`makeState`中第二个参数传入函数，将生成一个可写驱动状态。函数中的参数 `get`获取其他状态值， `set`修改状态值，`newValue`是新传入的值。

使用可写驱动函数，删除文本的最后N位数：
```jsx
const [useDelete] = makeState(
  get => get(text),
  (get, set, newValue) => {
    set(textState, // 要修改的状态
      text => text.slice(0, text.length - newValue)) // 删除最后N（newValue）位
  }
)

const DeleteBtn = () => {
  const [, sliceText] = useDelete()

  return (
    <button
      onClick={() => {
        sliceText(1) // 删除最后1个字符，传入2则删除最后2个字符
      }}
    >
      delete
    </button>
  )
}
```
(如果你了解Recoil，会发现此时生成的状态同selector（write）的返回值一样，是一个RecoilState)


## Recipes
### 数据流
利用驱动函数，可以将一共状态转为另一个状态，像流水线一样，形成数据流。一个状态的变动会引起整个数据流自动变化（[CodeSandBox](https://codesandbox.io/s/data-flow-0nhlm)）：

```jsx
const [useCount1, count1] = makeState(1);
const [useCount2, count2] = makeState(2);
const [useCount3, count3] = makeState(3);

const [useSum, sum] = makeState(
  (get) => get(count1) + get(count2) + get(count3), null
);

const [useSumDouble] = makeState((get) => get(sum) * 2, null);
```

`count1`, `count2`等，只要有一个状态变更， `sumDouble`会自动变更。

### 异步与请求数据（Suspense）
可以在`makeState`中传入异步函数，请求数据，例如查询HackerNews中的评论（[CodeSandBox](https://codesandbox.io/s/async-9id13)）：
```jsx
import makeState, { RecoilRoot } from "make-state";

const [useCommentId, commentIdState] = makeState(2922573); // 存入评论id
const [useComment] = makeState(async (get) => {
  const data = await fetch(
    `https://hacker-news.firebaseio.com/v0/item/${get(
      commentIdState
    )}.json?print=pretty`
  );
  return data.json();
}, null); 

const Post = () => {
  const [comment] = useComment();

  return (
    <div>
      <p>comment: {comment.text}</p>
      <p>by: {comment.by}</p>
    </div>
  );
};

const Demo = () => {
  return <Suspense fallback={<div>loading...</div>}>
    <Post />
  </Suspense>
}
```
借助Recoil提供的API，还可以支持非Suspense、并行串行请求等。

### immer支持
makeState中的`set`等方法已经添加[immer](https://github.com/immerjs/immer), 可以使用可变语法（[CodeSandBox](https://codesandbox.io/s/immer1-tqf9e)），immer将自动转为不可变变量。 

```jsx {9}
const [useUser, userState] = makeState({name: 'Tom'})

function User () {
    const [user, setUser] = useUser()

    return <div>
        {user.name}
         <input onChange = {e => {
             // 支持可变语法
            setUser(user => {user.name = e.target.value})
        }}>
    </div>
}
```

可写驱动状态中的`set`同样支持可变语法（[CodeSandBox](https://codesandbox.io/s/immer2-hu2bu)）。
```jsx 
const [useUserName] = makeState(
  get => get(userState).name,
  (get, set, newValue) => {
    // 支持可变语法
    set(userState, user => {user.name = newValue})
  }
)
```

被immer包裹的变量被代理封装，给debug带来不便：
```jsx
set(userState, user => {
  console.log(user) // ??? 火星文
  user.name = newValue}
)
```
可以用immer提供的[`current`](https://immerjs.github.io/immer/current)查看当前值, make-state导出此方法：
```jsx
import makeState, {current} from 'make-state'

// 略..
set(userState, user => {
  console.log(current(user)) // 可以看懂user啦
  user.name = newValue}
)
``` 

### 从组件中传入参数
一些情况下，需要从组件向状态传入参数，此时可以用`makeStates`:

```jsx
const [useStates] = makeStates(
  someProps =>   // 通过props获取组件传入的参数
    get =>  // 同makestate的参数
      someValue,
)

// 组件中：
const [data] = useStates(someProps) // 传入参数
```

假设有一个列表，每一项有一个文本框可以输入水果价格，不同的水果有不同的价格，向make-state传入水果的名称区分修改哪个水果的价格（[CodeSandBox](https://codesandbox.io/s/make-states-384er)）：
```jsx
import { makeStates } from "make-state";

const [useFriute] = makeStates((name) => ({
  // 获取从组件中传入的水果名称
  name: name,
  price: 0.0
}));

const FriuteItem = ({ name }) => {
                                // 传入水果名称
  const [friute, setFriute] = useFriute(name);
  return (
    <div>
      {name} price:
      <input
        value={friute.price}
        onChange={(e) => {
          setFriute((friute) => {
            friute.price = e.target.value;
          });
        }}
      />
    </div>
  );
};

function Demo() {
  return (
    <div>
      <FriuteItem name="apple" />
      <FriuteItem name="banana" />
      <FriuteItem name="orange" />
    </div>
  );
}
```

### 驱动状态接收组件中传入参数 
`makeStates`也可以用于驱动状态，此时需要套一层函数获取props，只读写法如下：

```jsx
makeState(
  props =>          // 通过props获取组件传入的参数
    get => value,   // 同makestate的参数 
  null              // 表示只读
)
```

可写驱动状态：
```jsx
makeState(
  // 读
  props =>         // 通过props获取组件传入的参数
    get =>   value,// 同makeState
      
  // 写
  props =>   // 通过props获取组件传入的参数
    (get, set, newValue) => {} // 同makeState
)
```

`makeStates`生成的状态，用在驱动状态中，同样需要传入props：
```jsx
const [, state] = makeStates(name => name)
const [useDrived] = makeStates(
  props => get => get(state(props)) // 注意是：state(props)
)
```

将上面对的水果价格列表的例子优化，封装一共专门改水果价格的hook（[CodeSandBox](https://codesandbox.io/s/make-states-drived-ord7t)）：
```jsx
import { makeStates, RecoilRoot } from "make-state";

const [, friuteState] = makeStates((name) => ({
  // 获取从组件获取name
  name: name,
  price: 0.0
}));

const [useFriutePrice] = makeStates(
  (name) => (get) => get(friuteState(name)).price,
  (name) => (get, set, newValue) =>
    set(friuteState(name), (friute) => {
      friute.price = newValue;
    })
);

const FriuteItem = ({ name }) => {
  const [friutePrice, setFriutePrice] = useFriutePrice(name);
  console.log(friutePrice);
  return (
    <div>
      {name} price:
      <input
        value={friutePrice}
        onChange={(e) => {
          setFriutePrice(e.target.value);
        }}
      />
    </div>
  );
};

const Demo = () => {
  return (
    <div>
      <FriuteItem name="apple" />
      <FriuteItem name="banana" />
      <FriuteItem name="orange" />
    </div>
  );
}
```
通过makeState一样，makeStates的方法也被immer包装。
如果你使用过Recoil，会发现makeStates和atomFamily或者selectorFamily是一样的。

### 添加key
`make-state`会自动为每一个状态生成随机key，出于调试等目的，可以在`makeState`中传入最后一个字符串类型的参数，手动设置key，例如（[CodeSandbox](https://codesandbox.io/s/key-unpwp)）:
```jsx
// 原始状态：
const [,count] = makeState(0, 'countKey')

// 只读驱动状态：
const [,double] = makeState(
    get => get(count),
    null
    'doubleKey' // 设key
)

// 可写驱动状态
const [,decrement] = makeState(
    get => get(count),
    (get, set, newValue) => {set(count, count => count - newValue)},
    'decrementKey' // 设key
)
```

如果你想知道当前状态的key，可以如下操作:
```jsx
const [useCount, count, {key}] = makeState(0)

console.log(key) // 打印当前key
```
随机key每次运行都可能不一样，仅供调试使用，切忌用于业务。一个应用所有的命名key必须唯一，不然可能产生异常。

## 与Recoil共用
如果你熟悉Recoil，可以阅读此部分。
`make-state`只是对recoil的封装，没有魔法:

- makeState创建原始状态：使用atom创建原子
- makeState只读驱动状态：使用selector，并传入get参数
- makeState可写状态：使用selector，并传入get和set参数

由于`make-state`生成的状态是`RecoilState`, 你可以将`make-state`生成的状态放入`recoil`中（[CodeSandbox](https://codesandbox.io/s/to-recoil-ijjhz)）:

```jsx
import makeState from 'make-state'
import {selector, useRecoilValue} from 'recoil'

const [,count] = makeState(1)

const doubleCount = selector({
    key: 'doubleCount',
    get: ({get}) => get(count) * 2
})

function Double () {
    const double = useRecoilValue(doubleCount)

    return <p>{double}</p>
}
```

同样， `make-state`中的`get`, `set` 方法与`recoil`一样，可以接收`recoil`产生的状态:

```jsx
import makeState from 'make-state'
import {atom}  from 'recoil'

const count = atom({
    key: 'count',
    default: 0
})

const [useDouble] = makeState(
    get => get(count) * 2, null
)

function Double () {
    const [double] = useDouble()

    return <p>{double}</p>
}
```

`make-state`与`recoil`一样，支持异步，也可以使用`wati`API。
`makeStates`方法则类似`atomFamily`和`selectorFamily`。
`make-state`同样支持`recoil`的devtool工具。


## 开发说明

### 本地开发
```
yarn start
```
基于snowpack的本地开发环境，用例见`examples`文件夹。

### 构建
目前只支持esm模式
```
yarn build
```
