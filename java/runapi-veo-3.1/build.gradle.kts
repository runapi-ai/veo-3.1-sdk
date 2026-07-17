plugins {
  `java-library`
  `maven-publish`
}

description = "RunAPI Veo 3 Java SDK for Veo 3 workflows."

java {
  withSourcesJar()
  withJavadocJar()
}

dependencies {
  api("ai.runapi:runapi-core:0.1.5")

  testImplementation(platform("org.junit:junit-bom:5.10.3"))
  testImplementation("org.junit.jupiter:junit-jupiter")
}

publishing {
  publications {
    create<MavenPublication>("mavenJava") {
      from(components["java"])
      artifactId = "runapi-veo-3.1"
      pom {
        name = "RunAPI Veo 3 Java SDK"
        description = "RunAPI Veo 3 Java SDK for Veo 3 workflows."
        url = "https://runapi.ai/models/veo-3.1"
        licenses {
          license {
            name = "Apache License, Version 2.0"
            url = "https://www.apache.org/licenses/LICENSE-2.0"
          }
        }
        developers {
          developer {
            id = "runapi"
            name = "RunAPI"
            email = "contact@runapi.ai"
          }
        }
        scm {
          url = "https://github.com/runapi-ai/veo-3.1-sdk"
          connection = "scm:git:https://github.com/runapi-ai/veo-3.1-sdk.git"
          developerConnection = "scm:git:ssh://git@github.com/runapi-ai/veo-3.1-sdk.git"
        }
      }
    }
  }
}
