FROM openjdk:11
ADD target/planning-idsdp-pps-rdpp-rtapp-backend-0.0.1-SNAPSHOT.jar planning-idsdp-pps-rdpp-rtapp-backend-0.0.1-SNAPSHOT.jar
EXPOSE 8097
RUN bash -c 'touch planning-idsdp-pps-rdpp-rtapp-backend-0.0.1-SNAPSHOT.jar'
ENTRYPOINT ["java","-Dspring.profiles.active=prod","-jar","planning-idsdp-pps-rdpp-rtapp-backend-0.0.1-SNAPSHOT.jar"]
