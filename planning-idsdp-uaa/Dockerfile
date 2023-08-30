FROM openjdk:11
ADD target/planning-idsdp-uaa.jar planning-idsdp-uaa.jar
EXPOSE 8080
ENTRYPOINT ["java","-Dspring.profiles.active=prod","-jar","planning-idsdp-uaa.jar"]
