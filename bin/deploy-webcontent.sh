#!/bin/bash

cd ${workspaceDir}/devops-toolkit-web
export website_bucket="devops-${environment}-us-east-1-${awsaccount_target}-toolkit-web"

npm cache clean -f
npm install
npm run build

echo "Deploying to bucket: ${website_bucket}"
aws s3 sync --delete \
  "dist/devops-toolkit-web/browser/" \
  "s3://${website_bucket}" \
  --region us-east-1

aws cloudfront list-distributions --output json --query "DistributionList.Items[?Comment=='devops-toolkit-${environment}'].Id" | awk -F '"' '{print $2}' | xargs -I{} aws cloudfront create-invalidation --distribution-id {} --paths "/*"
