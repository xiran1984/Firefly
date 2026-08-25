---
title: "程序员需要了解的一些基础概念"
published: 2026-08-25
description: "用直白的方式梳理前端、后端、数据库、部署运维与团队协作中的常见技术栈概念。"
tags: ["编程", "技术栈", "Vibe Coding"]
category: "技术"
draft: false
lang: zh-CN
---

# 程序员需要了解的一些基础概念

如果你想通过 AI 行业岗位的面试，或者在职场中顺畅地与同事沟通，就需要了解一些基础概念。其中有些概念，你甚至还不知道自己不知道。

这一篇，我会尽量使用最直白、最“人话”的方式，把 JD 中经常出现、但很多人并不了解的技术栈名词做一次简单科普。

这是视频的上集，我们先聊 AI 时代之前就已经存在的技术栈。下一集，再进入 Agent 相关的概念。

可以先记住这条主线：

> **用户看到界面 → 前端发出请求 → 后端处理业务 → 数据库存取信息 → 服务器负责运行 → 运维与测试保证它持续可用。**

## 一、一个应用是由什么组成的

程序员通过编程创造网站、电脑 APP、手机和平板 APP，用这些界面为人们提供服务。但一个界面要真正运行起来，背后需要很多技术栈互相串联。

![网站、电脑 APP 与手机/平板 APP 是服务的三种界面形态](/assets/images/basic-programming-concepts/08-interface-forms.png)

### Vibe Coding

**Vibe Coding**，就是人通过自然语言描述需求，让 AI 生成电脑能够读懂的编程语言，并让电脑按照代码做事。

![Vibe Coding 把自然语言需求转换成可执行代码](/assets/images/basic-programming-concepts/09-vibe-coding.png)

网站、电脑 APP 和手机/平板 APP 的开发与维护工作，一般可以分成五个部分：**前端、后端、数据库、运维 DevOps 和检测**。

因为有了 Vibe Coding，一个人可以干五个人的活，而市场总需求没有变化，所以筛选条件也开始从单纯的技术能力转向资格。

![前端、后端、数据库、运维与检测共同维持一个应用](/assets/images/basic-programming-concepts/01-five-part-stack.png)

下面，我们沿着一个应用从内部开发到外部上线的顺序，逐层认识这些技术。

## 二、后端：负责业务逻辑

前端负责让用户看见和操作，后端则负责真正处理业务。

### 编程语言

**编程语言**，只有编译器能读懂，并且照着办事。

不同语言有不同特点：Python 容易看懂，Rust 省显卡，Go 可以处理高并发需求，TypeScript 是高级的 JavaScript，可以防止 AI 产生类型错误。不同功能也可以使用不同语言完成。

在 AI 时代，不学习这些语言也能编程，只要能够正确说出业务需求和逻辑就行。

### Framework：框架

**Framework**，中文名叫框架。

一些程序员不想反复做相同的工作，于是发明了框架。每次开发新东西时，可以把框架直接拿来使用，不必从头编写。

不同框架由不同语言编写。例如 Spring Boot 使用 Java 编写，FastAPI 使用 Python 编写。并不是所有项目都要使用框架，它只是一个通过面试的筛选条件。

![业务需求、编程语言、框架和可运行程序的关系](/assets/images/basic-programming-concepts/02-language-framework.png)

### API：前端与后端的接口

**API**，中文名叫接口，用来连接后端与前端。

![前端通过 API 向后端发送请求并接收结果](/assets/images/basic-programming-concepts/03-api-interface.png)

### 常见的 Python 后端框架

**FastAPI、Django 和 Flask**是比较常见的 Python 后端框架。

FastAPI 就是一个很快的接口框架。AI 经常会使用 Python，因此 FastAPI 的出场率也很高，无脑用就对了。剩下两个不常用，不用看。

### Spring Boot

**Spring Boot**，外包公司才会使用这个很老的框架，ANC（AI 原生公司）一般不会使用。它和 FastAPI 的功能差不多，只是使用 Java 编写。

### RESTful API

**RESTful API**只是一个接口规范。中转站和模型厂的接口文档，使用的都是这个规范。

它通常采用 JSON 格式，通过 HTTP 完成增删改查，对应的方法包括：

- `POST`
- `DELETE`
- `PUT`
- `GET`

![RESTful 使用 GET、POST、PUT、DELETE 操作资源](/assets/images/basic-programming-concepts/11-restful-methods.png)

### Celery、RQ 与 Redis

**Celery / RQ**用于处理批量任务。

例如，当你点击“批量生图”或者执行 Agent 循环时，系统不会一下子同步给大模型塞入 10 个任务，而是会瞬间让这 10 个任务排队执行。

RQ 中的 R 是 Redis 货架的缩写。**Redis**是一个临时的、存取速度很快的内存数据库，缓存和限流都可以用到它。

![Celery、RQ 和 Redis 如何让批量任务排队执行](/assets/images/basic-programming-concepts/04-task-queue.png)

### SSE 与 WebSocket

**SSE / WebSocket**用于流式输出，让生成的文字像打字机一样，一个接一个地显示出来。

![SSE 单向推送、WebSocket 双向通信与流式输出](/assets/images/basic-programming-concepts/12-streaming-sse-websocket.png)

后端还有很多其他概念，等真正用到时再看即可。

## 三、数据库：负责保存信息

应用运行过程中产生的用户、订单、内容和配置等信息，通常都需要保存在数据库中。

### SQL

**SQL**，所有数据库都使用这个语言。

### SQLite、MySQL 与 PostgreSQL

**SQLite / MySQL / PostgreSQL**，可以简单理解为小型、中型和大型项目分别需要使用的关系型数据库。

