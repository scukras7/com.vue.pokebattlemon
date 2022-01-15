<template>
    <div>
        <GeneralMessageBox :message="errorMessage"/>
        <div>
            Reset Button
        </div>
        <div class="row justify-around q-gutter-sm">
            <div class="col-3">
                <PokemonSelector
                    :battleStarted="bBattleStarted"
                    @nextSelectedPokemon="onNextSelectedPokemon"
                    @selectedPlayer="onSelectedPlayer"
                />
            </div>
            <div class="col-3">
                <BattleWindow
                    @startBattle="onStartBattle"
                />
            </div>
            <div class="col-3">
                <div class="col-12">
                    <PokemonBench
                        :user="1"
                        :nextPokemon="nextPlayerPokemon"
                        :battleStarted="bBattleStarted"
                        @error="onError"
                        @pokemonBenchChange="onChangePokemonBenchPlayer"
                    />
                </div>
                <p/>
                <div class="col-12">
                    <PokemonBench
                        :user="2"
                        :nextPokemon="nextOpponentPokemon"
                        :battleStarted="bBattleStarted"
                        @error="onError"
                        @pokemonBenchChange="onChangePokemonBenchOpponent"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import GeneralMessageBox from '../components/GeneralMessageBox'
    import PokemonSelector from '../components/PokemonSelector'
    import BattleWindow from '../components/BattleWindow'
    import PokemonBench from '../components/PokemonBench'
    import { PLAYERS } from '../assets/constants'

    export default {
        name: 'Simulator',
        components: {
            GeneralMessageBox,
            PokemonSelector,
            BattleWindow,
            PokemonBench
        },
        data () {
            return {
                selectedPlayer: '',
                nextPlayerPokemon: {},
                nextOpponentPokemon: {},
                pokemonBenchPlayer: [],
                pokemonBenchOpponent: [],
                bBattleStarted: false,
                errorMessage: ''
            }
        },
        methods: {
            onNextSelectedPokemon (pokemon) {
                if (this.selectedPlayer === PLAYERS.player) {
                    this.nextPlayerPokemon = pokemon
                } else {
                    this.nextOpponentPokemon = pokemon
                }
            },
            onSelectedPlayer (player) {
                this.selectedPlayer = player
            },
            onChangePokemonBenchPlayer (pokemonBench) {
                const bench = []
                pokemonBench.forEach((pokemon) => {
                    bench.push(pokemon.pokemon)
                })
                this.pokemonBenchPlayer = [...bench]
            },
            onChangePokemonBenchOpponent (pokemonBench) {
                const bench = []
                pokemonBench.forEach((pokemon) => {
                    bench.push(pokemon.pokemon)
                })
                this.pokemonBenchOpponent = [...bench]
            },
            onStartBattle () {
                this.bBattleStarted = true
            },
            onError (error) {
                this.errorMessage = error
            }
        }
    }

</script>

<style>

</style>