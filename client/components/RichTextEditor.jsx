import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

const btnStyle = (active) => ({
    background: active ? '#f3f4f6' : 'none',
    border: '1px solid ' + (active ? '#d1d5db' : 'transparent'),
    borderRadius: '4px',
    padding: '0.2rem 0.45rem',
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
    color: active ? '#111827' : '#6b7280',
    lineHeight: 1.4,
});

export default function RichTextEditor({ value, onChange }) {
    const editor = useEditor({
        extensions: [StarterKit],
        content: value || '',
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    // Sync external value changes (e.g. when form resets or switches between edit/new)
    useEffect(() => {
        if (!editor) return;
        const current = editor.getHTML();
        if (value !== current) {
            editor.commands.setContent(value || '', false);
        }
    }, [value, editor]);

    if (!editor) return null;

    return (
        <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', overflow: 'hidden', background: '#fff' }}>
            {/* Toolbar */}
            <div style={{
                display: 'flex', gap: '0.2rem', padding: '0.5rem 0.6rem',
                borderBottom: '1px solid #e5e7eb', background: '#fafafa', flexWrap: 'wrap',
            }}>
                <button type="button" style={btnStyle(editor.isActive('bold'))} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold">B</button>
                <button type="button" style={{ ...btnStyle(editor.isActive('italic')), fontStyle: 'italic' }} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic">I</button>
                <button type="button" style={{ ...btnStyle(editor.isActive('strike')), textDecoration: 'line-through' }} onClick={() => editor.chain().focus().toggleStrike().run()} title="Strikethrough">S</button>
                <div style={{ width: '1px', background: '#e5e7eb', margin: '0 0.2rem' }} />
                <button type="button" style={btnStyle(editor.isActive('heading', { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Heading">H2</button>
                <button type="button" style={btnStyle(editor.isActive('heading', { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="Subheading">H3</button>
                <div style={{ width: '1px', background: '#e5e7eb', margin: '0 0.2rem' }} />
                <button type="button" style={btnStyle(editor.isActive('bulletList'))} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet list">• List</button>
                <button type="button" style={btnStyle(editor.isActive('orderedList'))} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered list">1. List</button>
                <div style={{ width: '1px', background: '#e5e7eb', margin: '0 0.2rem' }} />
                <button type="button" style={btnStyle(false)} onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider">—</button>
            </div>

            {/* Editor area */}
            <EditorContent
                editor={editor}
                style={{ minHeight: '160px', padding: '0.75rem 1rem', fontSize: '0.9rem', color: '#374151', lineHeight: 1.6 }}
            />
        </div>
    );
}
