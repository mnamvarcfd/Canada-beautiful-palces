import { config } from "./config";
import { AuthService } from "./AuthService";
import AWS = require("aws-sdk");



async function main(){

    const authService = new AuthService();

    const user = await authService.login(config.TEST_USER_NAME, config.TEST_USER_PASSWORD);

    await authService.getAWSTempCred(user);

    const cred = AWS.config.credentials;

    console.log(cred);
}

main();