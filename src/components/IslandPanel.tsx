import { getIslandsData, type IslandContent } from '../data/islandsData'
import { useNav, useNavDispatch } from '../store/navigationStore'
import { useTranslation } from '../i18n/translations'

function ProjectsContent({ content }: { content: IslandContent }) {
  return (
    <div className="panel-content">
      {content.projects?.map((project) => (
        <div key={project.title} className="panel-project">
          <div className="panel-project-header">
            <h3 className="panel-project-title">{project.title}</h3>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="panel-project-link"
              >
                ↗
              </a>
            )}
          </div>
          <p className="panel-project-desc">{project.description}</p>
          <div className="panel-tech-list">
            {project.tech.map((t) => (
              <span key={t} className="panel-tech-tag">{t}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function AboutContent({ content, t }: { content: IslandContent; t: ReturnType<typeof useTranslation> }) {
  return (
    <div className="panel-content">
      <p className="panel-bio">{content.bio}</p>
    </div>
  )
}

function SkillsContent({ content }: { content: IslandContent }) {
  return (
    <div className="panel-content">
      {content.skillCategories?.map((cat) => (
        <div key={cat.category} className="panel-section">
          <h3 className="panel-section-title">// {cat.category}</h3>
          <div className="panel-tech-list">
            {cat.items.map((skill) => (
              <span key={skill} className="panel-tech-tag">{skill}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function ExperienceContent({ content }: { content: IslandContent }) {
  return (
    <div className="panel-content">
      {content.experience?.map((entry) => (
        <div key={`${entry.company}-${entry.period}`} className="panel-project">
          <div className="panel-project-header">
            <h3 className="panel-project-title">{entry.role}</h3>
          </div>
          <div className="panel-experience-meta">
            <span className="panel-experience-company">{entry.company}</span>
            <span className="panel-experience-period">{entry.period}</span>
          </div>
          <p className="panel-project-desc">{entry.description}</p>
          <div className="panel-tech-list">
            {entry.tech.map((t) => (
              <span key={t} className="panel-tech-tag">{t}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function ContactContent({ content, t }: { content: IslandContent; t: ReturnType<typeof useTranslation> }) {
  return (
    <div className="panel-content">
      {content.email && (
        <div className="panel-section">
          <h3 className="panel-section-title">{t.ui.emailSection}</h3>
          <a href={`mailto:${content.email}`} className="panel-contact-link">
            {content.email}
          </a>
        </div>
      )}
      {content.social && (
        <div className="panel-section">
          <h3 className="panel-section-title">{t.ui.socialSection}</h3>
          <div className="panel-social-list">
            {content.social.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="panel-social-link"
              >
                <span className="panel-social-arrow">→</span> {link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function IslandPanel() {
  const nav = useNav()
  const dispatch = useNavDispatch()
  const t = useTranslation()
  const data = getIslandsData(nav.locale)
  const content = data.find((d) => d.id === nav.activeIsland) ?? null
  const isOpen = nav.activeIsland !== null

  const onClose = () => dispatch({ type: 'SET_ACTIVE_ISLAND', island: null })

  return (
    <div className={`island-panel${isOpen ? ' island-panel--open' : ''}`}>
      <div className="panel-header">
        <span className="panel-header-label">// {content?.title ?? ''}</span>
        <button className="panel-close" onClick={onClose} aria-label={t.ui.closePanel}>
          ✕
        </button>
      </div>

      {content?.type === 'projects' && <ProjectsContent content={content} />}
      {content?.type === 'about' && <AboutContent content={content} t={t} />}
      {content?.type === 'skills' && <SkillsContent content={content} />}
      {content?.type === 'experience' && <ExperienceContent content={content} />}
      {content?.type === 'contact' && <ContactContent content={content} t={t} />}
    </div>
  )
}
