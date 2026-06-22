import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  getPosts,
  createPost,
  upvotePost,
  downvotePost,
  getComments,
  addComment,
} from '../features/forum/forumSlice';
import Spinner from '../components/Spinner';

const Forum = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { posts, comments, isLoading, isError, message } = useSelector(
    (state) => state.forum
  );

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [postData, setPostData] = useState({
    title: '',
    content: '',
    category: '',
    tags: '',
  });
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    dispatch(getPosts());
  }, [dispatch, isError, message]);

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login first');
      return;
    }
    const tagsArray = postData.tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t);
    dispatch(createPost({ ...postData, tags: tagsArray }));
    setShowCreateModal(false);
    setPostData({ title: '', content: '', category: '', tags: '' });
    toast.success('Post created!');
  };

  const handleViewComments = (post) => {
    setSelectedPost(post);
    dispatch(getComments(post._id));
    setShowCommentsModal(true);
  };

  const handleAddComment = () => {
    if (!user) {
      toast.error('Please login first');
      return;
    }
    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }
    dispatch(addComment({ postId: selectedPost._id, content: newComment }));
    setNewComment('');
    toast.success('Comment added!');
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="bi bi-chat-dots me-2"></i>Discussion Forum
        </h2>
        {user && (
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <i className="bi bi-plus-lg me-2"></i>Create Post
          </button>
        )}
      </div>

      {/* Posts List */}
      <div className="row g-4">
        {posts.map((post) => (
          <div key={post._id} className="col-12">
            <div className="card card-hover">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="card-title mb-0">{post.title}</h5>
                  <span className="badge bg-primary">{post.category}</span>
                </div>
                <p className="card-text">{post.content}</p>
                {post.tags && post.tags.length > 0 && (
                  <div className="mb-3">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="badge bg-secondary me-1"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-3">
                    <small className="text-muted">
                      By: {post.author?.name}
                    </small>
                    <div className="d-flex align-items-center gap-2">
                      <button
                        className={`btn btn-sm ${
                          user && post.upvotes?.includes(user._id)
                            ? 'btn-primary'
                            : 'btn-outline-primary'
                        }`}
                        onClick={() => dispatch(upvotePost(post._id))}
                      >
                        <i className="bi bi-arrow-up"></i> {post.upvotes?.length || 0}
                      </button>
                      <button
                        className={`btn btn-sm ${
                          user && post.downvotes?.includes(user._id)
                            ? 'btn-danger'
                            : 'btn-outline-danger'
                        }`}
                        onClick={() => dispatch(downvotePost(post._id))}
                      >
                        <i className="bi bi-arrow-down"></i> {post.downvotes?.length || 0}
                      </button>
                    </div>
                  </div>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => handleViewComments(post)}
                  >
                    <i className="bi bi-chat me-1"></i>Comments
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-inbox display-1 text-muted"></i>
          <h4 className="mt-3">No posts yet. Be the first to post!</h4>
        </div>
      )}

      {/* Create Post Modal */}
      {showCreateModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create New Post</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCreateModal(false)}
                ></button>
              </div>
              <form onSubmit={handleCreatePost}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={postData.title}
                      onChange={(e) =>
                        setPostData({ ...postData, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Content</label>
                    <textarea
                      className="form-control"
                      rows="6"
                      required
                      value={postData.content}
                      onChange={(e) =>
                        setPostData({ ...postData, content: e.target.value })
                      }
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      required
                      value={postData.category}
                      onChange={(e) =>
                        setPostData({ ...postData, category: e.target.value })
                      }
                    >
                      <option value="">Select Category</option>
                      <option value="General">General</option>
                      <option value="Academics">Academics</option>
                      <option value="Help">Help</option>
                      <option value="Events">Events</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Tags (comma separated)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={postData.tags}
                      onChange={(e) =>
                        setPostData({ ...postData, tags: e.target.value })
                      }
                      placeholder="e.g., exam, help, study"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Comments Modal */}
      {showCommentsModal && selectedPost && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Comments on: {selectedPost.title}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCommentsModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {user && (
                  <div className="mb-4">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                      <button
                        className="btn btn-primary"
                        onClick={handleAddComment}
                      >
                        Post
                      </button>
                    </div>
                  </div>
                )}
                <div className="list-group">
                  {comments.map((comment) => (
                    <div key={comment._id} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">{comment.author?.name}</h6>
                          <p className="mb-1">{comment.content}</p>
                          {comment.replies && comment.replies.length > 0 && (
                            <div className="ms-4 mt-2">
                              {comment.replies.map((reply, idx) => (
                                <div key={idx} className="border-start ps-3 mb-2">
                                  <small className="fw-bold">{reply.author?.name}</small>
                                  <p className="mb-0 small">{reply.content}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <small className="text-muted">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
                {comments.length === 0 && (
                  <div className="text-center py-3">
                    <p className="text-muted mb-0">No comments yet. Be the first!</p>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCommentsModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forum;
