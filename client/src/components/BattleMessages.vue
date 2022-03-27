<template>
    <div v-if="battleStart" class="col-12">
        <p/>
        <div id="messageContainer">
            <div v-for="message, i of messages" class="eventMessage" :key="i">
                {{message.message}}
            </div>
        </div>
        <p/>
    </div>
</template>

<script>

    import { EVENTS } from '../constants/events'

    export default {
        name: 'BattleMessages',
        components: {},
        props: {
            battleMessageUpdate: Object,
            battleStart: Boolean
        },
        data () {
            return {
                messages: []
            }
        },
        watch: {
            battleMessageUpdate (updateObj) {

                let message

                if (updateObj.event === EVENTS.move) {
                    const attackingPokemon = updateObj.moveRes.pokemon.getName()
                    const defendingPokemon = updateObj.defendingPokemon
                    const moveName = updateObj.moveRes.move.getName()

                    if (updateObj.attackObj.bDamageDealtToDefendingPokemon) {
                        message = `${this.capitalize(attackingPokemon)} attacked ${this.capitalize(defendingPokemon)} with ${this.capitalize(moveName)}`
                    } else {
                        if (updateObj.moveRes.bApplyMoveToOpponent) {
                            message = `${this.capitalize(attackingPokemon)} used ${this.capitalize(moveName)} on ${this.capitalize(defendingPokemon)}`
                        } else {
                            message = `${this.capitalize(attackingPokemon)} used ${this.capitalize(moveName)}`
                        }
                    }
                } else if (updateObj.event === EVENTS.faints) {
                    message = `${this.capitalize(updateObj.faintedPokemon.getName())} fainted`
                }

                this.messages.unshift({ message })
            }
        },
        methods: {
            capitalize (str) {
                if (str) {
                    return str.charAt(0).toUpperCase() + str.slice(1)
                }
            },
        }
    }

</script>

<style>

    #messageContainer {
        background-color: var(--nintendo-bg);
        color: var(--nintendo-text);
        border-radius: 10px;
        overflow-y: auto;
        height: 100px;
        box-shadow: var(--box-shadow-std);
    }

    .eventMessage {
        font-size: 12px;
        padding-top: 5px;
        margin-left: 10px;
    }

</style>