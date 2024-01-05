<h1 align="center">Ying Chat</h1>

- [English](README.md)

## 简介

这是一个使用 pnpm 的 monorepo 架构的即时消息项目，只实现了基础的群聊。

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

以下所有命令，如果你是在 windows 下使用 cmd 跑命令，把 `\` 换行符改为 `^`，其他配置请自行替换为自己的。

### 1. redis 启动

```shell
docker run --name redis-test \
  -p 6379:6379 \
  -v D:/DockerData/ContainerBackup/redis-data:/data \
  -d redis
```

### 2. mysql 启动

```shell
docker run --name mysql-test \
  -p 3306:3306 \
  -v D:/DockerData/ContainerBackup/mysql-data:/var/lib/mysql \
  -e MYSQL_ROOT_PASSWORD=ying123456 \
  -e TZ=Asia/Shanghai \
  -d mysql
```

### 3. minio 启动

```shell
docker run --name minio-test -d \
  -p 9000:9000 \
  -p 9090:9090 \
  -v D:/DockerData/ContainerBackup/minio-data:/data \
  -e MINIO_ROOT_USER=ying \
  -e MINIO_ROOT_PASSWORD=ying123456 \
  minio/minio server /data --console-address ":9090"
```

`/data` 是 MinIO 容器内的数据存储位置。

`--console-address` 是 MinIO 的后台管理地址端口。

如果是在 windows 下使用 GitBash 跑命令，把 `/data` 改为 `./data` ，否则会无法正确使用路径。

启动完成后即可打开 MinIO 的后台管理系统，使用上面定义的 `MINIO_ROOT_USER` 和 `MINIO_ROOT_PASSWORD` 进行登录。

[http://localhost:9090](http://localhost:9090)

最后添加一个 `Access Keys`，后面启动项目要用。

### 4. 项目启动

把上面启动好的环境都填到 `apps\server\.env` 中。

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

docker 命令示例，以下`kubernetes.docker.internal`为容器访问我windows的本地网络。

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
