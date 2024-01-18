#! /usr/bin/env node

import { CloudAssembly } from "aws-cdk-lib/cx-api";

type Resources = Record<string, Resource>;
interface Resource {
  Type: string;
}

interface ServiceControlPolicy {
  Version: "2012-10-17";
  Statement: Statement[];
}

interface Statement {
  Sid: string;
  Effect: "Deny" | "Allow";
  NotAction: string | string[];
  Resource: string | string[];
}

function generateScp() {
  const cloudAssembly = new CloudAssembly("cdk.out");

  const resources = cloudAssembly.stacksRecursively.flatMap(stack => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const resources = stack.template.Resources as Resources;
    return Object.entries(resources).map(resource => {
      return resource[1].Type;
    });
  }).filter(resource => resource.startsWith("AWS::") && !resource.startsWith("AWS::CDK::"));

  const serviceNames = resources.map(resource => {
    const parts = resource.split("::");
    const serviceName = parts[1];
    return serviceName.toLowerCase();
  });

  const uniqueServiceNames = [...new Set(serviceNames)];

  const scp: ServiceControlPolicy = {
    Version: "2012-10-17",
    Statement: [{
      Sid: "DenyActionsNotInUse",
      Effect: "Deny",
      NotAction: uniqueServiceNames.map(serviceName => `${serviceName}:*`),
      Resource: "*"
    }]
  };

  console.log(JSON.stringify(scp, null, 2));
}

generateScp();
