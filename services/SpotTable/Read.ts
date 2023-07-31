import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

// Create a DynamoDB document client
const tableName = process.env.TABLE_NAME || '';
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    try {
        // Extract the query string parameters from the event
        const queryStringParameters = event.queryStringParameters;

        if (!queryStringParameters) {
            throw new Error("Missing query string parameters");
        }

        // Extract the query parameter key and value from the request
        const queryParamKey = Object.keys(queryStringParameters)[0];
        const queryParamValue = queryStringParameters[queryParamKey];

        // Build the DynamoDB GetCommand based on the query parameter key and value
        const getCommand = new GetCommand({
            TableName: tableName,
            Key: {
                [queryParamKey]: queryParamValue,
            },
        });

        // Send the GetCommand to DynamoDB using the document client
        const resItem = await docClient.send(getCommand);

        const result: APIGatewayProxyResult = {
            statusCode: 200,
            body: JSON.stringify({ resItem }),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        };

        return result;
    } catch (error) {
        console.error('Error getting item from DynamoDB:', error);

        const result: APIGatewayProxyResult = {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" }),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        };

        return result;
    }
}

export { handler };
