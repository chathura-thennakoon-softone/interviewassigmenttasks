# Quick Start Guide - Task Manager API

## Problem: Database Connection Issues

If you're seeing SQL Server connection errors, don't worry! The API is now configured to automatically fall back to an InMemory database for development and testing.

## Quick Solution

1. **Run the API immediately** (no database setup required):
   ```bash
   cd "d:\A-MY_LEARNINGS\SOFTONE\TaskManagerAPI\TaskManagerAPI"
   dotnet run
   ```

2. **The API will automatically use InMemory database** if SQL Server is not available.

## Database Options

### Option 1: InMemory Database (Recommended for Testing)
- **Pros**: No setup required, works immediately
- **Cons**: Data is lost when application stops
- **Usage**: Perfect for development and demonstration

To force InMemory database, set in `appsettings.Development.json`:
```json
{
  "DatabaseProvider": "InMemory"
}
```

### Option 2: SQL Server Express (For Persistence)
1. Install SQL Server Express from Microsoft
2. Update connection string in `appsettings.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=.\\SQLEXPRESS;Database=TaskManagerDB;Trusted_Connection=true;MultipleActiveResultSets=true;TrustServerCertificate=true"
     },
     "DatabaseProvider": "SqlServer"
   }
   ```
3. Run: `dotnet ef database update`

### Option 3: LocalDB
If you have Visual Studio installed, LocalDB should be available:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=TaskManagerDB;Trusted_Connection=true;MultipleActiveResultSets=true"
  },
  "DatabaseProvider": "SqlServer"
}
```

## Testing the API

1. **Start the API**:
   ```bash
   dotnet run
   ```

2. **Open your browser** and go to: `https://localhost:7219/swagger`

3. **Test the endpoints**:
   - Register a user: `POST /api/auth/register`
   - Login: `POST /api/auth/login`
   - Create tasks: `POST /api/tasks` (requires authentication)

## Sample API Calls

### 1. Register a User
```http
POST https://localhost:7219/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

### 2. Create a Task (with Basic Auth)
```http
POST https://localhost:7219/api/tasks
Content-Type: application/json
Authorization: Basic dGVzdHVzZXI6cGFzc3dvcmQxMjM=

{
  "title": "My First Task",
  "description": "This is a test task",
  "priority": 2
}
```

> **Note**: `dGVzdHVzZXI6cGFzc3dvcmQxMjM=` is Base64 encoding of `testuser:password123`

## Troubleshooting

### Issue: Port Already in Use
- Change the port in `Properties/launchSettings.json`
- Or use: `dotnet run --urls "https://localhost:5001"`

### Issue: HTTPS Certificate
- Run: `dotnet dev-certs https --trust`

### Issue: Still Getting SQL Errors
- Delete the `Migrations` folder if it exists
- Set `"DatabaseProvider": "InMemory"` in `appsettings.Development.json`
- Restart the application

## Features Working with InMemory Database

✅ User Registration  
✅ User Authentication  
✅ Task CRUD Operations  
✅ Task Filtering & Sorting  
✅ All API Endpoints  
✅ Swagger Documentation  

The only difference is that data won't persist between application restarts, which is perfect for demonstration purposes!
