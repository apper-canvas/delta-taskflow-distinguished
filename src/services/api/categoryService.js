import { toast } from "react-toastify"

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  })
}

const tableName = "category_c"

export const categoryService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "icon_c"}}
        ],
        orderBy: [{"fieldName": "Name", "sorttype": "ASC"}],
        pagingInfo: {"limit": 50, "offset": 0}
      }
      
      const response = await apperClient.fetchRecords(tableName, params)
      
      if (!response.success) {
        console.error("Error fetching categories:", response.message)
        toast.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching categories:", error?.response?.data?.message || error)
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
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "icon_c"}}
        ]
      }
      
      const response = await apperClient.getRecordById(tableName, parseInt(id), params)
      
      if (!response.success) {
        console.error("Error fetching category:", response.message)
        toast.error(response.message)
        return null
      }
      
      return response.data
    } catch (error) {
      console.error("Error fetching category:", error?.response?.data?.message || error)
      return null
    }
  }
}