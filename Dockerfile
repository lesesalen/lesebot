FROM maven:3-eclipse-temurin-17 AS builder

WORKDIR /app

COPY pom.xml .

RUN mvn clean install

COPY . .

RUN mvn package -DskipTests

FROM eclipse-temurin:17-alpine

RUN apk add dumb-init

WORKDIR /app

RUN addgroup --system java && adduser -S -s /bin/false -G java java
COPY --from=builder /app/target/lesebot-1.0-SNAPSHOT.jar lesebot.jar
COPY --from=builder /app/assets assets/

RUN chown -R java:java /app
USER java

CMD "dumb-init" "java" "-jar" "lesebot.jar"