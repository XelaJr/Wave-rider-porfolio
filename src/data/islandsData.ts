import type { Locale } from '../i18n/translations'
import { getTranslations } from '../i18n/translations'

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

export interface SkillCategory {
  category: string
  items: string[]
}

export interface ExperienceEntry {
  role: string
  company: string
  period: string
  description: string
  tech: string[]
}

export interface IslandContent {
  id: string
  title: string
  type: 'projects' | 'about' | 'contact' | 'skills' | 'experience'
  projects?: Project[]
  bio?: string
  skillCategories?: SkillCategory[]
  experience?: ExperienceEntry[]
  email?: string
  social?: SocialLink[]
}

export function getIslandsData(locale: Locale): IslandContent[] {
  const t = getTranslations(locale)

  return [
    {
      id: 'about',
      title: t.islands.about.title,
      type: 'about',
      bio: t.content.bio,
    },
    {
      id: 'skills',
      title: t.islands.skills.title,
      type: 'skills',
      skillCategories: [
        { category: 'Frontend', items: [...t.content.skills.frontend] },
        { category: 'Backend', items: [...t.content.skills.backend] },
        { category: 'Tools', items: [...t.content.skills.tools] },
      ],
    },
    {
      id: 'projects',
      title: t.islands.projects.title,
      type: 'projects',
      projects: t.content.projects.map((p) => ({ ...p })),
    },
    {
      id: 'experience',
      title: t.islands.experience.title,
      type: 'experience',
      experience: t.content.experience.map((e) => ({ ...e, tech: [...e.tech] })),
    },
    {
      id: 'contact',
      title: t.islands.contact.title,
      type: 'contact',
      email: t.content.email,
      social: t.content.social.map((s) => ({ ...s })),
    },
  ]
}

// Default export for backward compat (Spanish)
const islandsData = getIslandsData('es')
export default islandsData
