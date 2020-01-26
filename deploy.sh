echo 'Cleaning folder'
rm -rf output/

echo 'Running front end build'
cd eir-front-angular/
npm run deploy
#
echo 'Running back end build'
rm -rf ../eir-back/webroot/
mkdir ../eir-back/webroot/
cp -a dist/eir-front-angular/. ../eir-back/webroot/
cd ../eir-back/
./gradlew fatJar

# echo 'Warning! The last two must instructions must be executed manually after the deploy'
# Execute independently
echo 'Copying to output folder'
mkdir ../output
cp build/libs/eir-back-fat-1.0-SNAPSHOT.jar ../output/
cp -R webroot ../output/webroot
cp eir.db ../output/
cp Dockerfile ../output/
