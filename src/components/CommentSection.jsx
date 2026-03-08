import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp,
    updateDoc,
    deleteDoc,
    doc,
    writeBatch,
    getDocs
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Send, Reply, User, Edit2, Trash2, X, Check, Trash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CommentSection = ({ songId }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [replyTo, setReplyTo] = useState(null);
    const [replyContent, setReplyContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const isAdmin = user?.role === 'superadmin' || user?.role === 'admin';

    useEffect(() => {
        if (!songId) return;

        const q = query(
            collection(db, 'comments'),
            where('songId', '==', songId)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const commentsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })).sort((a, b) => {
                const aTime = a.timestamp?.toMillis() || 0;
                const bTime = b.timestamp?.toMillis() || 0;
                return aTime - bTime;
            });

            const threadMap = {};
            const rootComments = [];

            commentsData.forEach(comment => {
                if (comment.parentId) {
                    if (!threadMap[comment.parentId]) {
                        threadMap[comment.parentId] = [];
                    }
                    threadMap[comment.parentId].push(comment);
                } else {
                    rootComments.push(comment);
                }
            });

            const structuredComments = rootComments.map(root => ({
                ...root,
                replies: threadMap[root.id] || []
            }));

            setComments(structuredComments);
            setLoading(false);
        }, (err) => {
            console.error("Firestore snapshot error:", err);
            setError(`Failed to load comments: ${err.message || 'Check your connection.'}`);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [songId]);

    const handlePostComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !user || submitting) return;

        setSubmitting(true);
        setError(null);

        try {
            await addDoc(collection(db, 'comments'), {
                songId,
                userId: user.uid,
                userName: user.name || 'Choir Member',
                content: newComment,
                timestamp: serverTimestamp(),
                parentId: null
            });
            setNewComment('');
        } catch (err) {
            console.error("Error posting comment:", err);
            setError(`Failed to post message: ${err.message || 'Please try again.'}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handlePostReply = async (e, parentId) => {
        e.preventDefault();
        if (!replyContent.trim() || !user || submitting) return;

        setSubmitting(true);
        setError(null);

        try {
            await addDoc(collection(db, 'comments'), {
                songId,
                userId: user.uid,
                userName: user.name || 'Choir Member',
                content: replyContent,
                timestamp: serverTimestamp(),
                parentId: parentId
            });
            setReplyContent('');
            setReplyTo(null);
        } catch (err) {
            console.error("Error posting reply:", err);
            setError(`Failed to post reply: ${err.message || 'Please try again.'}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateComment = async (commentId, newContent) => {
        if (!newContent.trim() || submitting) return;
        setSubmitting(true);
        try {
            await updateDoc(doc(db, 'comments', commentId), {
                content: newContent,
                lastEdited: serverTimestamp()
            });
        } catch (err) {
            console.error("Error updating comment:", err);
            setError(`Failed to update message: ${err.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Are you sure you want to delete this message?")) return;
        setSubmitting(true);
        try {
            await deleteDoc(doc(db, 'comments', commentId));
        } catch (err) {
            console.error("Error deleting comment:", err);
            setError(`Failed to delete message: ${err.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteThread = async (commentId, replies = []) => {
        console.log("Deleting thread:", commentId, "with replies:", replies);
        if (!window.confirm("Are you sure you want to delete this entire message thread?")) return;

        setSubmitting(true);
        setError(null);
        try {
            const batch = writeBatch(db);

            // Delete the main comment
            batch.delete(doc(db, 'comments', commentId));

            // Delete all replies
            replies.forEach(reply => {
                batch.delete(doc(db, 'comments', reply.id));
            });

            await batch.commit();
        } catch (err) {
            console.error("Error deleting thread:", err);
            setError(`Failed to delete thread: ${err.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteAll = async () => {
        if (!window.confirm("WARNING: This will delete ALL comments and replies for this song. This action cannot be undone. Are you sure?")) return;

        setSubmitting(true);
        setError(null);
        try {
            const q = query(
                collection(db, 'comments'),
                where('songId', '==', songId)
            );
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                setError("No comments found to delete.");
                return;
            }

            const batch = writeBatch(db);
            snapshot.docs.forEach((doc) => {
                batch.delete(doc.ref);
            });

            await batch.commit();
        } catch (err) {
            console.error("Error deleting all comments:", err);
            setError(`Failed to delete all messages: ${err.message}. Please check if you have admin permissions.`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="comments-section">
            <div className="section-header">
                <div className="header-left">
                    <MessageSquare size={24} />
                    <h3>Questions, Comments & Messages</h3>
                </div>
                {isAdmin && comments.length > 0 && (
                    <button
                        className="btn-admin-delete-all"
                        onClick={handleDeleteAll}
                        disabled={submitting}
                        title="Delete All Messages for this song"
                    >
                        <Trash size={16} /> Delete all Comments
                    </button>
                )}
            </div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="error-message"
                    style={{
                        background: 'rgba(255, 107, 107, 0.1)',
                        color: 'var(--accent)',
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                        border: '1px solid rgba(255, 107, 107, 0.2)',
                        fontSize: '0.9rem'
                    }}
                >
                    {error}
                </motion.div>
            )}

            <form className="main-comment-form" onSubmit={handlePostComment}>
                <div className="input-wrapper">
                    <textarea
                        placeholder="Add a comment or send a message to other members..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        disabled={submitting}
                    />
                    <button type="submit" className="btn-primary-sm" disabled={!newComment.trim() || submitting}>
                        {submitting ? 'Posting...' : 'Post Message'} <Send size={16} />
                    </button>
                </div>
            </form>

            <div className="comments-list">
                {loading ? (
                    <div className="loading-comments">Loading comments...</div>
                ) : comments.length === 0 ? (
                    <div className="no-comments">No messages yet. Be the first to start a conversation!</div>
                ) : (
                    comments.map(comment => (
                        <CommentCard
                            key={comment.id}
                            comment={comment}
                            currentUser={user}
                            replyTo={replyTo}
                            setReplyTo={setReplyTo}
                            replyContent={replyContent}
                            setReplyContent={setReplyContent}
                            handlePostReply={handlePostReply}
                            handleUpdateComment={handleUpdateComment}
                            handleDeleteComment={handleDeleteComment}
                            handleDeleteThread={handleDeleteThread}
                            submitting={submitting}
                            setError={setError}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

const CommentCard = ({
    comment,
    isReply = false,
    currentUser,
    replyTo,
    setReplyTo,
    replyContent,
    setReplyContent,
    handlePostReply,
    handleUpdateComment,
    handleDeleteComment,
    handleDeleteThread,
    submitting,
    setError
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const isOwner = currentUser?.uid === comment.userId;
    const isAdmin = currentUser?.role === 'superadmin' || currentUser?.role === 'admin';

    const onSaveEdit = async (e) => {
        e.preventDefault();
        await handleUpdateComment(comment.id, editContent);
        setIsEditing(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: isReply ? 20 : 0 }}
            animate={{ opacity: 1, x: 0 }}
            className={`comment-card ${isReply ? 'reply-card' : ''}`}
        >
            <div className="comment-header">
                <div className="user-info">
                    <div className="user-avatar">
                        <User size={16} />
                    </div>
                    <span className="user-name">{comment.userName}</span>
                </div>
                {isAdmin && !isReply && (
                    <button
                        className="btn-admin-delete-thread"
                        onClick={() => {
                            console.log("Delete Thread clicked for:", comment.id);
                            handleDeleteThread(comment.id, comment.replies);
                        }}
                        disabled={submitting}
                        title="Delete Entire Thread"
                    >
                        <Trash2 size={14} /> Delete Thread
                    </button>
                )}
                <div className="comment-meta">
                    <span className="comment-date">
                        {comment.timestamp?.toDate().toLocaleDateString() || 'Just now'}
                        {comment.lastEdited && <span className="edited-tag"> (edited)</span>}
                    </span>
                    {(isOwner || isAdmin) && (
                        <div className="comment-actions">
                            <button className="action-icon" onClick={() => setIsEditing(!isEditing)} title="Edit">
                                <Edit2 size={14} />
                            </button>
                            <button className="action-icon delete" onClick={() => handleDeleteComment(comment.id)} title="Delete">
                                <Trash2 size={14} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="comment-body">
                <AnimatePresence mode="wait">
                    {isEditing ? (
                        <motion.form
                            key="edit-form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="edit-form"
                            onSubmit={onSaveEdit}
                        >
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                disabled={submitting}
                                autoFocus
                            />
                            <div className="edit-actions">
                                <button type="button" className="action-btn cancel" onClick={() => setIsEditing(false)}>
                                    <X size={14} /> Cancel
                                </button>
                                <button type="submit" className="action-btn save" disabled={submitting || !editContent.trim()}>
                                    <Check size={14} /> Save
                                </button>
                            </div>
                        </motion.form>
                    ) : (
                        <motion.div
                            key="comment-content"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="comment-content"
                        >
                            {comment.content}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {!isReply && !isEditing && (
                <button
                    className="reply-btn"
                    onClick={() => {
                        setReplyTo(replyTo === comment.id ? null : comment.id);
                        setError(null);
                    }}
                >
                    <Reply size={14} /> Reply
                </button>
            )}

            <AnimatePresence>
                {replyTo === comment.id && (
                    <motion.form
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="reply-form"
                        onSubmit={(e) => handlePostReply(e, comment.id)}
                    >
                        <textarea
                            placeholder="Write a reply..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            disabled={submitting}
                            autoFocus
                        />
                        <button type="submit" className="btn-send" disabled={submitting || !replyContent.trim()}>
                            <Send size={16} />
                        </button>
                    </motion.form>
                )}
            </AnimatePresence>

            {comment.replies && comment.replies.length > 0 && (
                <div className="replies-container">
                    {comment.replies.map(reply => (
                        <CommentCard
                            key={reply.id}
                            comment={reply}
                            isReply={true}
                            currentUser={currentUser}
                            replyTo={replyTo}
                            setReplyTo={setReplyTo}
                            replyContent={replyContent}
                            setReplyContent={setReplyContent}
                            handlePostReply={handlePostReply}
                            handleUpdateComment={handleUpdateComment}
                            handleDeleteComment={handleDeleteComment}
                            handleDeleteThread={handleDeleteThread}
                            submitting={submitting}
                            setError={setError}
                        />
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default CommentSection;
