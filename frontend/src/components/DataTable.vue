<script setup lang="ts">
    import {useUser} from "@/stores/user.js";
    import { ref, reactive } from "vue";
    import AddEntryForm from "@/components/AddEntryForm.vue";
    import { numeric, required } from "@vee-validate/rules";
    import {Field, Form, ErrorMessage} from "vee-validate"
    import Datepicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css'
    import moment from 'moment'

    const props = defineProps({
        foodEntries: Array,
        admin: Boolean
    });

    const userStore = useUser();
    const showEditForm = ref(false);
    const itemId = ref('');
    const food = reactive({
        name: '',
        calorie_value: '',
        taken_at: ''
    });

    function deleteEntry(id) {
        userStore.deleteFoodEntry(id).then((response) => console.log(response));
    }

    function updateEntry(item) {
        itemId.value = item.id;
        food.name = item.name;
        food.calorie_value = item.calorie_value;
        food.taken_at = item.taken_at;
        showEditForm.value = true;
    }

    const onSubmit = ((values) => {
        values.taken_at = moment(values.taken_at).format('YYYY-M-D H:m:s');
        userStore.updateFoodEntry(itemId.value, values).then(async () => {
            await userStore.getAllFoodEntries();
            showEditForm.value = false;
            itemId.value = '';
            food.name = '';
            food.calorie_value = '';
            food.taken_at = '';
        });
    });
</script>

<template>
    <div class="overflow-x-auto">
        <table class="table table-compact w-full">
            <!-- head -->
            <thead>
            <tr>
                <th>Name</th>
                <th>Calories</th>
                <th>Taken at</th>
                <th v-show="props.admin">Actions</th>
            </tr>
            </thead>
            <tbody>
                <!-- row -->
                <tr v-for="(item, key) in props.foodEntries">
                    
                    <td>{{ item.name }}</td>
                    <td>{{ item.calorie_value }}</td>
                    <td>{{ item.taken_at }}</td>
                    <td v-show="props.admin">
                        <div class="flex">
                            <div class="pr-5">
                                <button @click="updateEntry(item)" class="btn btn-square">Edit</button>
                            </div>
                            <div>
                                <button @click="deleteEntry(item.id)" class="btn btn-square">Delete</button>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <AddEntryForm :modal-open="showEditForm">
        <div class="p-5 flex flex-col">
            <Form @submit="onSubmit">
                <div class="flex">
                    <!-- Modal header -->
                        <div class="mb-4 flex-grow">
                        <div class="text-lg font-semibold text-slate-800">
                                <div class="form-control w-full">
                                    <label class="label">
                                        <span class="label-text">Date/time when the food was taken?</span>
                                    </label>
                                    <Field name="taken_at" :rules="[required]" v-model="food.taken_at" v-slot="{field, errors}">
                                        <Datepicker v-model="food.taken_at"  v-bind="field"></Datepicker>
                                    </Field>
                                    <label class="label">
                                        <span class="label-text">Food/product name?</span>
                                    </label>
                                    <Field name="name" :rules="[required]" v-model="food.name" v-slot="{field, errors}">
                                        <input type="text" placeholder="Food name?" class="input input-bordered w-full" v-bind="field"/>
                                    </Field>
                                    <ErrorMessage class="text-red-400 text-sm" name="name" />
                                    <label class="label">
                                        <span class="label-text">Calorie value?</span>
                                    </label>
                                    <Field name="calorie_value" :rules="[required]" v-model="food.calorie_value" v-slot="{field, errors}">
                                        <input type="number" placeholder="Type here" class="input input-bordered w-full" v-bind="field"/>
                                    </Field>
                                    <ErrorMessage name="calorie_value" >
                                        <message class="text-red-400 text-sm" >Invalid value</message>
                                    </ErrorMessage>
                                    
                                </div>
                        </div>
                        </div>
                </div>
                <div class="flex flex-wrap justify-end space-x-2">
                    <button class="btn btn-error"
                            @click.stop="showEditForm = false">Cancel
                    </button>

                    <button type="submit" class="btn btn-active btn-primary">
                        <span>Update Entry</span>
                    </button>
                </div>
            </Form>
        </div>
    </AddEntryForm>
</template>