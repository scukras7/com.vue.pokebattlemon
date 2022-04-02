<template>
    <div v-if="battleId !== '' && battleId !== null && battleId !== undefined">
        <p/>
        <div id="gameOverTitle" class="textAlignCenter">
            Game Over
        </div>
        <div id="winnerTitle" class="textAlignCenter">
            {{capitalize(winningPlayer)}} won!
        </div>
        <p/>
        <div id="eventContainer">
            <div v-for="event, i of events" :key="i">
                <div class="logEvent">
                    <div class= "row justify-center">
                        <div class="col-5">
                            Event:
                            <span v-if="event.event === EVENTS.move" class="eventMove">
                                {{capitalize(event.event)}}
                            </span>
                            <span v-if="event.event === EVENTS.faints" class="eventFaint">
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
                                <span v-if="'damageAmountDealt' in event">
                                    dealing <span class="damageDealt">{{event.damageAmountDealt}}</span> hit points of damage
                                </span>
                            </div>
                        </div>
                    </div>
                    <div v-if="event.event === EVENTS.move && !('defendingPokemon' in event)" class="row">
                        <div class="offset-1">
                            {{capitalize(event.attackingPokemon)}} used {{capitalize(event.name)}}
                        </div>
                    </div>
                    <div v-if="event.event === EVENTS.faints">
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
        <div id="divider"/>
        <div class="row justify-center">
            <q-btn
                color="white"
                text-color="black"
                label="Download History"
                :size="'xs'"
                class="col-2 qq-btn"
                @click="downloadCsv"
            />
            <q-btn
                color="white"
                text-color="black"
                label="Restart"
                :size="'xs'"
                class="col-2 offset-1 qq-btn"
                @click="restart"
            />
        </div>
    </div>
    <div v-else>
        <p/>
        <div id="noBattleId">
            No selected Battle ID
        </div>
        <p/>
        <div class="row justify-center">
            <div class="col-2 cstmButton" @click="restart">
                    Restart
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
            battleId () {
                this.renderBattleHistory()
            }
        },
        mounted() {
            this.renderBattleHistory()
        },
        methods: {
            renderBattleHistory () {
                if (this.battleId) {
                    const url = `${routes.server.api.root}${routes.server.api.getLogByBattleId}${this.battleId}`
                    HttpService.get(url)
                        .then((res) => {

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

                            this.events = [...tEvents]
                        })
                }
            },
            capitalize (str) {
                if (str) {
                    return str.charAt(0).toUpperCase() + str.slice(1)
                }
            },
            downloadCsv () {

                const HEADERS = [
                    'battleId', 'event', 'turnCount', 'dateCreated', 'attackingPokemon', 'defendingPokemon',
                    'attackName', 'damageDealt', 'pokemonOwner', 'pokemon', 'winningPlayer', 'winningPokemon'
                ]
                const headersLength = HEADERS.length
                const eventsLength = this.events.length

                let csvString = ''

                for (let i = 0; i < headersLength; i++) {
                    if (i === headersLength - 1) {
                        csvString += `${HEADERS[i]}\n`
                    } else {
                        csvString += `${HEADERS[i]},`
                    }
                }

                for (let i = 0; i < eventsLength; i++) {

                    const date = new Date(this.events[i].dateCreated)
                    const month = this.formatMonth(date)
                    const day = this.formatDay(date)
                    const hours = this.formatHours(date)
                    const minutes = this.formatMinutes(date)
                    const seconds = this.formatSeconds(date)
                    const dateCreated = `${date.getFullYear()}-${month}-${day}T${hours}:${minutes}:${seconds}`

                    if (this.events[i].event === EVENTS.move) {

                        const defendingPokemon = 'defendingPokemon' in this.events[i] && 'damageAmountDealt' in this.events[i] ? this.events[i].defendingPokemon : ''
                        const damageAmountDealt = 'damageAmountDealt' in this.events[i] ? this.events[i].damageAmountDealt : ''

                        csvString += `${this.events[i].battleId},`
                            + `${this.events[i].event},`
                            + `${this.events[i].turnCount},`
                            + `${dateCreated},`
                            + `${this.events[i].attackingPokemon},`
                            + `${defendingPokemon},`
                            + `${this.events[i].name},`
                            + `${damageAmountDealt}\n`
                    } else if (this.events[i].event === EVENTS.faints) {
                        csvString += `${this.events[i].battleId},`
                            + `${this.events[i].event},`
                            + `${this.events[i].turnCount},`
                            + `${dateCreated},,,,,`
                            + `${this.events[i].pokemonOwner},`
                            + `${this.events[i].pokemon}\n`
                    } else if (this.events[i].event === EVENTS.winner) {
                        csvString += `${this.events[i].battleId},`
                            + `${this.events[i].event},`
                            + `${this.events[i].turnCount},`
                            + `${dateCreated},,,,,,,`
                            + `${this.events[i].winningPlayer},`
                            + `${this.events[i].winningPokemon}\n`
                    }
                }

                const date = new Date()
                const month = this.formatMonth(date)
                const day = this.formatDay(date)
                const hours = this.formatHours(date)
                const minutes = this.formatMinutes(date)
                const seconds = this.formatSeconds(date)

                const blob = new Blob([csvString], { type: 'text/csv' })
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.setAttribute('href', url)
                a.setAttribute('download', `${date.getFullYear()}${month}${day}T${hours}${minutes}${seconds}_pokebattlemon_history.csv`)
                a.click()
            },
            restart () {
                this.$router.push(routes.client.battleSimulator)
            },
            formatMonth (date) {
                return date.getMonth() + 1 < 10 ? `0${String(date.getMonth() + 1)}` : String(date.getMonth() + 1)
            },
            formatDay (date) {
                return date.getDate() < 10 ? `0${String(date.getDate())}` : String(date.getDate())
            },
            formatHours (date) {
                return date.getHours() < 10 ? `0${String(date.getHours())}` : String(date.getHours())
            },
            formatMinutes (date) {
                return date.getMinutes() < 10 ? `0${String(date.getMinutes())}` : String(date.getMinutes())
            },
            formatSeconds (date) {
                return date.getSeconds() < 10 ? `0${String(date.getSeconds())}` : String(date.getSeconds())
            }
        },
    }

</script>

<style>

    #gameOverTitle {
        font-size: 20px;
    }

    #winnerTitle {
        font-size: 15px;
    }

    #eventContainer {
        height: 70vh;
        overflow-y: auto;
        color: var(--nintendo-text);
    }

    #divider {
        margin-top: 20px;
        margin-bottom: 20px;
        width: 80vw;
        margin-left: 10vw;
        border-bottom: 0.5px solid var(--nintendo-bg);
    }

    #noBattleId {
        text-align: center;
    }

    .logEvent {
        border: 1px solid var(--nintendo-bg);
        background-color: var(--nintendo-bg);
        border-radius: 15px;
        margin-bottom: 10px;
        width: 80vw;
        margin-left: 10vw;
        box-shadow: var(--box-shadow-std);
    }

    .turnCount {
        text-align: right;
    }

    .eventMove {
        color: var(--primary-std);
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

    .cstmButton {
        background-color: #4017f5;
        cursor: pointer;
        text-align: center;
    }

</style>