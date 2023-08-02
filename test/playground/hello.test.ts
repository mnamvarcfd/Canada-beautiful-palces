import { handler } from "../../services/SpotTable/Create";

async function run() {
    const event = {
        body: {location: "Toronto", country: "Canada", rating: 5} //
    }

    const context = {}; 

    try {
        const response = await handler(event as any, context as any);
        console.log(response);
    } catch (error) {
        console.error(error);
    }
}
run();


// import { handler } from "../../services/SpotTable/Read";
// import { APIGatewayProxyEvent } from "aws-lambda";

// async function run() {

//     const event: APIGatewayProxyEvent = {
//         queryStringParameters: {
//             spotId: "8f79c621-abc3-41b8-b83f-8c437897cac2"
//         },
//     } as any;

//     const context = {}; 

//     try {
//         const response = await handler(event as any, context as any);
//         console.log(response);
//     } catch (error) {
//         console.error(error);
//     }
// }
// run();


// import { handler } from "../../services/SpotTable/Update";
// import { APIGatewayProxyEvent } from "aws-lambda";

// async function run() {

//     const event: APIGatewayProxyEvent = {
//         queryStringParameters: {
//             spotId: "0faa8a3d-f225-4588-95a9-6e18c9ab1f91"
//         },
//         body:{
//             location: "Toronto2"
//         }
//     } as any;

//     const context = {}; 

//     try {
//         const response = await handler(event as any, context as any);
//         console.log(response);
//     } catch (error) {
//         console.error(error);
//     }
// }

// run();


// import { handler } from "../../services/SpotTable/Delete";
// import { APIGatewayProxyEvent } from "aws-lambda";

// async function run() {

//     const event: APIGatewayProxyEvent = {
//         queryStringParameters: {
//             spotId: "1"
//         }
//     } as any;

//     const context = {}; 

//     try {
//         const response = await handler(event as any, context as any);
//         console.log(response);
//     } catch (error) {
//         console.error(error);
//     }
// }

// run();

