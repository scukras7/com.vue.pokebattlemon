<template>
    <div>
        <p/>
        <div id="gameOverTitle" class="textAlignCenter">
            Game Over
        </div>
        <div id="winnerTitle" class="textAlignCenter">
            {{capitalize(winningPlayer)}} won!
        </div>
        <div v-for="event, i of events" class="" :key="i">
            <div class="logEvent">
            <div class= "row justify-center">
                <div class="col-5">
                    Event:
                    <span v-if="event.event === EVENTS.move" class="eventMove">
                        {{capitalize(event.event)}}
                    </span>
                    <span v-if="event.event === EVENTS.faint" class="eventFaint">
                        {{capitalize(event.event)}}
                    </span>
                    <span v-if="event.event === EVENTS.winner" class="eventWinner">
                        {{capitalize(event.event)}}
                    </span>
                </div>
                <div class="col-5 turnCount">
                    Turn: {{event.turnCount}}
                </div>
            </div>
            <div v-if="event.event === EVENTS.move && 'defendingPokemon' in event">
                <div class="row">
                    <div class="offset-1">
                        {{capitalize(event.attackingPokemon)}} attacked {{capitalize(event.defendingPokemon)}} with {{capitalize(event.name)}}
                    </div>
                </div>
                <div v-if="'damageAmountDealt' in event" class="row">
                    <div class="offset-1">
                        Attack dealt <span class="damageDealt">{{event.damageAmountDealt}}</span> hit points of damage
                    </div>
                </div>
            </div>
            <div v-if="event.event === EVENTS.move && !('defendingPokemon' in event)" class="row">
                <div class="offset-1">
                    {{capitalize(event.attackingPokemon)}} used {{capitalize(event.name)}}
                </div>
            </div>
            <div v-if="event.event === EVENTS.faint">
                <div class="row">
                    <div class="offset-1">
                        {{capitalize(event.pokemonOwner)}}'s {{capitalize(event.pokemon)}} fainted
                    </div>
                </div>
            </div>
            <div v-if="event.event === EVENTS.winner">
                <div class="row">
                    <div class="offset-1">
                        {{capitalize(event.winningPlayer)}} won with {{capitalize(event.winningPokemon)}}
                    </div>
                </div>
            </div>
            </div>
        </div>
    </div>
</template>

<script>

    import HttpService from '../services/HttpService'
    import routes from '../assets/json/routes.json'
    import { EVENTS } from '../constants/events.js'

    export default {
        name: 'GameOver',
        components: {},
        props: {
            bGameOver: Boolean,
            winningPlayer: String,
            battleId: String
        },
        data () {
            return {
                events: []
            }
        },
        created () {
            this.EVENTS = EVENTS
        },
        watch: {
            winningPlayer (player) {
                console.log(`I am the winner: ${player}`)
            }
        },
        mounted() {
            HttpService.get(`${routes.server.api.root}${routes.server.api.getLogByBattleId}ad8f6f28-ba55-4484-bf11-0b1690c2e565`/* this.battleId */)
                .then((res) => {
                    console.log(res)

                    const tEvents = []
                    res.data.moves.forEach((move) => tEvents.push(move))
                    res.data.faints.forEach((faint) => tEvents.push(faint))
                    tEvents.push(res.data.winner)

                    tEvents.sort((a, b) => {
                        if (a.dateCreated < b.dateCreated) {
                            return -1
                        }
                        if (a.dateCreated > b.dateCreated) {
                            return 1
                        }
                        return 0
                    })

                    console.log(tEvents)

                    this.events = [...tEvents]
                })
        },
        methods: {
            capitalize(str) {
                if (str) {
                    return str.charAt(0).toUpperCase() + str.slice(1)
                }
            }
        }
    }

</script>

<style>

    #gameOverTitle {
        font-size: 20px;
    }

    #winnerTitle {
        font-size: 15px;
    }

    .logEvent {
        border: 1px solid #d1d1d1;
        background-color: #d1d1d1;
        border-radius: 15px;
        margin-bottom: 10px;
        width: 80vw;
        margin-left: 10vw;
    }

    .turnCount {
        text-align: right;
    }

    .eventMove {
        color: #0f719e;
        font-weight: 600;
    }

    .eventFaint {
        color: #f5175a;
        font-weight: 600;
    }

    .eventWinner {
        color: #4017f5;
        font-weight: 600;
    }

    .damageDealt {
        color: #0e9662;
        font-weight: 600;
    }

</style>