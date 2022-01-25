<template>
    <div>
        <div>Battle Window</div>
        <div id="battleWindow" class="col-12">
            <div class="row">
                <div class="col-6">
                    <HitPoints :damagePoints="damagePointsPlayer" :totalHitPoints="pokemonHpOpponent" :lvl="activePokemonOpponent.lvl"/>
                </div>
                <div class="col-6 alignImageRight">
                    <img :src="activePokemonSpriteOpponent" :alt="activePokemonOpponent.pokemon" class="battleSprite"/>
                </div>
            </div>
            <div class="row">
                <div class="col-6">
                    <img :src="activePokemonSpritePlayer" :alt="activePokemonPlayer.pokemon" class="battleSprite"/>
                </div>
                <div class="col-6">
                    <HitPoints :damagePoints="damagePointsOpponent" :totalHitPoints="pokemonHpPlayer" :lvl="activePokemonPlayer.lvl"/>
                </div>
            </div>
        </div>
        <p/>
        <div class="row justify-center">
            <q-btn
                color="white"
                text-color="black"
                label="Start Battle"
                :size="'xs'"
                class="col-6"
                @click="onClickStartBattle"
            />
        </div>
        <BattleMoves :battleStart="battleStart"/>
        <BattleMessages/>
    </div>
</template>

<script>

    import HitPoints from './HitPoints'
    import BattleMoves from './BattleMoves'
    import BattleMessages from './BattleMessages'
    import HttpService from '../services/HttpService'
    import { PLAYERS } from '../assets/constants'
    import { getSpritesByPokemonName, getStatsByPokemonName } from '../assets/graphql/queries'

    export default {
        name: 'BattleWindow',
        components: { HitPoints, BattleMoves, BattleMessages },
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
                        this.activePokemonPlayer = bench[0]
                } else {
                    this.activePokemonPlayer = ''
                    this.activePokemonSpritePlayer = ''
                }
                this.pokemonBenchCopyPlayer = [...bench]
            },
            pokemonBenchOpponent (bench) {
                if (bench.length > 0) {
                    this.activePokemonOpponent = bench[0]
                } else {
                    this.activePokemonOpponent = ''
                    this.activePokemonSpriteOpponent = ''
                }
                this.pokemonBenchCopyOpponent = [...bench]
            },
            activePokemonPlayer (pokemon) {
                if (pokemon !== '') {
                    this.getSprites(PLAYERS.player)
                    this.setPokemonHp(PLAYERS.player, pokemon)
                }
            },
            activePokemonOpponent (pokemon) {
                if (pokemon !== '') {
                    this.getSprites(PLAYERS.opponent)
                    this.setPokemonHp(PLAYERS.opponent, pokemon)
                }
            }
        },
        methods: {
            onClickStartBattle () {
                this.battleStart = true
                this.$emit('startBattle', true)
            },
            getSprites (player) {
                console.log(player)
                console.log(this.activePokemonPlayer)
                console.log(this.activePokemonOpponent)
                if (player === PLAYERS.player) {
                    HttpService.graphql(getSpritesByPokemonName, { pokemon: this.activePokemonPlayer.pokemon })
                        .then((res) => {
                            this.activePokemonSpritePlayer = res.data.data.pokemon[0].sprites.back_default
                        })
                } else {
                    HttpService.graphql(getSpritesByPokemonName, { pokemon: this.activePokemonOpponent.pokemon })
                        .then((res) => {
                            this.activePokemonSpriteOpponent = res.data.data.pokemon[0].sprites.front_default
                        })
                }
            },
            setPokemonHp (player, pokemon) {
                HttpService.graphql(getStatsByPokemonName, { pokemon: pokemon.pokemon })
                    .then((res) => {
                        const stats = res.data.data.pokemon[0].stats
                        let baseHp = 0

                        for (let i = 0; i < stats.length; i++) {
                            if (stats[i].stat.name === 'hp') {
                                baseHp = stats[i].base_stat
                                break
                            }
                        }

                        if (player === PLAYERS.player) {
                            this.pokemonHpPlayer = baseHp
                        } else {
                            this.pokemonHpOpponent = baseHp
                        }
                    })
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