import { buildHierarchyTree } from "../../utils/buildHierarchyTree";
import CommentDrawer from "./CommentDrawer";
import React, { useMemo, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";
import { getIssueComments ,createComment,updateComment,deleteComment} from "../../services/comments.service";

const Icon = ({ name, className = "", filled = false, style = {} }) => (
  <span
    className={`material-symbols-outlined ${className}`}
    style={{
      fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 20`,
      ...style,
    }}
  >
    {name}
  </span>
);


const ISSUE_TYPE_CONFIG = {
  epic: { icon: "stars", color: "text-purple-600" },
  story: { icon: "bookmark", color: "text-emerald-600" },
  task: { icon: "check_box", color: "text-blue-500" },
  bug: { icon: "pest_control", color: "text-red-600" },
  improvement: { icon: "arrow_upward", color: "text-amber-600" },
};

const PRIORITY_STYLES = {
  critical: "bg-red-100 text-red-700",
  high: "bg-red-100 text-red-700",
  medium: "bg-blue-100 text-blue-700",
  low: "bg-slate-100 text-slate-600",
};

const STATUS_STYLES = {
  "in progress": "bg-blue-600 text-white shadow-sm",
  todo: "bg-slate-100 text-slate-600",
  backlog: "border border-slate-200 text-slate-600",
  done: "bg-emerald-600 text-white",
};

function getIssueTypeConfig(issueType) {
  return (
    ISSUE_TYPE_CONFIG[(issueType || "").toLowerCase()] || {
      icon: "task_alt",
      color: "text-slate-600",
    }
  );
}

function getPriorityClass(priority) {
  return PRIORITY_STYLES[(priority || "").toLowerCase()] || PRIORITY_STYLES.low;
}

function getStatusClass(status) {
  return STATUS_STYLES[(status || "").toLowerCase()] || STATUS_STYLES.todo;
}

function Avatar({ assignee, size = "w-7 h-7", textSize = "text-[11px]" }) {
  if (!assignee) {
    return (
      <div
        className={`${size} rounded-full bg-slate-100 text-slate-600 flex items-center justify-center ${textSize} font-bold border border-slate-200`}
      >
        ?
      </div>
    );
  }
  return (
    <div
      className={`${size} rounded-full bg-blue-600 text-white flex items-center justify-center ${textSize} font-bold ring-2 ring-white`}
      title={assignee.name}
    >
      {assignee.initials}
    </div>
  );
}

// ==================================================
// MAIN COMPONENT
// ==================================================

export default function IssueWorkspace({
  view = "table",
  issues = [],
  kanbanColumns = [],
  loading = false,
  error = null,

  expandedIssues = new Set(),
  toggleExpand = () => {},
  onDragEnd = () => {},
onBacklogDragEnd = () => {},
  onIssueClick = () => {},
  onStatusChange = () => {},
  onAddChild = () => {},

  onExpandAll = () => {},
  onCollapseAll = () => {},
  onBulkActions = () => {},
  onGroupBy = () => {},
  onColumnVisibility = () => {},
  onDensityChange = () => {},

  searchValue = "",
  onSearchChange = () => {},
}) {
  const hierarchyTree = useMemo(
    () => buildHierarchyTree(issues),
    [issues]
);
const [commentDrawerOpen, setCommentDrawerOpen] = useState(false);
const [selectedIssue, setSelectedIssue] = useState(null);
const [comments, setComments] = useState([]);
const [commentsLoading, setCommentsLoading] = useState(false);
const [editingCommentId, setEditingCommentId] =useState(null);
const [editingContent, setEditingContent] =useState("");
const [replyingToCommentId, setReplyingToCommentId] =useState(null);
const [replyContent, setReplyContent] = useState("");
const handleReplySubmit = async () => {

    if (!replyContent.trim()) return;

    await createComment(
        selectedIssue.id,
        {
            content: replyContent,
            parentCommentId: replyingToCommentId,
        }
    );

    await loadComments(selectedIssue.id);

    setReplyContent("");

    setReplyingToCommentId(null);

};
const handleEditComment = (comment) => {

    setEditingCommentId(comment.id);

    setEditingContent(comment.content);

};
const handleReplyComment = (
    commentId
) => {

    setReplyingToCommentId(commentId);

};
const handleSaveComment = async () => {

    await updateComment(
        editingCommentId,
        {
            content: editingContent
        }
    );

    await loadComments(selectedIssue.id);

    setEditingCommentId(null);

    setEditingContent("");

};
const handleDeleteComment = async (commentId) => {

    await deleteComment(commentId);

    await loadComments(selectedIssue.id);

};
const handleOpenComments = async (issue) => {

    setSelectedIssue(issue);

    setCommentDrawerOpen(true);

    setCommentsLoading(true);

    try {
            await loadComments(issue.id);

    } catch (error) {

        console.error(
            "Failed to load comments",
            error
        );

    } finally {

        setCommentsLoading(false);

    }

};
const handleAddComment = async (content) => {

    if (!content.trim()) return;

    await createComment(
        selectedIssue.id,
        {
            content,
            parentCommentId:
            replyingToCommentId
        }
    );

    await loadComments(selectedIssue.id);
    setReplyingToCommentId(null);
}; 
const loadComments = async (issueId) => {

    setCommentsLoading(true);

    try {

        const issueComments =
            await getIssueComments(issueId);

        setComments(issueComments);

        return issueComments;

    } catch (error) {

        console.error(error);

        setComments([]);

    } finally {

        setCommentsLoading(false);

    }

};
 // ==================================================
  // TOOLBAR
  // ==================================================
  function renderToolbar() {
    return (
      <div className="px-6 py-2 border-b border-slate-200 bg-white flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-2">
          <button
            onClick={onExpandAll}
            className="flex items-center px-3 py-1.5 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded transition-colors group"
          >
            <Icon name="expand" className="mr-1.5 !text-lg" />
            Expand All
          </button>
          <button
            onClick={onCollapseAll}
            className="flex items-center px-3 py-1.5 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded transition-colors group"
          >
            <Icon name="collapse" className="mr-1.5 !text-lg" />
            Collapse All
          </button>
          <div className="h-6 w-px bg-slate-200 mx-1" />
          <button
            onClick={onBulkActions}
            className="flex items-center px-3 py-1.5 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded border border-transparent hover:border-slate-200"
          >
            Bulk Actions
            <Icon name="arrow_drop_down" className="ml-1" />
          </button>
          <button
            onClick={onGroupBy}
            className="flex items-center px-3 py-1.5 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded border border-transparent hover:border-slate-200"
          >
            Group By
            <Icon name="arrow_drop_down" className="ml-1" />
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative group">
            <Icon
              name="search"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-600 !text-lg"
            />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search within issues..."
              className="pl-9 pr-4 py-1.5 bg-slate-50 border border-transparent focus:border-primary focus:bg-white focus:ring-0 rounded-lg text-sm w-64 transition-all"
            />
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <button
            onClick={onColumnVisibility}
            className="p-2 text-slate-600 hover:bg-slate-50 rounded transition-colors"
            title="Column Visibility"
          >
            <Icon name="view_column" />
          </button>
          <button
            onClick={onDensityChange}
            className="p-2 text-slate-600 hover:bg-slate-50 rounded transition-colors"
            title="Density"
          >
            <Icon name="density_medium" />
          </button>
        </div>
      </div>
    );
  }

  // ==================================================
  // TABLE / EXPLORER VIEW
  // ==================================================
  function renderTableHeader() {
    return (
      <thead className="sticky-header shadow-sm">
        <tr className="text-slate-600 font-semibold text-xs border-b border-slate-200 uppercase tracking-tight">
          <th className="py-3 px-4 w-12 text-center bg-white font-semibold">#</th>
          <th className="py-3 px-4 min-w-[400px] bg-white font-semibold">Key / Title</th>
          <th className="py-3 px-4 w-32 bg-white font-semibold">Assignee</th>
          <th className="py-3 px-4 w-32 bg-white font-semibold">Priority</th>
          <th className="py-3 px-4 w-40 bg-white font-semibold">Status</th>
          <th className="py-3 px-4 w-32 bg-white font-semibold">Due Date</th>
          <th className="py-3 px-4 w-28 text-right bg-white font-semibold">Children</th>
          <th className="py-3 px-4 w-16 bg-white" />
        </tr>
      </thead>
    );
  }

  // depth-aware hierarchy connector lines rendered in the first cell
  function renderHierarchyLines(depth) {
    if (depth === 0) return null;
    const lines = [];
    for (let i = 0; i < depth; i++) {
      lines.push(
        <div
          key={`v-${i}`}
          className="hierarchy-line-v"
          style={{ left: 14 + i * 24 }}
        />
      );
    }
    lines.push(
      <div
        key="h"
        className="hierarchy-line-h"
        style={{ left: 14 + (depth - 1) * 24 }}
      />
    );
    return lines;
  }

  function renderIssueNode(node, depth = 0) {
    const isExpanded = expandedIssues.has(node.id);
    const typeConfig = getIssueTypeConfig(node.issue_type);
    const isTopLevel = depth === 0;
    const rowPadding = depth === 0 ? "py-4" : depth === 1 ? "py-3" : "py-2.5";
    const indent = depth * 24;

    return (
      <React.Fragment key={node.id}>
        <tr
          onClick={() => onIssueClick(node)}
          className={`group hover:bg-slate-50 transition-colors relative cursor-pointer ${
            isTopLevel ? "" : "bg-white"
          }`}
        >
          <td className={`${rowPadding} px-4 align-middle relative`}>
            {renderHierarchyLines(depth)}
            {node.hasChildren ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(node.id);
                }}
                style={{ marginLeft: isTopLevel ? 0 : indent + 6 }}
                className={`flex items-center justify-center rounded text-slate-600 relative z-10 hover:bg-slate-100 ${
                  isTopLevel
                    ? "w-6 h-6"
                    : "w-5 h-5 bg-white border border-slate-200 shadow-sm"
                }`}
              >
                <Icon
                  name={isExpanded ? "expand_more" : "chevron_right"}
                  className={isTopLevel ? "" : "!text-lg"}
                />
              </button>
            ) : (
              <div style={{ marginLeft: indent + (isTopLevel ? 0 : 6) }} className="w-5 h-5" />
            )}
          </td>

          <td className={`${rowPadding} px-4`}>
            <div
              className="flex items-center space-x-3"
              style={{ marginLeft: isTopLevel ? 0 : indent + 24 }}
            >
              <Icon
                name={typeConfig.icon}
                filled
                className={`${typeConfig.color} ${
                  isTopLevel ? "!text-[22px]" : depth === 1 ? "!text-xl" : "!text-[18px]"
                }`}
              />
              <span className="font-code text-primary font-bold text-sm">
                {node.issue_key}
              </span>
              <span
                className={
                  isTopLevel
                    ? "font-semibold text-slate-900 text-lg"
                    : depth === 1
                    ? "text-slate-900 font-medium"
                    : "text-slate-600 text-sm"
                }
              >
                {node.title}
              </span>
            </div>
          </td>

          <td className={`${rowPadding} px-4`}>
            <Avatar assignee={node.assigned_to} />
          </td>

          <td className={`${rowPadding} px-4`}>
            <span
              className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase ${getPriorityClass(
                node.priority
              )}`}
            >
              {node.priority}
            </span>
          </td>

          <td className={`${rowPadding} px-4`}>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                node.status
              )}`}
            >
              {node.status}
            </span>
          </td>

          <td className={`${rowPadding} px-4 text-sm text-slate-600`}>
            {node.due_date}
          </td>

          <td className={`${rowPadding} px-4 text-right text-sm font-semibold text-slate-600`}>
            {node.children ? node.children.length : 0}
          </td>

          <td className={`${rowPadding} px-4 text-center`}>
            <div
              onClick={(e) => e.stopPropagation()}
              className="opacity-0 group-hover:opacity-100 flex items-center justify-end space-x-1"
            >
              <button
    onClick={() => handleOpenComments(node)}
    className="p-1 hover:bg-white rounded shadow-sm text-primary"
    title="Comments"
>
    <Icon
        name="chat_bubble"
        className="!text-lg"
    />
</button>
              <button className="p-1 hover:bg-white rounded shadow-sm text-slate-600" title="More">
                <Icon name="more_vert" className="!text-lg" />
              </button>
            </div>
          </td>
        </tr>

        {isExpanded &&
          node.hasChildren &&
          node.children.map((child) => renderIssueNode(child, depth + 1))}
      </React.Fragment>
    );
  }

  function renderExplorer() {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-24 text-slate-600 text-sm">
          Loading issues...
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex items-center justify-center py-24 text-error text-sm">
          {error}
        </div>
      );
    }
    if (!hierarchyTree || hierarchyTree.length === 0) {
      return (
        <div className="flex items-center justify-center py-24 text-slate-600 text-sm">
          No issues found.
        </div>
      );
    }
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse table-fixed">
          {renderTableHeader()}
          <tbody className="divide-y divide-slate-200">
            {hierarchyTree.map((node) => renderIssueNode(node, 0))}
          </tbody>
        </table>
      </div>
    );
  }

  // ==================================================
  // KANBAN VIEW
  // ==================================================
  function renderKanbanCard(card) {
    const typeConfig = getIssueTypeConfig(card.issue_type);
    return (
      <div
        key={card.id}
        onClick={() => onIssueClick(card)}
        className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer border-t-4 border-t-slate-300"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Icon name={typeConfig.icon} filled className={`${typeConfig.color} !text-sm`} />
            <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wide">
              {card.issue_type}
            </span>
            <span className="font-code text-[11px] font-bold text-primary">{card.issue_key}</span>
          </div>
          <span
            className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${getPriorityClass(
              card.priority
            )}`}
          >
            {card.priority}
          </span>
        </div>

        <h4 className="text-base font-semibold text-slate-900 mb-4 leading-tight">
          {card.title}
        </h4>

        <div className="space-y-1.5 mb-4">
          {card.parent_story && (
            <div className="flex items-center text-[10px] text-slate-600 font-medium bg-white px-2 py-1 rounded border border-slate-100">
              <Icon name="bookmark" className="!text-xs mr-1 text-emerald-600" />
              Parent: {card.parent_story.key} {card.parent_story.title}
            </div>
          )}
          {card.parent_epic && (
            <div className="flex items-center text-[10px] text-slate-600 font-medium bg-white px-2 py-1 rounded border border-slate-100">
              <Icon name="stars" className="!text-xs mr-1 text-purple-600" />
              Epic: {card.parent_epic.key} {card.parent_epic.title}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar assignee={card.assigned_to} size="w-6 h-6" textSize="text-[8px]" />
            <span className="text-[10px] text-slate-600">
              {card.assigned_to ? card.assigned_to.name : "Unassigned"}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-slate-600">
            <Icon name="attachment" className="!text-base" />
            <button
    onClick={(e) => {
        e.stopPropagation();
        handleOpenComments(card);
    }}
>
    <Icon
        name="chat_bubble_outline"
        className="!text-base"
    />
</button>
          </div>
        </div>
      </div>
    );
  }
