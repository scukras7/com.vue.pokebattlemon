<template>
    <div class="col-12">
        <div id="battleWindow" class="col-12">
            <div class="row">
                <div v-if="activePokemonOpponent !== '' && battleStart" class="col-6">
                    <HitPoints :remainingHp="activePokemonOpponentRemainingHp" :totalHitPoints="pokemonHpOpponent" :lvl="activePokemonOpponent.getLevel()"/>
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
                    <HitPoints :remainingHp="activePokemonPlayerRemainingHp" :totalHitPoints="pokemonHpPlayer" :lvl="activePokemonPlayer.getLevel()"/>
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
                class="col-6 qq-btn"
                @click="onClickStartBattle"
            />
        </div>
        <div v-if="loading" class="row justify-center">
            <img :src="PokeballSVG" className="loadingPokeball" alt="loading-pokeball"/>
        </div>
        <div v-if="!battleStart && !loading" id="instructionsContainer" class="row justify-center">
            <ol>
                <li>Select pokémon Base Level</li>
                <li>Select pokémon for Player and Opponent</li>
                <li>Press 'Start Battle'</li>
                <li>Battle!</li>
            </ol>
        </div>
    </div>
</template>

<script>

    import HitPoints from './HitPoints'
    import { PLAYERS } from '../constants/players'
    import PokeballSVG from '../assets/svg/pokeball.svg'

    export default {
        name: 'BattleWindow',
        components: { HitPoints },
        props: {
            pokemonBenchPlayer: Array,
            pokemonBenchOpponent: Array,
            activePokemonPlayerRemainingHp: Number,
            activePokemonOpponentRemainingHp: Number,
            loading: Boolean
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
                battleStart: false
            }
        },
        created () {
            this.PokeballSVG = PokeballSVG
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
                if (pokemon) {
                    if (player === PLAYERS.player) {
                        this.pokemonHpPlayer = pokemon.getHp().getRemainingHp()
                    } else {
                        this.pokemonHpOpponent = pokemon.getHp().getRemainingHp()
                    }
                }
            }
        }
    }

</script>

<style>

    #battleWindow {
        background-color: var(--nintendo-bg);
        color: var(--nintendo-text);
        border-radius: 10px;
        box-shadow: var(--box-shadow-std);
    }

    #instructionsContainer {
        margin-top: 25vh;
        font-weight: 500;
    }

    .battleSprite {
        width: 8em;
    }

    .alignImageRight {
        text-align: right;
    }

</style>