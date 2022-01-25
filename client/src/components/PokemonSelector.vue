<template>
    <div>
        <div class="row q-gutter-sm">
            <q-btn-group push>
                <q-btn
                    class="playerSelectBtnGroup"
                    color="amber-7"
                    flat
                    label="Player"
                    @click="onClickSelectPlayer(PLAYERS.player)"
                />
                <q-btn
                    class="playerSelectBtnGroup"
                    color="amber-7"
                    flat
                    label="Opponent"
                    @click="onClickSelectPlayer(PLAYERS.opponent)"
                />
            </q-btn-group>
            <div class="col-4 offset-1">
                <q-select
                    borderless
                    label-color="amber-7"
                    color="amber-7"
                    v-model="pokemonBaseLevel"
                    :options="pokemonBaseLevelOptions"
                    label="Base Lvl"
                    :hide-bottom-space="true"
                    popup-content-class="baseLevelSelect"
                    dense
                    :disable="disableBaseLevelSelector"
                />
            </div>
        </div>
        <div id="pokemonSprites" class="col-12">
            <img v-for="sprite, key in pokemonSprites"
                :src="sprite"
                :key="key"
                class="sprite"
                @click="onClickPokemon(pokemonNames[key], sprite)"
            />
        </div>
    </div>
</template>

<script>

    import HttpService from '../services/HttpService'
    import { getFrontSprites } from '../assets/graphql/queries'
    import { PLAYERS } from '../assets/constants'

    export default {
        name: 'PokemonSelector',
        components: {},
        emit: ['nextSelectedPokemon', 'selectedPlayer', 'pokemonBaseLevel'],
        props: {
            battleStarted: Boolean,
            pokemonBenchPlayer: Array,
            pokemonBenchOpponent: Array
        },
        data () {
            return {
                selectedPlayer: PLAYERS.player,
                pokemonNames: [],
                pokemonSprites: [],
                pokemonBaseLevel: 10,
                pokemonBaseLevelOptions: [],
                disableBaseLevelSelector: false
            }
        },
        watch: {
            pokemonBenchPlayer (bench) {
                if (bench.length === 0 && this.pokemonBenchOpponent.length === 0) {
                    this.disableBaseLevelSelector = false
                }
            },
            pokemonBenchOpponent (bench) {
                if (bench.length === 0 && this.pokemonBenchPlayer.length === 0) {
                    this.disableBaseLevelSelector = false
                }
            },
            pokemonBaseLevel (lvl) {
                this.$emit('pokemonBaseLevel', lvl)
            }
        },
        created () {

            this.PLAYERS = PLAYERS

            this.$emit('selectedPlayer', this.selectedPlayer)
            this.$emit('pokemonBaseLevel', this.pokemonBaseLevel)

            HttpService.graphql({ query: getFrontSprites })
                .then((res) => {
                    res.data.data.pokemon.forEach((pokemon) => {
                        this.pokemonNames.push(pokemon.name)
                        this.pokemonSprites.push(pokemon.sprites.front_default)
                    })
                })

            this.populatePokemonLevel()
        },
        methods: {
            onClickPokemon (pokemon, sprite) {
                if (!this.battleStarted) {
                    this.disableBaseLevelSelector = true
                    this.$emit('nextSelectedPokemon', { pokemon, sprite, lvl: this.pokemonBaseLevel })
                }
            },
            onClickSelectPlayer (playerSelection) {
                if (this.selectedPlayer !== playerSelection) {
                    this.selectedPlayer = playerSelection
                    this.$emit('selectedPlayer', playerSelection)
                }
            },
            populatePokemonLevel () {
                for (let i = 1; i <= 99; i++) {
                    this.pokemonBaseLevelOptions.push(i)
                }
            }
        }
    }

</script>

<style>

    .playerSelectBtnGroup {
        font-size: 0.7em !important;
    }

    .sprite {
        width: 3em;
        cursor: pointer;
    }

    .baseLevelSelect {
        background-color: #394855 !important;
    }

    #pokemonSprites {
        background-color:#afab9f;
        height: 75vh;
        overflow-y: auto;
    }

</style>