FROM maven:3-eclipse-temurin-17 AS builder

WORKDIR /app

COPY pom.xml .
RUN mvn -B -e -C org.apache.maven.plugins:maven-dependency-plugin:3.1.2:go-offline

COPY . .
RUN mvn -B -e -o package

FROM eclipse-temurin:17-alpine

RUN apk add dumb-init

WORKDIR /app

RUN addgroup --system java && adduser -S -s /bin/false -G java java
COPY --from=builder /app/target/lesebot-1.0-SNAPSHOT.jar lesebot.jar
COPY --from=builder /app/assets assets/

RUN chown -R java:java /app
USER java

CMD "dumb-init" "java" "-jar" "lesebot.jar"