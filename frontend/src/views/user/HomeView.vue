<script setup lang="ts">
    import {reactive} from "vue";
    import NavBar from '@/components/NavBar.vue';
    import {useUser} from "@/stores/user.js";
    import { onMounted, ref } from 'vue';
    import DataTable from '@/components/DataTable.vue';
    import {Field, Form, ErrorMessage} from "vee-validate"
    import { numeric, required } from "@vee-validate/rules";
    import Datepicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css'

    const userStore = useUser();
    const food_entries = ref([]);
    const filter = reactive({
        start_at: '',
        end_at: ''
    });

    
    onMounted(() => {
        getData();
    });

    async function getData() {
        food_entries.value = await userStore.getAllFoodEntries();
    }

    const filterFoodEntries = async () => {
        food_entries.value = await userStore.filterFoodEntries(filter.start_at, filter.end_at);
    }

    

</script>

<template>
    <NavBar @refresh="getData()" :dailyLimit="userStore.user.daily_calorie_limit" :metaData="food_entries.metaData" />
    Start Date
    <Field name="start_at" :rules="[required]" v-model="filter.start_at" >
        <Datepicker v-model="filter.start_at"  v-bind="field"></Datepicker>
    </Field>
    End Date
    <Field name="end_at" :rules="[required]" v-model="filter.end_at" >
        <Datepicker v-model="filter.end_at"  v-bind="field"></Datepicker>
    </Field>
    <button @click="filterFoodEntries" class="btn btn-ghost normal-case text-xl">Filter</button>
    <div class="flex flex-col w-full lg:flex-row">
        <div class="grid flex-grow h-full card bg-base-300 rounded-box">
            <DataTable :foodEntries="food_entries.data" />
        </div> 
    </div>
</template>