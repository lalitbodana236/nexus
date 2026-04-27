# syntax=docker/dockerfile:1

FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY target/nexus-core-0.0.1-SNAPSHOT.jar ./app.jar

ENV SPRING_PROFILES_ACTIVE=prod

EXPOSE 10001

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
