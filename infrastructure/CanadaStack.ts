import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { join } from "path";
import { GenerateTable } from "./GenerateTable";
import { AuthorizationType, MethodOptions, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Authorizing } from "./Auth/Authorizing";

export class CanadaStack extends Stack {

    private spotTable = new GenerateTable(this, {
        tableName: "SpotTable",
        primaryKey: "spotId",
        secondaryKey: ["location", "country"],
        CRUDLambdaPath: join(__dirname, "..", "services", "SpotTable"),
        CRUDLambdaName: ["Create" , "Read", "Update" ], // , "Delete"

    })


    private api = new RestApi(this, 'SpotTableAPI');
    private authorizer: Authorizing;


    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);

        this.authorizer = new Authorizing(this, this.api);

        const authorizerOption: MethodOptions = {
            authorizationType: AuthorizationType.COGNITO,
            authorizer: {authorizerId: this.authorizer.authorizer.authorizerId}
        }


        const spacesResource = this.api.root.addResource("spaces");
        spacesResource.addMethod("POST", this.spotTable.createLamIntegration, authorizerOption);
        spacesResource.addMethod("Get", this.spotTable.readLamIntegration, authorizerOption);
        spacesResource.addMethod("PUT", this.spotTable.updateLamIntegration, authorizerOption);


    }

}