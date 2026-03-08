import DataManager from './DataManager';

export default function CertificationsManager() {
  const columns = [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'issuer', label: 'Issuer', type: 'text' },
    { key: 'link', label: 'Certificate Link', type: 'text' },
  ] as const;

  return <DataManager endpoint="certifications" columns={columns as any} title="Certifications" />;
}
