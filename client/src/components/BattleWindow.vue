<template>
    <div>
        <div>Battle Window</div>
        <div id="battleWindow" class="col-12">
            <div class="row">
                <div v-if="activePokemonOpponent !== '' && battleStart" class="col-6">
                    <HitPoints :damagePoints="damagePointsPlayer" :totalHitPoints="pokemonHpOpponent" :lvl="activePokemonOpponent.getLevel()"/>
                </div>
                <div v-if="activePokemonOpponent !== '' && battleStart" class="col-6 alignImageRight">
                    <img :src="activePokemonSpriteOpponent" :alt="activePokemonOpponent.getName()" class="battleSprite"/>
                </div>
            </div>
            <div class="row">
                <div v-if="activePokemonPlayer !== '' && battleStart" class="col-6">
                    <img :src="activePokemonSpritePlayer" :alt="activePokemonPlayer.getName()" class="battleSprite"/>
                </div>
                <div v-if="activePokemonPlayer !== '' && battleStart" class="col-6">
                    <HitPoints :damagePoints="damagePointsOpponent" :totalHitPoints="pokemonHpPlayer" :lvl="activePokemonPlayer.getLevel()"/>
                </div>
            </div>
        </div>
        <p/>
        <div v-if="!battleStart" class="row justify-center">
            <q-btn
                color="white"
                text-color="black"
                label="Start Battle"
                :size="'xs'"
                class="col-6"
                @click="onClickStartBattle"
            />
        </div>
    </div>
</template>

<script>

    import HitPoints from './HitPoints'
    import { PLAYERS } from '../assets/constants'

    export default {
        name: 'BattleWindow',
        components: { HitPoints },
        props: {
            pokemonBenchPlayer: Array,
            pokemonBenchOpponent: Array
        },
        data () {
            return {
                pokemonBenchCopyPlayer: [],
                pokemonBenchCopyOpponent: [],
                activePokemonPlayer: '',
                activePokemonOpponent: '',
                activePokemonSpritePlayer: '',
                activePokemonSpriteOpponent: '',
                pokemonHpPlayer: 0,
                pokemonHpOpponent: 0,
                damagePointsPlayer: 0,
                damagePointsOpponent: 0,
                battleStart: false
            }
        },
        watch: {
            pokemonBenchPlayer (bench) {
                if (bench.length > 0) {
                        const pokemon = bench[0]
                        this.activePokemonPlayer = pokemon
                        this.activePokemonSpritePlayer = pokemon.getBackSprite()
                } else {
                    this.activePokemonPlayer = ''
                    this.activePokemonSpritePlayer = ''
                }
                this.pokemonBenchCopyPlayer = [...bench]
            },
            pokemonBenchOpponent (bench) {
                if (bench.length > 0) {
                    const pokemon = bench[0]
                    this.activePokemonOpponent = pokemon
                    this.activePokemonSpriteOpponent = pokemon.getFrontSprite()
                } else {
                    this.activePokemonOpponent = ''
                    this.activePokemonSpriteOpponent = ''
                }
                this.pokemonBenchCopyOpponent = [...bench]
            },
            activePokemonPlayer (pokemon) {
                if (pokemon !== null && pokemon !== undefined) {
                    this.setPokemonHp(PLAYERS.player, pokemon)
                }
            },
            activePokemonOpponent (pokemon) {
                if (pokemon !== null && pokemon !== undefined) {
                    this.setPokemonHp(PLAYERS.opponent, pokemon)
                }
            }
        },
        methods: {
            onClickStartBattle () {
                if (this.pokemonBenchCopyPlayer.length > 0 && this.pokemonBenchCopyOpponent.length > 0) {
                    this.battleStart = true
                }
                this.$emit('startBattle', true)
            },
            setPokemonHp (player, pokemon) {
                if (player === PLAYERS.player) {
                    this.pokemonHpPlayer = pokemon.getHp().getRemainingHp()
                } else {
                    this.pokemonHpOpponent = pokemon.getHp().getRemainingHp()
                }
            }
        }
    }

</script>

<style>

    #battleWindow {
        background-color: #afab9f;
        /*height: 50vh;*/
    }

    .battleSprite {
        width: 8em;
    }

    .alignImageRight {
        text-align: right;
    }

</style>