![SQLite、MySQL 与 PostgreSQL 的典型使用规模](/assets/images/basic-programming-concepts/13-relational-databases.png)

## 四、前端：负责用户看到的界面

前端负责把数据和功能变成用户能够看到、点击和操作的界面。

### React 与 Vue

**React / Vue**是两个比较常见的网页前端框架，可以通过组件的形式快速开发网页。

需要注意：这里的 **React** 是前端框架，不要和 Agent 中的 **ReAct** 混淆。

![FastAPI、Spring Boot、React 与 Vue 在前后端中的位置](/assets/images/basic-programming-concepts/10-frontend-backend-frameworks.png)

### npm、pnpm 与 yarn

**npm / pnpm / yarn**负责下载一个 `node_modules` 文件夹，里面存放网站搭建过程中可能需要使用的文件。

![npm 下载依赖，React 提供界面能力，Vite 负责打包](/assets/images/basic-programming-concepts/05-npm-vite-react.png)

### Node.js、Next.js 与 NestJS

需要分清楚三个长得很像的名字：**Node.js、Next.js 和 NestJS**。

- **Node.js**：所有现代网页搭建时都会用到。
- **Next.js**：一个 React 框架，可以实现简单的前端加接口功能，例如调用大模型接口获取输出。
- **NestJS**：用于纯后端接口。

### Electron 与 Tauri

Electron 与 Tauri 可以把网页前端包装成电脑 APP。

![Electron 与 Tauri 将网页前端包装成电脑 APP](/assets/images/basic-programming-concepts/14-electron-tauri.png)

### Tailwind CSS 与 shadcn/ui

**Tailwind CSS**负责外观样式；**shadcn/ui**则提供外观样式加动态效果。

![Tailwind CSS 提供样式零件，shadcn/ui 提供可修改的现成组件](/assets/images/basic-programming-concepts/15-tailwind-shadcn.png)

## 五、部署与运维：让程序真正跑起来

程序在本地开发完成后，还需要部署到服务器上，才能持续为用户提供服务。

### 服务器

很多任务无法在用户自己的电脑上完成。例如，大模型生成可能需要性能很强的 GPU。此时，用户电脑会发出请求，让服务器电脑帮助完成任务，再把任务结果返回。

这也是云服务器被称为“云计算”的原因。服务器电脑可以一直保持开机。

![用户电脑把重任务交给持续开机的服务器处理](/assets/images/basic-programming-concepts/16-server.png)

### Linux 与 Shell

**Linux**是服务器的操作系统。

**Shell**是给服务器下指令的命令行，最常见的用途是在服务器上部署程序。

![Linux 是服务器操作系统，Shell 是向它输入命令的入口](/assets/images/basic-programming-concepts/17-linux-shell.png)

### DNS 与 IP

网站和应用都需要通过 **DNS**将域名解析为 **IP**，才能正常联网。

![DNS 将域名查询为 IP 地址，从而找到对应服务器](/assets/images/basic-programming-concepts/18-dns-ip.png)

### Nginx 与 Caddy

**Nginx / Caddy**用于反向代理，把用户请求接入服务器，或者转发到服务器的某个端口。

![Nginx 和 Caddy 将外部请求反向代理到内部端口](/assets/images/basic-programming-concepts/19-nginx-caddy.png)

### Docker 与 Docker Compose

**Docker**可以让服务器中的程序在特定版本、环境和依赖下正常运行。

镜像的意思是安装包，容器的意思是安装好的一整套程序。单台服务器中的多个容器，可以使用 Docker Compose 管理。

![Docker 镜像、容器与 Docker Compose 的关系](/assets/images/basic-programming-concepts/06-docker-compose.png)

### K8s

**K8s**用于管理这些容器。

![K8s 在多台服务器之间调度、替换和扩展容器](/assets/images/basic-programming-concepts/20-k8s.png)

### CDN 与负载均衡

**CDN / 负载均衡**，负责让大量用户请求更加高效地到达服务器。

CDN 像是一个中转节点：如果缓存命中，就直接返回结果；如果没有命中，才会把请求引导到负载均衡。

负载均衡可以理解成一个分流器，它会把请求分配给空闲的服务器。

![CDN 缓存命中与负载均衡分流](/assets/images/basic-programming-concepts/07-cdn-load-balancer.png)

### 私有化部署

**私有化部署**，就是安装显卡，并在公司内网部署开源大模型，供公司员工使用。

### 日志与性能监控

**日志、性能监控**用于发现和修复服务器问题。如果不做运维工程师，稍微了解一下即可。

## 六、团队协作与交付流程

一个程序不仅要能够运行，还需要能够被团队持续修改、检查和发布。

**Git、CI/CD、SDD、TDD、ESLint**，需要用这些工具和方法走一套流程，以便更好地与团队协作。

![SDD、TDD、ESLint、Git 与 CI/CD 组成团队交付流程](/assets/images/basic-programming-concepts/21-team-delivery-workflow.png)

## 七、其他非必要不要使用的技术栈

技术栈不是越多越好。下面这些方案都有适用场景，但没有遇到对应问题时，不需要提前引入。

### K8s

**K8s**，只有在并发量较高、使用多台服务器，需要管理的服务器太多、已经管不过来时，才需要使用。

### Kafka

**Kafka**是后端之间的一种通信方法，只有服务器性能过于烂时才需要使用。

### 微服务

**微服务**，就是把每一个业务功能分别拆出来。

## 结语

这一篇的重点不是一次记住所有名词，而是先知道每个词大概处在系统的什么位置。

当你在 JD、技术文档或同事的讨论中再次看到它们时，就能知道它们分别属于前端、后端、数据库、部署运维还是团队协作。真正用到某项技术时，再深入学习即可。

