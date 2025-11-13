# Quick Start Guide

## Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Pages

### Public Pages
- **/** - Landing page with hero and features
- **/about** - About the platform and lecturer
- **/contact** - Contact form and information
- **/faq** - Frequently asked questions
- **/blog** - Blog listing
- **/blog/[slug]** - Individual blog post
- **/courses** - Available courses
- **/courses/[slug]** - Course details with materials
- **/ebooks** - eBooks library
- **/study-hub** - Daily study resources

### Authentication
- **/auth/login** - Student login
- **/auth/signup** - Student registration

### Student Area
- **/dashboard** - Student dashboard with progress

### Admin Area
- **/admin** - Admin dashboard (frontend mock)

## Features

### Theme Toggle
- Click the sun/moon icon in the navbar to switch between light and dark modes
- Theme preference is saved in localStorage

### Responsive Design
- Mobile-first design
- Breakpoints: mobile (default), tablet (md), desktop (lg)

### Animations
- Fade-in effects on page load
- Slide-up animations for sections
- Smooth hover transitions

## Development Tips

### Adding New Pages
1. Create a new folder in `/app` with the route name
2. Add a `page.tsx` file
3. Import and use existing components from `/components`

### Styling
- Use Tailwind utility classes
- Custom colors defined in `tailwind.config.ts`:
  - `primary-light` / `primary-dark`
  - `accent-light` / `accent-dark`
  - `background-light` / `background-dark`

### Components
All reusable components are in `/components`:
- `Card` - Container with shadow and padding
- `Button` - Styled button with variants
- `Input` - Form input field
- `Navbar` - Navigation bar
- `Footer` - Page footer
- `Hero` - Landing page hero section
- `ThemeToggle` - Dark mode toggle

## Mock Data

All data is currently hardcoded for demonstration. To add real data:
1. Set up a backend (Supabase, Firebase, etc.)
2. Create API routes in `/app/api`
3. Replace mock data with API calls

## Build for Production

```bash
npm run build
npm start
```

## Troubleshooting

### TypeScript Errors
If you see TypeScript errors, ensure all dependencies are installed:
```bash
npm install
```

### Port Already in Use
If port 3000 is busy, Next.js will automatically use the next available port (3001, 3002, etc.)

### Dark Mode Not Working
Clear your browser's localStorage and refresh the page.

## Next Steps

1. ✅ Install dependencies
2. ✅ Run dev server
3. 🔄 Explore all pages
4. 🔄 Test dark mode
5. 🔄 Test responsive design
6. 📝 Add backend integration
7. 📝 Deploy to Vercel/Netlify
