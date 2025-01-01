import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { RESTLambdaProxyIntegration } from "./REST/LambdaProxyIntegration/rest-lambda-proxy-integration";

export class LearnApiGwStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    new RESTLambdaProxyIntegration(this, "RestLambdaProxyIntegration");
  }
}
