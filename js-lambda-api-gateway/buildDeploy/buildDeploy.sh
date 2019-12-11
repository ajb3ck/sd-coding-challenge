#! /bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

cd $DIR/../lambdas/launchpads
rm -rf node_modules
npm install
npm run package
cd -

rm -rf lambdaPackages

mkdir lambdaPackages
mkdir lambdaPackages/launchpads

mv $DIR/../lambdas/launchpads/dist.zip $DIR/lambdaPackages/launchpads/

cd $DIR/terraform

terraform init --input=false
terraform apply --input=false --auto-approve

cd -