<script setup lang="ts">
    import NavBar from '@/components/NavBar.vue';
    import {useUser} from "@/stores/user.js";
    import { onMounted, ref } from 'vue';
import DataTable from '../../components/DataTable.vue';

    const userStore = useUser();
    const food_entries = ref([]);
    
    onMounted(async () => {
        food_entries.value = await userStore.getAllFoodEntries();;
    });

</script>

<template>
    <NavBar :dailyLimit="userStore.user.daily_calorie_limit" />
    <DataTable :foodEntries="food_entries" />
</template>