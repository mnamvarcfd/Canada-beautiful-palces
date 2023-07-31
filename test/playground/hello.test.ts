// import { App } from "aws-cdk-lib";
// import { CanadaStack } from "../../infrastructure/CanadaStack";
// import { handler } from "../../services/SpotTable/Create";

// async function runCreat() {
//     const event = {
//         body: {location: "Toronto"} //, country: "Canada", rating: 5
//     }

//     const context = {}; 

//     try {
//         const response = await handler(event as any, context as any);
//         console.log(response);
//     } catch (error) {
//         console.error(error);
//     }
// }


// import { App } from "aws-cdk-lib";
// import { CanadaStack } from "../../infrastructure/CanadaStack";
// import { handler } from "../../services/SpotTable/Create";

// async function stack() {

//     const app = new App();
//     const stackProps = {}; // Replace with any necessary stack properties
//     const canadaStack = new CanadaStack(app, 'CanadaBeautifulPlaces', stackProps);
    
//     const event = {
//         body: {location: "Toronto"} //, country: "Canada", rating: 5
//     }

//     const context = {}; 

//     try {
//         const response = await handler(event as any, context as any);
//         console.log(response);
//     } catch (error) {
//         console.error(error);
//     }
// }

import { App } from "aws-cdk-lib";
import { CanadaStack } from "../../infrastructure/CanadaStack";
import { handler } from "../../services/SpotTable/Read";
import { APIGateway } from "aws-sdk";
import { APIGatewayProxyEventV2 } from "aws-lambda";
async function stack() {

    const app = new App();
    const stackProps = {}; // Replace with any necessary stack properties
    const canadaStack = new CanadaStack(app, 'CanadaBeautifulPlaces', stackProps);
    
    // body: {spotId: "0faa8a3d-f225-4588-95a9-6e18c9ab1f91"} //, country: "Canada", rating: 5
    const event: APIGatewayProxyEventV2 = {
        queryStringParameters: {
            location: "Toronto"
        }
    } as any;
    

    const context = {}; 

    try {
        const response = await handler(event as any, context as any);
        console.log(response);
    } catch (error) {
        console.error(error);
    }
}

stack();


