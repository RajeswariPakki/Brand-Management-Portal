# Full Stack CRUD Application – ASP.NET Core & Vue.js

A full-stack CRUD (Create, Read, Update, Delete) application built using **ASP.NET Core Web API** for the backend and **Vue.js** for the frontend. The application demonstrates how a frontend communicates with a REST API to perform database operations.

## 🚀 Technologies Used

### Backend
- C#
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- RESTful APIs
- Swagger

### Frontend
- Vue.js
- JavaScript
- HTML5
- CSS3
- Vite

## 📂 Project Structure

```text
DotNet-Vue-CRUD-Application/
│
├── Backend/
│   ├── Controllers/
│   ├── Models/
│   ├── Data/
│   ├── Program.cs
│   └── CRUDOperations.csproj
│
├── Frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

## ✨ Features

- Create new records.
- Retrieve and display records.
- Update existing records.
- Delete records.
- Backend API integration with Vue.js.
- Role-based access
- Database operations using Entity Framework Core.
- REST API testing using Swagger.

## 🏗️ Application Architecture

The application follows a client-server architecture.

1. **Vue.js Frontend:** Provides the user interface and handles user interactions.
2. **ASP.NET Core Web API:** Receives HTTP requests and processes business logic.
3. **Entity Framework Core:** Handles communication between the backend and database.
4. **SQL Server:** Stores application data.

```text
User
  |
  v
Vue.js Frontend
  |
  | HTTP Requests
  v
ASP.NET Core Web API
  |
  v
Entity Framework Core
  |
  v
SQL Server Database
```

## ⚙️ Prerequisites

Make sure the following tools are installed:

- Visual Studio
- .NET SDK
- Node.js and npm
- SQL Server
- Git

## ▶️ How to Run the Application

### 1. Clone the Repository

```bash
git clone https://github.com/RajeswariPakki/Brand-Management-Portal.git
```

### 2. Run the Backend

Navigate to the backend directory:

```bash
cd Backend
```

Restore dependencies:

```bash
dotnet restore
```

Run the application:

```bash
dotnet run
```

Open Swagger in your browser to explore and test the available APIs.

### 3. Run the Frontend

Open another terminal and navigate to the frontend directory:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

Start the Vue development server:

```bash
npm run dev
```

Open the local URL displayed in the terminal to access the application.

## 📚 Learning Objectives

This project was developed to gain practical experience in:

- Building RESTful APIs using ASP.NET Core.
- Understanding controllers, models and application configuration.
- Implementing database operations using Entity Framework Core.
- Understanding HTTP methods such as GET, POST, PUT and DELETE.
- Connecting a Vue.js frontend with a .NET backend.
- Understanding client-server communication.
- Managing source code using Git and GitHub.

## 👨‍💻 Author

Developed as a hands-on learning project to explore full-stack application development using .NET and Vue.js.
