# lscs-tomo-api

This repository handles the backend for validating LSCS Members via barcode scanning. 

**For Tomo Coffee use**: checks if user is a LSCS Member, thus eligible for a discount within valid time bounds.

## Requirements
1. Requests are assumed as ID numbers (integer).

## Features
- **MySQL Database**
  - Stores the ID number, current date, and current time of each scan.
- **Validation**
  - Checks if the request is from a valid LSCS member using the LSCS Central Auth API.
  - Returns an error/fail response if the ID is invalid.
- **Time Restriction**
  - Ensures a minimum of 6 hours has elapsed since the last scan for the same ID number.
  - Returns an error/fail response if less than 6 hours have passed.

## Endpoints

### **POST `/validate`**
* requires `studentId` in req.body
* `request`:
```bash
curl -X POST http://tomo-scanner.app.dlsu-lscs.org/validate \
-H "Content-Type: application/json" \
-d '{"studentId": 12343765}'
```
* `response`:
```json
// successful scan
{
    "id": "12343765",
    "email": "rohann_dizon@dlsu.edu.ph",
    "full_name": "Rohann Gabriel Dizon",
    "committee_name": "Research and Development",
    "position_name": "Assistant Vice President",
    "division_name": "Internals"
}

// not a member
{ 
  "error": "Student ID number is not an LSCS member"
}

// availing discount within invalid time bound (6 hours from previous scan)
{
  "error": "The member has used up their discount within the last 6 hours."
}
```

### **GET `/status`**
* returns status and details of the id scanned
* requires `studentId` in req.body
* `request`:
```bash
curl -X GET http://tomo-scanner.app.dlsu-lscs.org/status \
-H "Content-Type: application/json" \
-d '{"studentId": 12343765}'
```

* `response`:
```json
// eligible for discount
{
    "member_details": {
        "id": "12343765",
        "email": "rohann_dizon@dlsu.edu.ph",
        "full_name": "Rohann Gabriel Dizon",
        "committee_name": "Research and Development",
        "position_name": "Assistant Vice President",
        "division_name": "Internals"
    },
    "previous_scan": "January 01, 2000 at 12:00:00 AM",
    "time_remaining": 0,
    "status": "The member eligible."
}

// ineligible for discount
{
    "member_details": {
        "id": "12343765",
        "email": "rohann_dizon@dlsu.edu.ph",
        "full_name": "Rohann Gabriel Dizon",
        "committee_name": "Research and Development",
        "position_name": "Assistant Vice President",
        "division_name": "Internals"
    },
    "previous_scan": "January 01, 2000 at 12:00:00 AM",
    "time_remaining": 6,
    "status": "The member is ineligible."
}

// no entry yet
{
    "member_details": {
        "id": "12343765",
        "email": "rohann_dizon@dlsu.edu.ph",
        "full_name": "Rohann Gabriel Dizon",
        "committee_name": "Research and Development",
        "position_name": "Assistant Vice President",
        "division_name": "Internals"
    },
    "previous_scan": "Never scanned.",
    "time_remaining": None,
    "status": "The member is eligible."
}
```
