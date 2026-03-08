import DataManager from './DataManager';

export default function ArticlesManager() {
  const columns = [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'excerpt', label: 'Excerpt', type: 'textarea' },
    { key: 'date', label: 'Date', type: 'text' },
    { key: 'author', label: 'Author', type: 'text' },
    { key: 'content', label: 'Content (Markdown)', type: 'textarea' },
  ] as const;

  return <DataManager endpoint="articles" columns={columns as any} title="Articles" />;
}
