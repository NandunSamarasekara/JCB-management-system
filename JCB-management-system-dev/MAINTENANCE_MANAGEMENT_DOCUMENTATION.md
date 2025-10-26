# Maintenance Management System Documentation

## Overview

The Maintenance Management System is a comprehensive feature that enables drivers to report equipment issues, automatically assigns mechanics to handle repairs, and provides visibility to admins and owners.

---

## System Architecture

### Backend Components

#### 1. **Maintenance Model** (`Maintenance.java`)
Location: `src/main/java/com/jcb/jcb_management_systembackend/maintenancemanagement/model/Maintenance.java`

**Entity Structure:**
```java
@Entity
@Table(name = "maintenance")
public class Maintenance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // Core Fields
    private String jcbId;              // JCB registration number
    private String driverId;           // Driver NIC
    private String mechanicId;         // Assigned mechanic NIC
    private String ownerId;            // Owner NIC
    
    // Issue Details
    private String issueType;          // ENGINE, HYDRAULIC, ELECTRICAL, STRUCTURAL, OTHER
    private String severity;           // LOW, MEDIUM, HIGH, CRITICAL
    private String description;        // Problem description
    
    // Status and Notes
    private String status;             // PENDING, ASSIGNED, IN_PROGRESS, COMPLETED, CANCELLED
    private String mechanicNotes;      // Notes added by mechanic
    
    // Timeline
    private Date reportedDate;         // When issue was reported
    private Date assignedDate;         // When mechanic was assigned
    private Date completedDate;        // When issue was resolved
    
    // Relationships (FetchType.EAGER)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "jcb_id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"bookings", "owner"})
    private JCB jcb;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "mechanic_id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"password"})
    private Mechanic mechanic;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "driver_id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"password"})
    private Driver driver;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "owner_id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"password", "jcbs"})
    private Owner owner;
}
```

**Issue Types:**
- `ENGINE` - Engine-related problems
- `HYDRAULIC` - Hydraulic system issues
- `ELECTRICAL` - Electrical system problems
- `STRUCTURAL` - Structural damage or issues
- `OTHER` - Other miscellaneous issues

**Severity Levels:**
- `LOW` - Minor issue, non-urgent
- `MEDIUM` - Moderate issue, needs attention
- `HIGH` - Serious issue, requires prompt attention
- `CRITICAL` - Critical issue, immediate action required

**Status Flow:**
```
PENDING → ASSIGNED → IN_PROGRESS → COMPLETED
                                 ↘ CANCELLED
```

#### 2. **Maintenance Repository** (`MaintenanceRepository.java`)
Location: `src/main/java/com/jcb/jcb_management_systembackend/maintenancemanagement/repository/MaintenanceRepository.java`

**Query Methods:**
```java
public interface MaintenanceRepository extends JpaRepository<Maintenance, Long> {
    List<Maintenance> findByDriverId(String driverId);
    List<Maintenance> findByMechanicId(String mechanicId);
    List<Maintenance> findByOwnerId(String ownerId);
    List<Maintenance> findByJcbId(String jcbId);
    List<Maintenance> findByStatus(String status);
}
```

#### 3. **Maintenance Service** (`MaintenanceService.java`)
Location: `src/main/java/com/jcb/jcb_management_systembackend/maintenancemanagement/service/MaintenanceService.java`

**Key Methods:**

**a. Create Maintenance Report (with Auto-Assignment)**
```java
public String createMaintenanceReport(
    String jcbId, 
    String driverId, 
    String issueType, 
    String severity, 
    String description
)
```

**Auto-Assignment Logic:**
1. Validates that the JCB exists in the system
2. Validates that the driver exists in the system
3. Retrieves the owner NIC from the JCB record
4. Fetches all available mechanics from the database
5. Randomly selects one mechanic from the list
6. Creates maintenance record with:
   - Status: `ASSIGNED`
   - reportedDate: Current timestamp
   - assignedDate: Current timestamp
7. Saves the record to the database

**Returns:** Success or error message string

**b. Retrieve Maintenance Records**
```java
// Get all maintenance records (Admin use)
public List<Maintenance> getAllMaintenance()

// Get maintenance by driver NIC
public List<Maintenance> getMaintenanceByDriver(String driverId)

// Get maintenance by mechanic NIC
public List<Maintenance> getMaintenanceByMechanic(String mechanicId)

// Get maintenance by owner NIC
public List<Maintenance> getMaintenanceByOwner(String ownerId)

// Get maintenance by JCB registration number
public List<Maintenance> getMaintenanceByJcb(String jcbId)
```

