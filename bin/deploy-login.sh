#!/bin/bash

noExecuteChangeset=""

if [ "${isNoExecuteChangeset}" = "true" ]; then
echo "Setting no-execute-changeset."
noExecuteChangeset="--no-execute-changeset"
else
echo "no-execute-changeset is false"
fi

echo Running against environment: ${environment}, account: $awsaccount_target
cd ${workspaceDir}/devops-toolkit-login

echo Running against region: $region, environment: $environment, account: $awsaccount_target, noexecutechangset: $noExecuteChangeset

sam build --template-file ./cloudformation/template.yaml --base-dir .

sam deploy --stack-name $stackName \
--s3-bucket $samDeployBucket --s3-prefix sam/$stackName $noExecuteChangeset \
--parameter-overrides \
EnvironmentName=${environmentName} \
Route53AppDomainName=$route53AppDomainName \
--capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM --region $region --no-confirm-changeset --no-fail-on-empty-changeset \
--tags stackname=$stackName environment=$environmentName system=$system customer=$customer