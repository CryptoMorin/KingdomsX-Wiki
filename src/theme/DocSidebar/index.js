import DocSidebar from '@theme-original/DocSidebar';

export default function DocSidebar(props) {
  return (
    <aside className="custom-sidebar">
      <div className="my-header">My Custom Docs</div>

      {/* original sidebar content */}
      <DocSidebar {...props} />

      <div className="my-footer">Version 2.0</div>
    </aside>
  );
}