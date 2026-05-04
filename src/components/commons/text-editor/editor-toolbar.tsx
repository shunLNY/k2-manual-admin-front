import dynamic from 'next/dynamic';

const ToolbarPlugin = dynamic(() => import('./plugins/ToolbarPlugin'), { ssr: false });
const ReDoPlugin = dynamic(() => import('./plugins/TreeViewPlugin'), { ssr: false });

export function EditorToolbar() {
  return (
    <>
      <ToolbarPlugin />
      <ReDoPlugin />
    </>
  );
}
