#! /bin/bash

cd ../lambdas/launchpads
npm run package
cd -

rm -rf lambdaPackages

mkdir lambdaPackages
mkdir lambdaPackages/launchpads

mv ../lambdas/launchpads/dist.zip ./lambdaPackages/launchpads/