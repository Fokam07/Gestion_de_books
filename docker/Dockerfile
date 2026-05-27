FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive
RUN export JAVA_HOME=$(dirname $(dirname $(readlink -f $(which java)))) \
&& echo "JAVA_HOME=$JAVA_HOME"
ENV ANDROID_SDK_ROOT=/opt/android-sdk
ENV PATH=$PATH:$JAVA_HOME/bin:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/platform-tools

# Java 21 + outils système (Capacitor 8.x requiert Java 21)
RUN apt-get update && apt-get install -y \
    openjdk-21-jdk \
    curl \
    unzip \
    wget \
    git \
    && rm -rf /var/lib/apt/lists/*

# Node.js 22
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Android cmdline-tools
RUN mkdir -p $ANDROID_SDK_ROOT/cmdline-tools \
    && wget -q https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip \
         -O /tmp/cmdtools.zip \
    && unzip -q /tmp/cmdtools.zip -d /tmp/cmdtools \
    && mv /tmp/cmdtools/cmdline-tools $ANDROID_SDK_ROOT/cmdline-tools/latest \
    && rm -rf /tmp/cmdtools /tmp/cmdtools.zip

# Licences + SDK Android 34
RUN yes | sdkmanager --licenses \
    && sdkmanager \
        "platform-tools" \
        "platforms;android-34" \
        "build-tools;34.0.0"

WORKDIR /workspace/app
