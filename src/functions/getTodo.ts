import { APIGatewayEvent } from "aws-lambda";

import { document } from "../utils/dynamodbClient";

export const handle = async (event: APIGatewayEvent) => {
  const { userid: user_id } = event.pathParameters;

  const response = await document.scan({
    TableName: "todos",
    FilterExpression: "user_id = :user_id",
    ExpressionAttributeValues: {
      ":user_id": user_id
    }
  }).promise();

  if (response.Items.length > 0) {
    return {
      statusCode: 201,
      body: JSON.stringify(response.Items),
      headers: {
        "Content-type": "application/json"
      }
    }
  }

  return {
    statusCode: 400,
    body: JSON.stringify({
      message: "Todos not found!"
    }),
    headers: {
      "Content-type": "application/json"
    }
  }
}