import { useState } from 'react'

export default function AddTaskForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [recurring, setRecurring] = useState('')
  const [expanded, setExpanded] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    onAdd({ title: title.trim(), dueDate, recurring })
    setTitle('')
    setDueDate('')
    setRecurring('')
    setExpanded(false)
  }

  return (
    <form className="add-task-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Add a new task…"
          className="task-input"
          onFocus={() => setExpanded(true)}
        />
        <button type="submit" className="add-btn">Add</button>
      </div>
      {expanded && (
        <div className="form-extras">
          <label className="extra-label">
            Due date
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="extra-input"
            />
          </label>
          <label className="extra-label">
            Repeats
            <select
              value={recurring}
              onChange={e => setRecurring(e.target.value)}
              className="extra-input"
            >
              <option value="">Never</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </label>
          <button type="button" className="cancel-btn" onClick={() => setExpanded(false)}>
            Cancel
          </button>
        </div>
      )}
    </form>
  )
}
