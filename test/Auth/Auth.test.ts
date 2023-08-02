import { config } from "./config";
import { AuthService } from "./AuthService";





const authService = new AuthService();

const user = authService.login(config.TEST_USER_NAME, config.TEST_USER_PASSWORD);

