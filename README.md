# Service Discovery with Consul

## Overview

This project demonstrates a basic service discovery mechanism using **Consul** in a **microservices architecture**. We have three services (Service A, Service B, and Service C) registered with Consul, an API Gateway that uses Consul to discover the services, and Docker Compose for orchestration.

The setup includes:

- **Service Registration** with Consul
- **Health Checks** to ensure only healthy services are returned
- **Load Balancing** where the API Gateway selects a random instance of a service when multiple instances are available
- **Service Deregistration** to ensure services are deregistered on shutdown
- **Docker Compose Setup** to run services, Consul, and the gateway

---

## Requirements

1. **Docker** and **Docker Compose** installed on your local machine.
2. A basic understanding of **microservices** and **service discovery** concepts.
3. Services are registered and health-checked via **Consul**.
4. An **API Gateway** that dynamically discovers and routes traffic to the services.
5. Use **Docker Compose** for setting up everything in containers.

---

## Project Structure

```
project-root/
├── docker-compose.yml      # Docker Compose file for services, gateway, and Consul
├── services/
│   ├── service-a/          # Service A: A dummy service with health check
│   ├── service-b/          # Service B: A dummy service with health check
│   └── service-c/          # Service C: A dummy service with health check
├── gateway/                # API Gateway: Routes requests to services
├── README.md               # Project documentation
└── .env                    # (Optional) Environment variables for services
```

---

## How to Run the Project

### Step 1: Clone the repository

```bash
git clone <repository-url>
cd <repository-folder>
```

### Step 2: Build and run the services with Docker Compose

Make sure **Docker** and **Docker Compose** are installed on your machine. Then run:

```bash
docker-compose up --build
```

This will:
1. Build the Docker images for the services and gateway.
2. Start the **Consul**, **Service A**, **Service B**, **Service C**, and **API Gateway** containers.

The services are available via the following routes:

- Service A: `http://localhost:3001/info`
- Service B: `http://localhost:3002/info`
- Service C: `http://localhost:3003/info`
- API Gateway: `http://localhost:3000/service-a/info`, `http://localhost:3000/service-b/info`, `http://localhost:3000/service-c/info`

The API Gateway will route the requests to the healthy instances of the services.

---

## Service Discovery Flow

### 1. **Consul Registration**
Each service (`service-a`, `service-b`, `service-c`) registers itself with **Consul** on startup using the Consul Agent. The services are registered with the following parameters:

- `id`: Unique identifier for the service.
- `name`: Service name.
- `port`: The port on which the service is running.
- `check`: A health check for each service (`/health` route), which is checked every 10 seconds.

### 2. **Health Checks**
Each service exposes a `/health` endpoint. Consul periodically checks this endpoint to ensure that the service is healthy. If the health check fails, the service is marked as **unhealthy** and is not included in the list of available instances.

### 3. **API Gateway**
The API Gateway (`gateway` service) acts as the entry point to the system. It queries Consul to find available services and routes requests to one of the healthy instances.

- The API Gateway uses Consul's **HTTP API** to fetch the list of healthy services.
- If there are multiple healthy instances, the API Gateway selects a random instance.

---

## Key Features

### 1. **Health Checks**

Each service has a `/health` endpoint for Consul to check the health of the service:

```bash
GET http://<service-name>:<port>/health
```

If the service is healthy, it returns `200 OK`. Otherwise, Consul will mark it as unhealthy.

### 2. **Load Balancing**

The API Gateway, when routing a request to a service, picks a healthy instance randomly from the available services. This ensures basic load balancing by distributing the requests between multiple instances of the same service.

### 3. **Service Deregistration**

When a service shuts down, it sends a deregistration request to Consul to ensure that the service is removed from the list of available services.

---

## Running the Project

### Accessing Services

Once the services are up and running, you can access the dummy `/info` endpoint for each service via the following URLs:

- `http://localhost:3001/info` for **Service A**
- `http://localhost:3002/info` for **Service B**
- `http://localhost:3003/info` for **Service C**

The API Gateway will allow you to access each service via:

- `http://localhost:3000/service-a/info`
- `http://localhost:3000/service-b/info`
- `http://localhost:3000/service-c/info`

---

## How to Stop the Project

To stop the containers, run the following command:

```bash
docker-compose down
```

This will stop and remove all the containers, networks, and volumes.

---

## Docker Compose File

The `docker-compose.yml` file sets up the following services:

- **Consul**: Service registry.
- **Service A, Service B, Service C**: Dummy services that register themselves with Consul and expose a `/info` and `/health` endpoint.
- **API Gateway**: Routes requests to the appropriate service based on the service name.

---

## Stretch Goals (Optional)

If you want to take the project further, consider the following stretch goals:

### 1. **Custom Domain with Route 53**
Configure a custom domain name for the services using **Amazon Route 53**.

### 2. **HTTPS with Let's Encrypt**
Use **Let's Encrypt** to configure SSL certificates for HTTPS.

### 3. **CI/CD Pipeline**
Implement a CI/CD pipeline using **GitHub Actions** to deploy services automatically whenever changes are pushed to the repository.

---

## Conclusion

By completing this project, you’ll have hands-on experience with:

- **Service Discovery** using **Consul**.
- **API Gateway** routing and load balancing.
- **Docker Compose** for orchestrating microservices.
- **Service health checks** and **deregistration** for better service management.

You will be better equipped to manage **microservices** and ensure high availability in a distributed system.

---

Feel free to modify the services or add more as needed. Happy coding! 🎉

---
https://roadmap.sh/projects/service-discovery