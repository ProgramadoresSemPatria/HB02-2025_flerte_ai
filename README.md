# Flert AI 💘

### Your assistant for when you need it most

-----

## About

You know that moment when your crush texts you and you don't know how to reply? Don't worry, it happens to everyone.

With **Flert AI**, you can ask for tips on how to respond to messages, how to start a conversation, choose a style for our assistant (Direct, Friendly, Sensual), and decide if you want a more complex or simpler response.

Another feature is image analysis (screenshots of conversations). You send the message, and the assistant analyzes the conversation, generating a response for your problem.

-----

## Technologies used

  - **Frontend:**
    - React Native
    - Typescript
  - **Backend:**
    - .NET 8 SDK
    - C#
    - ASP.NET Core
  - **AI**
    - Python
    - FastAPI
    - Google Gemini

-----

# Backend Setup and Execution Guide (flerte-ai-backend)

## 1\. Prerequisites

Before you begin, make sure you have the following tools installed on your machine:

  - **.NET 8 SDK:** The platform to run the project.
    [Download](https://dotnet.microsoft.com/download/dotnet/8.0.0)
  - **MySQL Server:** A local MySQL database.
    Option A (Recommended): Install MySQL and MySQL Workbench to manage it. Write down the password you set for the root user during installation.
    Option B (Advanced): If you use Docker, you can start a MySQL container.
  - **Git:** To clone the project repository.

## 2\. Project Configuration

Follow these steps in your preferred terminal (PowerShell, CMD, Git Bash, etc.).

### Step 1: Clone the Repository

If you haven't already, clone the project's main repository to your machine.

```bash
git clone <repository_url>
```

### Step 2: Navigate to the Backend Folder

All subsequent commands should be executed from within the backend project folder.

```bash
cd path/to/project/flerte-ai-backend
```

### Step 3: Configure Local Secrets (User Secrets)

We do not store passwords or secret keys in the code. Each developer must configure their own secrets locally using the .NET Secret Manager tool.

Initialize the Secret Manager:

```bash
dotnet user-secrets init
```

Configure the Database Connection String (replace YOUR\_MYSQL\_PASSWORD\_HERE):

```bash
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=localhost;Port=3306;Database=flerte_ai_db;Uid=root;Pwd=YOUR_MYSQL_PASSWORD_HERE;"
```

Configure the JWT Secret Key:

```bash
dotnet user-secrets set "Jwt:Key" "K3yS3cr3t4P4r4M3uH4ck4th0nQu3T3mQu3S3rMuit0L0ng4P4r4Func10n4rC0mHmacSha512"
```

### Step 4: Restore Project Dependencies

```bash
dotnet restore
```

### Step 5: Create the Database (Apply Migrations)

```bash
dotnet ef database update
```

## 3\. Running the API

If all the previous steps were completed without errors, your environment is ready.

Start the API:

```bash
dotnet run
```

Check the Output: The terminal will show something like:

```
Now listening on: https://localhost:7099
```

Access the API Documentation (Swagger):

```
https://localhost:XXXX/swagger
```

(replace `XXXX` with the port indicated in the terminal).
You will see interactive documentation with all the API endpoints.

The backend is now fully functional on your machine\!
