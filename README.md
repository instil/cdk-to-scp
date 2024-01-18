# cdk-to-scp

This project parses your CDK output, determines what services are in use by your application and generates a Service Control Policy (SCP) that can be used to restrict access to services that are not in use.

## Usage

Install the package

```bash
  npm install -g cdk-to-scp
```

Navigate to the folder in your project that contains the `cdk.out` folder

Then run

```bash
  cdk-to-scp
```

This will output a Service Control Policy to the console that only allows the services used by your project e.g.:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyActionsNotInUse",
      "Effect": "Deny",
      "NotAction": [
        "s3:*",
        "iam:*",
        "lambda:*",
        "sqs:*",
        "cloudwatch:*",
        "dynamodb:*",
        "sns:*",
        "ses:*",
        "ssm:*",
        "apigateway:*",
        "wafv2:*",
        "cognito:*",
        "cloudfront:*",
        "appsync:*",
      ],
      "Resource": "*"
    }
  ]
}

```

You can then use this as a starting point for your SCP.

