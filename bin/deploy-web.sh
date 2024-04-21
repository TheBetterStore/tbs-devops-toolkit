#!/bin/bash

noExecuteChangeset=""

if [ "${isNoExecuteChangeset}" = "true" ]; then
echo "Setting no-execute-changeset."
noExecuteChangeset="--no-execute-changeset"
else
echo "no-execute-changeset is false"
fi

echo Running against environment: ${environment}, account: $awsaccount_target
cd ${workspaceDir}/devops-toolkit-web

sam build --template-file ./cloudformation/template.yaml
sam deploy --stack-name $stackName $noExecuteChangeset \
--parameter-overrides \
EnvironmentName=${environmentName} \
Route53AppHostedZoneId=$route53AppHostedZoneId \
Route53AppDomainName=$route53AppDomainName \
ApiDomain=${apiDomain} \
--capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM --region $region --no-confirm-changeset --no-fail-on-empty-changeset \
--tags stackname=$stackName environment=$environmentName
