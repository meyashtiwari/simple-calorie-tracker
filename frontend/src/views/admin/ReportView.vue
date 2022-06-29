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
<div class="stats shadow flex items-center mt-5">
  
  
  
  <div class="stat">
    <div class="stat-figure text-secondary">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
    </div>
    <div class="stat-title">Last 7 Days</div>
    <div class="stat-value text-secondary" v-if="last_seven_food_entries.data&&last_seven_food_prev_entries.data">{{last_seven_food_entries.data[0].count}}</div>
    
  </div>
  <div class="stat">
    <div class="stat-figure text-primary">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
    </div>
    <div class="stat-title">The week before that </div>
    <div class="stat-value text-primary" v-if="last_seven_food_entries.data&&last_seven_food_prev_entries.data"> {{last_seven_food_prev_entries.data[0].count-last_seven_food_entries.data[0].count}}</div>
    
  </div>
  <div class="stat">
    <div class="stat-figure text-secondary">
      
    </div>
    <div class="stat-value" v-if="calorieLastSeven.data">{{calorieLastSeven.data[0].avg}}</div>
    <div class="stat-title">Avg Calories in Last 7 Days</div>
    
  </div>
  
</div>


    
</template>