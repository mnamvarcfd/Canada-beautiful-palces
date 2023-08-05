import { CanadaStack } from "./CanadaStack";
import { App } from "aws-cdk-lib";

const app = new App();
new CanadaStack(app, "beautiful-places", {stackName: "BeautifulPlaces"})


