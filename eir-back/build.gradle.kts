import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    kotlin("jvm") version "1.3.61"
    java
    application
}

group = "com.eir.gdr"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    compile("org.jetbrains.kotlin:kotlin-test-junit:1.3.50")
    compile("org.junit.jupiter:junit-jupiter-api:5.5.2")
    implementation(kotlin("stdlib-jdk8"))
    implementation("io.vertx:vertx-jdbc-client:3.8.3")
    implementation("org.xerial:sqlite-jdbc:3.28.0")
    implementation("io.vertx:vertx-core:3.8.3")
    implementation("io.vertx:vertx-web:3.8.3")
    testImplementation("org.junit.jupiter:junit-jupiter-api:5.5.2")
    testRuntime("org.junit.jupiter:junit-jupiter-api:5.5.2")
}

tasks.withType<KotlinCompile> {
    kotlinOptions.jvmTarget = "1.8"
}

java {
    sourceCompatibility = JavaVersion.VERSION_1_8
}

application {
    mainClassName = "com.eir.gdr.MainKt"
}

val fatJar = task("fatJar", type = Jar::class) {
    baseName = "${project.name}-fat"
    manifest {
        attributes["Implementation-Title"] = "Rhodes Gallery Fat Jar"
        attributes["Implementation-Version"] = version
        attributes["Main-Class"] = "com.eir.gdr.MainKt"
    }
    val from = from(configurations.runtimeClasspath.get()
        .map { if (it.isDirectory) it else zipTree(it) })
    with(tasks.jar.get() as CopySpec)
}

tasks {
    "build" {
        dependsOn(fatJar)
    }
}
