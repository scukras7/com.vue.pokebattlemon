<template>
    <div v-if="battleStart">
        <div v-if="activePokemonMovesPlayer.length > 0" id="movesContainer">
            <div class="row justify-center">
                <div v-for="move, key in activePokemonMovesPlayer" class="col-6 moveSelection" :key="key">
                    <span v-if="move.name !== 'null'" class="move" @click="selectMove(move)">{{move.name}}</span>
                    <span v-else class="moveNull">{{move.name}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import { PLAYERS } from '../assets/constants'

    export default {
        name: 'BattleMoves',
        components: {},
        emits: ['playerSelectedMove', 'faintPlayerPokemon', 'error'],
        props: {
            battleStart: Boolean,
            playerTurn: String,
            activePokemonPlayer: Object,
            activePokemonOpponent: Object
        },
        data () {
            return {
                activePokemonMovesPlayer: [],
                activePokemonMovesOpponent: []
            }
        },
        watch: {
            battleStart () {
                if (this.battleStart) this.update()
            }
        },
        methods: {
            update () {
                const moves = [...this.activePokemonPlayer.getMoves()]
                const movesToAdd = 4 - moves.length

                for (let i = 0; i < movesToAdd; i++) {
                    moves.push({ name: 'null' })
                }
                this.activePokemonMovesPlayer = [...moves]
            },
            selectMove (move) {
                this.$emit('error', '')

                if (this.playerTurn === PLAYERS.player) {

                    if (move.getPp() > 0) {
                        move.setPp(move.getPp() - 1)

                        const updateMoves = []
                        this.activePokemonPlayer.getMoves().forEach((moveObj) => {
                            if (move.getName() === moveObj.getName()) {
                                updateMoves.push(move)
                            } else {
                                updateMoves.push(moveObj)
                            }
                        })

                        this.activePokemonPlayer.setMoves(updateMoves)
                        this.$emit('playerSelectedMove', move)
                    } else {
                        let bMovesHavePp = false
                        const moves = this.activePokemonPlayer.getMoves()

                        for (let i = 0; i < moves.length; i++) {
                            if (moves[i].getPp() > 0) {
                                bMovesHavePp = true
                                break
                            }
                        }

                        if (!bMovesHavePp) {
                            this.$emit('faintPlayerPokemon', PLAYERS.player)
                        } else {
                            this.$emit('error', 'No remaining PP. Please select another move')
                        }

                    }
                }
            }
        }
    }

</script>

<style>

    .moveSelection {
        text-align: center;
        min-height: 1em;
    }

    .move {
        cursor: pointer;
    }

    .moveNull {
        opacity: 0;
    }

    #movesContainer {
        background-color: #afab9f;
    }

</style>