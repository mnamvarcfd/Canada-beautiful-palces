import { Stack } from "aws-cdk-lib";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";

export class GenerateTable{
    
    private stack: Stack;
    private name: string;
    private primaryKey: string;
    private table: Table;

    public constructor(stack: Stack, name: string, primaryKey: string){
        this.stack = stack;
        this.name = name;
        this.primaryKey = primaryKey;

        this.createTable();
        
    }

    private createTable(){
        this.table = new Table(this.stack, this.name, {
            partitionKey: 
            {
                name: this.primaryKey, 
                type: AttributeType.STRING
            },
            tableName: this.name,
            billingMode: BillingMode.PAY_PER_REQUEST
        
        })
    }
}