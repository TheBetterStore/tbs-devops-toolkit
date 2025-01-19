#!/bin/bash

samDeployBucket="MyBucketName"
stackName="MyCfnStackName"
environmentName="prod"
route53AppHostedZoneId="myRoute53HostedZoneId"
route53AppDomainName="myroute53.domain.name"
region="my aws region"
allowedCorsDomains="https://toolkit.${route53AppDomainName},http://localhost:4200"
loginCFStackName="tbs-devops-toolkit-login-${environment}"

cd ./devops-toolkit-api

# Initialising params in regions where I wish to monitor compliance rules
aws ssm put-parameter --name "/$stackName/FilteredComplianceRules" --type String --no-overwrite --region ap-southeast-2 \
--value "[]" 2> /dev/null

aws ssm put-parameter --name "/$stackName/FilteredComplianceRules" --type String --no-overwrite --region us-east-1 \
--value "[]" 2> /dev/null

aws ssm put-parameter --name "/$stackName/FilteredComplianceRules" --type String --no-overwrite --region eu-west-1 \
--value "[]" 2> /dev/null

sam build --template-file ./cloudformation/template.yaml --base-dir .

sam deploy --stack-name $stackName \
--resolve-s3 \
--parameter-overrides \
Environment=${environmentName} \
AllowedCorsDomains=$allowedCorsDomains \
Route53AppHostedZoneId=$route53AppHostedZoneId \
Route53AppDomainName=$route53AppDomainName \
LoginCFStackName=$loginCFStackName \
FilteredComplianceRulesParamName="/$stackName/FilteredComplianceRules" \
--capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM --region $region --no-confirm-changeset --no-fail-on-empty-changeset \
--tags stackname=$stackName environment=$environmentName \
--profile thebetterstore