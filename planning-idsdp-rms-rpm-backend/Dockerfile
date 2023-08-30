FROM openjdk:11
ADD target/planning-idsdp-rms-rpm-backend-0.0.1-SNAPSHOT.jar planning-idsdp-rms-rpm-backend-0.0.1-SNAPSHOT.jar
EXPOSE 8080
ENTRYPOINT ["java","-Dspring.profiles.active=prod","-jar","planning-idsdp-rms-rpm-backend-0.0.1-SNAPSHOT.jar"]
