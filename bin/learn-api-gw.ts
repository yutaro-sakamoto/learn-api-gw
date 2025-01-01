#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { LearnApiGwStack } from "../lib/learn-api-gw-stack";
import { AwsSolutionsChecks, NagSuppressions } from "cdk-nag";
import { Aspects } from "aws-cdk-lib";

const app = new cdk.App();
Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }));
const stack = new LearnApiGwStack(app, "LearnApiGwStack", {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */
  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },
  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});

NagSuppressions.addStackSuppressions(stack, [
  { id: "AwsSolutions-IAM4", reason: "It is allowed to use managed policies" },
]);
NagSuppressions.addStackSuppressions(stack, [
  {
    id: "AwsSolutions-APIG4",
    reason: "We do not need authentications of API GW.",
  },
]);
NagSuppressions.addStackSuppressions(stack, [
  {
    id: "AwsSolutions-COG4",
    reason: "We do not need authentications of API GW.",
  },
]);
cdk.Tags.of(app).add("project", "learn-api-gw");
