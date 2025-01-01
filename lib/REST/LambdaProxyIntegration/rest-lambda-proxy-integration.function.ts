import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

interface Event extends APIGatewayProxyEvent {
  greeter?: string;
}

export const handler = async (event: Event): Promise<APIGatewayProxyResult> => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  let greeter = "World";
  if (event.greeter && event.greeter !== "") {
    greeter = event.greeter;
  } else if (event.body && event.body !== "") {
    const body = JSON.parse(event.body);
    if (body.greeting && body.greeting !== "") {
      greeter = body.greeter;
    }
  } else if (
    event.queryStringParameters &&
    event.queryStringParameters.greeter &&
    event.queryStringParameters.greeter !== ""
  ) {
    greeter = event.queryStringParameters.greeter;
  } else if (
    event.multiValueHeaders &&
    event.multiValueHeaders.greeter &&
    event.multiValueHeaders.greeter.length > 0
  ) {
    greeter = event.multiValueHeaders.greeter.join(" and ");
  } else if (
    event.headers &&
    event.headers.greeter &&
    event.headers.greeter !== ""
  ) {
    greeter = event.headers.greeter;
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: "Hello, " + greeter + "!",
  };
};
