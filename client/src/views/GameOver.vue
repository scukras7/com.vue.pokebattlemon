<template>
    <div>
        GameOver works! {{winningPlayer}}
    </div>
</template>

<script>

    export default {
        name: 'GameOver',
        components: {},
        props: {
            bGameOver: Boolean,
            winningPlayer: String
        },
        watch: {
            winningPlayer (player) {
                console.log(`I am the winner: ${player}`)
            }
        },
        methods: {}
    }

</script>

<style>

</style>