import { CfnOutput, Fn, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { join } from "path";
import { GenerateTable } from "./GenerateTable";
import { AuthorizationType, MethodOptions, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Authorizing } from "./Auth/Authorizing";
import { Bucket, HttpMethods } from "aws-cdk-lib/aws-s3";
import { PolicyStatement, Effect, AnyPrincipal } from "aws-cdk-lib/aws-iam";

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
    private SpotPhotoBucket: Bucket;

    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);

        this.createSpotPhotoBucket();

        this.authorizer = new Authorizing(this, this.api, this.SpotPhotoBucket.bucketArn + "/*");

        const authorizerOption: MethodOptions = {
            authorizationType: AuthorizationType.COGNITO,
            authorizer: {authorizerId: this.authorizer.authorizer.authorizerId}
        }


        const spacesResource = this.api.root.addResource("spaces");
        spacesResource.addMethod("POST", this.spotTable.createLamIntegration, authorizerOption);
        spacesResource.addMethod("Get", this.spotTable.readLamIntegration, authorizerOption);
        spacesResource.addMethod("PUT", this.spotTable.updateLamIntegration, authorizerOption);
       
        // Configure CORS for the API Gateway
        const corsOptions: apigw.CorsOptions = {
            allowOrigins: ['http://localhost:3000'], // Replace with your frontend application's domain in production
            allowMethods: ['POST'],
            allowHeaders: ['*'], // Or specify the required headers as needed
        };
  
        // Enable CORS for the resource
        spacesResource.addCorsPreflight(corsOptions);

    }


    private createSpotPhotoBucket() {

        this.SpotPhotoBucket = new Bucket(this, "SpotPhotoBucket", {
            bucketName: "spot-photo-bucket-" + Fn.select(2, Fn.split("/", this.stackId)),
            cors: [{
                allowedMethods: [
                    HttpMethods.PUT,
                    HttpMethods.GET,
                    HttpMethods.POST,
                ],
                allowedOrigins: ["*"],
                allowedHeaders: ["*"]   
            }],
            publicReadAccess: true,
            blockPublicAccess: {
              blockPublicAcls: false,
              blockPublicPolicy: false,
              ignorePublicAcls: false,
              restrictPublicBuckets: false,
            }
        });



        // Bucket policy to allow public read access
        this.SpotPhotoBucket.addToResourcePolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions: ['s3:GetObject'],
                principals: [new AnyPrincipal()],
                resources: [this.SpotPhotoBucket.arnForObjects('*')],
            })
        );

        new CfnOutput(this, "SpotPhotoBucketName", {value: this.SpotPhotoBucket.bucketName});
    
    }

}