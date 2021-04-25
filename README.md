# make-state

简单灵活的React状态库，基于并兼容[Recoil](https://github.com/facebookexperimental/Recoil)。


**特点&动机：**

Recoil作为新一代状态管理非常好用，然而上手有点复杂，API略多。受[jotai](https://github.com/pmndrs/jotai)的灵感，简化API，提高易用性：

+ 简单的API，您无需学习Recoil，5分钟上手
+ 可以和Recoil共用，支持Recoil几乎所有特性, 满足深度使用场景。

**最小示例([CodeSandbox](https://codesandbox.io/s/confident-monad-x3x4d?file=/src/index.js))：**
```jsx
import ReactDom from 'react-dom'
import makeState, {RecoilRoot} from 'make-state'

const [useCount] = makeState(0) // 创建状态

function Demo () {
    const [count, setCount] = useCount() // 使用状态

    return <div>
        {count}
        <button onClick = {() => {
            setCount(state => state + 1) // 写
        }}> +1
        </button>
    </div>

}

ReactDom.render(
    <RecoilRoot>
        <Demo>
    </RecoilRoot>,
    document.getElementById('root)
)
```

## 快速起步
用一个示例（[CodeSandBox](https://codesandbox.io/s/make-state-text-7hz9m?file=/src/index.js)）：一个显示字数，并有删除键的文本框介绍make-state。

### 1. 安装
```
npm i make-state --save

// or yarn
yarn add make-state
```

### 2. 使用<RecoilRoot>包裹React组件
被`<RecoilRoot>`包裹的组件，才可以使用`make-state`， 推荐将`<RecoilRoot>`放置在根组件：

```jsx
import {RecoilRoot} from 'make-state'

ReactDOM.render(
  <ReocilRoot >
	  {/* 其他内容 */}
  </ReocilRoot >
  document.getElementById('root')
)
```

make-state和Recoil中的[RecoilRoot](https://recoiljs.org/docs/api-reference/core/RecoilRoot)完全一致。如果您的项目已使用Recoil，并添加RecoilRoot，无需此步。

### 3. 创建原始状态(primary state)
原始状态存储可跨组件使用的数据，初始值可以是数字、字符串、对象、数字等类型。makeState有两个返回值，第一个是一个类似`useState`的hook，第二个是存有数据的状态。

```jsx
import makeState from 'make-state'

const [useText, textState] = makeState("hello")

// makeState初始值支持多种类型, 如:
const [useName] = makeState('Tom')
const [useNames] = makeState(['Tom', 'Jerry'])
const [useUser] = makeState({name: 'Tom'})
```
(如果你了解Recoil，会发现makeState生成的状态同atom的返回值一样，也是一个RecoilState)


### 4. 在组件中使用
`useText`和React的`useState`几乎一样，第一个返回值是状态，第二个返回值是set函数。

```jsx
const Text = () => {
  const [text, setText] = useText()

  return (
    <input
      value={text}
      onChange={(e) => {
        setText(e.target.value)
      }}
    />
  )
}
```
执行`setText`后，所有用到`textState`的组件都将重新渲染，并返回最新的`textState`。

### 5. 创建驱动状态（drived stated）
在`makeState`中传入函数，将生成一个只读的驱动状态（或者称作计算属性、computed stated），通过`get`获取其他状态的值

```jsx
const [useTextLen] = makeState((get) => get(textState).length)

const TextLen = () => {
  const [len] = useTextLen()

  return <p>Length: {len} </p>
}
```

### 6. 创建可写驱动状态(writeable drrived stated)
在`makeState`中第二个参数中传入函数，将生成一个可写驱动状态。函数中的参数 `get`获取其他状态值， `set`修改状态值，`newValue`是新传入的值。

```jsx
const [useSlice] = makeState(
  undefined, // 本例为只读，第一个参数传入undefind
  (get, set, newValue) => {
    set(textState, (text) => text.slice(newValue))
  }
)

const SliceBtn = () => {
  const [, sliceText] = useSlice()

  return (
    <button
      onClick={() => {
        sliceText(1) // 删除第一个字符，传入2则删除前2个字符
      }}
    >
      delete first char
    </button>
  )
}
```


## Recipes
### 支持immer
makeState中的`set`等方法已经添加[immer](https://github.com/immerjs/immer), 可以使用可变语法

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

const [useUserName] = makeState(
    get => get(userState).name,
    (get, set, newValue) => {
        // 支持可变语法
        set(userState, user => {user.name = newValue})
    }
)
```

### 数据流
可以使用多个状态，生成一个新的状态
```jsx
const [useCount1, count1] = makeState(1)
const [useCount2, count2] = makeState(2)
const [useCOunt3 ,count3] = makeState(3)

const [useSum, sum] = makeStates(get =>
    get(count1) + get(count2) + get(count3)
)

const [useSumDouble, sumDdouble] = makeStates(get =>
    get(sum) * 2
)
```

`count1`, `count2`等，只要有一个状态变更， `sumDouble`会自动变更。


### 从组件中传入参数
一些情况下，需要从组件向状态传入参数，此时可以用`makeStates`。

下面的例子是一个简化版Todo List：
```jsx
import {makeStates} from 'make-state'

const [useTodo, todoState] = makeStates(
    id => ({ // 获取从组件传入的id参数
        id: id,
        text: 0
    })
)

function TodoItem (id) {
    const [todo, setTodo] = useTodo(id) // 传入Id

    return <div>
        {todo}
        <input onChange = {e => {
            setTodo(e.target.value)
        }} />
    </div>
}

function DemoItem () {
    return [<Todo id = {1}>, <Todo id = {2}>]
}
```

drived data可以用下面的方法获取参数:
```jsx
import {makeStates} from 'make-state'

const [useTodoText] = makeStates(
    props => get => get(todoState).text
    props => (get, set, newValue) => 
        set(todoState, todo => {todo.text = newValue})
)

function TodoText (id) {
    const [text, setText] = useTodoText(id)
    return <div>
        {todo}
        <input onChange = {e => {
            setTodo(e.target.value)
        }} />
    </div>
}
```

如果你使用过Recoil，会发现makeStates和atomFamily或者selectorFamily是一样的。

### 添加key
`make-state`会自动为每一个状态生成随机key，出于调试等目的，你可以在`makeState`中传入最后一个字符串类型的参数，手动设置key，例如:
```jsx
const [,count] = makeState(0, 'count')

const [,double] = makeState(
    get => get(count),
    'double' // 设key
)

const [,decrement] = makeState(
    get => get(count),
    (get, set, newValue) => {set(count, count => count - newValue)},
    'decrement' // 设key
)
```

如果你想知道当前状态的key，可以如下操作:
```jsx
const [useCount, count, {key}] = makeState(0)

console.log(key) // 打印当前key
```

## API
### makeState
primary state:
```
const [useState, state] = makeState(
    default: string | number | object | array | symbol, 
    key: sting)
```
write-only derived:
```
const [useState, state] = makeState(
    (get) => {},
    key: sting)
```
write derived:
```
const [useState, state] = makeState(
    (get) => {},
    (get, set, newValue) => {}
    key: sting)
```

## 与Recoil共用
如果你熟悉Recoil，可以阅读此部分。

由于`make-state`生成的状态是`RecoilState`, 所以你可以将`make-state`生成的状态放入`recoil`中:

```jsx
import makeState from 'make-state'
import {selector, useRecoilValue} from 'recoil'

const [,count] = makeState(0)

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
    get => get(count) * 2
)

function Double () {
    const [double] = useDouble()

    return <p>{double}</p>
}
```

`make-state`与`recoil`一样，支持异步，也可以使用`wati`API。
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
