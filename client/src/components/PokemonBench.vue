<template>
    <div>
        PokemonBench {{user}} works!
    </div>
</template>

<script>

    export default {
        name: 'PokemonBench',
        components: {},
        props: {
            user: Number,
            nextPokemon: String
        },
        data () {
            return {
                pokemonBench: []
            }
        },
        watch: {
            nextPokemon (pokemon) {
                this.addPokemonToBench(pokemon)
            }
        },
        methods: {
            addPokemonToBench (pokemon) {
                if (this.pokemonBench.length < 6) {
                    this.pokemonBench.push(pokemon)
                }

                console.log(this.pokemonBench)
            }
        }
    }

</script>

<style>

</style>