function renderKanban() {

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-600 text-sm">
        Loading board...
      </div>
    );
  }

  if (!kanbanColumns || kanbanColumns.length === 0) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-600 text-sm">
        No projects found.
      </div>
    );
  }

  return (
<DragDropContext
    onDragEnd={onDragEnd}
>
    <div className="space-y-10">

      {kanbanColumns.map((project) => (

        <section
          key={project.projectName}
          className="space-y-4"
        >

          {/* Project Header */}

          <div className="px-6 pt-6">

            <h2 className="text-xl font-bold text-slate-900">

              {project.projectName}

            </h2>

          </div>

          {/* Project Board */}

          <div className="flex p-6 space-x-6 bg-slate-50 overflow-x-auto">

           {project.columns.map((column) => (

  <Droppable
    key={column.key}
    droppableId={`${project.projectName}-${column.key}`}
  >
    {(provided) => (

      <div
        ref={provided.innerRef}
        {...provided.droppableProps}
        className="kanban-column flex flex-col"
      >

        {/* Column Header */}

        <div className="flex items-center justify-between px-3 py-2 mb-2">

          <div className="flex items-center space-x-2">

            <h3 className="text-xs uppercase tracking-widest text-slate-600 font-bold">
              {column.title}
            </h3>

            <span
              className={`px-2 py-0.5 rounded text-xs font-bold ${column.countClass}`}
            >
              {column.issues.length}
            </span>

          </div>

          <button
            onClick={() => onAddChild(null, column.key)}
            className="text-slate-600 hover:text-primary"
          >
            <Icon name="add" />
          </button>

        </div>

        {/* Cards */}

        <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-1 pb-lg">

          {column.issues.length > 0 ? (

            column.issues.map((card, index) => (

  <Draggable
    key={card.id}
    draggableId={card.id}
    index={index}
  >
    {(provided, snapshot) => (

      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        {renderKanbanCard(card)}
      </div>

    )}
  </Draggable>

))

          ) : (

            <div className="text-[11px] text-slate-600 px-2 py-4 text-center">
              No issues
            </div>

          )}

          {provided.placeholder}

        </div>

      </div>

    )}
  </Droppable>

))}


          </div>

        </section>

      ))}

    </div>


</DragDropContext>
  );
}

  // ==================================================
  // BACKLOG VIEW
  // ==================================================
  function renderBacklogNode(node, depth = 0) {
    const isExpanded = expandedIssues.has(node.id);
    const typeConfig = getIssueTypeConfig(node.issue_type);
    const indent = depth * 24;

    return (
      <React.Fragment key={node.id}>
        <div
          onClick={() => onIssueClick(node)}
          className={`flex items-center hover:bg-slate-50 group cursor-pointer transition-colors relative ${
            depth === 0 ? "p-4" : "p-3.5"
          }`}
        >
          {depth > 0 && (
            <>
              <div
                className="absolute top-0 bottom-0 w-[2px] bg-slate-300"
                style={{ left: 24 + (depth - 1) * 24 }}
              />
              <div
                className="absolute top-1/2 h-[2px] w-6 bg-slate-300"
                style={{ left: 24 + (depth - 1) * 24 }}
              />
            </>
          )}

          {node.hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(node.id);
              }}
              className="text-slate-600 mr-3 opacity-0 group-hover:opacity-100 cursor-grab"
              style={{ marginLeft: indent + (depth > 0 ? 24 : 0) }}
            >
              <Icon name="drag_indicator" />
            </button>
          ) : (
            <span
              className="text-slate-600 mr-3 opacity-0 group-hover:opacity-100 cursor-grab"
              style={{ marginLeft: indent + (depth > 0 ? 24 : 0) }}
            >
              <Icon name="drag_indicator" />
            </span>
          )}

          <Icon name={typeConfig.icon} filled className={`${typeConfig.color} mr-4`} />
          <span
            className={`font-code text-primary text-sm w-20 ${
              depth === 0 ? "font-bold" : "font-medium"
            }`}
          >
            {node.issue_key}
          </span>
          <span
            className={`flex-1 truncate ${
              depth === 0
                ? "text-slate-900 font-semibold text-lg"
                : "text-slate-600 text-base"
            }`}
          >
            {node.title}
          </span>

          <div className="flex items-center space-x-4 ml-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddChild(node);
              }}
              className="opacity-0 group-hover:opacity-100 text-primary text-sm font-bold px-2 py-1 hover:bg-primary/5 rounded transition-all"
            >
              Add Child Issue
            </button>
            <span
              className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${getPriorityClass(
                node.priority
              )}`}
            >
              {node.priority}
            </span>
            <Avatar assignee={node.assigned_to} size="w-7 h-7" textSize="text-[10px]" />
            {node.hasChildren && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(node.id);
                }}
              >
                <Icon
                  name={isExpanded ? "expand_more" : "chevron_right"}
                  className="text-slate-600"
                />
              </button>
            )}
          </div>
        </div>

        {isExpanded &&
          node.hasChildren &&
          node.children.map((child) => renderBacklogNode(child, depth + 1))}
      </React.Fragment>
    );
  }

  function renderBacklog() {
    const totalCount = issues.length;
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="font-semibold text-xl text-slate-900">Backlog</h2>
            <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-600 border border-slate-200">
              {totalCount} Issues
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 text-slate-600 text-sm">
            Loading backlog...
          </div>
        ) : issues.length === 0 ? (
          <div className="flex items-center justify-center py-24 text-slate-600 text-sm">
            Backlog is empty.
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm divide-y divide-slate-200">
            {hierarchyTree.map((node) => renderBacklogNode(node, 0))}
          </div>
        )}

        <div
          onClick={() => onAddChild(null)}
          className="mt-6 border-2 border-dashed border-slate-200 rounded-xl p-4 flex items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer text-slate-600 group"
        >
          <Icon name="add" className="mr-2 group-hover:text-primary transition-colors" />
          <span className="text-sm font-bold uppercase tracking-widest group-hover:text-primary transition-colors">
            Add a new item
          </span>
        </div>
      </div>
    );
  }

  // ==================================================
  // ROOT RENDER
  // ==================================================
  return (
<>
    <div className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden">

        {renderToolbar()}

        <div className="w-full">

            <div className="overflow-auto">

                {view === "table" && renderExplorer()}
                {view === "kanban" && renderKanban()}
                {view === "backlog" && renderBacklog()}

            </div>

        </div>

    </div>
  <CommentDrawer
    open={commentDrawerOpen}
    onClose={() => setCommentDrawerOpen(false)}

    issue={selectedIssue}

    comments={comments}

    loading={commentsLoading}

    onAddComment={handleAddComment}

    onReply={handleReplyComment}

    onEdit={handleEditComment}

    onDelete={handleDeleteComment}

    editingCommentId={editingCommentId}

    editingContent={editingContent}

    setEditingContent={setEditingContent}

    onSaveComment={handleSaveComment}

    onCancelEdit={() => {
        setEditingCommentId(null);
        setEditingContent("");
    }}

    replyingToCommentId={replyingToCommentId}

    replyContent={replyContent}

    setReplyContent={setReplyContent}

    onSubmitReply={handleReplySubmit}

    onCancelReply={() => {
        setReplyingToCommentId(null);
        setReplyContent("");
    }}
/>
</>
);
}