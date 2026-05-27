#
# Image de build Android — eclipse-temurin:21 (JDK 21) + Node 20
# Le SDK Android est installé au runtime dans un volume persistant
#
FROM eclipse-temurin:21-jdk-jammy

ENV DEBIAN_FRONTEND=noninteractive

#
# 1. Outils système
#
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    unzip \
    git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

#
# 2. Node.js 20
#
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

#
# 3. Android SDK paths (volume persistant monté par docker-compose)
#
ENV ANDROID_HOME=/opt/android-sdk
ENV PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH

#
# 4. Répertoire de travail
#
WORKDIR /workspace

#
# 5. Script d'entrée
#
COPY scripts/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
