import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as logs from "aws-cdk-lib/aws-logs";
import * as iam from "aws-cdk-lib/aws-iam";

export class RESTLambdaProxyIntegration extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

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

    const lambdaFunc = new NodejsFunction(this, "function", {
      runtime: lambda.Runtime.NODEJS_22_X,
    });

    const logGroup = new logs.LogGroup(this, "ApiGatewayAccessLogs");
    const restApi = new apigateway.LambdaRestApi(
      this,
      "RestLambdaProxyIntegrationExample",
      {
        handler: lambdaFunc,
        deployOptions: {
          accessLogDestination: new apigateway.LogGroupLogDestination(logGroup),
          accessLogFormat: apigateway.AccessLogFormat.jsonWithStandardFields({
            caller: true,
            httpMethod: true,
            ip: true,
            protocol: true,
            requestTime: true,
            resourcePath: true,
            responseLength: true,
            status: true,
            user: true,
          }),
          loggingLevel: apigateway.MethodLoggingLevel.INFO,
          dataTraceEnabled: true,
        },
      },
    );
    restApi.addRequestValidator("RequestValidator", {
      validateRequestBody: true,
      validateRequestParameters: true,
    });

    // Deploy after IAM role is created
    const deployment = restApi.latestDeployment;
    if (deployment) {
      deployment.node.addDependency(apiGatewayAccount);
    }
  }
}
