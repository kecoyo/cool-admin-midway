
FROM node:lts-alpine

WORKDIR /app

# 配置alpine国内镜像加速
RUN sed -i "s@http://dl-cdn.alpinelinux.org/@https://repo.huaweicloud.com/@g" /etc/apk/repositories

# 安装tzdata,默认的alpine基础镜像不包含时区组件，安装后可通过TZ环境变量配置时区
RUN apk add --no-cache tzdata

# 设置时区为中国东八区，这里的配置可以被docker-compose.yml或docker run时指定的时区覆盖
ENV TZ="Asia/Shanghai"

# 如果各公司有自己的私有源，可以替换registry地址,如使用官方源注释下一行
RUN npm config set registry https://registry.npmmirror.com

# 复制package.json等文件到容器
COPY package.json ./package.json
COPY bootstrap.js ./bootstrap.js
COPY public ./public

# 安装环境依赖   
RUN npm install

# ‌声明挂载点：构建目录、日志目录
VOLUME [ "/app/dist", "/app/logs" ]

# 如果端口更换，这边可以更新一下
EXPOSE 8001

CMD ["npm", "run", "start"]