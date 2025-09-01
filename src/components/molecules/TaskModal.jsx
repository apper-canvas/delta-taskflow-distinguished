import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Textarea from "@/components/atoms/Textarea"
import Select from "@/components/atoms/Select"

const TaskModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  task = null,
  categories = []
}) => {
const [formData, setFormData] = useState({
    title_c: "",
    description_c: "",
    category_c: 1,
    priority_c: "Medium",
    status_c: "pending",
    due_date_c: ""
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
if (task) {
      setFormData({
        title_c: task.title_c || task.title || "",
        description_c: task.description_c || task.description || "",
        category_c: task.category_c?.Id || task.category_c || 1,
        priority_c: task.priority_c || task.priority || "Medium",
        status_c: task.status_c || task.status || "pending",
        due_date_c: task.due_date_c || task.dueDate ? new Date(task.due_date_c || task.dueDate).toISOString().slice(0, 16) : ""
      })
    } else {
      setFormData({
        title_c: "",
        description_c: "",
        category_c: 1,
        priority_c: "Medium",
        status_c: "pending",
        due_date_c: ""
      })
    }
  }, [task, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
if (!formData.title_c.trim()) {
      toast.error("Please enter a task title")
      return
    }

    setIsLoading(true)
    try {
const taskData = {
        ...formData,
        due_date_c: formData.due_date_c ? new Date(formData.due_date_c).toISOString() : null
      }
      
      await onSave(taskData)
      toast.success(task ? "Task updated successfully" : "Task created successfully")
      onClose()
    } catch (error) {
      toast.error("Failed to save task")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {task ? "Edit Task" : "Add New Task"}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2"
          >
            <ApperIcon name="X" size={18} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
<Input
              type="text"
              value={formData.title_c}
              onChange={(e) => handleChange("title_c", e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
<Textarea
              value={formData.description_c}
              onChange={(e) => handleChange("description_c", e.target.value)}
              placeholder="Enter task description (optional)"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
<Select
                value={formData.category_c}
                onChange={(e) => handleChange("category_c", parseInt(e.target.value))}
              >
                {categories.map(category => (
                  <option key={category.Id} value={category.Id}>
                    {category.Name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
<Select
                value={formData.priority_c}
                onChange={(e) => handleChange("priority_c", e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </Select>
</div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
<Select 
                value={formData.status_c}
                onChange={(e) => handleChange("status_c", e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date
            </label>
<Input
              type="datetime-local"
              value={formData.due_date_c}
              onChange={(e) => handleChange("due_date_c", e.target.value)}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="accent"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Loader2" size={16} className="animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                task ? "Update Task" : "Create Task"
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default TaskModal