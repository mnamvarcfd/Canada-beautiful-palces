import { CfnOutput } from "aws-cdk-lib";
import { CognitoUserPoolsAuthorizer, RestApi } from "aws-cdk-lib/aws-apigateway";
import { CfnUserPoolGroup, UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";
import { Identifier } from "./Identifier";


export class Authorizing {
   
    private scope: Construct;
    private api: RestApi;
    private bucketArn: string;

    private userPool: UserPool;
    private userPoolClient: UserPoolClient;
    public authorizer: CognitoUserPoolsAuthorizer;
    private identifier: Identifier;
    

    constructor (scope: Construct, api: RestApi, bucketArn: string){
        this.scope = scope;
        this.api = api;
        this.bucketArn = bucketArn;

        this.createUserPool();
        this.createUserPoolClient();
        this.createAuthorizer();
        this.createIdentityPool();
        
        this.createAdminGroup();
    }

    private createUserPool(){
    
        this.userPool = new UserPool(this.scope, 'SpotUserPool', {
            userPoolName: 'SpotUserPool',
            selfSignUpEnabled: true,
            signInAliases: {
                email: true,
                username: true
            }
        });

        new CfnOutput(this.scope, 'UserPoolId', {
            value: this.userPool.userPoolId
        });   
    
    }

    private createUserPoolClient(){
    
        this.userPoolClient = this.userPool.addClient('SpotUserPoolClient', {
    
            userPoolClientName: 'SpotUserPoolClient',
            authFlows: {
                adminUserPassword: true,
                custom: true,
                userPassword: true,
                userSrp: true
            },
            generateSecret: false,
            
        });

        new CfnOutput(this.scope, 'UserPoolClientId', {
            value: this.userPoolClient.userPoolClientId
        });
    }

    private createAuthorizer(){

        this.authorizer = new CognitoUserPoolsAuthorizer(this.scope, 'SpotAuthorizer', {
            cognitoUserPools: [this.userPool],
            authorizerName: 'SpotAuthorizer',
            identitySource: 'method.request.header.Authorization'
        });
    
        this.authorizer._attachToApi(this.api);
    
    }

    private createAdminGroup(){
    
        new CfnUserPoolGroup(this.scope, 'AdminGroup', {
            userPoolId: this.userPool.userPoolId,
            groupName: 'AdminGroup',
            roleArn: this.identifier.adminRole.roleArn
        });

    }

    private createIdentityPool(){
        this.identifier = new Identifier(this.scope, this.userPool, this.userPoolClient, this.bucketArn);
    }
}