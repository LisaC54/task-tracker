import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import AddTaskForm from './components/AddTaskForm'
import TaskList from './components/TaskList'
import './App.css'

function isEffectivelyCompleted(task) {
  if (!task.completed) return false
  if (!task.recurring) return true
  if (!task.completed_at) return task.completed

  const completedAt = new Date(task.completed_at)
  const now = new Date()

  if (task.recurring === 'daily') {
    return completedAt.toDateString() === now.toDateString()
  }
  if (task.recurring === 'weekly') {
    return (now - completedAt) / (1000 * 60 * 60 * 24) < 7
  }
  return task.completed
}

export default function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTasks()
  }, [])

  async function fetchTasks() {
    setLoading(true)
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) setError(error.message)
    else setTasks(data)
    setLoading(false)
  }

  async function addTask({ title, dueDate, recurring }) {
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ title, due_date: dueDate || null, recurring: recurring || null }])
      .select()

    if (error) { alert('Error adding task: ' + error.message); return }
    setTasks(prev => [data[0], ...prev])
  }

  async function toggleTask(task) {
    const nowDone = !isEffectivelyCompleted(task)
    const { data, error } = await supabase
      .from('tasks')
      .update({ completed: nowDone, completed_at: nowDone ? new Date().toISOString() : null })
      .eq('id', task.id)
      .select()

    if (error) { alert('Error updating task: ' + error.message); return }
    setTasks(prev => prev.map(t => t.id === task.id ? data[0] : t))
  }

  async function deleteTask(id) {
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (error) { alert('Error deleting task: ' + error.message); return }
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  const processed = tasks.map(t => ({ ...t, effectivelyCompleted: isEffectivelyCompleted(t) }))
  const pending = processed.filter(t => !t.effectivelyCompleted)
  const done = processed.filter(t => t.effectivelyCompleted)

  return (
    <div className="app">
      <header className="app-header">
        <h1>⭐ Task Tracker</h1>
        <p className="subtitle">Stay on top of your to-dos!</p>
      </header>
      <main className="app-main">
        <AddTaskForm onAdd={addTask} />
        {loading ? (
          <div className="status-msg">Loading tasks…</div>
        ) : error ? (
          <div className="status-msg error-msg">
            <strong>Could not connect to Supabase.</strong><br />
            Make sure your <code>.env</code> file has the correct URL and anon key.
            <br /><small>{error}</small>
          </div>
        ) : (
          <>
            <TaskList
              title="To Do"
              tasks={pending}
              onToggle={toggleTask}
              onDelete={deleteTask}
              emptyMessage="No pending tasks — great job! 🎉"
            />
            {done.length > 0 && (
              <TaskList
                title="Completed"
                tasks={done}
                onToggle={toggleTask}
                onDelete={deleteTask}
                dimmed
              />
            )}
          </>
        )}
      </main>
    </div>
  )
}
