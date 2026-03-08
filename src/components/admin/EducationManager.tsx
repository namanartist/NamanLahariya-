import DataManager from './DataManager';

export default function EducationManager() {
  const columns = [
    { key: 'year', label: 'Year', type: 'text' },
    { key: 'title', label: 'Degree/Title', type: 'text' },
    { key: 'subtitle', label: 'School/University', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
  ] as const;

  return <DataManager endpoint="education" columns={columns as any} title="Education" />;
}
