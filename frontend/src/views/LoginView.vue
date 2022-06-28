<script setup lang="ts">
    import {reactive} from 'vue';
    import {useAuth} from "@/stores/auth.js";
    import {Field, Form, ErrorMessage} from "vee-validate"
    import { required, email } from "@vee-validate/rules";
    import CalorieAppIcon from '@/components/icons/CalorieAppIcon.vue';
    import router from '@/router/index.js';

    const store = useAuth();

    const user = reactive({
      email: '',
      password: ''
    })

    const onSubmit = ((values: typeof user) => {
        store.login(values.email, values.password).then(async () => {
            await router.push({name: 'home'});
        });
    });
</script>

<template>
    <div class="hero min-h-screen bg-base-200">
        <div class="hero-content flex-col lg:flex-row-reverse">
            <div class="text-center lg:text-left">
                <CalorieAppIcon :width="512" :height="512"/>
            </div>
            <div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                <Form @submit="onSubmit">
                    <div class="card-body">
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Email</span>
                            </label>
                            <Field name="email" :rules="[required, email]" v-model="user.email" v-slot="{field, errors}">
                                <input type="text" placeholder="email" class="input input-bordered" :class="(errors.length) ? 'input-error' : ''" v-bind="field"/>
                            </Field>
                            <ErrorMessage class="text-red-400 text-sm" name="email" />
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Password</span>
                            </label>
                            <Field name="password" :rules="[required]" v-model="user.password" v-slot="{field, errors}">
                                <input type="password" placeholder="password" class="input input-bordered" :class="(errors.length) ? 'input-error' : ''" v-bind="field"/>
                            </Field>
                            <ErrorMessage class="text-red-400 text-sm" name="password" />
                            <label class="label">
                                <router-link to="/signup" class="label-text-alt link link-hover">New User? Signup here.</router-link>
                            </label>
                        </div>
                        <div class="form-control mt-6">
                            <button type="submit" class="btn btn-primary">Login</button>
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    </div>
</template>