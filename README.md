# MedRegisrty - A Patient Registration System

A comprehensive, frontend-only patient registration and management application built with React, TypeScript, and PGlite for secure local data storage.

## Features

- **Patient Registration**: Complete patient registration with comprehensive medical information
- **Data Persistence**: Reliable local storage using PGlite 
- **SQL Query Interface**: Raw SQL query capabilities for advanced data analysis
- **Multi-tab Synchronization**: Real-time data synchronization across browser tabs
- **Export Functionality**: CSV export of query results
- **Search & Filter**: Advanced patient search and filtering capabilities

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Database**: PGlite (PostgreSQL in the browser)
- **UI Components**: shadcn/ui
- **State Management**: React Context
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Deployment**: Vercel

## Prerequisites

- Node.js 18+ and npm

## Setup Instructions

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## Usage Guide

### Patient Registration

1. Navigate to the "Patients" page
2. Click "Add New Patient" button
3. Fill in the comprehensive patient form:
   - Personal Information (name, email, phone, DOB, gender, address)
   - Emergency Contact details
   - Medical History, Allergies, Current Medications
   - Insurance Information
4. Click "Register Patient" to save

### Managing Patients

- **View All Patients**: Browse the patient list with search functionality
- **Edit Patient**: Click the "Edit" button on any patient card
- **Delete Patient**: Click the "Delete" button (with confirmation)
- **Search**: Use the search bar to find patients by name, email, or phone

### SQL Query Interface

1. Navigate to the "Query" page
2. Choose from sample queries or write custom SQL
3. Click "Execute Query" to run your query
4. View results in a formatted table
5. Export results as CSV if needed

### Sample Queries Available

- All patients listing
- Patient demographics by gender
- Recent registrations (last 30 days)
- Patients with specific allergies
- Age distribution analysis
- Database schema information

## Database Schema

The application uses a PostgreSQL-compatible schema with the following main table:

```sql
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  date_of_birth DATE,
  gender VARCHAR(20),
  address TEXT,
  emergency_contact_name VARCHAR(100),
  emergency_contact_phone VARCHAR(20),
  medical_history TEXT,
  allergies TEXT,
  medications TEXT,
  insurance_provider VARCHAR(100),
  insurance_policy_number VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

##  Deployment

### Vercel Deployment
- The application is deployed using vercel on https://medregistry.vercel.app/

## Development Challenges & Solutions

### Challenge 1: PGlite Integration

**Problem**: Integrating PGlite with React and ensuring proper initialization
**Solution**: Created a dedicated DatabaseContext with proper async initialization and error handling

### Challenge 2: Multi-tab Synchronization

**Problem**: Keeping data synchronized across multiple browser tabs
**Solution**: Implemented localStorage event listeners combined with custom events for real-time updates

## Security & Privacy

- **Local Storage Only**: All data stays in the browser
- **No External Dependencies**: No data sent to external servers
- **HIPAA-Conscious Design**: Built with healthcare privacy principles in mind
- **Secure by Default**: No authentication needed as data is local only

## Copyright Disclaimer
Copyright © 2025 Hriday Sehgal. All rights reserved.

This project and its source code are the proprietary intellectual property of Hriday Sehgal. Unauthorized copying, modification, distribution, or reproduction in any form without explicit permission is strictly prohibited.

## Contact
For inquiries or collaborations, reach out via:
- **Email**: hriday.career@gmail.com
