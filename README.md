<h1 align="center">Ying Chat</h1>

## 简介

这是一个使用 pnpm 的 monorepo 架构的即时通讯项目，前端 Vite + React + NextUI，后端使用 Nestjs + typeorm + MySQL，只实现了基础的群聊。

详细:

前端

- Vite
- React
- NextUI
- Socket.IO

后端

- Nestjs
- MySQL
- Redis
- MinIO
- Socket.IO

## 开发环境版本参考

- node v18.18.2
- pnpm v8.9.2

## 开发环境启动

查看 `apps\server\.env` 文件，把需要环境都填进去。

```shell
pnpm i
pnpm dev
```

## 部署

### 1. 打包镜像

项目根目录写了 Dockerfile 文件，直接使用 docker 的打包命令打包一个镜像。

```shell
docker build -t ying-chat:latest .
```

### 2.启动镜像

docker 命令示例，以下`kubernetes.docker.internal`为容器内访问我windows的宿主机的网络。

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

docker compose 文件示例

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
