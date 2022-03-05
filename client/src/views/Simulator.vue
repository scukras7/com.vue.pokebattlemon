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
                        :bench="pokemonBenchPlayer"
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
                        :bench="pokemonBenchOpponent"
                        :battleStarted="bBattleStarted"
                        @error="onError"
                        @pokemonBenchChange="onChangePokemonBenchOpponent"
                    />
                </div>
            </div>
        </div>
        <div class="row justify-center">
            <div class="col-4"/>
            <div class="col-3">
                <BattleMoves
                    :battleStart="bBattleStarted"
                    :playerTurn="playerTurn"
                    :activePokemonPlayer="activePokemonPlayer"
                    :activePokemonOpponent="activePokemonOpponent"
                    @playerSelectedMove="onPlayerSelectedMove"
                    @faintPlayerPokemon="faintPokemon"
                    @error="onError"
                />
                <!--<BattleMessages/>-->
            </div>
            <div class="col-4"/>
        </div>
    </div>
</template>

<script>

    import OpponentService from '../services/OpponentService'
    import GeneralMessageBox from '../components/GeneralMessageBox'
    import PokemonSelector from '../components/PokemonSelector'
    import BattleWindow from '../components/BattleWindow'
    import PokemonBench from '../components/PokemonBench'
    import BattleMoves from '../components/BattleMoves'
    // import BattleMessages from '../components/BattleMessages'
    import { PlayerService } from '../services/PlayerService'
    import { AttackService } from '../services/AttackService'
    import { PLAYERS } from '../assets/constants'

    export default {
        name: 'Simulator',
        components: {
            GeneralMessageBox,
            PokemonSelector,
            BattleWindow,
            PokemonBench,
            BattleMoves,
            // BattleMessages
        },
        data () {
            return {
                selectedPlayer: '',
                playerTurn: '',
                nextPlayerPokemon: {},
                nextOpponentPokemon: {},
                pokemonBenchPlayer: [],
                pokemonBenchOpponent: [],
                activePokemonPlayer: {},
                activePokemonOpponent: {},
                bBattleStarted: false,
                pokemonBaseLevel: 1,
                errorMessage: '',
                bGameOver: false,
                winningPlayer: ''
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
                this.activePokemonPlayer = pokemonBench[0]
                pokemonBench.forEach((pokemon) => {
                    bench.push(pokemon)
                })
                this.pokemonBenchPlayer = [...bench]
            },
            onChangePokemonBenchOpponent (pokemonBench) {
                const bench = []
                this.activePokemonOpponent = pokemonBench[0]
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
                    const pokemonSpeedPlayer = this.pokemonBenchPlayer[0].getSpeed
                    const pokemonSpeedOpponent = this.pokemonBenchOpponent[0].getSpeed
                    let playerTurn

                    pokemonSpeedPlayer >= pokemonSpeedOpponent ? playerTurn = PLAYERS.player : playerTurn = PLAYERS.opponent
                    this.playerTurn = playerTurn

                    this.bBattleStarted = true

                    if (playerTurn === PLAYERS.opponent) {
                        this.executeOpponentsTurn()
                    }
                }
            },
            onError (error) {
                this.errorMessage = error
            },
            onPlayerSelectedMove (move) {

                const playerMoveRes = PlayerService.createMove(this.activePokemonPlayer, move)
                this.activePokemonPlayer = playerMoveRes.pokemon

                // TODO log pokemon and move in database

                if (playerMoveRes.bApplyMoveToOpponent) {
                    this.executeMove(playerMoveRes)
                }

                this.playerTurn = PLAYERS.opponent
                this.executeOpponentsTurn()
            },
            executeOpponentsTurn () {
                const chosenMoveRes = OpponentService.chooseMove(this.activePokemonOpponent)
                this.activePokemonOpponent = chosenMoveRes.pokemon
                console.log('DEBUG chosenMoveRes')
                console.log(chosenMoveRes)

                // TODO log pokemon and move in database

                if (chosenMoveRes.faint) {
                    console.log('pokemon fainted')
                    this.faintPokemon(PLAYERS.opponent)
                } else {
                    this.executeMove(chosenMoveRes)
                }

                this.playerTurn = PLAYERS.player
            },
            faintPokemon (player) {

                let bench

                if (player === PLAYERS.player) {
                    bench = [...this.pokemonBenchPlayer]
                } else {
                    bench = [...this.pokemonBenchOpponent]
                }

                bench.shift()

                if (bench.length < 1) {
                    // TODO redirect to GamerOver component
                    console.log('DEBUG no remaining pokemon -> redirect to GameOver')
                    this.bGameOver = true
                    player === PLAYERS.player ? this.winningPlayer = PLAYERS.player : this.winningPlayer = PLAYERS.opponent
                } else {
                    if (player === PLAYERS.player) {
                        this.pokemonBenchPlayer = [...bench]
                        this.activePokemonPlayer = bench[0]
                        this.playerTurn = PLAYERS.opponent
                    } else {
                        this.pokemonBenchOpponent = [...bench]
                        this.activePokemonOpponent = bench[0]
                        this.playerTurn = PLAYERS.player
                    }
                }
            },
            executeMove (moveRes) {

                /* TODO
                    1. apply attack to opponent, deal damage
                    2. check if opponent fainted
                    3. if fainted get next pokemon from bench
                    4. if bench is empty redirect to GameOver

                    Update pokemon on return

                    { pokemon, faint: Boolean }
                */

                if (this.playerTurn === PLAYERS.player) {
                    AttackService.applyAttack(moveRes.move, this.activePokemonPlayer, this.activePokemonOpponent)
                } else {
                    AttackService.applyAttack(moveRes.move, this.activePokemonOpponent, this.activePokemonPlayer)
                }

            }
        }
    }

</script>

<style>

</style>