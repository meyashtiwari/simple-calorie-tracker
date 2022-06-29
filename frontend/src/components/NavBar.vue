<script setup lang="ts">
    import {ref, reactive} from "vue";
    import {useAuth} from "@/stores/auth.js";
    import {useUser} from "@/stores/user.js";
    import AddEntryForm from "@/components/AddEntryForm.vue";
    import {Field, Form, ErrorMessage} from "vee-validate"
    import { required } from "@vee-validate/rules";
    import Datepicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css'
    import moment from 'moment';
    import ModalBox from '@/components/ModalBox.vue';
    import InviteUser from "@/components/InviteUser.vue";
    
const appName = import.meta.env.VITE_APP_NAME;

const props = defineProps({
    dailyLimit: Number,
    limit: Boolean,
    admin: Boolean,
    metaData: Array,
    users: Array
});

const food = reactive({
    user_id: '',
    name: '',
    calorie_value: '',
    taken_at: ''
});

const emit = defineEmits(['refresh']);
const refresh = () => emit('refresh');

const showForm = ref(false);
const store = useAuth();
const userStore = useUser();

const logout = () => {
    store.signout();
}

const toggleForm = () => {
    showForm.value = !showForm.value;
}

    const showInvite = () => {
        showInviteForm.value = !showInviteForm.value;
    }

    const onSubmit = ((values) => {
        values.taken_at = moment(values.taken_at).format('YYYY-M-D H:m:s');
        food.taken_at = moment(values.taken_at).format('YYYY-M-D H:m:s');
        if(props.admin === true) {
            if(food.user_id === '')
                return;
            else {
                userStore.createNewFoodEntryAdmin(food).then(async () => {
                await userStore.getAllFoodEntries();
                showForm.value = false;
                food.user_id = '';
                food.name = '';
                food.calorie_value = '';
                food.taken_at = '';
                refresh();
            });
        }
    } else {
        userStore.createNewFoodEntry(values).then(async () => {
            await userStore.getAllFoodEntries();
            showForm.value = false;
            food.name = '';
            food.calorie_value = '';
            food.taken_at = '';
            refresh();
        });
    }
});

</script>

