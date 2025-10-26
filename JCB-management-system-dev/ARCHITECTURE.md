# JCB Management System - Architecture Overview

## System Architecture Diagram

```mermaid
graph TB
    subgraph "Frontend - React Application"
        Browser[Web Browser]
        Router[React Router]
        Auth[AuthContext]
        
        subgraph "Pages"
            Home[Homepage]
            Login[Login Page]
            Register[Register Page]
            CDash[Customer Dashboard]
        end
        
        subgraph "Components"
            Layout[Layout Component]
            Protected[Protected Route]
        end
        
        API[API Service Layer]
    end
    
    subgraph "Backend - Spring Boot"
        subgraph "Controllers"
            AuthCtrl[AuthController]
            BookCtrl[BookingController]
            CustCtrl[CustomerController]
        end
        
        subgraph "Services"
            AuthSvc[AuthService]
            BookSvc[BookingService]
        end
        
        subgraph "Repositories"
            UserRepo[User Repositories]
            BookRepo[BookingRepository]
            JCBRepo[JCBRepository]
        end
    end
    
    subgraph "Database - MySQL"
        DB[(MySQL Database)]
        
        subgraph "Tables"
            CustTbl[Customer]
            AdminTbl[Admin]
            DriverTbl[Driver]
            MechTbl[Mechanic]
            OwnerTbl[Owner]
            JCBTbl[JCB]
            BookTbl[Bookings]
        end
    end
    
    Browser --> Router
    Router --> Home
    Router --> Login
    Router --> Register
    Router --> Protected
    Protected --> CDash
    
    Home --> Layout
    Login --> Layout
    Register --> Layout
    CDash --> Layout
    
    Login --> Auth
    Register --> Auth
    CDash --> Auth
    
    CDash --> API
    Login --> API
    Register --> API
    
    API -->|HTTP POST /api/auth/login| AuthCtrl
    API -->|HTTP POST /api/auth/register| AuthCtrl
    API -->|HTTP POST /api/bookings| BookCtrl
    API -->|HTTP GET /dashboard/customer/jcbs/available| CustCtrl
    
    AuthCtrl --> AuthSvc
    BookCtrl --> BookSvc
    CustCtrl --> BookSvc
    
    AuthSvc --> UserRepo
    BookSvc --> BookRepo
    BookSvc --> JCBRepo
    
    UserRepo --> CustTbl
    UserRepo --> AdminTbl
    UserRepo --> DriverTbl
    UserRepo --> MechTbl
    UserRepo --> OwnerTbl
    BookRepo --> BookTbl
    JCBRepo --> JCBTbl
```

## Component Interaction Flow

### User Registration Flow

```mermaid
graph LR
    A[User fills registration form] --> B[Frontend validates input]
    B --> C[API POST /api/auth/register]
    C --> D[AuthController receives request]
    D --> E[AuthService processes registration]
    E --> F[Check if user exists]
    F -->|Not exists| G[Create user in role table]
    F -->|Exists| H[Return error]
    G --> I[Return success]
    I --> J[Frontend shows success message]
    J --> K[Redirect to login]
```

### User Login Flow

```mermaid
graph LR
    A[User enters credentials] --> B[Frontend validates]
    B --> C[API POST /api/auth/login]
    C --> D[AuthController receives request]
    D --> E[AuthService validates credentials]
    E --> F[Query role-specific table]
    F -->|Valid| G[Return user data]
    F -->|Invalid| H[Return error]
    G --> I[Store in localStorage]
    I --> J[Update AuthContext]
    J --> K[Redirect to dashboard]
```

### JCB Booking Flow

```mermaid
graph TD
    A[Customer clicks Book JCB] --> B[Form displayed]
    B --> C[Customer fills form]
    C --> D[Frontend validation]
    D -->|Valid| E[API POST /api/bookings]
    D -->|Invalid| F[Show error]
    E --> G[BookingController receives]
    G --> H[BookingService processes]
    H --> I[Find available JCB]
    I -->|Found| J[Find available driver]
    I -->|Not found| K[Return error]
    J -->|Found| L[Create booking]
    J -->|Not found| M[Return error]
    L --> N[Mark JCB unavailable]
    N --> O[Mark driver unavailable]
    O --> P[Save to database]
    P --> Q[Return success]
    Q --> R[Frontend updates UI]
    R --> S[Show success message]
```

## Data Flow Architecture

```mermaid
graph TB
    subgraph "Presentation Layer"
        UI[React Components]
    end
    
    subgraph "State Management"
        Context[AuthContext]
        LocalS[LocalStorage]
    end
    
    subgraph "API Layer"
        Axios[Axios HTTP Client]
        APIService[API Service]
    end
    
    subgraph "Backend Layer"
        Controllers[REST Controllers]
        Services[Business Logic]
        Repos[Data Repositories]
    end
    
    subgraph "Data Layer"
        MySQL[(MySQL DB)]
    end
    
    UI <--> Context
    Context <--> LocalS
    UI --> APIService
    APIService --> Axios
    Axios <-->|HTTP/JSON| Controllers
    Controllers --> Services
    Services --> Repos
    Repos <-->|JPA/Hibernate| MySQL
```

## Security Architecture

```mermaid
graph TB
    subgraph "Frontend Security"
        A[Route Protection]
        B[Role Validation]
        C[Session Management]
    end
    
    subgraph "Backend Security"
        D[CORS Configuration]
        E[Input Validation]
        F[Authentication Check]
    end
    
    subgraph "Data Security"
        G[Database Constraints]
        H[Email Uniqueness]
        I[NIC Uniqueness]
    end
    
    User[User Request] --> A
    A --> B
    B --> C
    C --> Request[HTTP Request]
    Request --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
```

