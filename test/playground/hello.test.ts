import { handler } from "../../services/hello/hello";

async function runTest() {
    const event = {}; 
    const context = {}; 

    try {
        const response = await handler(event, context);
        console.log(response);
    } catch (error) {
        console.error(error);
    }
}

runTest();
