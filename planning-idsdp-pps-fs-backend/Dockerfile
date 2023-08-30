FROM openjdk:11
ADD target/planning-idsdp-pps-fs-backend-0.0.1-SNAPSHOT.jar planning-idsdp-pps-fs-backend.jar
EXPOSE 8086
ENTRYPOINT ["java","-Dspring.profiles.active=prod","-jar","planning-idsdp-pps-fs-backend.jar"]
