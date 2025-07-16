import React, { useState, useEffect } from 'react'
import {
  Clock,
  Link,
  Unlink,
  Check,
  Trash2,
  Plus,
  Edit2,
  Calendar
} from 'lucide-react'

interface Task {
  id: string
  text: string
  startTime: string | null
  linkedTo: string | null
  completed: boolean
  day: string
  order: number
  createdAt: string
  completedAt: string | null
}

const TaskChainApp = () => {
  // Initialize from localStorage immediately
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('taskChainData')
      if (saved) {
        const parsedTasks = JSON.parse(saved)
        // Ensure backward compatibility by adding missing date fields
        return parsedTasks.map((task: any) => ({
          ...task,
          createdAt: task.createdAt || new Date().toISOString(),
          completedAt: task.completedAt || null
        }))
      }
      return []
    } catch (e) {
      console.error('Failed to load tasks:', e)
      return []
    }
  })
  const [activeTab, setActiveTab] = useState('active')
  const [selectedDay, setSelectedDay] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [newTaskText, setNewTaskText] = useState('')
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([])
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('taskChainData', JSON.stringify(tasks))
    } catch (e) {
      console.error('Failed to save tasks:', e)
    }
  }, [tasks])

  // Listen to system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Extract hashtags from text
  const extractHashtags = (text: string): string[] => {
    const regex = /#[\w\u0080-\uFFFF]+/g
    const matches = text.match(regex)
    return matches ? matches.map((tag) => tag.toLowerCase()) : []
  }

  // Get all unique hashtags from tasks
  const getAllHashtags = () => {
    const allHashtags = tasks.flatMap((task) => extractHashtags(task.text))
    return [...new Set(allHashtags)].sort()
  }

  // Generate unique ID
  const generateId = () =>
    `task-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`

  // Helper function to get formatted date
  const getFormattedDate = () => new Date().toISOString()

  // Helper function to format dates for display
  const formatDisplayDate = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    // Remove time component for comparison
    const dateWithoutTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    )

    if (dateWithoutTime.getTime() === today.getTime()) {
      return 'Today'
    } else if (dateWithoutTime.getTime() === yesterday.getTime()) {
      return 'Yesterday'
    } else {
      const diffTime = today.getTime() - dateWithoutTime.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        return '1 day ago'
      } else if (diffDays > 1 && diffDays <= 7) {
        return `${diffDays} days ago`
      } else {
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        })
      }
    }
  }

  // Generate 7 days starting from today
  const generateWeekDays = () => {
    const days = []
    const today = new Date()

    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)

      const dateString = date.toISOString().split('T')[0]
      const month = date.toLocaleDateString('en-US', { month: 'short' })
      const day = date.getDate()

      let displayName: string
      if (i === 0) {
        displayName = `Today (${month} ${day})`
      } else if (i === 1) {
        displayName = `Tomorrow (${month} ${day})`
      } else {
        const weekday = date.toLocaleDateString('en-US', { weekday: 'short' })
        displayName = `${weekday} (${month} ${day})`
      }

      days.push({
        date: dateString,
        displayName
      })
    }

    return days
  }

  // Add new task
  const addTask = () => {
    if (!newTaskText.trim()) return

    const newTask = {
      id: generateId(),
      text: newTaskText,
      startTime: null,
      linkedTo: null,
      completed: false,
      day: selectedDay,
      order: tasks.filter((t) => t.day === selectedDay && !t.completed).length,
      createdAt: getFormattedDate(),
      completedAt: null
    }

    setTasks([...tasks, newTask])
    setNewTaskText('')
  }

  // Toggle task completion
  const toggleComplete = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed ? getFormattedDate() : null
            }
          : task
      )
    )
  }

  // Delete task
  const deleteTask = (taskId: string) => {
    // Unlink any tasks linked to this one
    const updatedTasks = tasks.map((task) =>
      task.linkedTo === taskId ? { ...task, linkedTo: null } : task
    )
    setTasks(updatedTasks.filter((task) => task.id !== taskId))
  }

  // Update task text
  const updateTaskText = (taskId: string, newText: string) => {
    if (newText.trim()) {
      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, text: newText.trim() } : task
        )
      )
    }
    setEditingTaskId(null)
    setEditingText('')
  }

  // Start editing
  const startEditing = (taskId: string, currentText: string) => {
    setEditingTaskId(taskId)
    setEditingText(currentText)
  }

  // Cancel editing
  const cancelEditing = () => {
    setEditingTaskId(null)
    setEditingText('')
  }

  // Set task time
  const setTaskTime = (taskId: string, time: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, startTime: time } : task
      )
    )
  }

  // Link tasks
  const linkTask = (taskId: string, targetId: string) => {
    if (taskId === targetId) return

    // Check if target already has something linked to it
    const isTargetAlreadyLinked = tasks.some(
      (t) => t.linkedTo === targetId && t.id !== taskId
    )
    if (isTargetAlreadyLinked) return

    // Check for circular dependencies
    const wouldCreateCycle = () => {
      let current: string | null = targetId
      while (current) {
        if (current === taskId) return true
        const task = tasks.find((t) => t.id === current)
        current = task?.linkedTo || null
      }
      return false
    }

    if (wouldCreateCycle()) return

    // Find the target task and the task being linked
    const targetTask = tasks.find((t) => t.id === targetId)
    const linkingTask = tasks.find((t) => t.id === taskId)

    if (!targetTask || !linkingTask) return

    // Update tasks with new order
    setTasks((prevTasks) => {
      // Create a copy of tasks
      let updatedTasks = [...prevTasks]

      // Update the linking task
      updatedTasks = updatedTasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, linkedTo: targetId, startTime: null }
        }
        return task
      })

      // Filter tasks for the same day
      const sameDayTasks = updatedTasks.filter(
        (t) => t.day === targetTask.day && !t.completed
      )
      const otherTasks = updatedTasks.filter(
        (t) => t.day !== targetTask.day || t.completed
      )

      // Sort tasks by order
      sameDayTasks.sort((a, b) => a.order - b.order)

      // Find target task index
      const targetIndex = sameDayTasks.findIndex((t) => t.id === targetId)

      // Remove the linking task from its current position
      const linkingIndex = sameDayTasks.findIndex((t) => t.id === taskId)
      if (linkingIndex > -1) {
        sameDayTasks.splice(linkingIndex, 1)
      }

      // Find the updated linking task (with linkedTo set)
      const updatedLinkingTask =
        sameDayTasks.find((t) => t.id === taskId) ||
        updatedTasks.find((t) => t.id === taskId)

      // Insert linking task right after target task
      if (updatedLinkingTask) {
        sameDayTasks.splice(targetIndex + 1, 0, updatedLinkingTask)
      }

      // Update order for all tasks
      sameDayTasks.forEach((task, index) => {
        task.order = index
      })

      // Combine back all tasks
      return [...sameDayTasks, ...otherTasks]
    })
  }

  // Unlink task
  const unlinkTask = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, linkedTo: null } : task
      )
    )
  }

  // Get filtered tasks
  const getFilteredTasks = () => {
    return tasks
      .filter((task) => {
        const dayMatch = task.day === selectedDay
        const tabMatch =
          activeTab === 'active'
            ? !task.completed
            : activeTab === 'completed'
            ? task.completed
            : task.completed // timeline tab shows completed tasks
        const hashtagMatch =
          selectedHashtags.length === 0 ||
          selectedHashtags.some((tag) =>
            extractHashtags(task.text).includes(tag)
          )

        return dayMatch && tabMatch && hashtagMatch
      })
      .sort((a, b) => a.order - b.order)
  }

  // Get completed tasks grouped by completion date for timeline view
  const getTimelineTasks = () => {
    const completedTasks = tasks
      .filter((task) => task.completed && task.completedAt)
      .sort((a, b) => {
        const dateA = new Date(a.completedAt!).getTime()
        const dateB = new Date(b.completedAt!).getTime()
        return dateB - dateA // Most recent first
      })

    // Group by completion date
    const grouped: { [date: string]: Task[] } = {}
    completedTasks.forEach((task) => {
      const date = new Date(task.completedAt!).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      if (!grouped[date]) {
        grouped[date] = []
      }
      grouped[date].push(task)
    })

    return grouped
  }

  // Format completion time
  const formatCompletionTime = (completedAt: string) => {
    const date = new Date(completedAt)
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  // Get task chain
  const getTaskChain = (taskId: string) => {
    const chain: Task[] = []
    let current: string | null = taskId

    while (current) {
      const task = tasks.find((t) => t.id === current)
      if (!task || chain.some((t) => t.id === task.id)) break
      chain.unshift(task)
      current = task.linkedTo
    }

    return chain
  }

  // Drag and drop handlers
  const handleDragStart = (_e: React.DragEvent, task: Task) => {
    setDraggedTask(task)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, targetTask: Task) => {
    e.preventDefault()
    if (!draggedTask || draggedTask.id === targetTask.id) return

    const sourceIndex = tasks.findIndex((t) => t.id === draggedTask.id)
    const targetIndex = tasks.findIndex((t) => t.id === targetTask.id)

    const newTasks = [...tasks]
    const [removed] = newTasks.splice(sourceIndex, 1)
    newTasks.splice(targetIndex, 0, removed)

    // Update order
    const reorderedTasks = newTasks.map((task, index) => ({
      ...task,
      order: index
    }))

    setTasks(reorderedTasks)
    setDraggedTask(null)
  }

  const TaskItem = ({ task }: { task: Task }) => {
    const linkedFromTask = tasks.find((t) => t.id === task.linkedTo)
    const isEditing = editingTaskId === task.id

    return (
      <div
        className={`rounded-lg shadow-sm border p-4 mb-3 cursor-move transition-shadow ${
          isDarkMode
            ? 'bg-gray-800 border-gray-700 hover:shadow-lg hover:shadow-gray-900/50'
            : 'bg-white border-gray-200 hover:shadow-md'
        }`}
        draggable
        onDragStart={(e) => handleDragStart(e, task)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, task)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task.id)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              {isEditing ? (
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onBlur={() => updateTaskText(task.id, editingText)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      updateTaskText(task.id, editingText)
                    } else if (e.key === 'Escape') {
                      cancelEditing()
                    }
                  }}
                  className={`text-lg flex-1 px-2 py-1 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-gray-100'
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                  autoFocus
                />
              ) : (
                <span
                  className={`text-lg cursor-pointer ${
                    task.completed
                      ? isDarkMode
                        ? 'line-through text-gray-500'
                        : 'line-through text-gray-500'
                      : isDarkMode
                      ? 'text-gray-100'
                      : 'text-gray-800'
                  }`}
                  onClick={() =>
                    !task.completed && startEditing(task.id, task.text)
                  }
                >
                  {task.text
                    .split(/(#[\w\u0080-\uFFFF]+)/g)
                    .map((part: string, i: number) =>
                      part.startsWith('#') ? (
                        <span
                          key={i}
                          className={`font-medium ${
                            isDarkMode ? 'text-blue-400' : 'text-blue-600'
                          }`}
                        >
                          {part}
                        </span>
                      ) : (
                        part
                      )
                    )}
                </span>
              )}
            </div>

            {task.linkedTo && linkedFromTask && (
              <div
                className={`ml-7 text-sm mb-2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Linked after: {linkedFromTask.text}
              </div>
            )}

            {task.startTime && !task.linkedTo && (
              <div
                className={`ml-7 flex items-center gap-1 text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                <Clock className="w-4 h-4" />
                {task.startTime}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!task.completed && !isEditing && (
              <button
                onClick={() => startEditing(task.id, task.text)}
                className={`p-1 transition-colors ${
                  isDarkMode
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                title="Edit task"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}

            {!task.linkedTo && !task.completed && !isEditing && (
              <input
                type="time"
                value={task.startTime || ''}
                onChange={(e) => setTaskTime(task.id, e.target.value)}
                className={`px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-gray-100'
                    : 'border-gray-300'
                }`}
              />
            )}

            {!task.completed && (
              <div className="flex gap-1">
                {task.linkedTo ? (
                  <button
                    onClick={() => unlinkTask(task.id)}
                    className={`p-1 transition-colors ${
                      isDarkMode
                        ? 'text-gray-400 hover:text-red-400'
                        : 'text-gray-600 hover:text-red-600'
                    }`}
                    title="Unlink task"
                  >
                    <Unlink className="w-4 h-4" />
                  </button>
                ) : (
                  <select
                    onChange={(e) =>
                      e.target.value && linkTask(task.id, e.target.value)
                    }
                    className={`text-sm border rounded px-1 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-gray-100'
                        : 'border-gray-300'
                    }`}
                    value=""
                  >
                    <option value="">Link to...</option>
                    {tasks
                      .filter(
                        (t) =>
                          t.id !== task.id && t.day === task.day && !t.completed
                      )
                      .map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.text}
                        </option>
                      ))}
                  </select>
                )}
              </div>
            )}

            <button
              onClick={() => deleteTask(task.id)}
              className={`p-1 transition-colors ${
                isDarkMode
                  ? 'text-gray-400 hover:text-red-400'
                  : 'text-gray-600 hover:text-red-600'
              }`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen p-4 transition-colors ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      <div className="max-w-3xl mx-auto">
        <h1
          className={`text-3xl font-bold mb-6 ${
            isDarkMode ? 'text-gray-100' : 'text-gray-800'
          }`}
        >
          Task Chain Manager
        </h1>

        {/* Hashtag filter */}
        {getAllHashtags().length > 0 && (
          <div className="mb-4">
            <div
              className={`text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Filter by hashtags:
            </div>
            <div className="flex flex-wrap gap-2">
              {getAllHashtags().map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedHashtags((prev) =>
                      prev.includes(tag)
                        ? prev.filter((t) => t !== tag)
                        : [...prev, tag]
                    )
                  }}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedHashtags.includes(tag)
                      ? isDarkMode
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-600 text-white'
                      : isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
              {selectedHashtags.length > 0 && (
                <button
                  onClick={() => setSelectedHashtags([])}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    isDarkMode
                      ? 'bg-red-900 text-red-200 hover:bg-red-800'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* Day selector */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {generateWeekDays().map((day) => (
            <button
              key={day.date}
              onClick={() => setSelectedDay(day.date)}
              className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                selectedDay === day.date
                  ? 'bg-blue-600 text-white'
                  : isDarkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {day.displayName}
            </button>
          ))}
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'active'
                ? 'bg-green-600 text-white'
                : isDarkMode
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Active Tasks
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'completed'
                ? isDarkMode
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-600 text-white'
                : isDarkMode
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'timeline'
                ? isDarkMode
                  ? 'bg-purple-700 text-white'
                  : 'bg-purple-600 text-white'
                : isDarkMode
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Timeline
          </button>
        </div>

        {/* Add new task */}
        {activeTab === 'active' && (
          <div className="mb-6 flex gap-2">
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              placeholder="Add a new task... (use #hashtags to categorize)"
              className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500'
                  : 'border-gray-300'
              }`}
            />
            <button
              onClick={addTask}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add
            </button>
          </div>
        )}

        {/* Task list */}
        <div className="space-y-2">
          {activeTab === 'timeline' ? (
            <div>
              {Object.keys(getTimelineTasks()).length === 0 ? (
                <div
                  className={`text-center py-8 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  No completed tasks in timeline
                  {selectedHashtags.length > 0 && ' matching selected hashtags'}
                </div>
              ) : (
                Object.entries(getTimelineTasks()).map(([date, tasks]) => (
                  <div key={date} className="mb-6">
                    <h3
                      className={`text-lg font-semibold mb-3 pb-2 border-b flex items-center gap-2 ${
                        isDarkMode
                          ? 'text-gray-200 border-gray-700'
                          : 'text-gray-800 border-gray-300'
                      }`}
                    >
                      <Calendar className="w-5 h-5" />
                      {date}
                    </h3>{' '}
                    <div className="space-y-2">
                      {tasks.map((task) => (
                        <div
                          key={task.id}
                          className={`rounded-lg shadow-sm border p-4 ${
                            isDarkMode
                              ? 'bg-gray-800 border-gray-700'
                              : 'bg-white border-gray-200'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Check className="w-5 h-5 text-green-500" />
                                <span
                                  className={`text-lg line-through ${
                                    isDarkMode
                                      ? 'text-gray-400'
                                      : 'text-gray-500'
                                  }`}
                                >
                                  {task.text
                                    .split(/(#[\w\u0080-\uFFFF]+)/g)
                                    .map((part: string, i: number) =>
                                      part.startsWith('#') ? (
                                        <span
                                          key={i}
                                          className={`font-medium ${
                                            isDarkMode
                                              ? 'text-blue-400'
                                              : 'text-blue-600'
                                          }`}
                                        >
                                          {part}
                                        </span>
                                      ) : (
                                        part
                                      )
                                    )}
                                </span>
                              </div>
                              <div
                                className={`ml-7 text-sm ${
                                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                }`}
                              >
                                Completed {formatDisplayDate(task.completedAt!)}{' '}
                                at {formatCompletionTime(task.completedAt!)}
                              </div>
                            </div>
                            <button
                              onClick={() => deleteTask(task.id)}
                              className={`p-1 transition-colors ${
                                isDarkMode
                                  ? 'text-gray-400 hover:text-red-400'
                                  : 'text-gray-600 hover:text-red-600'
                              }`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div>
              {getFilteredTasks().length === 0 ? (
                <div
                  className={`text-center py-8 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  {activeTab === 'active'
                    ? 'No active tasks'
                    : 'No completed tasks'}
                  {selectedHashtags.length > 0 && ' matching selected hashtags'}
                </div>
              ) : (
                getFilteredTasks().map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TaskChainApp
