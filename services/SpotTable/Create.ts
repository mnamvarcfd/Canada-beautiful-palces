import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { validateAsSpotTable } from "../Shared/InputValidator";

import { v4 } from "uuid";

// Create a DynamoDB document client
const tableName = process.env.TABLE_NAME || '';
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

async function handler(event: APIGatewayProxyEvent, context: Context ): Promise<APIGatewayProxyResult> {

    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: ' ',
        headers: {
            'content-type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-methods': '*',
            'Access-Control-Allow-Headers': '*'
        }
    }

    try {

        // Create a random ID for the item
        const randomId = random();
        
        const item = typeof event.body == 'object' ? event.body : JSON.parse(event.body);
        item.spotId = randomId;
        
        validateAsSpotTable(item);

        const command = new PutCommand({
            TableName: tableName,
            Item: item,
        });

        await docClient.send(command);
        
        result.statusCode = 200;
        result.body = JSON.stringify({id: item.spotId});
 
        return result;

    } catch (error) {

        if (error instanceof Error) {
            // If the error is an instance of the Error class, we handle it as a known error
            result.statusCode = 500;
            result.body = error.message;
          } else {
            // If the error is of an unknown type, handle it accordingly (optional)
            result.statusCode = 500;
            result.body = 'Error putting item in DynamoDB:', error;
          }
        return result;
    }

}

export { handler };


function random() {
    return v4();
}
