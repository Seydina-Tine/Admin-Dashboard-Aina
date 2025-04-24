# Dockerfile-SpringBoot
FROM openjdk:19-slim

# Installer netcat (nc)
RUN apt-get update && apt-get install -y netcat

COPY target/adel_version2024-0.0.1-SNAPSHOT.jar adel_version2024-0.0.1-SNAPSHOT.jar
EXPOSE 9001
CMD ["java", "-jar", "adel_version2024-0.0.1-SNAPSHOT.jar"]
