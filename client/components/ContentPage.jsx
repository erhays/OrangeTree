import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import RichTextEditor from './RichTextEditor';

const formatDate = (dt) => new Date(dt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const cancelBtnStyle = {
    padding: '0.7rem 1.75rem',
    border: '1px solid #ddd',
    borderRadius: '7px',
    fontSize: '0.95rem',
    fontWeight: 600,
    color: '#555',
    background: 'none',
    cursor: 'pointer',
};

const DEFAULT_HERO = 'We bring the shine back to your vehicle — inside and out. Serving the area with premium detailing at competitive prices.';

export default function ContentPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editPost, setEditPost] = useState(null);
    const [form, setForm] = useState({ title: '', body: '' });
    const [submitting, setSubmitting] = useState(false);
    const [heroDescription, setHeroDescription] = useState('');
    const [savingHero, setSavingHero] = useState(false);

    const loadPosts = () => {
        axios.get('/api/posts')
            .then(res => setPosts(res.data))
            .catch(() => toast.error('Failed to load posts.'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadPosts();
        axios.get('/api/settings/hero')
            .then(res => setHeroDescription(res.data.heroDescription || DEFAULT_HERO))
            .catch(() => setHeroDescription(DEFAULT_HERO));
    }, []);

    const openNew = () => {
        setEditPost(null);
        setForm({ title: '', body: '' });
        setShowForm(true);
    };

    const openEdit = (post) => {
        setEditPost(post);
        setForm({ title: post.title, body: post.body });
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const strippedBody = form.body.replace(/<[^>]*>/g, '').trim();
        if (!strippedBody) { toast.error('Post body cannot be empty.'); return; }
        setSubmitting(true);
        try {
            if (editPost) {
                await axios.put(`/api/posts/${editPost.id}`, form);
                toast.success('Post updated.');
            } else {
                await axios.post('/api/posts', form);
                toast.success('Post published.');
            }
            setShowForm(false);
            loadPosts();
        } catch {
            toast.error('Failed to save post.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSaveHero = async (e) => {
        e.preventDefault();
        setSavingHero(true);
        try {
            await axios.put('/api/settings/hero', { heroDescription });
            toast.success('Hero description updated.');
        } catch {
            toast.error('Failed to update hero description.');
        } finally {
            setSavingHero(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/posts/${id}`);
            toast.success('Post deleted.');
            setPosts(prev => prev.filter(p => p.id !== id));
        } catch {
            toast.error('Failed to delete post.');
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '680px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', margin: '0 0 1.5rem' }}>Content</h2>

            {/* Hero Description */}
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#111827', margin: '0 0 1rem' }}>Hero Description</h3>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 6px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
                <form onSubmit={handleSaveHero} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <textarea
                        className="home-contact-input home-contact-textarea"
                        rows={3}
                        value={heroDescription}
                        onChange={e => setHeroDescription(e.target.value)}
                        placeholder="Enter hero description…"
                    />
                    <div>
                        <button type="submit" className="customer-list-add-btn" disabled={savingHero}>
                            {savingHero ? 'Saving…' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#111827', margin: 0 }}>Posts</h3>
                {!showForm && (
                    <button className="customer-list-add-btn" onClick={openNew}>
                        + New Post
                    </button>
                )}
            </div>

            {showForm && (
                <form className="home-contact-form" style={{ margin: '0 0 2rem 0' }} onSubmit={handleSubmit}>
                    <div className="home-contact-field">
                        <label className="home-contact-label">{editPost ? 'Editing Post' : 'New Post'}</label>
                        <input
                            className="home-contact-input"
                            type="text"
                            placeholder="Title"
                            value={form.title}
                            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                            required
                            autoFocus
                        />
                    </div>
                    <div className="home-contact-field">
                        <label className="home-contact-label">Body</label>
                        <RichTextEditor
                            value={form.body}
                            onChange={body => setForm(p => ({ ...p, body }))}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                        <button type="button" style={cancelBtnStyle} onClick={() => setShowForm(false)}>
                            Cancel
                        </button>
                        <button type="submit" className="home-contact-btn" style={{ alignSelf: 'auto' }} disabled={submitting}>
                            {submitting ? 'Saving…' : editPost ? 'Save Changes' : 'Publish'}
                        </button>
                    </div>
                </form>
            )}

            {loading ? (
                <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Loading…</p>
            ) : posts.length === 0 ? (
                <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>No posts yet. Create one above.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {posts.map(post => (
                        <div key={post.id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.25rem 1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', margin: '0 0 0.2rem' }}>{post.title}</p>
                                    <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: '0 0 0.5rem' }}>{formatDate(post.created_at)}</p>
                                    <div
                                        className="rich-text"
                                        style={{ fontSize: '0.875rem', color: '#555', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
                                        dangerouslySetInnerHTML={{ __html: post.body }}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                                    <button
                                        onClick={() => openEdit(post)}
                                        style={{ padding: '0.35rem 0.75rem', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.8rem', color: '#555', background: '#fff', cursor: 'pointer' }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(post.id)}
                                        style={{ padding: '0.35rem 0.75rem', border: '1px solid #fee2e2', borderRadius: '6px', fontSize: '0.8rem', color: '#ef4444', background: '#fff', cursor: 'pointer' }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
