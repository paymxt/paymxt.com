# PayMxt Website

Official website for PayMxt built with Nuxt 3, Vue, and Tailwind CSS.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

The site will be available at `https://localhost:3000/` with HTTPS enabled.

### Build

```bash
# Build for production
npm run build

# Generate static site
npm run generate

# Preview production build
npm run preview
```

## 📁 Project Structure

```
├── components/          # Reusable Vue components
├── composables/         # Vue composables and hooks
├── layouts/             # Layout components
├── pages/               # Dynamic pages (catch-all routes)
├── plugins/             # Nuxt plugins
├── storyblok/           # Storyblok CMS components
├── utils/               # Utility functions
├── assets/              # Static assets (CSS, fonts, images)
├── public/              # Public files (robots.txt, models, videos)
├── nuxt.config.ts       # Nuxt configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

## 🛠 Tech Stack

- **Framework**: [Nuxt 3](https://nuxt.com/) - Vue 3 meta-framework
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- **CMS**: [Storyblok](https://www.storyblok.com/) - Headless CMS
- **3D Graphics**: [TresJS](https://tresjs.org/) - Three.js wrapper for Vue
- **Database**: [Firebase](https://firebase.google.com/) - Backend services
- **E-commerce**: [Shopify Buy SDK](https://github.com/Shopify/js-buy-sdk) - Shopping integration
- **Animations**: [GSAP](https://greensock.com/gsap/) - Animation library
- **UI Components**: [Swiper](https://swiperjs.com/) - Carousel/slider library

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```
STORYBLOK_TOKEN_DEV=your_dev_token
STORYBLOK_TOKEN_PROD=your_prod_token
STORYBLOK_CUSTOM_PARENT=your_custom_parent
SHOPIFY_DOMAIN=your_shopify_domain
SHOPIFY_TOKEN=your_shopify_token
NUXT_FIREBASE_API_KEY=your_firebase_key
NUXT_FIREBASE_AUTH_DOMAIN=your_auth_domain
NUXT_FIREBASE_PROJECT_ID=your_project_id
NUXT_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NUXT_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NUXT_FIREBASE_APP_ID=your_app_id
```

## 📝 Scripts

- `npm run dev` - Start development server with HTTPS
- `npm run build` - Build for production
- `npm run generate` - Generate static pages
- `npm run preview` - Preview production build
- `npm run prepare` - Setup husky pre-commit hooks

## 🎨 Key Features

- **Dynamic Content**: Fetch content from Storyblok CMS
- **3D Graphics**: Interactive 3D elements using Three.js
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Firebase Integration**: Real-time data and user authentication
- **E-commerce**: Shopify product integration
- **SEO Optimized**: Static generation and meta tags
- **HTTPS Support**: Local development with SSL certificates

## 📦 Dependencies

See `package.json` for the complete list of dependencies and devDependencies.

## 🤝 Contributing

1. Create a new branch for your feature
2. Make your changes
3. Commit with descriptive messages
4. Push to the remote repository
5. Create a pull request

## 📄 License

Proprietary - PayMxt Inc.

## 📧 Support

For issues or questions, please reach out to the PayMxt development team.
