<template>
    <div>
        <div class="row q-gutter-sm">
            <q-btn-group push>
                <q-btn
                    class="playerSelectBtnGroup"
                    flat
                    label="Player"
                    @click="onClickSelectPlayer(PLAYERS.player)"
                />
                <q-btn
                    class="playerSelectBtnGroup"
                    flat
                    label="Opponent"
                    @click="onClickSelectPlayer(PLAYERS.opponent)"
                />
            </q-btn-group>
        </div>
        <div id="pokemonSprites" class="col-12">
            <img v-for="sprite, key in pokemonSprites"
                :src="sprite"
                :key="key"
                class="sprite"
                @click="onClickPokemon(pokemonNames[key])"
            />
        </div>
    </div>
</template>

<script>

    import HttpService from '../services/HttpService'
    import { getFrontSprites } from '../assets/graphql/queries'
    import { PLAYERS } from '../assets/constants'

    export default {
        name: 'PokemonSelector',
        components: {},
        emit: ['nextSelectedPokemon', 'selectedPlayer'],
        data () {
            return {
                selectedPlayer: PLAYERS.player,
                pokemonNames: [],
                pokemonSprites: []
            }
        },
        created () {

            this.PLAYERS = PLAYERS

            this.$emit('selectedPlayer', this.selectedPlayer)

            HttpService.graphql({ query: getFrontSprites })
                .then((res) => {
                    res.data.data.pokemon.forEach((pokemon) => {
                        this.pokemonNames.push(pokemon.name)
                        this.pokemonSprites.push(pokemon.sprites.front_default)
                    })
                })
        },
        methods: {
            onClickPokemon (pokemon) {
                this.$emit('nextSelectedPokemon', pokemon)
            },
            onClickSelectPlayer (playerSelection) {
                if (this.selectedPlayer !== playerSelection) {
                    this.selectedPlayer = playerSelection
                    this.$emit('selectedPlayer', playerSelection)
                }
            }
        }
    }

</script>

<style>

    .playerSelectBtnGroup {
        font-size: 0.7em !important;
    }

    .sprite {
        width: 3em;
        cursor: pointer;
    }

    #pokemonSprites {
        background-color:#afab9f;
        height: 75vh;
        overflow-y: auto;
    }

</style>