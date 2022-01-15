<template>
    <div>
        Simulator works!
        <div>
            Reset Button
        </div>
        <div class="row justify-around q-gutter-sm">
            <div class="col-3">
                <PokemonSelector
                    @nextSelectedPokemon="onNextSelectedPokemon"
                    @selectedPlayer="onSelectedPlayer"
                />
            </div>
            <div class="">
                <BattleWindow/>
            </div>
            <div class="">
                <div class="col-12">
                    <PokemonBench :user="1" :nextPokemon="nextPlayerPokemon"/>
                </div>
                <div class="col-12">
                    <PokemonBench :user="2" :nextPokemon="nextOpponentPokemon"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import PokemonSelector from '../components/PokemonSelector'
    import BattleWindow from '../components/BattleWindow'
    import PokemonBench from '../components/PokemonBench'
    import { PLAYERS } from '../assets/constants'

    export default {
        name: 'Simulator',
        components: {
            PokemonSelector,
            BattleWindow,
            PokemonBench
        },
        data () {
            return {
                selectedPlayer: '',
                nextPlayerPokemon: '',
                nextOpponentPokemon: ''
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
            }
        }
    }

</script>

<style>

</style>