import { toast } from "react-toastify"

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  })
}

const tableName = "task_c"

export const taskService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "order_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "category_c"}}
        ],
        orderBy: [{"fieldName": "created_at_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      }
      
      const response = await apperClient.fetchRecords(tableName, params)
      
      if (!response.success) {
        console.error("Error fetching tasks:", response.message)
        toast.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error)
      return []
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient()
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "order_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "category_c"}}
        ]
      }
      
      const response = await apperClient.getRecordById(tableName, parseInt(id), params)
      
      if (!response.success) {
        console.error("Error fetching task:", response.message)
        toast.error(response.message)
        return null
      }
      
      return response.data
    } catch (error) {
      console.error("Error fetching task:", error?.response?.data?.message || error)
      return null
    }
  },

  async create(taskData) {
    try {
      const apperClient = getApperClient()
      
      // Only include Updateable fields
      const params = {
        records: [{
          Name: taskData.title_c || taskData.title || "",
          title_c: taskData.title_c || taskData.title || "",
          description_c: taskData.description_c || taskData.description || "",
          completed_c: false,
          priority_c: taskData.priority_c || taskData.priority || "Medium",
          due_date_c: taskData.due_date_c || taskData.dueDate ? new Date(taskData.due_date_c || taskData.dueDate).toISOString() : null,
          status_c: taskData.status_c || taskData.status || "pending",
          category_c: taskData.category_c || taskData.category || 1,
          order_c: taskData.order_c || taskData.order || 1
        }]
      }
      
      const response = await apperClient.createRecord(tableName, params)
      
      if (!response.success) {
        console.error("Error creating task:", response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} tasks:`, JSON.stringify(failed))
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            }
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          return successful[0].data
        }
      }
      
      throw new Error("Failed to create task")
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error)
      throw error
    }
  },

  async update(id, updateData) {
    try {
      const apperClient = getApperClient()
      
      // Only include Updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: updateData.title_c || updateData.title,
          title_c: updateData.title_c || updateData.title,
          description_c: updateData.description_c || updateData.description,
          completed_c: updateData.completed_c !== undefined ? updateData.completed_c : updateData.completed,
          priority_c: updateData.priority_c || updateData.priority,
          due_date_c: updateData.due_date_c || updateData.dueDate ? new Date(updateData.due_date_c || updateData.dueDate).toISOString() : null,
          status_c: updateData.status_c || updateData.status,
          category_c: updateData.category_c || updateData.category,
          order_c: updateData.order_c || updateData.order
        }]
      }
      
      const response = await apperClient.updateRecord(tableName, params)
      
      if (!response.success) {
        console.error("Error updating task:", response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} tasks:`, JSON.stringify(failed))
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            }
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          return successful[0].data
        }
      }
      
      throw new Error("Failed to update task")
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error)
      throw error
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient()
      const params = { 
        RecordIds: [parseInt(id)]
      }
      
      const response = await apperClient.deleteRecord(tableName, params)
      
      if (!response.success) {
        console.error("Error deleting task:", response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} tasks:`, JSON.stringify(failed))
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        return successful.length > 0
      }
      
      return false
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error)
      throw error
    }
  },

  async toggleComplete(id) {
    try {
      // Get current task first
      const currentTask = await this.getById(id)
      if (!currentTask) {
        throw new Error("Task not found")
      }
      
      // Update with toggled completion status
      return await this.update(id, {
        completed_c: !currentTask.completed_c,
        status_c: !currentTask.completed_c ? "completed" : "pending"
      })
    } catch (error) {
      console.error("Error toggling task completion:", error?.response?.data?.message || error)
      throw error
    }
  },

  async reorderTasks(reorderedTasks) {
    try {
      const updatePromises = reorderedTasks.map((task, index) => 
        this.update(task.Id, { order_c: index + 1 })
      )
      
      await Promise.all(updatePromises)
      return reorderedTasks
    } catch (error) {
      console.error("Error reordering tasks:", error?.response?.data?.message || error)
      throw error
    }
  }
}