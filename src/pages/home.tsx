import { useEffect, useState } from 'react'
import { TextContent } from "@cloudscape-design/components";
import BaseAppLayout from "../components/base-app-layout";
import { Schema } from '../../amplify/data/resource'
import { generateClient } from "aws-amplify/data"

// data를 호출하기 위해서 필요
// const client = generateClient<Schema>();

export default function HomePage() {
  // const [classes, setClass] = useState<Array<Schema["Class"]["type"]>>([]);

  // useEffect(() => {
  //   client.models.Class.observeQuery().subscribe({
  //     next: (data) => setClass([...data.items],)
  //   });
  // }, []);

  // function createClass() {
  //   client.models.Class.create( {content: window.prompt("class content") });
  // }


  return (
    <BaseAppLayout
      content={
        <TextContent>
          <h1>Let's go Re:invent 2024!!</h1>
          <p>Hello</p>
          <p>Hi</p>
        {/* <button onClick={createClass}>+ new class</button> */}
        {/* <ul>
          {classes.map((class) =>(
            <li key={class.id}>{class.content}</li>
          ))}
        </ul> */}
        </TextContent>

      }
      
    />
  );
}
