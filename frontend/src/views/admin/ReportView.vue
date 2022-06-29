<script setup lang="ts">
    import NavBar from '@/components/NavBar.vue';
    import {useUser} from "@/stores/user.js";
    import { onMounted, ref } from 'vue';
    import DataTable from '@/components/DataTable.vue';

    const userStore = useUser();
    const food_entries = ref([]);
    const last_seven_food_entries = ref([]);
    const last_seven_food_prev_entries = ref([]);
    const calorieLastSeven = ref([]);
    const users = ref([]);
    
    onMounted(() => {
        getData();
    });

    async function getData() {
        food_entries.value = await userStore.getAllUsersFoodEntries();
        last_seven_food_entries.value = await userStore.getAllUsersLastSevenFoodEntries();
        last_seven_food_prev_entries.value = await userStore.getAllUsersLastSevenPrevFoodEntries();
        calorieLastSeven.value = await userStore.avgCalorieLastSeven();
        users.value = await userStore.getAllUsers();
    }

</script>

<template>
    <NavBar :admin="true" :users="users.data"/>

    <div class="flex flex-col w-full lg:flex-row">
        <div v-if="last_seven_food_entries.data&&last_seven_food_prev_entries.data" class="grid flex-grow h-full card bg-base-300 rounded-box">
            <span>Last 7 Days {{last_seven_food_entries.data[0].count}}</span>
            <span>The week before that {{last_seven_food_prev_entries.data[0].count-last_seven_food_entries.data[0].count}}</span>
        </div> 

        
    </div>
    <div class="flex flex-col w-full lg:flex-row">
        <div v-if="calorieLastSeven.data" class="grid flex-grow h-full card bg-base-300 rounded-box">
            <span>Calorie Last 7 Days {{calorieLastSeven.data[0].avg}}</span>
            
        </div> 
        
        
    </div>
</template>