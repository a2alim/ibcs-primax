FROM openjdk:11
ADD target/planning-idsdp-pps-pc-backend-0.0.1-SNAPSHOT.jar pps-pc-backend.jar
EXPOSE 8085
ENTRYPOINT ["java","-Dspring.profiles.active=prod","-jar","pps-pc-backend.jar"]
