import DataManager from './DataManager';

export default function ExperienceManager() {
  const columns = [
    { key: 'year', label: 'Year', type: 'text' },
    { key: 'title', label: 'Role/Title', type: 'text' },
    { key: 'subtitle', label: 'Company', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
  ] as const;

  return <DataManager endpoint="experience" columns={columns as any} title="Experience" />;
}
