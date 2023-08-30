FROM openjdk:11
ADD target/planning-idsdp-rms-ti-backend-0.0.1-SNAPSHOT.jar planning-idsdp-rms-ti-backend-0.0.1-SNAPSHOT.jar
EXPOSE 7004
ENTRYPOINT ["java","-Dspring.profiles.active=prod","-jar","planning-idsdp-rms-ti-backend-0.0.1-SNAPSHOT.jar"]
