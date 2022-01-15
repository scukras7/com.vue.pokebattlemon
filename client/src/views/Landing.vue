<template>
    <div>
        Landing works!
        <q-btn color="white" text-color="black" label="Enter" @click="onClickEnter"/>
    </div>
</template>

<script>

    import routes from '../assets/json/routes.json'

    export default {
        name: 'Landing',
        components: {},
        methods: {
            onClickEnter () {
                this.$router.push(routes.client.battleSimulator)
            }
        }
    }

</script>

<style>

</style>