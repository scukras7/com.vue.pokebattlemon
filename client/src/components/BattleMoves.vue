<template>
    <div v-if="battleStart">
        BattleMoves works!
    </div>
</template>

<script>

    import HttpService from '../services/HttpService'
    import { getMovesByPokemon } from '../assets/graphql/queries'

    const MOVE_LEARN_METHOD = 'level-up'

    export default {
        name: 'BattleMoves',
        components: {},
        props: {
            battleStart: Boolean,
            activePokemonPlayer: Object,
            activePokemonOpponent: Object
        },
        data () {
            return {
            }
        },
        watch: {
            battleStart () {
                if (this.battleStart) this.update()
            }
        },
        methods: {
            async update () {
                /* TODO
                    - Get attacks for active pokemon
                    - Determine turn based on pokemon agility
                    - Pick attacks and emit event to Simulator
                        - Simulator calculates damage and updates HitPoints
                        - If pokemone faints update bench by sending fainted pokemon to bench to remove
                */

               const resMovesPlayer = await HttpService.graphql(getMovesByPokemon, { name: this.activePokemonPlayer.pokemon, levelLearnedAtLTE: this.activePokemonPlayer.lvl, moveLearnMethod: MOVE_LEARN_METHOD })
               const resMovesOpponent = await HttpService.graphql(getMovesByPokemon, { name: this.activePokemonOpponent.pokemon, levelLearnedAtLTE: this.activePokemonOpponent.lvl, moveLearnMethod: MOVE_LEARN_METHOD })

               console.log(resMovesPlayer)
               console.log(resMovesOpponent)

            }
        }
    }

</script>

<style>

</style>