import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

// Create a DynamoDB document client
const TABLE_NAME = process.env.TABLE_NAME;
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: ' ',
        headers: {
            'content-type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*'
        }
    }

    try {
        // Extract the query string parameters from the event
        const queryStringParameters = event.queryStringParameters;

        if (!queryStringParameters || Object.keys(queryStringParameters).length === 0) {
            // If no query string parameters are provided, perform a scan operation to retrieve all items from the table
            const scanParams = { TableName: TABLE_NAME };
            const scanCommand = new ScanCommand(scanParams);
            const resItems = await docClient.send(scanCommand);

            result.statusCode = 200;
            result.body = JSON.stringify( resItems.Items );
        } else {
            // Extract the query parameter key and value from the request
            const queryParamKey = Object.keys(queryStringParameters)[0];
            const queryParamValue = queryStringParameters[queryParamKey];

            const item = {
                TableName: TABLE_NAME,
                Key: { [queryParamKey]: queryParamValue },
            }

            const command = new GetCommand(item);

            // Send the GetCommand to DynamoDB using the document client
            const resItem = await docClient.send(command);

            result.statusCode = 200;
            result.body = JSON.stringify( resItem );
        }

        return result;
    } catch (error) {
        if (error instanceof Error) {
            // If the error is an instance of the Error class, we handle it as a known error
            result.statusCode = 500;
            result.body = error.message;
        } else {
            // If the error is of an unknown type, handle it accordingly (optional)
            result.statusCode = 500;
            result.body = 'An unknown error occurred';
        }
        return result;
    }
}

export { handler };