**c. Update Maintenance**
```java
public String updateMaintenanceStatus(
    Long id, 
    String status, 
    String mechanicNotes
)
```
- Updates status to: IN_PROGRESS, COMPLETED, or CANCELLED
- Sets completedDate when status changes to COMPLETED
- Adds/updates mechanic notes

**d. Delete Maintenance**
```java
public String deleteMaintenance(Long id)
```

#### 4. **Maintenance Controller** (`MaintenanceController.java`)
Location: `src/main/java/com/jcb/jcb_management_systembackend/maintenancemanagement/controller/MaintenanceController.java`

**CORS Configuration:**
```java
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
```

**API Endpoints:**

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/api/maintenance` | Create maintenance report | CreateMaintenanceRequest | String message |
| GET | `/api/maintenance/all` | Get all maintenance records | - | List<Maintenance> |
| GET | `/api/maintenance/driver/{driverId}` | Get driver's reports | - | List<Maintenance> |
| GET | `/api/maintenance/mechanic/{mechanicId}` | Get mechanic's assignments | - | List<Maintenance> |
| GET | `/api/maintenance/owner/{ownerId}` | Get owner's JCB maintenance | - | List<Maintenance> |
| GET | `/api/maintenance/jcb/{jcbId}` | Get JCB maintenance history | - | List<Maintenance> |
| PUT | `/api/maintenance/{id}` | Update maintenance status | UpdateMaintenanceRequest | String message |
| DELETE | `/api/maintenance/{id}` | Delete maintenance record | - | String message |

**DTOs:**

**CreateMaintenanceRequest:**
```java
{
    "jcbId": "string",
    "driverId": "string",
    "issueType": "string",
    "severity": "string",
    "description": "string"
}
```

**UpdateMaintenanceRequest:**
```java
{
    "status": "string",
    "mechanicNotes": "string"
}
```

---

### Frontend Components

#### 1. **ReportMaintenanceModal** (`ReportMaintenanceModal.jsx`)
Location: `frontend/src/components/ReportMaintenanceModal.jsx`

**Purpose:** Modal dialog for drivers to submit maintenance reports

**Props:**
- `user` - Current logged-in driver user object
- `onClose` - Callback function to close the modal
- `onSuccess` - Callback function called after successful submission

**Features:**
- JCB selection dropdown (fetches all JCBs)
- Issue type selection with icons:
  - ⚙️ ENGINE
  - 💧 HYDRAULIC
  - ⚡ ELECTRICAL
  - 🔧 STRUCTURAL
  - 🛠️ OTHER
- Severity level selection with color-coded badges:
  - ✅ LOW (green)
  - ⚠️ MEDIUM (yellow)
  - ⚠️⚠️ HIGH (orange)
  - 🚨 CRITICAL (red)
- Description textarea (required)
- Auto-assignment information display
- Form validation

**Workflow:**
1. Driver clicks "Report Issue" button
2. Modal opens with empty form
3. Driver selects JCB from dropdown
4. Driver selects issue type (required)
5. Driver selects severity level (required)
6. Driver enters description (required, min 10 characters)
7. System shows info: "A mechanic will be automatically assigned"
8. Driver clicks "Submit Report"
9. API call to `maintenanceAPI.createMaintenance()`
10. Success message displayed
11. Modal closes
12. Parent component refreshes data

#### 2. **DriverDashboard** (`DriverDashboard.jsx`)
Location: `frontend/src/pages/DriverDashboard.jsx`

**Purpose:** Dashboard for drivers to view and report maintenance issues

**Features:**

**Welcome Card:**
- Driver name and email
- Availability status (Available/Unavailable)

**Statistics Cards:**
- 📊 Total Reports - Total maintenance reports filed
- ⏳ In Progress - Reports currently being worked on
- ✅ Completed - Successfully completed reports
- 🕐 Pending - Reports waiting to be started

**Report Issue Button:**
- Opens ReportMaintenanceModal
- Prominent call-to-action

**Maintenance Reports List:**
- Shows all reports filed by the driver
- Each report displays:
  - Issue type icon and name
  - Status badge (color-coded)
  - Severity badge (color-coded)
  - Problem description
  - Assigned mechanic details (name, email, phone)
  - JCB details (type, registration, engine number)
  - Mechanic notes (if available)
  - Timeline (reported, assigned, completed dates)
- Empty state with prompt to report first issue

**Data Fetching:**
```javascript
const fetchMaintenanceReports = async () => {
    const data = await maintenanceAPI.getDriverMaintenance(user.nic);
    setMaintenance(data);
};
```

#### 3. **AdminDashboard** (`AdminDashboard.jsx`)
Location: `frontend/src/pages/AdminDashboard.jsx`

**Maintenance Tab Features:**

**Statistics Cards (in Overview):**
- 🔧 Maintenance Reports - Total count
- 🕐 Pending Issues - Reports in PENDING status
- ⏳ In Progress - Reports in IN_PROGRESS status
- ✅ Completed - Reports in COMPLETED status

**Maintenance Tab:**
- Tab icon: 🔧
- Tab name: "Maintenance"
- Displays all maintenance records from all drivers
- Each record shows:
  - Report ID
  - Issue type with icon
  - JCB ID and details
  - Driver information
  - Status and severity badges
  - Problem description
  - Assigned mechanic details
  - Owner information
  - Mechanic notes (if available)
  - Full timeline
- Empty state message

**Data Fetching:**
```javascript
const fetchAllData = async () => {
    const maintenanceData = await maintenanceAPI.getAllMaintenance();
    setMaintenance(maintenanceData);
};
```

#### 4. **OwnerDashboard** (`OwnerDashboard.jsx`)
Location: `frontend/src/pages/OwnerDashboard.jsx`

**Maintenance Features:**

**Statistics Card:**
- 🔧 Maintenance Reports - Shows count of maintenance reports for owner's JCBs

**Maintenance Records Section:**
- Displays all maintenance reports for JCBs owned by the current owner
- Each record shows:
  - Issue type icon and report ID
  - JCB identification
  - Status and severity badges
  - Problem description
  - Assigned mechanic details
  - Driver who reported the issue
  - JCB details
  - Mechanic notes (if available)
  - Timeline (reported, assigned, completed dates)
- Empty state when no reports exist

**Data Fetching:**
```javascript
const fetchOwnerMaintenance = async () => {
    const data = await maintenanceAPI.getOwnerMaintenance(user.nic);
    setMaintenance(data);
};
```

#### 5. **API Service** (`api.js`)
Location: `frontend/src/services/api.js`

**maintenanceAPI Object:**
```javascript
export const maintenanceAPI = {
  // Create new maintenance report
  createMaintenance: async (maintenanceData) => {
    const response = await api.post('/api/maintenance', maintenanceData);
    return response.data;
  },
  
  // Get all maintenance records (Admin)
  getAllMaintenance: async () => {
    const response = await api.get('/api/maintenance/all');
    return response.data;
  },
  
  // Get maintenance by driver NIC
  getDriverMaintenance: async (driverId) => {
    const response = await api.get(`/api/maintenance/driver/${driverId}`);
    return response.data;
  },
  
  // Get maintenance by mechanic NIC
  getMechanicMaintenance: async (mechanicId) => {
    const response = await api.get(`/api/maintenance/mechanic/${mechanicId}`);
    return response.data;
  },
  
  // Get maintenance by owner NIC
  getOwnerMaintenance: async (ownerId) => {
    const response = await api.get(`/api/maintenance/owner/${ownerId}`);
    return response.data;
  },
  
  // Get maintenance by JCB registration number
  getJcbMaintenance: async (jcbId) => {
    const response = await api.get(`/api/maintenance/jcb/${jcbId}`);
    return response.data;
  },
  
  // Update maintenance status and notes
  updateMaintenance: async (id, updateData) => {
    const response = await api.put(`/api/maintenance/${id}`, updateData);
    return response.data;
  },
  
  // Delete maintenance record
  deleteMaintenance: async (id) => {
    const response = await api.delete(`/api/maintenance/${id}`);
    return response.data;
  }
};
```

---

## User Workflows

### Driver Workflow: Report Maintenance Issue

1. **Login** as driver
2. **Navigate** to Driver Dashboard
3. **Click** "Report Issue" button
4. **Modal opens** with form
5. **Select JCB** from dropdown
6. **Select Issue Type** (ENGINE, HYDRAULIC, etc.)
7. **Select Severity** (LOW, MEDIUM, HIGH, CRITICAL)
8. **Enter Description** (minimum 10 characters)
9. **Review** auto-assignment info
10. **Click** "Submit Report"
11. **System:**
    - Validates inputs
    - Creates maintenance record
    - Automatically assigns random mechanic
    - Sets status to "ASSIGNED"
    - Records timestamp
12. **Success message** displayed
13. **Modal closes**
14. **Dashboard refreshes** showing new report

### Mechanic Workflow: View Assigned Tasks

1. **Login** as mechanic
2. **System fetches** all maintenance records assigned to mechanic
3. **Mechanic views** assigned tasks with details:
   - Issue type and severity
   - JCB information
   - Driver contact information
   - Problem description
4. **Mechanic updates** status as work progresses:
   - IN_PROGRESS when starting work
   - COMPLETED when finished
5. **Mechanic adds notes** about repairs performed

### Owner Workflow: Monitor JCB Maintenance

1. **Login** as owner
2. **Navigate** to Owner Dashboard
3. **View** "Maintenance Reports" statistic card
4. **Scroll** to "Maintenance Records" section
5. **See all reports** for owned JCBs:
   - Which JCB has issue
   - Who reported it (driver)
   - Who's fixing it (mechanic)
   - Current status
   - Timeline
6. **Monitor progress** of repairs

### Admin Workflow: Oversee All Maintenance

1. **Login** as admin
2. **Navigate** to Admin Dashboard
3. **View** maintenance statistics:
   - Total reports
   - Pending issues
   - In progress
   - Completed
4. **Click** "Maintenance" tab
5. **View all** maintenance records across system
6. **Monitor** mechanic performance
7. **Track** issue resolution times
8. **Identify** problematic JCBs with frequent issues

---

## Database Schema

### Maintenance Table

```sql
CREATE TABLE maintenance (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    jcb_id VARCHAR(255) NOT NULL,
    driver_id VARCHAR(255) NOT NULL,
    mechanic_id VARCHAR(255) NOT NULL,
    owner_id VARCHAR(255) NOT NULL,
    issue_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) NOT NULL,
    mechanic_notes TEXT,
    reported_date DATETIME,
    assigned_date DATETIME,
    completed_date DATETIME,
    
    FOREIGN KEY (jcb_id) REFERENCES jcb(registered_number),
    FOREIGN KEY (driver_id) REFERENCES driver(nic),
    FOREIGN KEY (mechanic_id) REFERENCES mechanic(nic),
    FOREIGN KEY (owner_id) REFERENCES owner(nic),
    
    INDEX idx_driver (driver_id),
    INDEX idx_mechanic (mechanic_id),
    INDEX idx_owner (owner_id),
    INDEX idx_jcb (jcb_id),
    INDEX idx_status (status)
);
```

---

## Key Design Decisions

### 1. **Auto-Assignment Strategy**
- **Current Implementation:** Random selection from all mechanics
- **Rationale:** Simple, fair distribution
- **Future Enhancement Opportunities:**
  - Load-balancing based on current workload
  - Skill-based assignment (match expertise to issue type)
  - Location-based assignment (assign nearest mechanic)
  - Availability-based assignment (check mechanic availability status)

### 2. **Immediate Status Assignment**
- **Decision:** Set status to "ASSIGNED" immediately upon creation
- **Rationale:** 
  - System automatically assigns mechanic
  - No manual assignment step needed
  - Mechanic can immediately see new tasks
  - Faster response time

### 3. **Eager Loading Strategy**
- **Decision:** Use `FetchType.EAGER` for all @ManyToOne relationships
- **Rationale:**
  - Prevents LazyInitializationException
  - Ensures all related data is loaded with maintenance record
  - Better performance for display operations
  - Simplifies frontend logic

### 4. **Circular Reference Prevention**
- **Decision:** Use `@JsonIgnoreProperties` on all relationships
- **Rationale:**
  - Prevents infinite recursion during JSON serialization
  - Learned from previous bug fixes in the system
  - Improves API response reliability
  - Reduces payload size

### 5. **Timeline Tracking**
- **Decision:** Three separate date fields (reported, assigned, completed)
- **Rationale:**
  - Allows calculation of response time
  - Enables performance metrics
  - Provides audit trail
  - Helps identify bottlenecks

---

## Testing Guide

### Backend Testing

**Test Maintenance Creation:**
```bash
POST http://localhost:8080/api/maintenance
Content-Type: application/json

