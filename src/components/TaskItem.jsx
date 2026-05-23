function dueDateStatus(dateStr) {
  if (!dateStr) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dateStr + 'T00:00:00')
  const diff = Math.floor((due - today) / 86400000)
  if (diff < 0) return 'overdue'
  if (diff === 0) return 'today'
  return 'upcoming'
}

function fmtDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function TaskItem({ task, onToggle, onDelete }) {
  const status = task.due_date ? dueDateStatus(task.due_date) : null

  return (
    <li className={`task-item${task.effectivelyCompleted ? ' completed' : ''}`}>
      <button
        className={`checkbox${task.effectivelyCompleted ? ' checked' : ''}`}
        onClick={() => onToggle(task)}
        aria-label={task.effectivelyCompleted ? 'Mark incomplete' : 'Mark complete'}
      >
        {task.effectivelyCompleted && '✓'}
      </button>

      <div className="task-body">
        <span className="task-title">{task.title}</span>
        <div className="task-badges">
          {task.due_date && !task.effectivelyCompleted && (
            <span className={`badge badge-${status}`}>
              {status === 'overdue' ? '⚠ Overdue'
                : status === 'today' ? '📅 Today'
                : `📅 ${fmtDate(task.due_date)}`}
            </span>
          )}
          {task.recurring && (
            <span className="badge badge-recurring">
              🔁 {task.recurring === 'daily' ? 'Daily' : 'Weekly'}
            </span>
          )}
        </div>
      </div>

      <button
        className="delete-btn"
        onClick={() => onDelete(task.id)}
        aria-label="Delete task"
      >
        ×
      </button>
    </li>
  )
}
