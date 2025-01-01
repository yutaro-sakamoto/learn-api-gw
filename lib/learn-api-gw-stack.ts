import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { RESTLambdaProxyIntegration } from "./REST/LambdaProxyIntegration/rest-lambda-proxy-integration";
import * as iam from "aws-cdk-lib/aws-iam";
import * as apigateway from "aws-cdk-lib/aws-apigateway";

export class LearnApiGwStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create an IAM role for API Gateway to write logs to CloudWatch Logs
    const apiGatewayLogsRole = new iam.Role(this, "ApiGatewayLogsRole", {
      assumedBy: new iam.ServicePrincipal("apigateway.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AmazonAPIGatewayPushToCloudWatchLogs",
        ),
      ],
    });

    const apiGatewayAccount = new apigateway.CfnAccount(
      this,
      "ApiGatewayAccount",
      {
        cloudWatchRoleArn: apiGatewayLogsRole.roleArn,
      },
    );

    // Create a REST API with a Lambda proxy integration
    const restLambdaProxy = new RESTLambdaProxyIntegration(
      this,
      "RestLambdaProxyIntegration",
    );

    // add dependency to ensure the account is created before the API
    restLambdaProxy.node.addDependency(apiGatewayAccount);
  }
}
