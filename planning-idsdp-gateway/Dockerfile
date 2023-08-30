FROM openjdk:11
ADD target/planning-idsdp-gateway-0.0.1-SNAPSHOT.jar planning-idsdp-gateway-0.0.1-SNAPSHOT.jar
EXPOSE 8081
ENTRYPOINT ["java","-Dspring.profiles.active=prod","-jar","planning-idsdp-gateway-0.0.1-SNAPSHOT.jar"]
