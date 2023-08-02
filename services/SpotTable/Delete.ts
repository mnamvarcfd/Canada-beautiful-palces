import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

// Create a DynamoDB document client
const tableName = process.env.TABLE_NAME || '';
const PRIMARY_KEY = process.env.PRIMARY_KEY;
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    try {

        const spotId = event.queryStringParameters?.[PRIMARY_KEY!]

        const command = new DeleteCommand({
            TableName: tableName,
            Key: { [PRIMARY_KEY!]: spotId },
        });

        const resItem = await docClient.send(command);

        const result: APIGatewayProxyResult = {
            statusCode: 200,
            body: JSON.stringify({ message: "Item deleted successfully" }),
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
