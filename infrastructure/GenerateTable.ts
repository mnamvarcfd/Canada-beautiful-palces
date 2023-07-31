import { Stack } from "aws-cdk-lib";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export interface TableProps {
    CRUDLambdaPath: string;

    tableName: string;
    primaryKey: string;
    secondaryKey?: string[];
}

export class GenerateTable{
    
    private stack: Stack;
    private props: TableProps;
    private table: Table;
    private tableName: string;
    private primaryKey: string;

    private createLam: NodejsFunction | undefined;
    private readLam: NodejsFunction | undefined;
    private updateLam: NodejsFunction | undefined;
    private deleteLam: NodejsFunction | undefined;

    public createLamIntegration: LambdaIntegration;
    public readLamIntegration: LambdaIntegration;
    public updateLamIntegration: LambdaIntegration;
    public deleteLamIntegration: LambdaIntegration;


    public constructor(stack: Stack, props: TableProps){
        this.stack = stack;
        this.props = props;
        this.tableName = props.tableName;
        this.primaryKey = props.primaryKey;

        this.createTable();
        this.addSecondaryKeys();

        this.createLam = this.createLambdaFunction('Create', props.CRUDLambdaPath);
        this.table.grantWriteData(this.createLam);
        this.createLamIntegration = new LambdaIntegration(this.createLam);

        this.readLam = this.createLambdaFunction('Read', props.CRUDLambdaPath);
        this.table.grantReadData(this.readLam);
        this.readLamIntegration = new LambdaIntegration(this.readLam); 



    }

    private createTable(){
        this.table = new Table(this.stack, this.tableName, {
            partitionKey: 
            {
                name: this.primaryKey, 
                type: AttributeType.STRING
            },
            tableName: this.tableName,
            billingMode: BillingMode.PAY_PER_REQUEST
        
        })
    }

    private addSecondaryKeys(){
        if(this.props.secondaryKey){
            this.props.secondaryKey.forEach(key => {
                this.table.addGlobalSecondaryIndex({
                    indexName: key,
                    partitionKey: {
                        name: key,
                        type: AttributeType.STRING
                    }
                })
            })
        }
    }
    
    //a generic function to create a lambda function
    private createLambdaFunction(lamName: string, lamPath: string): NodejsFunction{
        const lambdaFunction = new NodejsFunction(this.stack, lamName, {
            entry: lamPath + '\\' + lamName + '.ts',
            handler: 'handler',
            functionName: this.stack.stackName + '-' +this.tableName + "-" + lamName,
            environment: {
                TABLE_NAME: this.tableName,
                PRIMARY_KEY: this.primaryKey
            }
        })

        return lambdaFunction;
    }

}