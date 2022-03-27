<template>
    <div>
        <div class="row q-gutter-sm">
            <q-btn-group push>
                <q-btn
                    :id="PLAYER_SELECTOR_ID"
                    :class="`${PLAYER_SELECT_BTN_GROUP_CLASS} ${BTN_GROUP_CLASS}`"
                    color="amber-7"
                    flat
                    label="Player"
                    @click="onClickSelectPlayer(PLAYERS.player)"
                />
                <q-btn
                    :id="OPPONENT_SELECTOR_ID"
                    :class="PLAYER_SELECT_BTN_GROUP_CLASS"
                    color="amber-7"
                    flat
                    label="Opponent"
                    @click="onClickSelectPlayer(PLAYERS.opponent)"
                />
            </q-btn-group>
            <div class="col-4 offset-1">
                <q-select
                    borderless
                    label-color="amber-7"
                    color="amber-7"
                    v-model="pokemonBaseLevel"
                    :options="pokemonBaseLevelOptions"
                    label="Base Lvl"
                    :hide-bottom-space="true"
                    popup-content-class="baseLevelSelect"
                    dense
                    :disable="disableBaseLevelSelector"
                />
            </div>
        </div>
        <div style="margin-top: 20px"/>
        <div id="pokemonSprites" class="col-12">
            <img v-for="sprite, key in pokemonSprites"
                :src="sprite"
                :key="key"
                class="sprite"
                @click="onClickPokemon(pokemonNames[key], sprite)"
            />
        </div>
    </div>
</template>

