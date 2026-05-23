import TaskItem from './TaskItem'

export default function TaskList({ title, tasks, onToggle, onDelete, emptyMessage, dimmed }) {
  return (
    <section className={`task-list${dimmed ? ' dimmed' : ''}`}>
      <h2 className="list-title">
        {title}
        {tasks.length > 0 && <span className="count-badge">{tasks.length}</span>}
      </h2>
      {tasks.length === 0 ? (
        <p className="empty-msg">{emptyMessage}</p>
      ) : (
        <ul>
          {tasks.map(task => (
            <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
          ))}
        </ul>
      )}
    </section>
  )
}
