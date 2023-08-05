import { CfnOutput } from "aws-cdk-lib";
import { CfnIdentityPool, CfnIdentityPoolRoleAttachment, UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";
import { Effect, FederatedPrincipal, PolicyStatement, Role } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";




export class Identifier{
    
    private scope: Construct;
    private userPool: UserPool;
    private userPoolClient: UserPoolClient;
    private photoBucketArn: string;

    

    private identityPool: CfnIdentityPool;

    private authenticatedRole : Role;
    private unauthenticatedRole : Role;
    public adminRole: Role;


    constructor(scope: Construct, userPool: UserPool, userPoolClient: UserPoolClient, photoBucketArn: string){
        this.scope = scope;
        this.userPool = userPool;
        this.userPoolClient = userPoolClient;
        this.photoBucketArn = photoBucketArn;

        this.createIdentityPool();
        this.createRoles();
        this.attachRoles();
    
    }


    private createIdentityPool(){
        this.identityPool = new CfnIdentityPool(this.scope, 'SpotIdentityPool', {
            allowUnauthenticatedIdentities: true,
            cognitoIdentityProviders: [ {
                clientId: this.userPoolClient.userPoolClientId, 
                providerName: this.userPool.userPoolProviderName
            }],
        });
        new CfnOutput(this.scope, 'IdentityPoolId', {
            value: this.identityPool.ref,
        })

    }


    private createRoles(){
        this.authenticatedRole = new Role(this.scope, 'SpotAuthenticatedRole', {
            assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
                StringEquals: {
                    'cognito-identity.amazonaws.com:aud': this.identityPool.ref
                },
                "ForAnyValue:StringLike": {
                    'cognito-identity.amazonaws.com:amr': 'authenticated'
                }
            },
            "sts:AssumeRoleWithWebIdentity")
        });

        this.unauthenticatedRole = new Role(this.scope, 'SpotUnauthenticatedRole', {
            assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
                StringEquals: {
                    'cognito-identity.amazonaws.com:aud': this.identityPool.ref
                },
                "ForAnyValue:StringLike": {
                    'cognito-identity.amazonaws.com:amr': 'unauthenticated'
                }
            },
            "sts:AssumeRoleWithWebIdentity")
        });

        this.adminRole = new Role(this.scope, 'SpotAdminRole', {
            assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
                StringEquals: {
                    'cognito-identity.amazonaws.com:aud': this.identityPool.ref
                },
                "ForAnyValue:StringLike": {
                    'cognito-identity.amazonaws.com:amr': 'authenticated'
                }
            },
            "sts:AssumeRoleWithWebIdentity")
        });

        this.adminRole.addToPolicy( new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ['s3:PutObject', 's3:PutObjectAcl'],
            resources: [this.photoBucketArn]
        }))
    }
    
    private attachRoles(){
        new CfnIdentityPoolRoleAttachment(this.scope, 'SpotRoleAttachment', {
            identityPoolId: this.identityPool.ref,
            roles: {
                "authenticated": this.authenticatedRole.roleArn,
                "unauthenticated": this.unauthenticatedRole.roleArn,
            },
            roleMappings: {
                adminsMapping: {
                    type: 'Token',
                    ambiguousRoleResolution: 'AuthenticatedRole',
                    identityProvider: this.userPool.userPoolProviderName + ':' + this.userPoolClient.userPoolClientId,
                }
            }

        });

    }
}