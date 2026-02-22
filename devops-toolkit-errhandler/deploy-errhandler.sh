#!/bin/bash
environment="prod"
region="my aws region"
appName="MyAppName"
stackName=$appName-"${environment}"
route53AppHostedZoneId="myRoute53HostedZoneId"
route53AppDomainName="myroute53.domain.name"
samDeployBucket="MyBucketName"
allowedCorsDomains="https://toolkit.${route53AppDomainName},http://localhost:4200"

cd ./devops-toolkit-errorhandler


sam build --template-file ./cloudformation/template.yaml --cached

sam deploy --template-file --stack-name $stackName \
--s3-bucket $samDeployBucket --s3-prefix sam/$appName \
--capabilities CAPABILITY_NAMED_IAM --region $region \
--parameter-overrides Environment=$environment \
AppLoginCFName=tbs-app-login-$environment \
InfraBaseCFName=tbs-infra-$environment \
--no-fail-on-empty-changeset \
--tags StackName=$stackName Environment=$environment Product=$appName \
--profile thebetterstore
