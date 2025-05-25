# Patient Registry System

A comprehensive, frontend-only patient registration and management application built with React, TypeScript, and PGlite for secure local data storage.

## 🏥 Features

- **Patient Registration**: Complete patient registration with comprehensive medical information
- **Data Persistence**: Reliable local storage using PGlite with IndexedDB persistence
- **SQL Query Interface**: Raw SQL query capabilities for advanced data analysis
- **Multi-tab Synchronization**: Real-time data synchronization across browser tabs
- **Responsive Design**: Professional healthcare-focused interface optimized for all devices
- **Real-time Updates**: Automatic UI updates when data changes
- **Export Functionality**: CSV export of query results
- **Search & Filter**: Advanced patient search and filtering capabilities

## 🚀 Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Database**: PGlite (PostgreSQL in the browser)
- **UI Components**: shadcn/ui
- **State Management**: React Context + TanStack Query
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Deployment**: Vercel/Netlify ready

## 📋 Prerequisites

- Node.js 18+ and npm
- Modern web browser with IndexedDB support

## 🛠️ Setup Instructions

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd patient-registry-system
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
   Navigate to `http://localhost:8080`

## 📖 Usage Guide

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

1. Navigate to the "Query Database" page
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

## 🗃️ Database Schema

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

## 🔄 Multi-tab Synchronization

The application implements cross-tab synchronization using:

- localStorage events for change notifications
- Custom event dispatching for real-time updates
- Automatic data refresh when changes are detected

## 🚀 Deployment

### Vercel Deployment

1. Fork this repository
2. Connect your GitHub account to Vercel
3. Import the project
4. Deploy automatically

### Netlify Deployment

1. Fork this repository
2. Connect your GitHub account to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Deploy

## 🧪 Development Challenges & Solutions

### Challenge 1: PGlite Integration

**Problem**: Integrating PGlite with React and ensuring proper initialization
**Solution**: Created a dedicated DatabaseContext with proper async initialization and error handling

### Challenge 2: Multi-tab Synchronization

**Problem**: Keeping data synchronized across multiple browser tabs
**Solution**: Implemented localStorage event listeners combined with custom events for real-time updates

### Challenge 3: Complex Form Validation

**Problem**: Comprehensive patient data validation while maintaining user experience
**Solution**: Implemented progressive validation with clear error messages and field-level feedback

### Challenge 4: Performance with Large Datasets

**Problem**: Maintaining performance when displaying many patient records
**Solution**: Implemented search/filter functionality and pagination concepts for better UX

### Challenge 5: SQL Query Security

**Problem**: Providing raw SQL access while preventing harmful operations
**Solution**: Used PGlite's built-in safety features and implemented error handling for invalid queries

## 🎨 Design Principles

- **Healthcare-focused**: Professional medical interface with appropriate color schemes
- **Accessibility**: WCAG compliant design with proper contrast and keyboard navigation
- **Responsive**: Mobile-first design that works on all devices
- **Performance**: Optimized for fast loading and smooth interactions
- **Security**: Client-side only architecture with no data transmission

## 🔒 Security & Privacy

- **Local Storage Only**: All data stays in the browser's IndexedDB
- **No External Dependencies**: No data sent to external servers
- **HIPAA-Conscious Design**: Built with healthcare privacy principles in mind
- **Secure by Default**: No authentication needed as data is local only

## 📊 Performance Features

- **Lazy Loading**: Components load only when needed
- **Optimized Queries**: Efficient SQL queries with proper indexing
- **Minimal Re-renders**: Optimized React component updates
- **Caching**: Query result caching for better performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **PGlite Team**: For the amazing PostgreSQL-in-browser technology
- **shadcn/ui**: For the beautiful UI component library
- **Tailwind CSS**: For the utility-first CSS framework
- **React Team**: For the excellent frontend framework

---

For questions or support, please open an issue on the GitHub repository.
