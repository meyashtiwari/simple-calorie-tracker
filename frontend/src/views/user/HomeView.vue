<script setup lang="ts">
import { reactive } from "vue";
import NavBar from '@/components/NavBar.vue';
import { useUser } from "@/stores/user.js";
import { onMounted, ref } from 'vue';
import DataTable from '@/components/DataTable.vue';
import { Field, Form, ErrorMessage } from "vee-validate"
import { numeric, required } from "@vee-validate/rules";
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import moment from 'moment'

const userStore = useUser();
const food_entries = ref([]);
const filter = reactive({
    start_at: '',
    end_at: ''
});
const emit = defineEmits(['refresh']);
const refresh = () => emit('refresh');

onMounted(() => {
    getData();
});

async function getData() {
    food_entries.value = await userStore.getAllFoodEntries();
}


const filterFoodEntries = (async (values) => {
    filter.start_at = moment(filter.start_at).format('YYYY-M-D H:m:s');
    filter.end_at = moment(filter.end_at).format('YYYY-M-D H:m:s');
    food_entries.value = await userStore.filterFoodEntries(filter.start_at, filter.end_at);
    refresh();
});


</script>

<template>
    <NavBar @refresh="getData()" :dailyLimit="userStore.user.daily_calorie_limit" :metaData="food_entries.metaData" />
    <div class="flex flex-col w-full lg:flex-row p-2 items-center">
        <Form class="flex flex-col w-full lg:flex-row p-2 items-center" @submit="filterFoodEntries">
            <span class="px-2">Start Date</span>
            <Field name="start_at" :rules="[required]" v-model="filter.start_at" v-slot="{field, errors}">
                <Datepicker v-model="filter.start_at" v-bind="field"></Datepicker>
            </Field>
            <ErrorMessage class="text-red-400 text-sm" name="start_at">
                <p class="text-red-400 text-sm">Start at date is invalid</p>
            </ErrorMessage>
            <span  class="px-2">End Date</span>
            <Field name="end_at" :rules="[required]" v-model="filter.end_at" v-slot="{field, errors}">
                <Datepicker v-model="filter.end_at" v-bind="field"></Datepicker>
            </Field>
            <ErrorMessage class="text-red-400 text-sm" name="end_at">
                <p class="text-red-400 text-sm">End at date is invalid</p>
            </ErrorMessage>
            <button type="submit" class="btn  normal-case px-5 ml-5">Filter</button>
        </Form>
    </div>
    <div class="flex flex-col w-full lg:flex-row">
        <div class="grid flex-grow h-full card bg-base-300 rounded-box">
            <DataTable :foodEntries="food_entries.data" />
        </div>

    </div>
</template>