#!/bin/bash

samDeployBucket="MyBucketName"
stackName="tbs-devops-toolkit-login-${environment}"
environmentName="prod"
route53AppDomainName="myroute53.domain.name"
region="my aws region"

cd ./devops-toolkit-login

sam build --template-file ./cloudformation/template.yaml --base-dir .

sam deploy --stack-name $stackName \
--s3-bucket $samDeployBucket --s3-prefix sam/$stackName \
--parameter-overrides \
Environment=${environmentName} \
Route53AppDomainName=$route53AppDomainName \
--capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM --region $region --no-confirm-changeset --no-fail-on-empty-changeset \
--tags stackname=$stackName environment=$environmentName \
--profile thebetterstore