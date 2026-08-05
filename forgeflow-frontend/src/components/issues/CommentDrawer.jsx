import { useState } from "react";

export default function CommentDrawer({
  open,
  onClose,
  issue,
  comments,
  loading,
  onAddComment,
  onReply,
  onEdit,
  onDelete,

  editingCommentId,
  editingContent,
  setEditingContent,
  onSaveComment,
  onCancelEdit,

  replyingToCommentId,
  replyContent,
  setReplyContent,
  onSubmitReply,
  onCancelReply,
})  {
  const [commentText, setCommentText] = useState("");

  if (!open) return null;

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    onAddComment(commentText);
    setCommentText("");
  };

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        aria-hidden="true"
        className="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-40 fade-in"
      ></div>

      {/* Comment Drawer Container */}
      <div className="fixed top-0 right-0 h-full w-[420px] bg-white shadow-2xl z-50 rounded-l-xl drawer-slide-in flex flex-col border-l border-slate-200">
        {/* Header Section */}
        <div className="flex-shrink-0 p-4 border-b border-slate-200 flex items-start justify-between bg-white rounded-tl-xl">
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[13px] leading-[18px] text-slate-500 bg-slate-100 px-2 py-[2px] rounded">
                  {issue?.id}
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-slate-500 hover:text-slate-900 transition-colors p-[2px] rounded hover:bg-slate-100"
              >
                <span className="material-symbols-outlined text-[20px]" data-icon="close">
                  close
                </span>
              </button>
            </div>

            <h2 className="text-lg font-semibold leading-7 tracking-[-0.01em] text-slate-900 mt-1">
              {issue?.title}
            </h2>

            <div className="flex flex-wrap items-center gap-1 mt-1">
              <span className="inline-flex items-center gap-1 px-2 py-[2px] rounded-full border border-slate-200 bg-slate-50 text-xs font-semibold tracking-[0.02em] leading-4 text-slate-500">
                <span className="w-[8px] h-[8px] rounded-full bg-blue-600"></span>
                {issue?.type}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-[2px] rounded-full border border-slate-200 bg-slate-50 text-xs font-semibold tracking-[0.02em] leading-4 text-orange-700">
                <span className="material-symbols-outlined text-[14px]" data-icon="keyboard_double_arrow_up">
                  keyboard_double_arrow_up
                </span>
                {issue?.priority}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-[2px] rounded-full border border-slate-200 bg-blue-100 text-xs font-semibold tracking-[0.02em] leading-4 text-slate-600">
                <span className="material-symbols-outlined text-[14px]" data-icon="progress_activity">
                  progress_activity
                </span>
                {issue?.status}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 bg-slate-50 flex flex-col gap-6">
          {loading ? (
            <div className="flex flex-col gap-4 animate-pulse mt-8">
              <div className="flex gap-2">
                <div className="w-[32px] h-[32px] rounded-full bg-slate-200"></div>
                <div className="flex-1 space-y-2 py-[4px]">
                  <div className="h-[14px] bg-slate-200 rounded w-1/3"></div>
                  <div className="h-[60px] bg-slate-200 rounded w-full"></div>
                </div>
              </div>
            </div>
          ) : comments && comments.length > 0 ? (
            <div className="flex flex-col gap-4">
              {comments.map((comment) =>
                comment.type === "activity" ? (
                  // System Activity Entry
                  <div key={comment.id} className="group flex gap-2 relative mt-4">
                    <div className="flex-shrink-0 z-10 pt-[4px]">
                      <span
                        className="material-symbols-outlined text-[20px] text-slate-400 p-[6px] bg-slate-100 rounded-full border border-slate-200"
                        data-icon="history"
                      >
                        history
                      </span>
                    </div>
                    <div className="flex-1 flex flex-col justify-center min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm leading-5 tracking-[-0.005em] text-slate-500">
                          <span className="text-xs font-semibold tracking-[0.02em] leading-4 text-slate-900">
                            {comment.author?.name}
                          </span>{" "}
                          {comment.activityText}
                        </span>
                        <div className="flex items-center gap-2">

    <span className="text-[13px] leading-[18px] text-slate-500 flex-shrink-0">
        {new Date(comment.createdAt).toLocaleDateString()}
    </span>

    {comment.editedAt && (
        <span className="text-[11px] text-slate-400 italic">
            Edited
        </span>
    )}

</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Comment Card
                  <div key={comment.id} className="group flex gap-2 relative">
                    <div className="absolute left-[15px] top-[32px] bottom-[-16px] w-[2px] bg-slate-200 group-last:hidden"></div>
                    <div className="flex-shrink-0 z-10">
                      <div className="w-[32px] h-[32px] rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
    {comment.author?.name?.charAt(0).toUpperCase()}
</div>
                    </div>
                    <div className="flex-1 flex flex-col gap-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <div className="flex items-baseline gap-2 min-w-0">
                          <span className="text-xs font-semibold tracking-[0.02em] leading-4 text-slate-900 truncate">
                            {comment.author?.name}
                          </span>
                          <span className="text-[13px] leading-[18px] text-slate-500 flex-shrink-0">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                          {comment.editedAt !== null && (
        <span className="text-[11px] italic text-blue-600 font-medium">
            (Edited)
        </span>
    )}
                        </div>
                        {/* Hover Actions */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white border border-slate-200 rounded px-2 py-[2px] shadow-sm -mt-[4px]">

    <button
    onClick={() => onReply(comment.id)}
    className="text-slate-500 hover:text-blue-600 transition-colors"
>
    <span className="text-xs font-semibold">
        Reply
    </span>
</button>

    <span className="w-[1px] h-[12px] bg-slate-200"></span>

    <button
        onClick={() => onEdit(comment)}
        className="text-slate-500 hover:text-blue-600 transition-colors"
    >
        <span className="text-xs font-semibold">
            Edit
        </span>
    </button>

    <span className="w-[1px] h-[12px] bg-slate-200"></span>

    <button
        onClick={() => onDelete(comment.id)}
        className="text-red-600 hover:text-red-700 transition-colors"
    >
        <span className="text-xs font-semibold">
            Delete
        </span>
    </button>

</div>

                      </div>
{editingCommentId === comment.id ? (

<div className="bg-white border border-slate-200 rounded p-2 shadow-sm">

<textarea
    value={editingContent}
    onChange={(e) =>
        setEditingContent(e.target.value)
    }
    rows={3}
    className="w-full border rounded p-2 text-sm resize-none"
/>

<div className="flex justify-end gap-2 mt-2">

<button
    onClick={onCancelEdit}
    className="px-3 py-1 text-sm rounded border"
>
Cancel
</button>

<button
    onClick={onSaveComment}
    className="px-3 py-1 text-sm rounded bg-blue-600 text-white"
>
Save
</button>

</div>

</div>

) : (

<div className="text-sm leading-5 tracking-[-0.005em] text-slate-900 bg-white border border-slate-200 rounded p-2 shadow-sm leading-relaxed whitespace-pre-wrap">

{comment.content}

</div>

)}

                      {/* Nested Replies */}
                      {comment.replies &&
                        comment.replies.map((reply) => (
                          <div key={reply.id} className="mt-2 group/reply flex gap-2 relative">
                            <div className="flex-shrink-0 z-10">
                              <div className="w-[24px] h-[24px] rounded-full bg-slate-700 text-white flex items-center justify-center text-[10px] font-semibold">
    {reply.author?.name?.charAt(0).toUpperCase()}
</div>
                            </div>
                            <div className="flex-1 flex flex-col gap-1 min-w-0">
                              <div className="flex items-baseline justify-between gap-2">
                                <div className="flex items-baseline gap-2 min-w-0">
                                  <span className="text-xs font-semibold tracking-[0.02em] leading-4 text-slate-900 truncate">
                                    {reply.author?.name}
                                  </span>
                                  <div className="flex items-center gap-2">

    <span className="text-[13px] leading-[18px] text-slate-500 flex-shrink-0">
        {new Date(reply.createdAt).toLocaleString()}
    </span>

    {reply.editedAt && (
        <span className="text-[11px] text-slate-400 italic">
            Edited
        </span>
    )}

</div>
                                </div>
                                <div className="opacity-0 group-hover/reply:opacity-100 transition-opacity flex items-center gap-1 bg-white border border-slate-200 rounded px-1 py-[2px] shadow-sm -mt-[2px]">
                                  <button
                                    onClick={() => onDelete(reply.id)}
                                    className="text-slate-500 hover:text-red-700 transition-colors p-[2px]"
                                  >
                                    <span className="material-symbols-outlined text-[16px]" data-icon="delete">
                                      delete
                                    </span>
                                  </button>
                                </div>
                              </div>
                              <div className="text-sm leading-5 tracking-[-0.005em] text-slate-900 bg-white border border-slate-200 rounded p-2 shadow-sm">
                                {reply.content}
                              </div>
                            </div>
                          </div>
                        ))}

                      {/* Inline Reply Composer */}
                      {replyingToCommentId === comment.id && (
    <div className="mt-2 flex flex-col gap-2 pl-8">

        <div className="relative">

            <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded p-2 text-sm leading-5 tracking-[-0.005em] text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none resize-none custom-scrollbar"
                placeholder="Write a reply..."
                rows={2}
            />

        </div>

        <div className="flex items-center justify-end gap-2">

            <button
                onClick={onCancelReply}
                className="text-xs font-semibold tracking-[0.02em] leading-4 text-slate-500 hover:text-slate-900 px-2 py-1 rounded transition-colors"
            >
                Cancel
            </button>

            <button
                onClick={onSubmitReply}
                className="text-xs font-semibold tracking-[0.02em] leading-4 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition-colors shadow-sm"
            >
                Reply
            </button>

        </div>

    </div>
)}
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            // Empty State
            <div className="flex flex-col items-center justify-center py-8 mt-8 text-center">
              <span className="material-symbols-outlined text-[48px] text-slate-200 mb-2" data-icon="chat_bubble">
                chat_bubble
              </span>
              <p className="text-lg font-semibold leading-7 tracking-[-0.01em] text-slate-500">No comments yet</p>
              <p className="text-[13px] leading-[18px] text-slate-400 mt-1 max-w-[200px]">
                Be the first to share your thoughts on this issue.
              </p>
            </div>
          )}
        </div>

        {/* Footer / Comment Composer */}
        <div className="flex-shrink-0 p-4 border-t border-slate-200 bg-white rounded-bl-xl">
          <div className="flex flex-col gap-2">
            <div className="relative">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                maxLength={500}
                className="w-full bg-white border border-slate-200 rounded p-2 text-sm leading-5 tracking-[-0.005em] text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none resize-none custom-scrollbar pb-[28px]"
                placeholder="Add a comment... Use @ to mention"
                rows="3"
              ></textarea>
              <div className="absolute bottom-2 right-2 flex items-center gap-2">
                <span className="text-[13px] leading-[18px] text-slate-400">
                  {commentText.length} / 500
                </span>
              </div>
              <div className="absolute bottom-2 left-2 flex items-center gap-1">
                <button className="text-slate-500 hover:text-slate-900 p-[2px] rounded hover:bg-slate-100 transition-colors">
                  <span className="material-symbols-outlined text-[20px]" data-icon="format_bold">
                    format_bold
                  </span>
                </button>
                <button className="text-slate-500 hover:text-slate-900 p-[2px] rounded hover:bg-slate-100 transition-colors">
                  <span className="material-symbols-outlined text-[20px]" data-icon="link">
                    link
                  </span>
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleAddComment}
                className="text-xs font-semibold tracking-[0.02em] leading-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-1"
              >
                Comment
                <span className="material-symbols-outlined text-[16px]" data-icon="send">
                  send
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}