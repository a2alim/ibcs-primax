FROM openjdk:11
ADD target/planning-idsdp-rms-configuration-backend-0.0.1-SNAPSHOT.jar planning-idsdp-rms-configuration-backend-0.0.1-SNAPSHOT.jar
EXPOSE 6000
ENTRYPOINT ["java","-Dspring.profiles.active=prod","-jar","planning-idsdp-rms-configuration-backend-0.0.1-SNAPSHOT.jar"]
