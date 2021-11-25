import { APIGatewayEvent } from "aws-lambda";
import {v4 as uuidv4} from "uuid";

import { document } from "../utils/dynamodbClient";

interface ICreateTodo {
  title: string;
  deadline: string;
}

export const handle = async (event: APIGatewayEvent) => {
  const { title, deadline } = JSON.parse(event.body) as ICreateTodo;
  const { userid: user_id } = event.pathParameters;
  const id = uuidv4();

  await document.put({
    TableName: "todos",
    Item: {
      id,
      user_id,
      title,
      done: false,
      deadline: new Date(deadline).toISOString()
    }
  }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "Todo created!",
      data: {
        id,
        title,
        done: false,
        deadline: new Date(deadline).toISOString()
      }
    }),
    headers: {
      "Content-type": "application/json"
    }
  }
}