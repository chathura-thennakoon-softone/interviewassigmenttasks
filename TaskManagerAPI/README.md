# Task Manager API

A comprehensive Task Management REST API built with .NET 8 Web API, Entity Framework Core, and SQL Server.

## Features

- **User Authentication**: Basic HTTP authentication with username/password
- **Task Management**: Full CRUD operations for tasks
- **Task Filtering & Sorting**: Filter by priority, completion status, and sort by various fields
- **Task Priorities**: Low, Medium, High priority levels
- **Due Dates**: Set and track task due dates
- **Completion Tracking**: Mark tasks as completed with completion timestamps

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with username/password

### Tasks (Requires Authentication)

- `GET /api/tasks` - Get all tasks for the authenticated user
  - Query parameters: `sortBy`, `priority`, `isCompleted`
- `GET /api/tasks/{id}` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/{id}` - Update a task
- `PATCH /api/tasks/{id}/toggle` - Toggle task completion status
- `DELETE /api/tasks/{id}` - Delete a task

## Setup Instructions

### Prerequisites

- .NET 8 SDK
- SQL Server or SQL Server Express
- Visual Studio 2022 or VS Code

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TaskManagerAPI
   ```

2. **Update Connection String**
   
   Edit `appsettings.json` and update the connection string to match your SQL Server instance:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=TaskManagerDB;Trusted_Connection=true;MultipleActiveResultSets=true"
     }
   }
   ```

3. **Restore Packages and Setup Database**
   
   Run the setup batch file:
   ```bash
   setup.bat
   ```
   
   Or manually run:
   ```bash
   dotnet restore
   dotnet ef migrations add InitialCreate
   dotnet ef database update
   ```

4. **Run the Application**
   ```bash
   dotnet run
   ```

   The API will be available at `https://localhost:7219` (or the port shown in the console).

## Usage

### 1. Register a User

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

### 2. Create a Task

```http
POST /api/tasks
Content-Type: application/json
Authorization: Basic dGVzdHVzZXI6cGFzc3dvcmQxMjM=

{
  "title": "Complete project documentation",
  "description": "Write comprehensive documentation for the task manager API",
  "priority": 2,
  "dueDate": "2025-07-25T10:00:00Z"
}
```

### 3. Get Tasks with Filtering

```http
GET /api/tasks?sortBy=priority&priority=2&isCompleted=false
Authorization: Basic dGVzdHVzZXI6cGFzc3dvcmQxMjM=
```

## Authentication

The API uses Basic HTTP Authentication. To authenticate:

1. Register a user using the `/api/auth/register` endpoint
2. Use your username:password encoded in Base64 for the Authorization header
3. For example: `testuser:password123` becomes `dGVzdHVzZXI6cGFzc3dvcmQxMjM=`

## Data Models

### User
- `Id` (int): Unique identifier
- `Username` (string): Unique username
- `Email` (string): User email
- `PasswordHash` (string): Hashed password
- `CreatedAt` (DateTime): Account creation timestamp

### Task
- `Id` (int): Unique identifier
- `Title` (string): Task title (required)
- `Description` (string): Task description (optional)
- `IsCompleted` (bool): Completion status
- `Priority` (enum): Low(1), Medium(2), High(3)
- `CreatedAt` (DateTime): Task creation timestamp
- `DueDate` (DateTime): Optional due date
- `CompletedAt` (DateTime): Completion timestamp
- `UserId` (int): Foreign key to User

## Error Handling

The API includes comprehensive error handling with appropriate HTTP status codes:

- `200 OK`: Successful operation
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Access denied
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Testing

Use the included `TaskManagerAPI.http` file with VS Code REST Client extension or any HTTP client like Postman to test the API endpoints.

## Database Schema

The application uses Entity Framework Core with SQL Server. The database includes:

- `Users` table with unique constraints on Username and Email
- `Tasks` table with foreign key relationship to Users
- Automatic timestamps for creation and completion

## Security Features

- Password hashing using BCrypt
- Basic HTTP authentication
- User isolation (users can only access their own tasks)
- Input validation and sanitization
- SQL injection prevention through Entity Framework

## Technologies Used

- .NET 8 Web API
- Entity Framework Core 8
- SQL Server
- BCrypt.Net for password hashing
- Swagger/OpenAPI for documentation
- Basic HTTP Authentication

## License

This project is created for educational and interview purposes.
