<template>
    <div>
        <div v-if="user===1" class="row bottomSpacer">
            <div class="col-6 benchTitle">
                Player Bench:
            </div>
            <q-btn
                v-if="!battleStarted"
                color="white"
                text-color="black"
                label="Remove"
                :size="'xs'"
                class="col-2 offset-2 self-end qq-btn-sm"
                @click="onClickRemove"
            />
            <q-btn
                v-if="battleStarted"
                color="white"
                text-color="black"
                label="Remove"
                :size="'xs'"
                class="col-2 offset-2 self-end qq-btn-sm"
                disable
            />
        </div>
        <div v-else class="row bottomSpacer">
            <div class="col-6 benchTitle">
                Opponent Bench:
            </div>
            <q-btn
                v-if="!battleStarted"
                color="white"
                text-color="black"
                label="Remove"
                :size="'xs'"
                class="col-2 offset-2 self-end qq-btn-sm"
                @click="onClickRemove"
            />
            <q-btn
                v-if="battleStarted"
                color="white"
                text-color="black"
                label="Remove"
                :size="'xs'"
                class="col-2 offset-2 self-end qq-btn-sm"
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
                if (this.pokemonBench.length > 0) {
                    this.pokemonBench.pop()
                    this.pokemonBenchChange()
                } else {
                    this.pokemonBench = []
                }
            },
            pokemonBenchChange () {
                this.$emit('pokemonBenchChange', this.pokemonBench)
            }
        }
    }

</script>

<style>

    #pokemonBench {
        background-color: var(--secondary-std);
        text-align: center;
        border-radius: 50px;
        padding: 5px 15px 0px 15px;
        box-shadow: var(--box-shadow-std);
        font-weight: 500;

    }

    .benchTitle {
        font-weight: 500;
        margin-left: 20px;
    }

    .pokemonSprite {
        width: 40px;
    }

    .bottomSpacer {
        margin-bottom: 10px;
    }

</style>