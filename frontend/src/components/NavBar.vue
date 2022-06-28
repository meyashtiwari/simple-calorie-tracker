<script setup lang="ts">
    import {useAuth} from "@/stores/auth.js";
    const appName = import.meta.env.VITE_APP_NAME;

    const props = defineProps({
        dailyLimit: Number,
    });

    const store = useAuth();

    const logout = () => {
        store.signout();
    }

</script>
<template>
    <div class="navbar bg-base-300">
        <div class="flex-1">
            <a class="btn btn-ghost normal-case text-xl">{{ appName }}</a>
        </div>
        <div class="flex-none">
            <div class="dropdown dropdown-end">
            <label tabindex="0" class="btn btn-ghost btn-circle">
                <div class="indicator">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1125.628 1125.628" width="30" height="30" style="enable-background:new 0 0 1125.628 1125.628" xml:space="preserve">
                    <path d="M562.812.002C252.476.002 0 252.479 0 562.814s252.476 562.812 562.812 562.812c310.34 0 562.817-252.476 562.817-562.812S873.152.002 562.812.002zM309.189 739.263l-68.974-101H222.48v101h-70v-357h70v203h15.889l57.901-93h77.963l-79.808 111.736 92.036 135.264h-77.272zm158.995-66.383c7.299 13.589 20.325 20.382 38.317 20.382 11.995 0 21.792-3.329 29.023-10.286 7.226-6.952 11.026-14.712 11.026-27.712h61.131l.69 1.237c.612 25.224-8.88 46.258-28.489 63.246-19.605 16.997-43.942 25.452-73.007 25.452-37.218 0-65.962-11.781-86.11-35.309-20.144-23.529-30.283-53.763-30.283-90.671v-6.925c0-36.753 10.102-66.968 30.169-90.652 20.071-23.68 48.745-35.524 85.958-35.524 30.76 0 55.57 8.766 74.412 26.297 18.833 17.531 27.954 41.73 27.342 70.334l-.453 2.516h-61.36c0-14-3.54-24.775-10.611-33.312-7.075-8.533-16.837-13.365-29.298-13.365-17.837 0-31.158 6.628-38.457 20.446-7.308 13.818-11.703 31.349-11.703 53.151v6.911c0 22.266 4.395 40.194 11.703 53.784zm324.958 66.383c-2.462-4-4.582-11.157-6.345-17.465-1.772-6.304-3.038-12.499-3.805-19.113-6.925 12.15-16.033 22.354-27.338 30.348-11.301 7.998-24.798 12.061-40.484 12.061-26.141 0-46.285-6.691-60.432-20.148-14.151-13.457-21.222-31.78-21.222-54.998 0-24.456 9.414-43.221 28.256-56.683 18.833-13.452 46.327-20.003 82.467-20.003h39.242v-20.18c0-11.995-3.974-21.3-10.282-27.914-6.303-6.609-16.019-9.917-28.32-9.917-10.922 0-19.545 2.65-25.465 7.957-5.92 5.303-8.982 12.648-8.982 22.026l-65.101-.228-.259-1.384c-1.073-21.066 8.063-39.251 27.44-54.553 19.377-15.302 44.822-22.953 76.349-22.953 29.832 0 54.075 7.578 72.684 22.72 18.605 15.151 27.938 36.716 27.938 64.703v103.113c0 11.689.854 22.156 2.622 32.461 1.768 10.3 4.55 21.149 8.396 30.149h-67.359zm109.339 0v-357h70v357h-70z"/>
                    <path d="M711.712 640.846c-7.382 7.153-11.072 16.229-11.072 26.379 0 8.304 2.768 15.211 8.304 20.285 5.536 5.075 13.069 7.717 22.606 7.717 11.84 0 23.195-2.865 32.422-8.707 9.227-5.847 14.509-12.558 19.509-20.246v-37.012h-39.242c-14.306.001-25.146 4.436-32.527 11.584z"/>
                    <g/>
                    <g/>
                    <g/>
                    <g/>
                    <g/>
                    <g/>
                    <g/>
                    <g/>
                    <g/>
                    <g/>
                    <g/>
                    <g/>
                    <g/>
                    <g/>
                    <g/>
                </svg>

                <span class="badge badge-sm indicator-item">8</span>
                </div>
            </label>
            <div tabindex="0" class="mt-3 card card-compact dropdown-content w-52 bg-base-100 shadow">
                <div class="card-body">
                <span class="font-bold text-lg">8 Items</span>
                <span class="text-info">Calories today: $999</span>
                <div class="card-actions">
                    <button class="btn btn-primary btn-block">Daily Limit: {{ props.dailyLimit }}</button>
                </div>
                </div>
            </div>
            </div>
            <div class="dropdown dropdown-end">
            <label tabindex="0" class="btn btn-ghost btn-circle avatar">
                <div class="w-10 rounded-full">
                <img src="https://api.lorem.space/image/drink?hash=33791" />
                </div>
            </label>
            <ul tabindex="0" class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                <li>
                <a class="justify-between">
                    Add Entry
                    <span class="badge">New</span>
                </a>
                </li>
                <li><a @click="logout">Logout</a></li>
            </ul>
            </div>
        </div>
    </div>
</template>