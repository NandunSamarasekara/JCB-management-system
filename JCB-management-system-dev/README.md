# JCB Management System

A comprehensive web application for managing JCB equipment rentals with role-based access control.

## Technology Stack

### Backend
- **Framework**: Spring Boot 3.3.4
- **Language**: Java 21
- **Database**: MySQL 8.0.33
- **Build Tool**: Maven
- **Security**: Spring Security

### Frontend
- **Framework**: React 18.3.1
- **Build Tool**: Vite 5.4.8
- **Styling**: Tailwind CSS 3.4.13
- **Routing**: React Router DOM 6.26.2
- **HTTP Client**: Axios 1.7.7

## Features

### User Roles
- **Customer**: Book JCB equipment, view bookings
- **Driver**: Assigned to bookings (future features)
- **Mechanic**: Maintenance management (future features)
- **Owner**: Equipment management (future features)
- **Admin**: System administration (future features)

### Current Functionality
- ✅ User Registration with role selection
- ✅ User Login with role-based authentication
- ✅ Homepage with system information
- ✅ Customer Dashboard
- ✅ JCB Booking System
  - Select JCB type
  - Choose rental and return dates
  - Automatic JCB and driver assignment
  - Accept pricing and terms
- ✅ View available JCBs
- ✅ View customer bookings
- ✅ Cancel bookings

## Prerequisites

- Java 21 or higher
- Node.js 16 or higher
- MySQL 8.0.33
- Maven 3.6+
- npm or yarn

## Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE jcb_management;
```

2. Update `src/main/resources/application.properties` with your database credentials:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/jcb_management
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

## Installation & Running

### Backend Setup

1. Navigate to the project root directory:
```bash
cd JCB_management_system
```

2. Build the backend:
```bash
./mvnw clean install
```
Or on Windows:
```bash
mvnw.cmd clean install
```

3. Run the Spring Boot application:
```bash
./mvnw spring-boot:run
```
Or on Windows:
```bash
mvnw.cmd spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

## Usage Guide

### For Unregistered Users

1. **Visit Homepage**: Navigate to `http://localhost:3000`
   - View system information and features
   - See "Register" and "Sign In" buttons in the top-left corner

2. **Register an Account**:
   - Click "Register" button
   - Fill in the registration form:
     - NIC Number (unique identifier)
     - Email address
     - Username
     - First Name & Last Name
     - Password & Confirm Password
     - Select User Role (Customer, Driver, Mechanic, Owner, or Admin)
   - Submit the form
   - Upon success, you'll see a success message and be redirected to the login page

3. **Login**:
   - Enter your email
   - Enter your password
   - Select your user role
   - Click "Sign In"
   - You'll be redirected to your role-specific dashboard

### For Customer Users

1. **Access Customer Dashboard**:
   - After logging in as a Customer, you'll see:
     - Welcome message with your details
     - "Book a JCB" button
     - List of your existing bookings
     - Available JCBs

2. **Book a JCB**:
   - Click "Book a JCB" button
   - Fill in the booking form:
     - Customer NIC (auto-filled)
     - Select Required JCB Type from dropdown
     - Choose Rental Date
     - Choose Return Date
     - Check "Accept rental price" checkbox
     - Check "Accept terms and conditions" checkbox
   - Click "Submit Booking"
   - System will:
     - Validate your inputs
     - Find available JCB of the requested type
     - Assign an available driver
     - Create the booking
     - Display success message with booking details

3. **View Bookings**:
   - See all your bookings in the "My Bookings" table
   - Each booking shows:
     - Booking ID
     - JCB ID
     - Rental Date
     - Return Date
     - Assigned Driver email

4. **Cancel Bookings**:
   - Click "Cancel" button on any booking
   - Confirm the cancellation
   - The JCB and driver will become available again

5. **View Available JCBs**:
   - Browse available JCBs in the "Available JCBs" section
   - See JCB type, registration number, engine number, and daily rental price

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Bookings
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings/customer/{customerNic}` - Get customer bookings
- `DELETE /api/bookings/{id}` - Cancel a booking

### Customer Dashboard
- `GET /dashboard/customer/jcbs/available` - Get available JCBs
- `POST /dashboard/customer/book` - Book a JCB

## Project Structure

```
JCB_management_system/
├── src/
│   ├── main/
│   │   ├── java/com/jcb/jcb_management_systembackend/
│   │   │   ├── authentication/
│   │   │   │   ├── controller/
│   │   │   │   ├── service/
│   │   │   │   └── dto/
│   │   │   ├── bookingmanagement/
│   │   │   │   ├── controller/
│   │   │   │   ├── model/
│   │   │   │   ├── repository/
│   │   │   │   ├── service/
│   │   │   │   └── strategy/
│   │   │   ├── jcbmanagement/
│   │   │   │   ├── controller/
│   │   │   │   ├── model/
│   │   │   │   └── repository/
│   │   │   ├── usermanagement/
│   │   │   │   ├── controller/
│   │   │   │   ├── model/
│   │   │   │   └── repository/
│   │   │   ├── config/
│   │   │   └── JcbManagementSystemBackendApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Homepage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── CustomerDashboard.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── pom.xml
└── README.md
```

## Design Patterns Used

### Strategy Pattern
- **Location**: `bookingmanagement.strategy`
- **Purpose**: Payment processing
- **Classes**: 
  - `PaymentStrategy` (interface)
  - `CashPayment`
  - `CreditCardPayment`
  - `PayPalPayment`

## Future Enhancements

- Password hashing and encryption
- JWT-based authentication
- Driver dashboard with assigned bookings
- Mechanic dashboard for maintenance tracking
- Owner dashboard for equipment management
- Admin dashboard for system administration
- Payment processing integration
- Email notifications
- Review and rating system
- Advanced search and filtering
- Reporting and analytics

## Notes

- **Security**: Currently, passwords are stored in plain text. In production, implement proper password hashing (e.g., BCrypt)
- **CORS**: The backend is configured to accept requests from the frontend
- **Database**: Tables are auto-created by Hibernate based on entity classes

## Troubleshooting

### Backend Issues
- Ensure MySQL is running
- Check database credentials in `application.properties`
- Verify Java 21 is installed: `java -version`
- Check if port 8080 is available

### Frontend Issues
- Ensure Node.js is installed: `node -version`
- Clear npm cache if needed: `npm cache clean --force`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check if port 3000 is available

### Database Issues
- Verify MySQL connection
- Check if database exists
- Ensure proper user permissions

## License

This project is for educational purposes.

## Contributors

JCB Management System Development Team
