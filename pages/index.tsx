import { useState } from "react";
import { Counter } from "../components/counter.jsx";
import { Layout } from "../components/layout.jsx";

export default () => {
  const [count, setCount] = useState({
    name: 'dan',
    color: 'blue',
    age: 26
  })
  return(
  <Layout title="home">
    <div className=" bg-violet">{count.age}</div>
    <button type="button" className=" bg-violet" onClick={() => setCount({...count, age: count.age++})}></button>
    <Counter/>
  </Layout>
)};