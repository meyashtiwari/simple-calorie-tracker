<script setup lang="ts">
    const props = defineProps({
        foodEntries: Array
    });
</script>

<template>
    <div class="overflow-x-auto">
        <table class="table w-full">
            <!-- head -->
            <thead>
            <tr>
                <th></th>
                <th>Name</th>
                <th>Calories</th>
                <th>Taken at</th>
            </tr>
            </thead>
            <tbody>
                <!-- row -->
                <tr v-for="(item, key) in props.foodEntries">
                    <th>{{ item.id }}</th>
                    <td>{{ item.name }}</td>
                    <td>{{ item.calorie_value }}</td>
                    <td>{{ item.taken_at }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>