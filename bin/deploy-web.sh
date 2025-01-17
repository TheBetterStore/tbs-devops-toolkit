#!/bin/bash

samDeployBucket="MyBucketName"
appName="tbs-devops-toolkit-web"
stackName=$appName-"${environment}"
environmentName="prod"
route53AppHostedZoneId="myRoute53HostedZoneId"
route53AppDomainName="myroute53.domain.name"
apidomain="My.Api.Domain.Name"
region="my aws region"

cd ./devops-toolkit-web

sam build --template-file ./cloudformation/template.yaml
sam deploy --stack-name $stackName \
--parameter-overrides \
Environment=${environmentName} \
Route53AppHostedZoneId=$route53AppHostedZoneId \
Route53AppDomainName=$route53AppDomainName \
ApiDomain=${apiDomain} \
--capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM --region $region --no-confirm-changeset --no-fail-on-empty-changeset \
--tags stackname=$stackName environment=$environmentName \
--profile thebetterstore
