import {defineStore} from 'pinia'
import {useAuth} from './auth'
import ApiHandler from "../utils/ApiHandler"

export const useUser = defineStore('user', {
    state: () => ({
        user: null,
        loading: false,
    }),
    actions: {
        setLoading(loading) {
            this.loading = loading
        },
        async getUser() {
            try {
                const {data} = await ApiHandler.get('/users/me', ApiHandler.getAuthHeader())
                this.user = data // FIX: For whatever reason the user data is being stored and used in/from both the user and auth state
                useAuth().user = data
                return true
            } catch (error) {
                return false
            }
        },
        async updateUser(firstName, lastName, email) {
            try {
                await ApiHandler.patch('/users', {
                    firstName,
                    lastName,
                    email
                }, ApiHandler.getAuthHeader())
                return true
            } catch (error) {
                if (error.response.data.error) {
                    return {error: error.response.data.error}
                }
                return false
            }
        },
        async changePassword(currentPassword, password, passwordConfirm) {
            try {
                await ApiHandler.patch('/users/password', {
                    currentPassword,
                    password,
                    password_confirmation: passwordConfirm
                }, ApiHandler.getAuthHeader())
                return true
            } catch (error) {
                if (error.response.data.error) {
                    return {error: error.response.data.error}
                }
                return false
            }
        },
        async getAllFoodEntries() {
            try {
                const {data} = await ApiHandler.get('/food', ApiHandler.getAuthHeader());
                return data;
            } catch (error) {
                return false
            }
        },
        async getAllUsersFoodEntries() {
            try {
                const {data} = await ApiHandler.get('/foodAll', ApiHandler.getAuthHeader());
                return data;
            } catch (error) {
                return false
            }
        },
        async getAllUsersLastSevenFoodEntries() {
            try {
                const {data} = await ApiHandler.get('/foodLastSeven', ApiHandler.getAuthHeader());
                return data;
            } catch (error) {
                return false
            }
        },
        async getAllUsersLastSevenPrevFoodEntries() {
            try {
                const {data} = await ApiHandler.get('/foodLastSevenPrev', ApiHandler.getAuthHeader());
                return data;
            } catch (error) {
                return false
            }
        },
        async avgCalorieLastSeven() {
            try {
                const {data} = await ApiHandler.get('/avgCalorieLastSeven', ApiHandler.getAuthHeader());
                return data;
            } catch (error) {
                return false
            }
        },
        async filterFoodEntries(start,end) {
            try {
                const {data} = await ApiHandler.get('/foodFilter', ApiHandler.getAuthHeader(), {start:start,end:end});
                return data;
            } catch (error) {
                return false
            }
        },
        async createNewFoodEntry(data) {
            try {
                await ApiHandler.post('/food',  ApiHandler.getAuthHeader(), data)
                return true
            } catch (error) {
                if (error.response.data.error) {
                    return {error: error.response.data.error}
                }
                return false
            }
        },
        async createNewFoodEntryAdmin(data) {
            try {
                await ApiHandler.post('/admin/food',  ApiHandler.getAuthHeader(), data)
                return true
            } catch (error) {
                if (error.response.data.error) {
                    return {error: error.response.data.error}
                }
                return false
            }
        },
        async updateFoodEntry(id, data) {
            try {
                await ApiHandler.patch(`/food/${id}`, data, ApiHandler.getAuthHeader());
                return true
            } catch (error) {
                if (error.response.data.error) {
                    return {error: error.response.data.error}
                }
                return false
            }
        },
        async deleteFoodEntry(id) {
            try {
                await ApiHandler.delete(`/food/${id}`, {}, ApiHandler.getAuthHeader())
                return true
            } catch (error) {
                if (error.response.data.error) {
                    return {error: error.response.data.error}
                }
                return false
            }
        },
        async getAllUsers() {
            try {
                const {data} = await ApiHandler.get(`/admin/users`,  ApiHandler.getAuthHeader())
                return data
            } catch (error) {
                if (error.response.data.error) {
                    return {error: error.response.data.error}
                }
                return false
            }
        }
    }
})
