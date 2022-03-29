<template>
    <div>
        <GeneralMessageBox :message="errorMessage"/>
        <div class="row justify-around q-gutter-sm">
            <div class="col-3">
                <PokemonSelector
                    :battleStarted="bBattleStarted"
                    :pokemonBenchPlayer="pokemonBenchPlayer"
                    :pokemonBenchOpponent="pokemonBenchOpponent"
                    @nextSelectedPokemon="onNextSelectedPokemon"
                    @selectedPlayer="onSelectedPlayer"
                    @pokemonBaseLevel="onPokemonBaseLevel"
                    @loadingPokemon="onLoading"
                />
            </div>
            <div class="col-3">
                <div class="row">
                    <BattleWindow
                        :pokemonBenchPlayer="pokemonBenchPlayer"
                        :pokemonBenchOpponent="pokemonBenchOpponent"
                        :activePokemonPlayerRemainingHp="activePokemonPlayerRemainingHp"
                        :activePokemonOpponentRemainingHp="activePokemonOpponentRemainingHp"
                        :loading="loading"
                        @startBattle="onStartBattle"
                    />
                </div>
                <div class="row">
                    <BattleMoves
                        :battleStart="bBattleStarted"
                        :playerTurn="playerTurn"
                        :activePokemonPlayer="activePokemonPlayer"
                        @playerSelectedMove="onPlayerSelectedMove"
                        @faintPlayerPokemon="faintPokemon"
                        @error="onError"
                    />
                </div>
                <div class="row">
                    <BattleMessages :battleMessageUpdate="battleMessageUpdate" :battleStart="bBattleStarted"/>
                </div>
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
    </div>
</template>

