import DataManager from './DataManager';

export default function SkillsManager() {
  const columns = [
    { key: 'category', label: 'Category', type: 'text' },
    { key: 'name', label: 'Skill Name', type: 'text' },
    { key: 'iconName', label: 'Icon Name (Lucide)', type: 'text' },
  ] as const;

  return <DataManager endpoint="skills" columns={columns as any} title="Skills" />;
}
