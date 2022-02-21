<template>
    <div>
        <div v-if="user===1" class="row bottomSpacer">
            <div class="col-6">
                Player Bench:
            </div>
            <q-btn
                v-if="!battleStarted"
                color="white"
                text-color="black"
                label="Remove"
                :size="'xs'"
                class="col-2 offset-4 self-end"
                @click="onClickRemove"
            />
            <q-btn
                v-if="battleStarted"
                color="white"
                text-color="black"
                label="Remove"
                :size="'xs'"
                class="col-2 offset-4 self-end"
                disable
            />
        </div>
        <div v-else class="row bottomSpacer">
            <div class="col-6">
                Opponent Bench:
            </div>
            <q-btn
                v-if="!battleStarted"
                color="white"
                text-color="black"
                label="Remove"
                :size="'xs'"
                class="col-2 offset-4 self-end"
                @click="onClickRemove"
            />
            <q-btn
                v-if="battleStarted"
                color="white"
                text-color="black"
                label="Remove"
                :size="'xs'"
                class="col-2 offset-4 self-end"
                disable
            />
        </div>
        <div id="pokemonBench" class="col-12">
            <span v-if="pokemonBench.length > 0">
                <span v-for="pokemon, key in pokemonBench" :key="key">
                    <img :src="pokemon.getFrontSprite()" class="pokemonSprite"/>
                </span>
            </span>
            <span v-else>No pokemon selected</span>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'PokemonBench',
        components: {},
        emits: ['error', 'pokemonBenchChange'],
        props: {
            user: Number,
            nextPokemon: Object,
            bench: Array,
            battleStarted: Boolean
        },
        data () {
            return {
                pokemonBench: []
            }
        },
        watch: {
            nextPokemon (pokemon) {
                this.addPokemonToBench(pokemon)
            },
            bench (bench) {
                this.pokemonBench = [...bench]
            }
        },
        methods: {
            addPokemonToBench (pokemon) {
                if (this.pokemonBench.length < 6) {
                    this.pokemonBench.push(pokemon)
                    this.pokemonBenchChange()
                } else {
                    this.$emit('error', 'Cannot add more than 6 pokemon to bench')
                    setTimeout(() => {
                        this.$emit('error', '')
                    }, 5000)
                }
            },
            onClickRemove () {
                this.pokemonBench.pop()
                this.pokemonBenchChange()
            },
            pokemonBenchChange () {
                this.$emit('pokemonBenchChange', this.pokemonBench)
            }
        }
    }

</script>

<style>

    #pokemonBench {
        background-color: #afab9f;
        text-align: center;
    }

    .pokemonSprite {
        width: 3em;
    }

    .resetBtn {
        font-size: 0.65em;
    }

    .bottomSpacer {
        margin-bottom: 0.5em;
    }

</style>