<script>

    import OpponentService from '../services/OpponentService'
    import GeneralMessageBox from '../components/GeneralMessageBox'
    import PokemonSelector from '../components/PokemonSelector'
    import BattleWindow from '../components/BattleWindow'
    import PokemonBench from '../components/PokemonBench'
    import BattleMoves from '../components/BattleMoves'
    import BattleMessages from '../components/BattleMessages'
    import { PlayerService } from '../services/PlayerService'
    import { AttackService } from '../services/AttackService'
    import { LoggerService } from '../services/LoggerService'
    import { EVENTS } from '../constants/events'
    import { PLAYERS } from '../constants/players'
    import HttpService from '../services/HttpService'
    import routes from '../assets/json/routes.json'

    export default {
        name: 'Simulator',
        components: {
            GeneralMessageBox,
            PokemonSelector,
            BattleWindow,
            PokemonBench,
            BattleMoves,
            BattleMessages
        },
        data () {
            return {
                loading: true,
                selectedPlayer: '',
                playerTurn: '',
                nextPlayerPokemon: {},
                nextOpponentPokemon: {},
                pokemonBenchPlayer: [],
                pokemonBenchOpponent: [],
                activePokemonPlayer: {},
                activePokemonOpponent: {},
                activePokemonPlayerRemainingHp: 0,
                activePokemonOpponentRemainingHp: 0,
                bBattleStarted: false,
                pokemonBaseLevel: 1,
                battleId: '',
                turnCount: 0,
                battleMessageUpdate: {},
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
                if (pokemonBench.length > 0) {
                    this.activePokemonPlayer = pokemonBench[0]
                    this.activePokemonPlayerRemainingHp = pokemonBench[0].getHp().getRemainingHp()
                    pokemonBench.forEach((pokemon) => {
                        bench.push(pokemon)
                    })
                    this.pokemonBenchPlayer = [...bench]
                } else {
                    this.activePokemonPlayer = {}
                    this.activePokemonPlayerRemainingHp = 0
                    this.pokemonBenchPlayer = []
                }
            },
            onChangePokemonBenchOpponent (pokemonBench) {
                const bench = []
                if (pokemonBench.length > 0) {
                    this.activePokemonOpponent = pokemonBench[0]
                    this.activePokemonOpponentRemainingHp = pokemonBench[0].getHp().getRemainingHp()
                    pokemonBench.forEach((pokemon) => {
                        bench.push(pokemon)
                    })
                    this.pokemonBenchOpponent = [...bench]
                } else {
                    this.activePokemonOpponent = {}
                    this.activePokemonOpponentRemainingHp = 0
                    this.pokemonBenchOpponent = []
                }
            },
            onPokemonBaseLevel (lvl) {
                this.pokemonBaseLevel = lvl
            },
            async onStartBattle () {
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

                    const battleIdRes = await HttpService.get(routes.server.api.root + routes.server.api.logCreateBattleId)
                    this.battleId = battleIdRes.data.battleId

                    LoggerService.log(EVENTS.benches, { playerBench: this.pokemonBenchPlayer, opponentBench: this.pokemonBenchOpponent }, battleIdRes.data.battleId)

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

                this.turnCount++

                if (playerMoveRes.bApplyMoveToOpponent) {
                    this.executeMove(playerMoveRes)
                } else {
                    LoggerService.log(EVENTS.move, playerMoveRes, this.battleId, { turnCount: this.turnCount })
                    this.battleMessageUpdate = { event: EVENTS.move, playerMoveRes }
                }

                this.playerTurn = PLAYERS.opponent
                this.executeOpponentsTurn()
            },
            executeOpponentsTurn () {
                setTimeout(() => {
                    const chosenMoveRes = OpponentService.chooseMove(this.activePokemonOpponent)
                    this.activePokemonOpponent = chosenMoveRes.pokemon

                    this.turnCount++

                    if (chosenMoveRes.faint) {
                        this.faintPokemon(PLAYERS.opponent)
                    } else {
                        if (this.pokemonBenchOpponent.length > 0) {
                            this.executeMove(chosenMoveRes)
                        }
                    }

                    this.playerTurn = PLAYERS.player
                }, 2000)
            },
            faintPokemon (player) {
                let bench

                if (player === PLAYERS.player) {
                    bench = [...this.pokemonBenchPlayer]
                } else {
                    bench = [...this.pokemonBenchOpponent]
                }

                const faintedPokemon = bench.shift()

                LoggerService.log(EVENTS.faints, faintedPokemon, this.battleId, { player, turnCount: this.turnCount })
                this.battleMessageUpdate = { event: EVENTS.faints, faintedPokemon }

                if (bench.length < 1) {
                    let winningPlayer
                    let winningPokemon

                    player === PLAYERS.player ? winningPlayer = PLAYERS.opponent : winningPlayer = PLAYERS.player
                    player === PLAYERS.player ? winningPokemon = this.pokemonBenchOpponent[0].getName() : winningPokemon = this.pokemonBenchPlayer[0].getName()
                    player === PLAYERS.player ? this.pokemonBenchPlayer = [] : this.pokemonBenchOpponent = []

                    LoggerService.log(EVENTS.winner, winningPlayer, this.battleId, { winningPokemon, turnCount: this.turnCount })

                    this.$router.push({ name: 'GameOver', params: { winningPlayer, battleId: this.battleId } })
                } else {
                    if (player === PLAYERS.player) {
                        this.pokemonBenchPlayer = [...bench]
                        this.activePokemonPlayer = bench[0]
                        this.activePokemonPlayerRemainingHp = bench[0].getHp().getRemainingHp()
                        this.playerTurn = PLAYERS.player
                    } else {
                        this.pokemonBenchOpponent = [...bench]
                        this.activePokemonOpponent = bench[0]
                        this.activePokemonOpponentRemainingHp = bench[0].getHp().getRemainingHp()
                        this.playerTurn = PLAYERS.player
                    }
                }
            },
            async executeMove (moveRes) {

                if (this.playerTurn === PLAYERS.player) {

                    const attackRes = await AttackService.applyAttack(moveRes.move, this.activePokemonPlayer, this.activePokemonOpponent)
                    LoggerService.log(EVENTS.move, moveRes, this.battleId, { attackObj: attackRes, defendingPokemon: this.activePokemonOpponent.getName(), turnCount: this.turnCount })
                    this.battleMessageUpdate = { event: EVENTS.move, moveRes, attackObj: attackRes, defendingPokemon: this.activePokemonOpponent.getName() }

                    if (attackRes.bDamageDealtToDefendingPokemon) {
                        const hp = this.activePokemonOpponent.getHp()
                        hp.setRemainingHp(hp.getRemainingHp() - attackRes.damage)

                        if (hp.getRemainingHp() <= 0) {
                            this.faintPokemon(PLAYERS.opponent)
                        } else {
                            this.activePokemonOpponentRemainingHp = hp.getRemainingHp()
                            this.activePokemonOpponent.setHp(hp)
                        }
                    } else {
                        this.activePokemonOpponent = attackRes.defendingPokemon
                    }

                } else {
                    const attackRes = await AttackService.applyAttack(moveRes.move, this.activePokemonOpponent, this.activePokemonPlayer)
                    LoggerService.log(EVENTS.move, moveRes, this.battleId, { attackObj: attackRes, defendingPokemon: this.activePokemonPlayer.getName(), turnCount: this.turnCount })
                    this.battleMessageUpdate = { event: EVENTS.move, moveRes, attackObj: attackRes, defendingPokemon: this.activePokemonPlayer.getName() }

                    if (attackRes.bDamageDealtToDefendingPokemon) {
                        const hp = this.activePokemonPlayer.getHp()
                        hp.setRemainingHp(hp.getRemainingHp() - attackRes.damage)

                        if (hp.getRemainingHp() <= 0) {
                            this.faintPokemon(PLAYERS.player)
                        } else {
                            this.activePokemonPlayerRemainingHp = hp.getRemainingHp()
                            this.activePokemonPlayer.setHp(hp)
                        }
                    } else {
                        this.activePokemonPlayer = attackRes.defendingPokemon
                    }
                }

            },
            onLoading (val) {
                this.loading = val
            }
        }
    }

</script>

<style>

</style>