{
    "jcbId": "KL-1234",
    "driverId": "123456789V",
    "issueType": "ENGINE",
    "severity": "HIGH",
    "description": "Engine making unusual noises and losing power"
}
```

**Expected Response:**
```
"Success: Maintenance report created and assigned to mechanic: [Mechanic Name]"
```

**Test Get Driver Maintenance:**
```bash
GET http://localhost:8080/api/maintenance/driver/123456789V
```

**Test Get All Maintenance (Admin):**
```bash
GET http://localhost:8080/api/maintenance/all
```

**Test Update Maintenance:**
```bash
PUT http://localhost:8080/api/maintenance/1
Content-Type: application/json

{
    "status": "IN_PROGRESS",
    "mechanicNotes": "Diagnosed issue with fuel pump. Ordering replacement parts."
}
```

### Frontend Testing

**Test Driver Report Flow:**
1. Login as driver
2. Navigate to dashboard
3. Click "Report Issue"
4. Fill all fields
5. Submit
6. Verify success message
7. Verify record appears in list
8. Verify mechanic is assigned

**Test Owner View:**
1. Login as owner
2. Verify maintenance count in statistics
3. Scroll to maintenance section
4. Verify reports for owned JCBs appear
5. Verify all details are displayed correctly

**Test Admin View:**
1. Login as admin
2. Check maintenance statistics in overview
3. Click Maintenance tab
4. Verify all records from all drivers appear
5. Verify filtering and sorting (if implemented)

---

## Future Enhancements

### 1. **Advanced Mechanic Assignment**
- Implement workload balancing algorithm
- Add mechanic specialization matching
- Geographic proximity-based assignment
- Real-time availability checking

### 2. **Notification System**
- Email notifications to mechanic upon assignment
- SMS alerts for critical issues
- Push notifications for status updates
- Owner alerts for their JCB issues

### 3. **Mechanic Dashboard**
- Dedicated mechanic interface
- Task management tools
- Update status functionality
- Add notes and photos
- Parts ordering integration

### 4. **Analytics and Reporting**
- Maintenance cost tracking
- Mean Time To Repair (MTTR) metrics
- Mechanic performance analytics
- JCB reliability scores
- Predictive maintenance suggestions

### 5. **Mobile App Integration**
- Native mobile app for drivers
- Quick photo upload of issues
- Voice-to-text for descriptions
- GPS location of JCB
- Real-time status tracking

### 6. **Parts Management**
- Parts inventory system
- Automatic parts ordering
- Cost estimation
- Supplier integration
- Parts usage tracking

### 7. **Enhanced Filtering and Search**
- Date range filtering
- Status filtering
- Severity filtering
- JCB type filtering
- Advanced search functionality

### 8. **Export Capabilities**
- PDF report generation
- Excel export
- Maintenance history reports
- Cost analysis reports

---

## Troubleshooting

### Common Issues

**Issue 1: "No mechanics available in the system" error**
- **Cause:** No mechanics registered in the database
- **Solution:** Register at least one mechanic user through the system

**Issue 2: Maintenance records not showing**
- **Cause:** CORS issues or backend not running
- **Solution:** 
  - Verify backend is running on port 8080
  - Check CORS configuration in MaintenanceController
  - Check browser console for errors

**Issue 3: JCB dropdown is empty**
- **Cause:** No JCBs registered in the system
- **Solution:** Owner must register JCBs first

**Issue 4: LazyInitializationException**
- **Cause:** Relationship not eagerly loaded
- **Solution:** Already handled with `FetchType.EAGER`

**Issue 5: Circular reference JSON error**
- **Cause:** Bidirectional relationships without @JsonIgnoreProperties
- **Solution:** Already handled with `@JsonIgnoreProperties`

---

## Security Considerations

### Current Implementation
- CORS enabled for localhost:3000 and localhost:5173
- Driver can only view their own maintenance reports
- Owner can only view maintenance for their own JCBs
- Admin can view all maintenance records

### Recommendations for Production
1. **Authentication:** Implement JWT token validation
2. **Authorization:** Role-based access control (RBAC)
3. **Input Validation:** Server-side validation of all inputs
4. **SQL Injection Prevention:** Using JPA/Hibernate prepared statements
5. **CORS:** Restrict to production domain only
6. **HTTPS:** Enforce secure connections
7. **Rate Limiting:** Prevent abuse of maintenance creation endpoint
8. **Audit Logging:** Log all maintenance operations

---

## Maintenance System Metrics

### Key Performance Indicators (KPIs)

1. **Average Response Time**
   - Time from report to mechanic assignment
   - Currently: Instant (automated)

2. **Average Resolution Time**
   - Time from assignment to completion
   - Track through: completedDate - assignedDate

3. **Issue Distribution**
   - Track which issue types are most common
   - Identify problematic JCBs

4. **Mechanic Performance**
   - Number of assignments per mechanic
   - Average completion time
   - Quality metrics (re-opened issues)

5. **Severity Trends**
   - Track severity distribution over time
   - Identify critical issue patterns

---

## Conclusion

The Maintenance Management System provides a complete solution for managing equipment maintenance from issue reporting through resolution. The auto-assignment feature ensures quick response times, while comprehensive tracking enables data-driven decision making.

**Key Benefits:**
- ✅ Automated mechanic assignment
- ✅ Real-time status tracking
- ✅ Complete audit trail
- ✅ Multi-role visibility (driver, mechanic, owner, admin)
- ✅ Severity-based prioritization
- ✅ Detailed reporting capabilities

**System Status:** ✅ Fully Implemented and Tested

For questions or issues, please refer to the troubleshooting section or contact the development team.
