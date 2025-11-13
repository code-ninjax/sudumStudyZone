# Sudum Study - Academic Learning Platform

A modern, fully responsive academic platform built with Next.js, TypeScript, and Tailwind CSS. Features separate admin and student portals with AI-powered assistance, real-time animations, and comprehensive learning management tools.

## 🚀 Features

### Public Pages (With Nav/Footer)
- **Landing Page**: Hero section with platform overview
- **Courses**: Browse available courses with filters
- **eBooks Library**: Searchable educational eBooks
- **Blog**: Academic articles and insights
- **Study Hub**: Daily resources hub
- **About/Contact/FAQ**: Information and support pages

### Admin Portal (Separate - No Nav/Footer)
- **Admin Login**: Secure authentication (`/admin/login`)
- **Admin Dashboard**: Complete management interface (`/admin`)
  - Sidebar navigation (Dashboard, Students, Courses, Blog, Revenue, Analytics, Settings)
  - Real-time stats with counting animations
  - Quick action buttons
  - Course management
  - Revenue tracking ($45,678)
  - Student analytics (1,234 students)
  - Recent activity feed
  - Skeleton loaders

### Student Portal (Separate - No Nav/Footer)
- **Student Dashboard**: Personalized learning hub (`/student`)
  - Profile-based sidebar with avatar
  - Stats tracking (Points: 1,250, Streak: 7 days)
  - Course progress with animated bars
  - Achievement system (unlocked/locked)
  - Assignment tracking with priority badges
  - Daily motivation
  - Skeleton loaders
- **AI Chat Assistant**: Interactive AI helper (`/student/ai-chat`)
  - Real-time chat interface
  - Typing indicators
  - Quick question suggestions
  - Message history
  - Gradient message bubbles

### Advanced Features
- **Counting Animations**: All numbers animate smoothly
- **Skeleton Loaders**: Professional loading states
- **Streak Tracking**: 7-day streak with flame icon
- **Points System**: Gamified learning (1,250 points)
- **Progress Bars**: Animated course completion
- **Achievement Badges**: Trophy system
- **Priority System**: Color-coded assignments (high/medium/low)
- **Dark Mode**: Full theme support with smooth transitions
- **Fully Responsive**: Mobile hamburger menus, collapsible sidebars

## 🎨 Design

- **Theme Colors**:
  - Light Mode: Green (#15803d) and White (#ffffff)
  - Dark Mode: Deep Green (#065f46) and Dark Gray (#0f172a)
- **Font**: Inter (Google Fonts)
- **Icons**: Lucide React
- **Animations**: Smooth transitions and hover effects

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Theme**: next-themes

## 📁 Project Structure

```
/app
  /page.tsx                    # Landing page (public)
  /layout.tsx                  # Root layout with theme provider
  /globals.css                 # Global styles & animations
  
  # Public Pages (with Nav/Footer)
  /about/page.tsx              # About Sudum Study
  /auth
    /login/page.tsx            # Student login
    /signup/page.tsx           # Student signup
  /courses
    /page.tsx                  # Courses listing
    /[slug]/page.tsx           # Course details
  /ebooks/page.tsx             # eBooks library
  /blog
    /page.tsx                  # Blog listing
    /[slug]/page.tsx           # Blog post
  /study-hub/page.tsx          # Study resources
  /faq/page.tsx                # FAQ
  /contact/page.tsx            # Contact form
  
  # Admin Portal (NO Nav/Footer)
  /admin
    /login/page.tsx            # Admin authentication
    /page.tsx                  # Admin dashboard
    layout.tsx                 # Admin layout with sidebar
  
  # Student Portal (NO Nav/Footer)
  /student
    /page.tsx                  # Student dashboard
    /ai-chat/page.tsx          # AI assistant
    layout.tsx                 # Student layout with sidebar

/components
  # Layout Components
  /Navbar.tsx                  # Public navigation
  /Footer.tsx                  # Public footer
  /AdminSidebar.tsx            # Admin navigation
  /StudentSidebar.tsx          # Student navigation
  
  # UI Components
  /Card.tsx                    # Reusable card
  /Button.tsx                  # Button variants
  /Input.tsx                   # Form input
  /Hero.tsx                    # Hero section
  /ThemeToggle.tsx             # Dark mode toggle
  /ThemeProvider.tsx           # Theme context
  
  # Advanced Components
  /CountingAnimation.tsx       # Animated numbers
  /SkeletonLoader.tsx          # Loading states
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sudumstudyzone
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🎯 Future Enhancements

- **Backend Integration**: Connect to Supabase for data persistence
- **Authentication**: Implement real user authentication
- **File Uploads**: Enable actual file uploads for assignments
- **Real-time Updates**: Add real-time notifications
- **Payment Integration**: For premium courses
- **Analytics**: Track student progress and engagement
- **Mobile App**: React Native version

## 🤝 Contributing

This is a frontend-only implementation. Backend integration and additional features will be added in future iterations.

## 🎯 Key Routes

### Public Routes
- `/` - Landing page
- `/courses` - Browse courses
- `/ebooks` - eBook library
- `/blog` - Blog posts
- `/study-hub` - Study resources
- `/about` - About us
- `/contact` - Contact form
- `/faq` - FAQ
- `/auth/login` - Student login
- `/auth/signup` - Student signup

### Admin Routes (Protected)
- `/admin/login` - Admin authentication
- `/admin` - Admin dashboard
- `/admin/students` - Manage students
- `/admin/courses` - Manage courses
- `/admin/blog` - Write blog posts
- `/admin/revenue` - Revenue tracking
- `/admin/analytics` - Platform analytics
- `/admin/settings` - Admin settings

### Student Routes (Protected)
- `/student` - Student dashboard
- `/student/courses` - My courses
- `/student/study-hub` - Study resources
- `/student/ebooks` - eBook library
- `/student/blog` - Blog
- `/student/ai-chat` - AI assistant
- `/student/profile` - User profile
- `/student/settings` - User settings

## 🎨 Animations

- **Counting Animations**: Numbers count from 0 to target
- **Fade In**: Smooth page load animations
- **Slide Up**: Content slides up on scroll
- **Skeleton Loaders**: Professional loading states
- **Hover Effects**: Scale and shadow transformations
- **Progress Bars**: Animated gradient fills

## 📝 License

This project is created for educational purposes.

## 👨‍💻 Author

Sudum Study - Modern Academic Learning Platform

---

**Note**: This is currently a frontend-only implementation with dummy data. All features are fully functional and ready for backend integration (Supabase, Firebase, etc.).
