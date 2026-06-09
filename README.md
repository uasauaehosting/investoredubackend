# UASA Investor Education Portal - Backend

Backend API for the UASA Investor Education Portal with comprehensive content management and admin dashboard functionality.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Content Management**: Full CRUD operations for all website content
- **Multi-language Support**: English, Arabic, and French glossary terms
- **File Upload Support**: PDF and document management
- **Rate Limiting**: API protection against abuse
- **Data Validation**: Comprehensive input validation
- **Admin Dashboard**: Dynamic admin interface for content management

## Tech Stack

- **Node.js** with TypeScript
- **Express.js** framework
- **MySQL** database with mysql2 driver
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Express Validator** for input validation
- **Morgan** for logging
- **Helmet** for security
- **CORS** for cross-origin requests

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Set up MySQL database:
   ```bash
   # Create database using the provided SQL script
   mysql -u root -p < mysql_database_setup.sql
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

- `PORT`: Server port (default: 5007)
- `NODE_ENV`: Environment (development/production)
- `DB_HOST`: MySQL database host
- `DB_USER`: MySQL database username
- `DB_PASSWORD`: MySQL database password
- `DB_NAME`: MySQL database name
- `DB_PORT`: MySQL database port (default: 3306)
- `JWT_SECRET`: JWT secret key
- `JWT_EXPIRE`: JWT expiration time
- `FRONTEND_URL`: Frontend application URL
- `RATE_LIMIT_WINDOW_MS`: Rate limit window
- `RATE_LIMIT_MAX_REQUESTS`: Max requests per window

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current admin
- `POST /api/auth/change-password` - Change password

### Home Page
- `GET /api/home/news` - Get all news
- `POST /api/home/news` - Create news (Admin)
- `PUT /api/home/news/:id` - Update news (Admin)
- `DELETE /api/home/news/:id` - Delete news (Admin)
- `GET /api/home/members` - Get all members
- `POST /api/home/members` - Create member (Admin)
- `PUT /api/home/members/:id` - Update member (Admin)
- `DELETE /api/home/members/:id` - Delete member (Admin)
- `GET /api/home/stats` - Get home statistics
- `PUT /api/home/stats` - Update statistics (Admin)

### About Page
- `GET /api/about/sections` - Get about sections
- `POST /api/about/sections` - Create section (Admin)
- `PUT /api/about/sections/:id` - Update section (Admin)
- `DELETE /api/about/sections/:id` - Delete section (Admin)
- `GET /api/about/contact` - Get contact info
- `POST /api/about/contact` - Create contact info (Admin)
- `PUT /api/about/contact/:id` - Update contact info (Admin)
- `DELETE /api/about/contact/:id` - Delete contact info (Admin)

### Investor Education
- `GET /api/investor-education/reading-materials` - Get reading materials
- `POST /api/investor-education/reading-materials` - Create material (Admin)
- `PUT /api/investor-education/reading-materials/:id` - Update material (Admin)
- `DELETE /api/investor-education/reading-materials/:id` - Delete material (Admin)
- `GET /api/investor-education/member-activities` - Get member activities
- `POST /api/investor-education/member-activities` - Create activity (Admin)
- `PUT /api/investor-education/member-activities/:id` - Update activity (Admin)
- `DELETE /api/investor-education/member-activities/:id` - Delete activity (Admin)
- `GET /api/investor-education/alerts-bulletins` - Get alerts/bulletins
- `POST /api/investor-education/alerts-bulletins` - Create alert/bulletin (Admin)
- `PUT /api/investor-education/alerts-bulletins/:id` - Update alert/bulletin (Admin)
- `DELETE /api/investor-education/alerts-bulletins/:id` - Delete alert/bulletin (Admin)

### Glossary
- `GET /api/glossary` - Get glossary terms
- `POST /api/glossary` - Create term (Admin)
- `PUT /api/glossary/:id` - Update term (Admin)
- `DELETE /api/glossary/:id` - Delete term (Admin)
- `GET /api/glossary/categories` - Get categories
- `GET /api/glossary/languages` - Get languages

### Feedback
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback` - Get all feedback (Admin)
- `GET /api/feedback/:id` - Get specific feedback (Admin)
- `PUT /api/feedback/:id/respond` - Respond to feedback (Admin)
- `PUT /api/feedback/:id/status` - Update feedback status (Admin)
- `DELETE /api/feedback/:id` - Delete feedback (Admin)
- `GET /api/feedback/stats/summary` - Get feedback statistics (Admin)

### Admin Management
- `GET /api/admin` - Get all admins (Super Admin)
- `POST /api/admin` - Create admin (Super Admin)
- `PUT /api/admin/:id` - Update admin (Super Admin)
- `DELETE /api/admin/:id` - Delete admin (Super Admin)
- `PUT /api/admin/:id/toggle-status` - Toggle admin status (Super Admin)

## Default Admin Credentials

After seeding the database:

**Super Admin:**
- Username: `superadmin`
- Password: `admin123`

**Admin:**
- Username: `admin`
- Password: `admin123`

## Data Models

### News
- title, excerpt, link, date, isActive

### Member
- name, country, website, logo, isActive

### Reading Material
- title, description, category, author, date, pdfUrl, views, downloads

### Member Activity
- title, description, type, organization, date, status, participants

### Alert/Bulletin
- title, description, type, priority, date, author

### Glossary Term
- term, definition, category, language, translations, views, downloads

### Feedback
- name, email, phone, subject, message, rating, category, status, response

### Admin
- username, email, password, firstName, lastName, role, permissions

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run typecheck` - Type checking

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- CORS configuration
- Helmet security headers
- Input validation and sanitization
- Role-based access control

## Error Handling

- Global error handler
- Validation error responses
- 404 handling
- Development vs production error messages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License
