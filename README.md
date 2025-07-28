# 🎓 Academic Dashboard - Advanced Learning Management System

A comprehensive academic management platform featuring separate dashboards for **Students**, **Tutors**, and **Administrators** with all the features of a modern academic site.

## ✨ Key Features

### 🎯 **Student Dashboard**
- **Personal Dashboard** with academic overview and progress tracking
- **Course Management** - View enrolled courses, materials, and schedules
- **Assignment Submission** - Submit assignments with file uploads and text responses
- **Grade Tracking** - View grades, GPA calculation, and academic transcript
- **Interactive Calendar** - Track assignments, exams, and important dates
- **Real-time Messaging** - Communicate with tutors and classmates
- **Announcements** - Receive course and system-wide notifications
- **Discussion Forums** - Participate in course discussions
- **Profile Management** - Update personal information and preferences

### 👨‍🏫 **Tutor Dashboard**
- **Course Management** - Create and manage courses, modules, and content
- **Assignment Creation** - Design assignments with rubrics and auto-grading
- **Grade Management** - Grade submissions with detailed feedback
- **Student Analytics** - Track student progress and performance
- **Attendance Tracking** - Monitor student participation
- **Communication Tools** - Message students and make announcements
- **Resource Management** - Upload and organize course materials
- **Calendar Integration** - Schedule classes, office hours, and deadlines

### 🔧 **Admin Dashboard**
- **User Management** - Manage students, tutors, and admin accounts
- **Course Administration** - Oversee all courses and enrollments
- **System Analytics** - Comprehensive reporting and data visualization
- **Announcement System** - Send system-wide notifications
- **Settings Management** - Configure system settings and preferences
- **Report Generation** - Generate academic and administrative reports
- **Security Management** - Monitor system security and user activity

### 🚀 **Advanced Features**
- **Real-time Notifications** with Socket.io
- **File Upload & Management** with cloud storage support
- **Advanced Search & Filtering** across all content
- **Responsive Design** optimized for all devices
- **Dark/Light Theme** with user preferences
- **Multi-language Support** for internationalization
- **Email Integration** for notifications and communications
- **Calendar Integration** with Google Calendar sync
- **Advanced Analytics** with interactive charts and reports
- **Security Features** including 2FA, rate limiting, and audit logs

## 🛠️ Technology Stack

### **Backend**
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **Socket.io** for real-time communication
- **JWT** for authentication
- **Multer** for file uploads
- **Nodemailer** for email functionality
- **bcryptjs** for password hashing

### **Frontend**
- **React 18** with modern hooks and patterns
- **Material-UI (MUI)** for beautiful UI components
- **React Router** for navigation
- **React Query** for data fetching and caching
- **Framer Motion** for smooth animations
- **Recharts** for data visualization
- **Socket.io Client** for real-time features

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd academic-dashboard
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install all dependencies (root + client)
npm run install-all
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/academic-dashboard

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Client URL
CLIENT_URL=http://localhost:3000

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 4. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# On macOS with Homebrew
brew services start mongodb/brew/mongodb-community

# On Ubuntu/Debian
sudo systemctl start mongod

# Or run directly
mongod
```

### 5. Run the Application
```bash
# Development mode (runs both server and client)
npm run dev

# Or run separately
npm run server  # Backend only
npm run client  # Frontend only
```

### 6. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 👥 Default User Accounts

After setting up, you can create accounts or use these default credentials:

### Student Account
- **Email**: student@example.com
- **Password**: student123
- **Role**: Student

### Tutor Account
- **Email**: tutor@example.com
- **Password**: tutor123
- **Role**: Tutor

### Admin Account
- **Email**: admin@example.com
- **Password**: admin123
- **Role**: Admin

## 📁 Project Structure

```
academic-dashboard/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   ├── pages/         # Page components
│   │   ├── styles/        # CSS and styling
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   └── utils/            # Utility functions
├── uploads/              # File uploads directory
├── .env                  # Environment variables
├── package.json          # Root package.json
└── README.md            # This file
```

## 🔧 Configuration

### Database Setup
1. Install MongoDB locally or use MongoDB Atlas
2. Update `MONGODB_URI` in your `.env` file
3. The application will create necessary collections automatically

### Email Configuration (Optional)
For email features like password reset and notifications:
1. Set up an email service (Gmail, SendGrid, etc.)
2. Update email configuration in `.env`
3. For Gmail, use an App Password instead of your regular password

### File Upload Configuration
- Files are stored in the `uploads/` directory by default
- Configure cloud storage (AWS S3, Cloudinary) for production
- Adjust file size limits in the server configuration

## 🎨 Customization

### Theming
- Modify theme colors in `client/src/index.js`
- Add custom CSS in `client/src/styles/`
- Use Material-UI's theming system for consistent styling

### Adding Features
1. **Backend**: Add new routes in `server/routes/`
2. **Frontend**: Create new components in `client/src/components/`
3. **Database**: Add new models in `server/models/`

## 🚀 Deployment

### Backend Deployment
1. Set `NODE_ENV=production` in your environment
2. Configure production database URL
3. Set up proper security headers and CORS
4. Use PM2 or similar for process management

### Frontend Deployment
1. Build the React app: `npm run build`
2. Serve static files with nginx or similar
3. Configure proper routing for SPA

### Database Deployment
- Use MongoDB Atlas for cloud deployment
- Set up proper backup and monitoring
- Configure database security and access controls

## 🔒 Security Features

- **JWT Authentication** with secure token handling
- **Password Hashing** with bcrypt
- **Rate Limiting** to prevent abuse
- **Input Validation** and sanitization
- **CORS Configuration** for cross-origin requests
- **Helmet.js** for security headers
- **Account Lockout** after failed login attempts

## 📊 Analytics & Reporting

- **Student Progress Tracking**
- **Course Performance Analytics**
- **System Usage Statistics**
- **Custom Report Generation**
- **Data Export Capabilities**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Contact the development team

## 🔄 Updates & Changelog

### Version 1.0.0
- Initial release with full dashboard functionality
- Student, Tutor, and Admin dashboards
- Real-time messaging and notifications
- File upload and management
- Comprehensive analytics and reporting

---

**Built with ❤️ for the academic community**