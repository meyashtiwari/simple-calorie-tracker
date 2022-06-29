<script setup lang="ts">
    import { reactive, ref } from 'vue';
    import {Field, Form, ErrorMessage} from "vee-validate"
    import { required, email } from "@vee-validate/rules";
    import {useUser} from "@/stores/user.js";

    const inviteUser = reactive({
        name: '',
        email: ''
    });

    const userStore = useUser();
    const response = ref({});

    const onSubmit = (async (values) => {
        response.value = await userStore.inviteUser(values);
    });
</script>

<template>
    <div class="form-control w-full max-w-xs">
        <Form @submit="onSubmit">
            <label class="label">
                <span class="label-text">Name</span>
            </label>
            <Field name="name" :rules="[required]" v-model="inviteUser.name" v-slot="{field, errors}">
                <input type="text" placeholder="Type Name" class="input input-bordered w-full max-w-xs" :class="(errors.length) ? 'input-error' : ''" v-bind="field" />
            </Field>
            <ErrorMessage class="text-red-400 text-sm" name="name" />

            <label class="label">
                <span class="label-text">Email</span>
            </label>
            <Field name="email" :rules="[required, email]" v-model="inviteUser.email" v-slot="{field, errors}">
                <input type="text" placeholder="Type Email" class="input input-bordered w-full max-w-xs" :class="(errors.length) ? 'input-error' : ''" v-bind="field"/>
            </Field>
            <ErrorMessage class="text-red-400 text-sm" name="email" />

            <div v-if="response" class="text-center">
                <div v-if="response.error === true">User is already registered.</div>
                <div v-if="response.error === false">Generated password: {{ response.password }}</div>
            </div>

            <button type="submit" class="btn mt-3 btn-active w-full btn-primary">Invite your friend</button>
        </Form>
    </div>
</template>