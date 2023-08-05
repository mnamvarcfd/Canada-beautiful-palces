import { config } from "./config";
import { AuthService } from "./AuthService";
import AWS = require("aws-sdk");


async function getBuckets() {
    let buckets;
    try {
        buckets = await new AWS.S3().listBuckets().promise();
    } catch (error) {
        buckets = undefined
    }

    return buckets;
}

async function main(){

    const authService = new AuthService();

    const user = await authService.login(config.TEST_USER_NAME, config.TEST_USER_PASSWORD);

    await authService.getAWSTempCred(user);

    const cred = AWS.config.credentials;

    const buckets = await getBuckets();

    console.log(cred);
}

main();