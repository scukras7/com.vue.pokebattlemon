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
        methods: {
            temp () {
                /*
                    1. display logs of battle
                    2. enable log download
                    3. replay button
                */
            }
        }
    }

</script>

<style>

</style>