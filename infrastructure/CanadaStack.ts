import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Code, Runtime, Function as lambda } from "aws-cdk-lib/aws-lambda";
import { join } from "path";
import { GenerateTable } from "./GenerateTable";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";

export class CanadaStack extends Stack {

    private spotTable = new GenerateTable(this, "SpotTable", "SpotId")

    private api = new RestApi(this, 'HelloAPI');



    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);


        // const helloLamda =  new lambda(this, "hello2", {
        //     runtime: Runtime.NODEJS_18_X,
        //     code: Code.fromAsset(join( __dirname, "..", "services", "hello")),
        //     handler: "hello.main"
        // });

        const helloLamda =  new NodejsFunction(this, "hello", {
            entry: join( __dirname, "..", "services", "hello", "hello.ts"),
            handler: "hello.main"
        });

        //API
        const helloLamdaApi = new LambdaIntegration(helloLamda);
        const helloLamdaResource = this.api.root.addResource("hello3");
        helloLamdaResource.addMethod("GET", helloLamdaApi);


    }

}