import DataManager from './DataManager';

export default function ProjectsManager() {
  const columns = [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'category', label: 'Category', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'tech', label: 'Tech Stack (comma separated)', type: 'json' },
    { key: 'demoLink', label: 'Demo Link', type: 'text' },
    { key: 'githubLink', label: 'GitHub Link', type: 'text' },
  ] as const;

  return <DataManager endpoint="projects" columns={columns as any} title="Projects" />;
}
