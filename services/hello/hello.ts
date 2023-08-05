async function handler(event: any, context: any) {
    console.log(event);
    const a = 9;
    const b = 10;
    const c = a + b;
    console.log(c);

    const response = {
        statusCode: 200,
        body: JSON.stringify("executed successfully"),
    };

    return response;
}

export { handler };

