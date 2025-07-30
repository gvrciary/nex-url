## `nex url` - Professional URL Shortener

<div align="center">
<img src="public/og-image.png" width="650px">

![Next.js](https://img.shields.io/badge/Next.js-111111?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-111111?style=for-the-badge&logo=tailwindcss&logoColor=38BDF8)
![TypeScript](https://img.shields.io/badge/TypeScript-111111?style=for-the-badge&logo=typescript&logoColor=3178C6)
![BetterAuth](https://img.shields.io/badge/Better%20Auth-111111?style=for-the-badge&logo=vercel&logoColor=white)

</div>

## Whats is nex url?

Transform long URLs into short and elegant links. Track clicks, analyze audience and manage your links professionally.

### Features

- **URL Shortening**: Convert long URLs into short, shareable links
- **Custom Aliases**: Create personalized short links with custom aliases
- **Dashboard**: Manage all your links in one place
- **Responsive Design**: Works perfectly on desktop and mobile
- **Dark/Light Theme**: Toggle between themes for optimal viewing
- **Real-time Updates**: Instant feedback and updates
- **Export Data**: Download your links data as JSON

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gvrciary/nex-url.git
   cd nex-url
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**

  Create a `.env.local` file in the root directory:

  ```env
  # Database Configuration (Turso)
  TURSO_CONNECTION_URL=your_turso_database_url
  TURSO_AUTH_TOKEN=your_turso_auth_token
  
  # Authentication
  BETTER_AUTH_SECRET=your_random_secret_key
  BETTER_AUTH_URL=http://localhost:3000
  GOOGLE_CLIENT_ID=your_google_client_id
  GOOGLE_CLIENT_SECRET=your_github_client_secret
  GITHUB_CLIENT_ID=your_github_client_id
  GITHUB_CLIENT_SECRET=your_github_client_secret
  ```

4. **Database Setup**
  Run database migrations:
  
  ```bash
  npm run db:generate
  npm run db:migrate
  ```
3. **Run in development mode**
  ```bash
  npm run dev
  ```

## License

[![LICENSE - MIT by gvrciary](https://img.shields.io/badge/LICENSE-MIT-111111?style=for-the-badge&labelColor=111111&logo=open-source-initiative&logoColor=white)](LICENSE)