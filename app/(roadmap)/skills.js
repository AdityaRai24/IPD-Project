export const skills = [
  {
    name: "HTML",
    levels: [
      { level: 1, description: "Basic tags, structure, and attributes" },
      { level: 2, description: "Formatting, links, images, lists, tables" },
      { level: 3, description: "Forms, semantic HTML, accessibility basics" },
      { level: 4, description: "HTML5 elements, ARIA roles, SEO tags" },
      { level: 5, description: "Advanced SEO, structured data, microdata" },
    ],
  },
  {
    name: "CSS",
    levels: [
      { level: 1, description: "Basic styling, color, font, text alignment" },
      {
        level: 2,
        description: "Box model, layout basics (display, positioning)",
      },
      { level: 3, description: "Responsive design, Flexbox, Grid layout" },
      { level: 4, description: "Animations, transitions, media queries" },
      {
        level: 5,
        description: "Advanced styling (SASS/SCSS, CSS modules, CSS-in-JS)",
      },
    ],
  },
  {
    name: "JavaScript",
    levels: [
      { level: 1, description: "Syntax, variables, data types, operators" },
      {
        level: 2,
        description: "Functions, control flow (loops, conditionals)",
      },
      {
        level: 3,
        description:
          "Objects, arrays, ES6+ features (arrow functions, destructuring)",
      },
      {
        level: 4,
        description: "Asynchronous JavaScript, Promises, async/await",
      },
      {
        level: 5,
        description:
          "Advanced topics: closures, prototypes, modules, the event loop",
      },
    ],
  },
  {
    name: "ReactJS",
    levels: [
      { level: 1, description: "JSX, components, props, state basics" },
      {
        level: 2,
        description: "Hooks (useState, useEffect), component lifecycle",
      },
      { level: 3, description: "Context API, custom hooks, React Router" },
      {
        level: 4,
        description: "Performance optimization, lazy loading, error boundaries",
      },
      {
        level: 5,
        description:
          "Advanced React patterns, testing with React Testing Library",
      },
    ],
  },
  {
    name: "NextJS",
    levels: [
      { level: 1, description: "File-based routing, pages, static content" },
      {
        level: 2,
        description:
          "Data fetching methods (getStaticProps, getServerSideProps)",
      },
      {
        level: 3,
        description: "API routes, authentication, state management with SWR",
      },
      {
        level: 4,
        description: "Server-side rendering, ISR, performance optimizations",
      },
      {
        level: 5,
        description: "Advanced config, custom servers, Next.js with TypeScript",
      },
    ],
  },
  {
    name: "TailwindCSS",
    levels: [
      { level: 1, description: "Basic utility classes, responsive utilities" },
      {
        level: 2,
        description: "Customization with config files, breakpoints, themes",
      },
      {
        level: 3,
        description: "CSS modules with Tailwind, transitions, animations",
      },
      { level: 4, description: "Advanced design patterns, theming, dark mode" },
      {
        level: 5,
        description: "Integrating Tailwind with frameworks (Next.js, Vue)",
      },
    ],
  },
  {
    name: "Framer Motion",
    levels: [
      {
        level: 1,
        description:
          "Introduction to Framer Motion; basic animations like opacity, translate, and scale",
      },
      {
        level: 2,
        description:
          "Understanding and using variants for consistent animations across components; controlling transitions with ease and duration",
      },
      {
        level: 3,
        description:
          "Advanced animations with keyframes, custom easing functions, and gestures (hover, tap, drag)",
      },
      {
        level: 4,
        description:
          "Animating layout changes with the layout prop; using `AnimatePresence` for managing animations on component mount/unmount",
      },
      {
        level: 5,
        description:
          "Complex animation sequences and shared layout transitions; optimizing performance, managing nested animations, and integrating Framer Motion with React context",
      },
    ],
  },
  {
    name: "Shadcn UI",
    levels: [
      {
        level: 1,
        description: "Setting up Shadcn UI, basic components, theming",
      },
      {
        level: 2,
        description: "Integrating with Next.js, dynamic theming, dark mode",
      },
      { level: 3, description: "Component customization, accessibility" },
      {
        level: 4,
        description: "Advanced usage with Tailwind CSS, global styling",
      },
      { level: 5, description: "Performance optimizations, custom animations" },
    ],
  },
  {
    name: "Node.js",
    levels: [
      {
        level: 1,
        description: "Environment setup, npm, building a basic server",
      },
      { level: 2, description: "Express.js basics, routing, middleware" },
      { level: 3, description: "Working with databases, CRUD, and MongoDB" },
      {
        level: 4,
        description: "Authentication, security, real-time applications",
      },
      {
        level: 5,
        description: "Optimizations, microservices, deploying with Docker",
      },
    ],
  },
  {
    name: "Express.js",
    levels: [
      { level: 1, description: "Setting up an Express server, basic routes" },
      { level: 2, description: "Middleware, error handling, basic APIs" },
      { level: 3, description: "RESTful API design, MongoDB integration" },
      {
        level: 4,
        description: "Authentication, sessions, advanced error handling",
      },
      {
        level: 5,
        description: "Advanced topics: WebSockets, scalable Express servers",
      },
    ],
  },
  {
    name: "MongoDB",
    levels: [
      { level: 1, description: "CRUD operations, MongoDB Shell" },
      {
        level: 2,
        description: "Schema design, indexing, working with collections",
      },
      { level: 3, description: "Aggregation, relationships, advanced queries" },
      {
        level: 4,
        description: "Optimizations, transactions, handling large datasets",
      },
      { level: 5, description: "Replicas, sharding, MongoDB Atlas setup" },
    ],
  },
  {
    name: "Docker",
    levels: [
      { level: 1, description: "Containers, Docker CLI, Dockerfile basics" },
      { level: 2, description: "Building images, docker-compose, volumes" },
      { level: 3, description: "Networking, linking containers, Docker Hub" },
      {
        level: 4,
        description: "Docker Swarm, multi-stage builds, custom networks",
      },
      { level: 5, description: "Kubernetes integration, CI/CD with Docker" },
    ],
  },
  {
    name: "Git",
    levels: [
      { level: 1, description: "Basic commands: clone, commit, push, pull" },
      { level: 2, description: "Branching, merging, resolving conflicts" },
      { level: 3, description: "Pull requests, collaborating with GitHub" },
      { level: 4, description: "Git workflows, handling large projects" },
      { level: 5, description: "Advanced Git: rebasing, stashing, hooks" },
    ],
  },
  {
    name: "TypeScript",
    levels: [
      { level: 1, description: "Basic types, interfaces, basic TS setup" },
      { level: 2, description: "Type unions, intersections, and generics" },
      {
        level: 3,
        description: "Integrating with React, complex type patterns",
      },
      {
        level: 4,
        description: "Type inference, TypeScript config, decorators",
      },
      {
        level: 5,
        description: "Advanced TypeScript: conditional types, type guards",
      },
    ],
  },
];
