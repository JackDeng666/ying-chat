<h1 align="center">Ying Chat</h1>

- [简体中文](README.zh_CN.md)

## Introduction

This is an instant messaging project using the monorepo of PNPM, which only implements basic group chat.

front end

- Vite
- React
- NextUI
- Socket.IO

back end

- Nestjs
- MySQL
- Redis
- MinIO
- Socket.IO

## Development environment version reference

- node v18.18.2
- pnpm v8.9.2

## Development environment startup

For all the following commands, if you are using cmd to run commands in Windows, change the line break from `\` to `^`, and replace other configurations with your own.

### 1. Redis startup

```shell
docker run --name redis-test \
  -p 6379:6379 \
  -v D:/DockerData/ContainerBackup/redis-data:/data \
  -d redis
```

### 2. MySQL startup

```shell
docker run --name mysql-test \
  -p 3306:3306 \
  -v D:/DockerData/ContainerBackup/mysql-data:/var/lib/mysql \
  -e MYSQL_ROOT_PASSWORD=ying123456 \
  -e TZ=Asia/Shanghai \
  -d mysql
```

### 3. MinIO startup

```shell
docker run --name minio-test -d \
  -p 9000:9000 \
  -p 9090:9090 \
  -v D:/DockerData/ContainerBackup/minio-data:/data \
  -e MINIO_ROOT_USER=ying \
  -e MINIO_ROOT_PASSWORD=ying123456 \
  minio/minio server /data --console-address ":9090"
```

`/data` is the data storage location within the MinIO container.

`--console-address` is the backend management address port of MinIO.

If you are using GitBash to run commands on Windows, change `/data` to `./Data`, otherwise the path may not be used correctly.

After startup, you can open the backend management system of MinIO and use the `MINIO_ROOT_USER` and `MINIO_ROOT_PASSWORD` defined above to log in.

[http://localhost:9090](http://localhost:9090)

Finally, add an `Access Keys` that will be used to start the project later.

### 4. Project startup

Fill in the `apps/server/.env` section with all the environments that have been started above.

```shell
pnpm i
pnpm dev
```

## Deploy

### 1. Build image

The root directory of the project has written a Dockerfile file, and you can directly use Docker's build command to build an image.

```shell
docker build -t ying-chat:latest .
```

### 2. Start container

Docker Command Example，the following `kubernetes.docker.internal` are containers accessing my windows local network.

```shell
docker run --name ying-chat \
  -p 80:3000 \
  -e SERVER_PORT=3000 \
  -e SERVER_JWT_SECRET=4h4gdsf2ds1f2 \
  -e EMAIl_HOST=smtp.qq.com \
  -e EMAIL_PORT=465 \
  -e EMAIL_USER=jackdeng155@qq.com \
  -e EMAIL_AUTH_CODE=somjvruefdgbided \
  -e DB_HOST=kubernetes.docker.internal \
  -e DB_USER=root \
  -e DB_PORT=3306 \
  -e DB_PASSWORD=ying123456 \
  -e DB_NAME=ying_chat \
  -e REDIS_HOST=kubernetes.docker.internal \
  -e REDIS_PORT=6379 \
  -e MINIO_HOST=kubernetes.docker.internal \
  -e MINIO_PORT=9000 \
  -e MINIO_ACCESS_KEY=Jd86dW5F1aXvfcQroe5e \
  -e MINIO_SECRET_KEY=RlQqCWexfztJAQ8A17VS3bdZAj22WhFrWvJBbBQ6 \
  -d ying-chat:latest
```

Docker Compose File Example

```yml
version: '3'
services:
  ying-chat:
    container_name: ying-chat
    image: ying-chat:latest
    ports:
      - '80:3000'
    environment:
      # api
      SERVER_PORT: 3000
      SERVER_JWT_SECRET:
      # mysql
      DB_HOST:
      DB_PORT:
      DB_USER:
      DB_PASSWORD:
      DB_NAME:
      # redis
      REDIS_HOST:
      REDIS_PORT:
      # email
      EMAIl_HOST:
      EMAIL_PORT:
      EMAIL_USER:
      EMAIL_AUTH_CODE:
      # minio
      MINIO_HOST:
      MINIO_PORT:
      MINIO_ACCESS_KEY:
      MINIO_SECRET_KEY:
```
