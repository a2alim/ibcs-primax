FROM openjdk:11
ADD target/planning-idsdp-configuration-backend-0.0.1-SNAPSHOT.jar planning-idsdp-configuration-backend-0.0.1-SNAPSHOT.jar
EXPOSE 8083
ENTRYPOINT ["java","-Dspring.profiles.active=prod","-jar","planning-idsdp-configuration-backend-0.0.1-SNAPSHOT.jar"]