## Technology Stack Layers

```mermaid
graph TB
    subgraph "Frontend Stack"
        React[React 18.3.1]
        Vite[Vite 5.4.8]
        Tailwind[Tailwind CSS 3.4.13]
        Router[React Router 6.26.2]
        Axios[Axios 1.7.7]
    end
    
    subgraph "Backend Stack"
        Spring[Spring Boot 3.3.4]
        Java[Java 21]
        JPA[JPA/Hibernate]
        Validation[Bean Validation]
    end
    
    subgraph "Database Stack"
        MySQL[MySQL 8.0.33]
    end
    
    React --> Vite
    React --> Tailwind
    React --> Router
    React --> Axios
    
    Spring --> Java
    Spring --> JPA
    Spring --> Validation
    
    JPA --> MySQL
```

## Database Schema

```mermaid
erDiagram
    CUSTOMER ||--o{ BOOKING : makes
    JCB ||--o{ BOOKING : assigned_to
    DRIVER ||--o{ BOOKING : drives
    OWNER ||--|| JCB : owns
    OWNER ||--o{ BOOKING : receives
    
    CUSTOMER {
        string nic PK
        string firstName
        string lastName
        string email UK
        string password
    }
    
    ADMIN {
        string nic PK
        string firstName
        string lastName
        string email UK
        string password
    }
    
    DRIVER {
        string nic PK
        string firstName
        string lastName
        string email UK
        string password
        boolean isAvailable
    }
    
    MECHANIC {
        string nic PK
        string firstName
        string lastName
        string email UK
        string password
    }
    
    OWNER {
        string nic PK
        string firstName
        string lastName
        string email UK
        string password
    }
    
    JCB {
        string registeredNumber PK
        string engineNumber UK
        string jcbType
        double rentalPrice
        boolean isAvailable
        string ownerNic FK
    }
    
    BOOKING {
        long id PK
        string customerId FK
        string customerEmail
        string jcbId FK
        string ownerId FK
        string ownerEmail
        string driverId FK
        string driverEmail
        date rentalDate
        date returnDate
        date createdAt
    }
```

## API Endpoint Structure

### Authentication Endpoints
```
POST /api/auth/register
    Request: { nic, email, username, firstName, lastName, password, role }
    Response: { success, message, user }

POST /api/auth/login
    Request: { email, password, role }
    Response: { success, message, user }
```

### Booking Endpoints
```
POST /api/bookings
    Request: { customerNic, jcbType, rentalDate, returnDate, acceptPrice, acceptTerms }
    Response: Success/Error message

GET /api/bookings/customer/{customerNic}
    Response: [ { id, jcbId, rentalDate, returnDate, ... } ]

DELETE /api/bookings/{id}
    Response: Success/Error message
```

### Customer Endpoints
```
GET /dashboard/customer/jcbs/available
    Response: [ { registeredNumber, jcbType, rentalPrice, ... } ]

POST /dashboard/customer/book
    Request: { customerNic, jcbType, rentalDate, returnDate, acceptPrice, acceptTerms }
    Response: Success/Error message
```

## Deployment Architecture

```mermaid
graph TB
    subgraph "Client Side"
        Browser[Web Browser]
    end
    
    subgraph "Frontend Server"
        Vite[Vite Dev Server<br/>Port 3000]
    end
    
    subgraph "Backend Server"
        Tomcat[Embedded Tomcat<br/>Port 8080]
        Spring[Spring Boot App]
    end
    
    subgraph "Database Server"
        MySQL[MySQL Server<br/>Port 3306]
    end
    
    Browser -->|HTTP| Vite
    Vite -->|Proxy /api| Tomcat
    Tomcat --> Spring
    Spring -->|JDBC| MySQL
```

## Design Patterns Used

### 1. Strategy Pattern (Payment Processing)
```mermaid
graph TB
    BookingService --> PaymentStrategy
    PaymentStrategy <|.. CashPayment
    PaymentStrategy <|.. CreditCardPayment
    PaymentStrategy <|.. PayPalPayment
```

### 2. Repository Pattern (Data Access)
```mermaid
graph TB
    Service --> Repository
    Repository <|.. CustomerRepository
    Repository <|.. BookingRepository
    Repository <|.. JCBRepository
    Repository --> JPA
    JPA --> Database
```

### 3. Context Pattern (State Management)
```mermaid
graph TB
    App --> AuthProvider
    AuthProvider --> AuthContext
    AuthContext --> Components
    Components --> useAuth
    useAuth --> AuthContext
```

## Security Considerations

### Current Implementation
- ✅ CORS configured for frontend-backend communication
- ✅ Input validation on both frontend and backend
- ✅ Protected routes based on user roles
- ✅ Session management with localStorage
- ✅ Email and NIC uniqueness constraints

### Recommended for Production
- 🔄 Password hashing (BCrypt)
- 🔄 JWT token-based authentication
- 🔄 HTTPS/SSL encryption
- 🔄 Rate limiting
- 🔄 SQL injection prevention (already using JPA)
- 🔄 XSS protection
- 🔄 CSRF protection

## Performance Considerations

### Frontend
- React component optimization
- Code splitting with React Router
- Lazy loading for routes
- Tailwind CSS purging in production
- Vite build optimization

### Backend
- JPA lazy loading for relationships
- Database connection pooling
- Transaction management
- Query optimization

### Database
- Indexed primary keys (NIC, registeredNumber)
- Unique constraints on email
- Foreign key relationships
- Proper data types

---

This architecture provides a solid foundation for the JCB Management System with clear separation of concerns, scalability, and maintainability.
