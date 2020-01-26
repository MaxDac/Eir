# Removing older versions
echo 'Removing older versions'
docker rm $1 --force
docker rmi maxdac/eir:latest

# Executing docker build
echo 'Building... '
cd output/
docker build -t 'maxdac/eir:1.0' .

# Running docker container
docker run -d -p 80:8080 --name $1 maxdac/eir:latest

# Publishing container
docker push maxdac/eir:1.0
