#!/bin/bash

noExecuteChangeset=""

if [ "${isNoExecuteChangeset}" = "true" ]; then
echo "Setting no-execute-changeset."
noExecuteChangeset="--no-execute-changeset"
else
echo "no-execute-changeset is false"
fi

echo Running against environment: ${environment}, account: $awsaccount_target
cd ${workspaceDir}/devops-toolkit-api

# Initialising params
aws ssm put-parameter --name "/$stackName/FilteredComplianceRules" --type String --no-overwrite --region ap-southeast-2 \
--value "[]" 2> /dev/null

aws ssm put-parameter --name "/$stackName/FilteredComplianceRules" --type String --no-overwrite --region us-east-1 \
--value "[]" 2> /dev/null

aws ssm put-parameter --name "/$stackName/FilteredComplianceRules" --type String --no-overwrite --region eu-west-1 \
--value "[]" 2> /dev/null

echo Running against region: $region, environment: $environment, account: $awsaccount_target, noexecutechangset: $noExecuteChangeset

sam build --template-file ./cloudformation/template.yaml --base-dir .

sam deploy --stack-name $stackName \
--resolve-s3 \
--parameter-overrides \
EnvironmentName=${environmentName} \
AllowedCorsDomains=$allowedCorsDomains \
Route53AppHostedZoneId=$route53AppHostedZoneId \
Route53AppDomainName=$route53AppDomainName \
LoginCFStackName=$loginCFStackName \
FilteredComplianceRulesParamName="/$stackName/FilteredComplianceRules" \
--capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM --region $region --no-confirm-changeset --no-fail-on-empty-changeset \
--tags stackname=$stackName environment=$environmentName