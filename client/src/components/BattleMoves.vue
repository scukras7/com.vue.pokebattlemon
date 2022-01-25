<template>
    <div v-if="battleStart">
        BattleMoves works!
    </div>
</template>

<script>

    export default {
        name: 'BattleMoves',
        components: {},
        props: {
            battleStart: Boolean,
            pokemonBenchPlayer: Array,
            pokemonBenchOpponent: Array
        },
        watch: {
            battleStart () {
                this.init()
            }
        },
        methods: {
            init () {
                // TODO Player/Opponent attack in this component
                // TODO send attack updates HP, bench change, active pokemon to BattleWindow
            }
        }
    }

</script>

<style>

</style>