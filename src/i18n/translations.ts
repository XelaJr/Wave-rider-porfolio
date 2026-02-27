import { useNav } from '../store/navigationStore'

const translations = {
  es: {
    welcome: {
      name: 'Alex',
      title: 'Desarrollador Web',
      guidedTour: 'Zarpar (Tour Guiado)',
      explore: 'Explorar Libremente',
      controls: 'WASD / Flechas para navegar',
    },
    islands: {
      about: { title: 'Sobre Mí', name: 'Sobre Mí' },
      skills: { title: 'Skills', name: 'Skills' },
      projects: { title: 'Proyectos', name: 'Proyectos' },
      experience: { title: 'Experiencia', name: 'Experiencia' },
      contact: { title: 'Contacto', name: 'Contacto' },
    },
    ui: {
      tourIndicator: 'Tour Guiado — Presiona cualquier tecla para tomar control',
      closePanel: 'Cerrar panel',
      skillsSection: '// skills',
      emailSection: '// email',
      socialSection: '// redes',
      bioSection: '// sobre mí',
      experienceSection: '// experiencia',
    },
    content: {
      bio: 'Desarrollador apasionado por crear experiencias digitales únicas. Me especializo en el desarrollo web moderno con un enfoque en interfaces interactivas y rendimiento. Siempre explorando nuevas tecnologías para llevar los proyectos al siguiente nivel.',
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
      skills: {
        frontend: ['React', 'TypeScript', 'Three.js', 'GLSL', 'CSS/Tailwind'],
        backend: ['Node.js', 'Rust', 'PostgreSQL', 'REST APIs'],
        tools: ['Git', 'Docker', 'Vite', 'Linux', 'Figma'],
      },
      experience: [
        {
          role: 'Desarrollador Frontend',
          company: 'Empresa Tech',
          period: '2023 — Presente',
          description: 'Desarrollo de interfaces interactivas con React y Three.js. Optimización de rendimiento y experiencia de usuario.',
          tech: ['React', 'TypeScript', 'Three.js'],
        },
        {
          role: 'Desarrollador Web',
          company: 'Startup Digital',
          period: '2021 — 2023',
          description: 'Creación de aplicaciones web full-stack. Implementación de APIs REST y bases de datos.',
          tech: ['Node.js', 'PostgreSQL', 'React'],
        },
      ],
      email: 'hola@example.com',
      social: [
        { name: 'GitHub', url: 'https://github.com' },
        { name: 'LinkedIn', url: 'https://linkedin.com' },
        { name: 'Twitter', url: 'https://twitter.com' },
      ],
    },
  },
  en: {
    welcome: {
      name: 'Alex',
      title: 'Web Developer',
      guidedTour: 'Set Sail (Guided Tour)',
      explore: 'Explore Freely',
      controls: 'WASD / Arrow keys to navigate',
    },
    islands: {
      about: { title: 'About Me', name: 'About Me' },
      skills: { title: 'Skills', name: 'Skills' },
      projects: { title: 'Projects', name: 'Projects' },
      experience: { title: 'Experience', name: 'Experience' },
      contact: { title: 'Contact', name: 'Contact' },
    },
    ui: {
      tourIndicator: 'Guided Tour — Press any key to take control',
      closePanel: 'Close panel',
      skillsSection: '// skills',
      emailSection: '// email',
      socialSection: '// social',
      bioSection: '// about me',
      experienceSection: '// experience',
    },
    content: {
      bio: 'Passionate developer creating unique digital experiences. I specialize in modern web development with a focus on interactive interfaces and performance. Always exploring new technologies to take projects to the next level.',
      projects: [
        {
          title: '3D Portfolio',
          description: 'Interactive portfolio with simulated ocean, navigable boat and explorable islands.',
          tech: ['React', 'Three.js', 'R3F', 'Rapier', 'GLSL'],
          link: 'https://github.com',
        },
        {
          title: 'Project Alpha',
          description: 'Project description. Placeholder for real content.',
          tech: ['TypeScript', 'Node.js', 'PostgreSQL'],
        },
        {
          title: 'Project Beta',
          description: 'Project description. Placeholder for real content.',
          tech: ['React', 'Tailwind', 'Vercel'],
        },
      ],
      skills: {
        frontend: ['React', 'TypeScript', 'Three.js', 'GLSL', 'CSS/Tailwind'],
        backend: ['Node.js', 'Rust', 'PostgreSQL', 'REST APIs'],
        tools: ['Git', 'Docker', 'Vite', 'Linux', 'Figma'],
      },
      experience: [
        {
          role: 'Frontend Developer',
          company: 'Tech Company',
          period: '2023 — Present',
          description: 'Building interactive interfaces with React and Three.js. Performance optimization and UX improvements.',
          tech: ['React', 'TypeScript', 'Three.js'],
        },
        {
          role: 'Web Developer',
          company: 'Digital Startup',
          period: '2021 — 2023',
          description: 'Full-stack web application development. REST API implementation and database management.',
          tech: ['Node.js', 'PostgreSQL', 'React'],
        },
      ],
      email: 'hello@example.com',
      social: [
        { name: 'GitHub', url: 'https://github.com' },
        { name: 'LinkedIn', url: 'https://linkedin.com' },
        { name: 'Twitter', url: 'https://twitter.com' },
      ],
    },
  },
} as const

export type Translations = typeof translations.es
export type Locale = 'es' | 'en'

export function getTranslations(locale: Locale): Translations {
  return translations[locale]
}

export function useTranslation(): Translations {
  const { locale } = useNav()
  return translations[locale]
}

export default translations
