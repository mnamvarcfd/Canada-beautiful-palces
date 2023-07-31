import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

import { v4 } from "uuid";

// Create a DynamoDB document client
const tableName = process.env.TABLE_NAME || '';
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

async function handler(event: APIGatewayProxyEvent, context: Context ): Promise<APIGatewayProxyResult> {

    // Create a random ID for the item
    const randomId = random();
    
    const item = typeof event.body == 'object' ? event.body : JSON.parse(event.body);
    item.spotId = randomId;
    
    const command = new PutCommand({
        TableName: tableName,
        Item: item,
      });


    try {
        await docClient.send(command);
        console.log('Item put successfully in DynamoDB.');
    } catch (error) {
        console.error('Error putting item in DynamoDB:', error);
    }
    
    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: JSON.stringify({message: `ceated item id ${item.spotId} was success`}),
        headers: {
            'Access-Control-Allow-Origin': '*',
        }
    }
    

    return result;
}

export { handler };


function random() {
    return v4();
}
