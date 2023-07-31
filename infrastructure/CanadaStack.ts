import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { join } from "path";
import { GenerateTable } from "./GenerateTable";
import { RestApi } from "aws-cdk-lib/aws-apigateway";

export class CanadaStack extends Stack {

    private spotTable = new GenerateTable(this, {
        tableName: "SpotTable",
        primaryKey: "spotId",
        secondaryKey: ["location"],
        CRUDLambdaPath: join(__dirname, "..", "services", "SpotTable"),

    })

    private api = new RestApi(this, 'SpotTableAPI');



    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);

        //spaces table APIs
        const spacesResource = this.api.root.addResource("spaces");
        spacesResource.addMethod("POST", this.spotTable.createLamIntegration);
        spacesResource.addMethod("Get", this.spotTable.readLamIntegration);

    }

}