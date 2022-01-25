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
                    :pokemonBenchPlayer="pokemonBenchPlayer"
                    :pokemonBenchOpponent="pokemonBenchOpponent"
                    @nextSelectedPokemon="onNextSelectedPokemon"
                    @selectedPlayer="onSelectedPlayer"
                    @pokemonBaseLevel="onPokemonBaseLevel"
                />
            </div>
            <div class="col-3">
                <BattleWindow
                    :pokemonBenchPlayer="pokemonBenchPlayer"
                    :pokemonBenchOpponent="pokemonBenchOpponent"
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
                pokemonBaseLevel: 1,
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
                    bench.push(pokemon)
                })
                this.pokemonBenchPlayer = [...bench]
            },
            onChangePokemonBenchOpponent (pokemonBench) {
                const bench = []
                pokemonBench.forEach((pokemon) => {
                    bench.push(pokemon)
                })
                this.pokemonBenchOpponent = [...bench]
            },
            onPokemonBaseLevel (lvl) {
                this.pokemonBaseLevel = lvl
            },
            onStartBattle () {
                let error = false
                this.errorMessage = ''

                if (this.pokemonBenchPlayer.length < 1) {
                    error = true
                    this.errorMessage = 'Player\'s bench must have at least 1 pokemon'
                }

                if (this.pokemonBenchOpponent < 1) {
                    error = true
                    this.errorMessage = 'Opponent\'s bench must have at least 1 pokemon'
                }

                if (!error) {
                    this.bBattleStarted = true
                }
            },
            onError (error) {
                this.errorMessage = error
            }
        }
    }

</script>

<style>

</style>