<script setup lang="ts">
    import NavBar from '@/components/NavBar.vue';
    import {useUser} from "@/stores/user.js";
    import { onMounted, ref } from 'vue';
    import DataTable from '@/components/DataTable.vue';

    const userStore = useUser();
    const food_entries = ref([]);
    const users = ref([]);
    
    onMounted(async () => {
        food_entries.value = await userStore.getAllUsersFoodEntries();
        users.value = await userStore.getAllUsers();
    });

    

</script>

<template>
    <NavBar :admin="true" :users="users.data"/>

    <div class="flex flex-col w-full lg:flex-row">
        <div class="grid flex-grow h-full card bg-base-300 rounded-box">
            <DataTable :foodEntries="food_entries.data" :admin="true" />
        </div> 
        
    </div>
</template>