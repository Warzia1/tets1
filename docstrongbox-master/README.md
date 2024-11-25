# Doc Strongbox API

## Creators

The **Doc Strongbox API** project was developed by the following contributors:

- **Baptiste COSTAMAGNA** - Lead developer and responsible for integrating and configuring the backend (Node.js, MongoDB, Docker).
- **Aya FSAHI** and **Pierre WADRA** - Contributed to project management and design
- **RUEFF Nathan** - Main external colaborator for integration with the authentication API(RUGM)
- **Remy SAIL**, **Leo CUISSET** and **Hadir BARHOUMI** - Project initiators

### Acknowledgments

We would like to thank everyone who contributed to this project and helped it evolve.

## Description

The Strongbox API is a REST API designed to securely store and manage files. It acts as a vault where each service or group of users can deposit files that are accessible only to them. Depending on the requirements, the API offers advanced features like exclusive access to documents, file sensitivity management with different encryption levels, and much more.

## Goals

- Allow any service to deposit files in a secure vault.
- Ensure that only authorized users or services can access the files.
- Manage document sensitivity through encryption levels.
- Provide a token to retrieve deposited documents.
- Support persistence and scalability for stored files.

## Features

- **File CRUD Operations**: Create, Read, Update, and Delete files using standard HTTP methods (GET, POST, PUT, DELETE).
- **Authentication**: Users and services must be authenticated to use the API.
- **Document Exclusivity**: Option to restrict file access to the user who deposited it.
- **Document Sensitivity**: Sensitive files can be protected by different encryption levels.
- **Automatic Documentation**: The API is self-documented and accessible via a specific domain, using Swagger or another documentation tool.

## Technology

### REST API

The Strongbox API is based on REST (Representational State Transfer) architecture, which uses HTTP requests to perform CRUD operations on resources. It enables standardized and secure communication with other services and applications through URLs and HTTP methods (GET, POST, PUT, DELETE).

### Database: MongoDB

MongoDB is used to store files and their associated metadata in JSON-like documents. This NoSQL database offers flexibility and scalability for document management, making it suitable for a wide range of use cases.

### Server: Node.js & Express

Node.js and Express are used to build the Strongbox API server. They handle incoming requests, interact with the MongoDB database, and send responses to clients quickly and efficiently.

### Documentation: Swagger

Swagger is used to generate the interactive API documentation. Endpoints, HTTP methods, parameters, and usage examples are detailed, making integration easier for other developers or services.

## Endpoints

- **POST /**: Deposit a file in the vault.
- **GET /**: Retrieve a file.
- **PUT /**: Update an existing file.
- **DELETE /**: Delete a file from the vault.
- **GET /files**: Get the list of the users files.
- **GET /api-doc**: Get the API documentation.

## Authentication and Security

- Users and services must authenticate before accessing API features.
- Only the Scolis manager has direct access to the API; all other services must go through a secure mechanism.
- The service is in stateful mode, ensuring persistence and data volume management.

## Installation and Setup

### Prerequisites

- **Docker**: Ensure Docker is installed to facilitate application deployment.
- **Node.js and npm**: Required if you want to run the application outside of Docker.

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://forgens.univ-ubs.fr/gitlab/projetwebsecu3/docstrongbox.git
   cd docstrongbox
   ```

Configure the environment variables

2. **Create a .env file in the project's root directory with the following configuration values:**

    ```env
    USERNAME=APPDocStrongBoxUsernameRUGM
    PASSWORD=APPDocStrongBoxPasswordRUGM
    RUGM_HOST=http://rugm.ensibs.fr:5000
    DB_HOST=127.0.0.1
    DB_NAME=DocStrongBox
    ```
3. **Start a MongoDB Server**

   - **Using Docker**: If you prefer to use Docker, you can start a MongoDB container with the following command:

     ```bash
     docker run -d -p 27017:27017 --name DocStrongBox -v mongo-data:/data/db mongo
     ```

     This command will:
     - Start a MongoDB server in a container named `strongbox-mongo`.
     - Expose MongoDB on port 27017 (the default MongoDB port).
     - Use a Docker volume `mongo-data` to persist data.

   - **Without Docker**: Alternatively, if MongoDB is installed locally, you can start it using the command:

     ```bash
     mongod --dbpath /path/to/your/mongo/data
     ```

     Replace `/path/to/your/mongo/data` with the actual path where you want to store MongoDB data files. MongoDB will start listening on `localhost:27017` by default.

   Ensure MongoDB is running on the host and port specified in your `.env` file (default: `DB_HOST=127.0.0.1`, `DB_PORT=27017`) before proceeding to the next step.


4. **Download and start the Docker container**

    If you're using Docker, run the following commands to build and start the application:

    ```bash
    mkdir files
    docker build -t doc-strongbox-api .
    docker run -d --network host -v ./files/:/usr/src/app/uploads/ --env-file .env --name DocStrongBox_API doc-strongbox-api
    ```

5. **Verify API access**

    Access the API via http://localhost:3000 to verify it is working correctly. The Swagger documentation is available at http://localhost:3000/api-doc.