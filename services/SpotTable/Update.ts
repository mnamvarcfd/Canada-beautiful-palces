import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const TABLE_NAME = process.env.TABLE_NAME || '';
const PRIMARY_KEY = process.env.PRIMARY_KEY || '';
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    try {
        const requestBody = typeof event.body == 'object' ? event.body : JSON.parse(event.body);
        const spotId = event.queryStringParameters?.[PRIMARY_KEY]

        const requestBodyKey = Object.keys(requestBody)[0];
        const requestBodyValue = requestBody[requestBodyKey];


        const updateCommand = new UpdateCommand({
            TableName: TABLE_NAME,
            Key: {
                [PRIMARY_KEY]: spotId,
            },
            UpdateExpression: "#zzz = :zz",
            ExpressionAttributeValues: {
                ":zz": requestBodyValue,
            },
            ExpressionAttributeNames:{
                "#zzz": requestBodyKey
            },
            ReturnValues: "UPDATED",
        });

        // Send the GetCommand to DynamoDB using the document client
        const resItem = await docClient.send(updateCommand);

        const result: APIGatewayProxyResult = {
            statusCode: 200,
            body: JSON.stringify({ resItem }),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        };
        return result;

    } catch (error) {

        const result: APIGatewayProxyResult = {
            statusCode: 500,
            body: JSON.stringify({ error }),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        };

        return result;
    }
}

export { handler };
