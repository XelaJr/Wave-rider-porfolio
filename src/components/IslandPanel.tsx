import islandsData, { IslandContent } from '../data/islandsData'

interface IslandPanelProps {
  islandId: string | null
  onClose: () => void
}

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

function AboutContent({ content }: { content: IslandContent }) {
  return (
    <div className="panel-content">
      <p className="panel-bio">{content.bio}</p>
      {content.skills && (
        <div className="panel-section">
          <h3 className="panel-section-title">// skills</h3>
          <div className="panel-tech-list">
            {content.skills.map((skill) => (
              <span key={skill} className="panel-tech-tag">{skill}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ContactContent({ content }: { content: IslandContent }) {
  return (
    <div className="panel-content">
      {content.email && (
        <div className="panel-section">
          <h3 className="panel-section-title">// email</h3>
          <a href={`mailto:${content.email}`} className="panel-contact-link">
            {content.email}
          </a>
        </div>
      )}
      {content.social && (
        <div className="panel-section">
          <h3 className="panel-section-title">// redes</h3>
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

export default function IslandPanel({ islandId, onClose }: IslandPanelProps) {
  const content = islandsData.find((d) => d.id === islandId) ?? null

  return (
    <div className={`island-panel${islandId ? ' island-panel--open' : ''}`}>
      <div className="panel-header">
        <span className="panel-header-label">// {content?.title ?? ''}</span>
        <button className="panel-close" onClick={onClose} aria-label="Cerrar panel">
          ✕
        </button>
      </div>

      {content?.type === 'projects' && <ProjectsContent content={content} />}
      {content?.type === 'about' && <AboutContent content={content} />}
      {content?.type === 'contact' && <ContactContent content={content} />}
    </div>
  )
}
