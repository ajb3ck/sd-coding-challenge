#! /bin/bash

cd ../lambdas/launchpads
npm run package
cd -

rm -rf lambdaPackages

mkdir lambdaPackages
mkdir lambdaPackages/launchpads

mv ../lambdas/launchpads/dist.zip ./lambdaPackages/launchpads/

cd terraform

terraform init --input=false
terraform apply --input=false --auto-approve

cd -