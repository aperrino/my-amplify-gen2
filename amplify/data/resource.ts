import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  Profile: a.model({
      id: a.string().required(),
      point: a.integer(),
      userId: a.string(),
      name: a.string(),
      organization: a.string(),
    })
    .authorization((allow) => [allow.owner()]),
  Reward: a.model({
      id: a.string().required(),
      point: a.integer(),
      userId: a.string(),
      classId: a.string(),
    })
    .authorization((allow) => [allow.owner()]),
  Class: a.model({
      id: a.id(),
      name: a.string().required(),
      description: a.string(),
      image: a.string(),
      class_flag: a.integer(),
      courseId: a.id(),
      url: a.string(),
      transcript: a.string(),
      comments: a.string(),
      author: a.string(),
      course: a.belongsTo('Course', 'courseId'),
    })
    .authorization(allow => [allow.authenticated()]),
  Course: a.model({
      id: a.id(),
      name: a.string().required(),
      classes: a.hasMany('Class', 'courseId'),
    })
    .authorization(allow => [allow.authenticated()]),
  Comment: a.model({
      id: a.id().required(),
      classId: a.string(),
      content: a.string(),
      commentVersion: a.string(),
    })
    .authorization(allow => [allow.authenticated()]),

    BedrockResponse: a.customType({
      body: a.string(),
      error: a.string(),
    }),
  
    askBedrock: a
      .query()
      .arguments({ prompt: a.string() })
      .returns(a.ref("BedrockResponse"))
      .authorization(allow => allow.authenticated())
      .handler(
          a.handler.custom({ entry: "./bedrock.js", dataSource: "bedrockDS" })
    ),

});
export type Schema = ClientSchema<typeof schema>;
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)
Using JavaScript or Next.js React Server Components, Middleware, Server
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/
/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/
/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/
/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()
// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>