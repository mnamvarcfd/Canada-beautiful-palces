import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Code, Runtime, Function as lambda } from "aws-cdk-lib/aws-lambda";
import { join } from "path";

export class CanadaStack extends Stack {

    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);
        const helloLamda =  new lambda(this, "helloLambda", {
            runtime: Runtime.NODEJS_18_X,
            code: Code.fromAsset(join( __dirname, "..", "services", "hello")),
            handler: "hello.main"
        });
    }
}