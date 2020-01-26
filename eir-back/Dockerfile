FROM adoptopenjdk/openjdk8-openj9:alpine

MAINTAINER Massimiliano D Acunzo

COPY . /app

RUN rm -rf Dockerfile \
&& addgroup -S rappgroup \
&& adduser -S eir -G rappgroup \
&& chown -R eir /app

USER eir

EXPOSE 8080

WORKDIR /app

ENTRYPOINT [ "java" ]

CMD [ "-jar", "eir-back-fat-1.0-SNAPSHOT.jar" ]