<script>

    import HttpService from '../services/HttpService'
    import { getAllPokemonAndStats, getMovesByPokemon, getMoveDetails } from '../assets/graphql/queries'
    import { Pokemon } from '../classes/Pokemon'
    import { Stat } from '../classes/Stat'
    import { HpStat } from '../classes/HpStat'
    import { Move } from '../classes/Move'
    import { StatChange } from '../classes/StatChange'
    import { PLAYERS } from '../constants/players'

    const ALLOWED_MOVE_LEARNED_METHOD = 'level-up'
    const PLAYER_SELECTOR_ID = 'playerSelector'
    const OPPONENT_SELECTOR_ID = 'opponentSelector'
    const PLAYER_SELECT_BTN_GROUP_CLASS = 'playerSelectBtnGroup'
    const BTN_GROUP_CLASS = 'qq-btn'

    const STAT = {
        hp: 'hp',
        attack: 'attack',
        defense: 'defense',
        specialAttack: 'special-attack',
        specialDefense: 'special-defense',
        speed: 'speed'
    }

    export default {
        name: 'PokemonSelector',
        components: {},
        emit: ['nextSelectedPokemon', 'selectedPlayer', 'pokemonBaseLevel'],
        props: {
            battleStarted: Boolean,
            pokemonBenchPlayer: Array,
            pokemonBenchOpponent: Array
        },
        data () {
            return {
                selectedPlayer: PLAYERS.player,
                allPokemonAndStats: [],
                pokemonNames: [],
                pokemonSprites: [],
                pokemonBaseLevel: 10,
                pokemonBaseLevelOptions: [],
                disableBaseLevelSelector: false
            }
        },
        watch: {
            pokemonBenchPlayer (bench) {
                if (bench.length === 0 && this.pokemonBenchOpponent.length === 0) {
                    this.disableBaseLevelSelector = false
                }
            },
            pokemonBenchOpponent (bench) {
                if (bench.length === 0 && this.pokemonBenchPlayer.length === 0) {
                    this.disableBaseLevelSelector = false
                }
            },
            pokemonBaseLevel (lvl) {
                this.$emit('pokemonBaseLevel', lvl)
            }
        },
        created () {

            this.PLAYERS = PLAYERS
            this.PLAYER_SELECTOR_ID = PLAYER_SELECTOR_ID
            this.OPPONENT_SELECTOR_ID = OPPONENT_SELECTOR_ID
            this.PLAYER_SELECT_BTN_GROUP_CLASS = PLAYER_SELECT_BTN_GROUP_CLASS
            this.BTN_GROUP_CLASS = BTN_GROUP_CLASS

            this.$emit('selectedPlayer', this.selectedPlayer)
            this.$emit('pokemonBaseLevel', this.pokemonBaseLevel)

            HttpService.graphql({ query: getAllPokemonAndStats })
                .then((res) => {
                    res.data.data.pokemon.forEach((pokemon) => {
                        this.pokemonNames.push(pokemon.name)
                        this.pokemonSprites.push(pokemon.sprites.front_default)
                    })
                    this.allPokemonAndStats = [...res.data.data.pokemon]
                })

            this.populatePokemonLevel()
        },
        methods: {
            async onClickPokemon (pokemonName) {
                if (!this.battleStarted) {
                    this.disableBaseLevelSelector = true

                    const pokemon = this.allPokemonAndStats.filter((obj) => pokemonName === obj.name)[0]

                    let filteredStat
                    filteredStat = pokemon.stats.filter((stat) => stat.stat.name === STAT.hp)[0]
                    const hp = new HpStat(STAT.hp, filteredStat.base_stat)

                    filteredStat = pokemon.stats.filter((stat) => stat.stat.name === STAT.attack)[0]
                    const attack = new Stat(STAT.attack, filteredStat.base_stat)

                    filteredStat = pokemon.stats.filter((stat) => stat.stat.name === STAT.defense)[0]
                    const defense = new Stat(STAT.defense, filteredStat.base_stat)

                    filteredStat = pokemon.stats.filter((stat) => stat.stat.name === STAT.specialAttack)[0]
                    const specialAttack = new Stat(STAT.specialAttack, filteredStat.base_stat)

                    filteredStat = pokemon.stats.filter((stat) => stat.stat.name === STAT.specialDefense)[0]
                    const specialDefense = new Stat(STAT.specialDefense, filteredStat.base_stat)

                    filteredStat = pokemon.stats.filter((stat) => stat.stat.name === STAT.speed)[0]
                    const speed = new Stat(STAT.speed, filteredStat.base_stat)

                    const types = []
                    pokemon.types.forEach((type) => types.push(type.type.name))

                    const moves = await this.getMoves(pokemon.name)

                    this.$emit('nextSelectedPokemon', new Pokemon(
                        pokemon.id,
                        pokemon.name,
                        this.pokemonBaseLevel,
                        pokemon.base_experience,
                        hp,
                        attack,
                        defense,
                        specialAttack,
                        specialDefense,
                        speed,
                        moves,
                        types,
                        pokemon.sprites.front_default,
                        pokemon.sprites.back_default
                    ))

                }
            },
            onClickSelectPlayer (playerSelection) {

                if (this.selectedPlayer !== playerSelection) {
                    this.selectedPlayer = playerSelection

                    if (playerSelection === PLAYERS.player) {
                        document.getElementById(PLAYER_SELECTOR_ID).className += ` ${BTN_GROUP_CLASS}`
                        document.getElementById(OPPONENT_SELECTOR_ID).className = document.getElementById(OPPONENT_SELECTOR_ID).className.replace(` ${BTN_GROUP_CLASS}`, '')
                    } else {

                        document.getElementById(OPPONENT_SELECTOR_ID).className += ` ${BTN_GROUP_CLASS}`
                        document.getElementById(PLAYER_SELECTOR_ID).className = document.getElementById(PLAYER_SELECTOR_ID).className.replace(` ${BTN_GROUP_CLASS}`, '')
                    }

                    this.$emit('selectedPlayer', playerSelection)
                }
            },
            populatePokemonLevel () {
                for (let i = 1; i <= 99; i++) {
                    this.pokemonBaseLevelOptions.push(i)
                }
            },
            async getMoves (pokemonName) {
                const allMovesList = []
                const moves = []
                const movesRes = await HttpService.graphql(getMovesByPokemon, { name: pokemonName, levelLearnedAtLTE: this.pokemonBaseLevel, moveLearnMethod: ALLOWED_MOVE_LEARNED_METHOD })

                movesRes.data.data.pokemon[0].moves.forEach((moveObj) => {
                    allMovesList.push(moveObj.move.name)
                })

                const movesDetailsRes = await HttpService.graphql(getMoveDetails, { name: allMovesList })

                let moveObjs = movesDetailsRes.data.data.moves
                moveObjs = moveObjs.sort((a, b) => {
                    if (a.power < b.power || a.power === null) {
                        return 1
                    }
                    if (a.power > b.power || b.power === null) {
                        return -1
                    }
                    return 0
                })

                for (let i = 0; i < moveObjs.length; i++) {
                    if (i > 3) {
                        break
                    }

                    const statChanges = []
                    moveObjs[i].stat_changes.forEach((statChangeObj) => {
                        statChanges.push(new StatChange(statChangeObj.change, statChangeObj.stat.name))
                    })

                    moves.push(new Move(
                        moveObjs[i].id,
                        moveObjs[i].name,
                        moveObjs[i].accuracy,
                        moveObjs[i].power,
                        moveObjs[i].pp,
                        moveObjs[i].priority,
                        moveObjs[i].type.name,
                        [...statChanges],
                        moveObjs[i].target.name
                    ))
                }

                return moves

            }
        }
    }

</script>

<style>

    .playerSelectBtnGroup {
        font-size: 0.7em !important;
        font-weight: 900 !important;
        font-size: 11px !important;
    }

    .sprite {
        width: 3em;
        cursor: pointer;
    }

    .baseLevelSelect {
        background-color: var(--primary-std) !important;
    }

    #pokemonSprites {
        background-color: var(--secondary-std);
        height: 75vh;
        overflow-y: auto;
        border-radius: 50px;
        padding: 10px 20px 10px 20px;
        box-shadow: var(--box-shadow-std);
    }

</style>