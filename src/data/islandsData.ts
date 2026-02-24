export interface Project {
  title: string
  description: string
  tech: string[]
  link?: string
}

export interface SocialLink {
  name: string
  url: string
}

export interface IslandContent {
  id: string
  title: string
  type: 'projects' | 'about' | 'contact'
  projects?: Project[]
  bio?: string
  skills?: string[]
  email?: string
  social?: SocialLink[]
}

const islandsData: IslandContent[] = [
  {
    id: 'projects',
    title: 'Proyectos',
    type: 'projects',
    projects: [
      {
        title: 'Portfolio 3D',
        description: 'Portfolio interactivo con océano simulado, barco navegable e islas explorables.',
        tech: ['React', 'Three.js', 'R3F', 'Rapier', 'GLSL'],
        link: 'https://github.com',
      },
      {
        title: 'Proyecto Alpha',
        description: 'Descripción del proyecto. Placeholder para contenido real.',
        tech: ['TypeScript', 'Node.js', 'PostgreSQL'],
      },
      {
        title: 'Proyecto Beta',
        description: 'Descripción del proyecto. Placeholder para contenido real.',
        tech: ['React', 'Tailwind', 'Vercel'],
      },
    ],
  },
  {
    id: 'about',
    title: 'Sobre Mí',
    type: 'about',
    bio: 'Desarrollador apasionado por crear experiencias digitales únicas. Me especializo en el desarrollo web moderno con un enfoque en interfaces interactivas y rendimiento. Siempre explorando nuevas tecnologías para llevar los proyectos al siguiente nivel.',
    skills: ['TypeScript', 'React', 'Three.js', 'Node.js', 'GLSL', 'Rust', 'PostgreSQL', 'Docker'],
  },
  {
    id: 'contact',
    title: 'Contacto',
    type: 'contact',
    email: 'hola@example.com',
    social: [
      { name: 'GitHub', url: 'https://github.com' },
      { name: 'LinkedIn', url: 'https://linkedin.com' },
      { name: 'Twitter', url: 'https://twitter.com' },
    ],
  },
]

export default islandsData