<template>
    <div class="navbar bg-base-300">
        <div class="flex-1">
            <a class="btn btn-ghost normal-case text-xl">{{ appName }}</a>
            <router-link v-show="props.admin" to="/admin/dashboard" class="btn link link-hover  ml-5">Dashboard</router-link>
            <div>
                <button @click="toggleForm" class="btn  ml-5">
                    New Food Entry
                </button>
            </div>
            <div v-show="!props.admin">
                <button @click="showInvite" class="btn">
                    Invite Friends
                </button>
            </div>
            <div v-show="props.admin" class="px-1">
                <button @click="logout" class="btn">
                    Logout
                </button>
                
                <router-link to="/admin/report" class="btn link link-hover ">Reports</router-link>  
            </div>
            <div v-if="props.metaData" class="px-1">
                <span class="text-red-500 px-5 font-bold"
                    v-show="props?.metaData[0]?.calories_today>props.dailyLimit">Calorie limit exceeded for today</span>
            </div>
        </div>
        <div v-if="props.metaData" class="flex-none">
            <div class="dropdown dropdown-end">
                <label tabindex="0" class="btn btn-ghost btn-circle">
                    <div class="indicator">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1125.628 1125.628" width="30" height="30"
                            style="enable-background:new 0 0 1125.628 1125.628" xml:space="preserve">
                            <path
                                d="M562.812.002C252.476.002 0 252.479 0 562.814s252.476 562.812 562.812 562.812c310.34 0 562.817-252.476 562.817-562.812S873.152.002 562.812.002zM309.189 739.263l-68.974-101H222.48v101h-70v-357h70v203h15.889l57.901-93h77.963l-79.808 111.736 92.036 135.264h-77.272zm158.995-66.383c7.299 13.589 20.325 20.382 38.317 20.382 11.995 0 21.792-3.329 29.023-10.286 7.226-6.952 11.026-14.712 11.026-27.712h61.131l.69 1.237c.612 25.224-8.88 46.258-28.489 63.246-19.605 16.997-43.942 25.452-73.007 25.452-37.218 0-65.962-11.781-86.11-35.309-20.144-23.529-30.283-53.763-30.283-90.671v-6.925c0-36.753 10.102-66.968 30.169-90.652 20.071-23.68 48.745-35.524 85.958-35.524 30.76 0 55.57 8.766 74.412 26.297 18.833 17.531 27.954 41.73 27.342 70.334l-.453 2.516h-61.36c0-14-3.54-24.775-10.611-33.312-7.075-8.533-16.837-13.365-29.298-13.365-17.837 0-31.158 6.628-38.457 20.446-7.308 13.818-11.703 31.349-11.703 53.151v6.911c0 22.266 4.395 40.194 11.703 53.784zm324.958 66.383c-2.462-4-4.582-11.157-6.345-17.465-1.772-6.304-3.038-12.499-3.805-19.113-6.925 12.15-16.033 22.354-27.338 30.348-11.301 7.998-24.798 12.061-40.484 12.061-26.141 0-46.285-6.691-60.432-20.148-14.151-13.457-21.222-31.78-21.222-54.998 0-24.456 9.414-43.221 28.256-56.683 18.833-13.452 46.327-20.003 82.467-20.003h39.242v-20.18c0-11.995-3.974-21.3-10.282-27.914-6.303-6.609-16.019-9.917-28.32-9.917-10.922 0-19.545 2.65-25.465 7.957-5.92 5.303-8.982 12.648-8.982 22.026l-65.101-.228-.259-1.384c-1.073-21.066 8.063-39.251 27.44-54.553 19.377-15.302 44.822-22.953 76.349-22.953 29.832 0 54.075 7.578 72.684 22.72 18.605 15.151 27.938 36.716 27.938 64.703v103.113c0 11.689.854 22.156 2.622 32.461 1.768 10.3 4.55 21.149 8.396 30.149h-67.359zm109.339 0v-357h70v357h-70z" />
                            <path
                                d="M711.712 640.846c-7.382 7.153-11.072 16.229-11.072 26.379 0 8.304 2.768 15.211 8.304 20.285 5.536 5.075 13.069 7.717 22.606 7.717 11.84 0 23.195-2.865 32.422-8.707 9.227-5.847 14.509-12.558 19.509-20.246v-37.012h-39.242c-14.306.001-25.146 4.436-32.527 11.584z" />
                            <g />
                            <g />
                            <g />
                            <g />
                            <g />
                            <g />
                            <g />
                            <g />
                            <g />
                            <g />
                            <g />
                            <g />
                            <g />
                            <g />
                            <g />
                        </svg>

                        <span class="badge badge-sm indicator-item">{{ props?.metaData[0]?.count ?? 0 }}</span>
                    </div>
                </label>
                <div tabindex="0" class="mt-3 card card-compact dropdown-content w-52 bg-base-100 shadow">
                    <div class="card-body">
                        <span class="font-bold text-lg">Items: {{ props?.metaData[0]?.count ?? 0 }}</span>
                        <span class="text-info">Calories today: {{ props?.metaData[0]?.calories_today ?? 0 }}</span>
                        <div class="card-actions">
                            <button class="btn btn-primary btn-block">Daily Limit: {{ props.dailyLimit ?? 0 }}</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="dropdown dropdown-end">
                <label tabindex="0" class="btn btn-ghost btn-circle avatar">
                    <div class="w-10 rounded-full">


                        <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                            xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 272.383 272.383"
                            style="enable-background:new 0 0 272.383 272.383;" xml:space="preserve">
                            <g>
                                <g>
                                    <path style="fill:#010002;" d="M223.214,152.723h-32.237c16.306-20.152,26.76-47.195,26.76-71.415
			C217.737,36.474,181.262,0,136.428,0S55.114,36.474,55.114,81.309c0,24.22,10.454,51.263,26.76,71.415H49.164
			c-14.86,0-28.544,7.468-36.599,19.972c-5.673,8.811-6.864,24.242-3.535,45.868l4.259,27.701
			c2.246,14.647,15.621,26.118,30.437,26.118h184.928c14.816,0,28.191-11.471,30.442-26.118l4.259-27.701
			c3.329-21.626,2.138-37.056-3.535-45.868C251.758,160.191,238.073,152.723,223.214,152.723z M248.342,244.616
			c-1.409,9.154-10.427,16.888-19.689,16.888H43.725c-9.263,0-18.281-7.734-19.689-16.888l-4.259-27.701
			c-2.828-18.389-2.143-31.998,1.931-38.324c6.043-9.388,16.312-14.99,27.456-14.99h42.838
			c12.901,11.988,28.229,19.668,44.421,19.668s31.525-7.68,44.421-19.668h42.37c11.145,0,21.414,5.602,27.456,14.985
			c4.079,6.326,4.759,19.94,1.931,38.324L248.342,244.616z M207.408,81.309c0,24.438-12.276,52.786-30.263,71.415
			c-1.86,1.925-3.775,3.737-5.749,5.439c-2.29,1.974-4.64,3.813-7.065,5.439c-8.686,5.831-18.145,9.339-27.908,9.339
			s-19.216-3.508-27.902-9.339c-2.426-1.626-4.775-3.465-7.065-5.439c-1.974-1.702-3.889-3.514-5.749-5.439
			c-17.987-18.629-30.263-46.972-30.263-71.415c0-39.14,31.84-70.985,70.985-70.985S207.408,42.169,207.408,81.309z" />
                                </g>
                            </g>
                            <g>
                            </g>
                            <g>
                            </g>
                            <g>
                            </g>
                            <g>
                            </g>
                            <g>
                            </g>
                            <g>
                            </g>
                            <g>
                            </g>
                            <g>
                            </g>
                            <g>
                            </g>
                            <g>
                            </g>
                            <g>
                            </g>
                            <g>
                            </g>
                            <g>
                            </g>
                            <g>
                            </g>
                            <g>
                            </g>
                        </svg>
                    </div>
                </label>
                <ul tabindex="0"
                    class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                    <li><a @click="logout">Logout</a></li>
                </ul>
            </div>
        </div>
    </div>
    <AddEntryForm :modal-open="showForm">
        <div class="p-5 flex flex-col">
            <Form @submit="onSubmit">
                <div class="flex">
                    <!-- Modal header -->
                    <div class="mb-4 flex-grow">
                        <div class="text-lg font-semibold text-slate-800">
                            <div class="form-control w-full">
                                <label v-if="props.admin && props.users" class="label">
                                    <span class="label-text">Select a user to add entry for:</span>
                                </label>
                                <select v-if="props.admin && props.users" v-model="food.user_id"
                                    class="select select-bordered w-full max-w-xs">
                                    <option value='' disabled selected>Pick user</option>
                                    <option v-for="user in props.users" :value="user.id">
                                        {{ user.name }}
                                    </option>
                                </select>
                                <label class="label">
                                    <span class="label-text">Date/time when the food was taken?</span>
                                </label>
                                <Field name="taken_at" :rules="[required]" v-model="food.taken_at"
                                    v-slot="{field, errors}">
                                    <Datepicker v-model="food.taken_at" v-bind="field"></Datepicker>
                                </Field>
                                <label class="label">
                                    <span class="label-text">Food/product name?</span>
                                </label>
                                <Field name="name" :rules="[required]" v-model="food.name" v-slot="{field, errors}">
                                    <input type="text" placeholder="Food name?" class="input input-bordered w-full"
                                        v-bind="field" />
                                </Field>
                                <ErrorMessage class="text-red-400 text-sm" name="name" />
                                <label class="label">
                                    <span class="label-text">Calorie value?</span>
                                </label>
                                <Field name="calorie_value" :rules="[required]" v-model="food.calorie_value"
                                    v-slot="{field, errors}">
                                    <input type="number" placeholder="Type here" class="input input-bordered w-full"
                                        v-bind="field" />
                                </Field>
                                <ErrorMessage name="calorie_value">
                                    <message class="text-red-400 text-sm">Invalid value</message>
                                </ErrorMessage>

                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex flex-wrap justify-end space-x-2">
                    <button class="btn btn-error" @click.stop="showForm = false">Cancel
                    </button>

                    <button type="submit" class="btn btn-active btn-primary">
                        <span>Add Entry</span>
                    </button>
                </div>
            </Form>
        </div>
    </AddEntryForm>

    <ModalBox :modal-open="showInviteForm">
        <label @click="showInviteForm = !showInviteForm" for="my-modal-3" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
        <div class="flex justify-center p-5">
            <InviteUser />
        </div>
    </ModalBox>
</template>