import { STAT } from '../constants/stat'

export class Pokemon {

    /*
        id: Number
        name: String
        level: Number
        baseExp: Number
        hp: HpStat
        attack: Stat
        defense: Stat
        specialAttack: Stat
        specialDefense: Stat
        speed: Stat
        moves: [Move]
        sprite: String
    */

    constructor (id, name, level, baseExp, hp, attack, defense, specialAttack, specialDefense, speed, moves, frontSprite, backSprite) {
        this.id = id
        this.name = name
        this.level = level
        this.baseExp = baseExp
        this.hp = hp
        this.attack = attack
        this.defense = defense
        this.specialAttack = specialAttack
        this.specialDefense = specialDefense
        this.speed = speed

        this._setStatToLevelHp(hp, level)
        this.hp.setRemainingHp(this.hp.getCurrentStat())
        this._setStatToLevel(attack, level)
        this._setStatToLevel(defense, level)
        this._setStatToLevel(specialAttack, level)
        this._setStatToLevel(specialDefense, level)
        this._setStatToLevel(speed, level)

        this.moves = [...moves]
        this.frontSprite = frontSprite
        this.backSprite = backSprite

    }

    getId () { return this.id }

    setId (id) { this.id = id }

    getName () { return this.name }

    setName (name) { this.name = name }

    getLevel () { return this.level }

    setLevel (level) { this.level = level }

    getBaseExp () { return this.baseExp }

    setBaseExp (baseExp) { this.baseExp = baseExp }

    getHp () { return this.hp }

    setHp (hp) { this.hp = hp }

    getAttack () { return this.attack }

    setAttack (attack) { this.attack = attack }

    getDefense () { return this.defense }

    setDefense (defense) { this.defense = defense }

    getSpecialAttack () { return this.specialAttack }

    setSpecialAttack (specialAttack) { this.specialAttack = specialAttack }

    getSpecialDefense () { return this.specialDefense }

    setSpecialDefense (specialDefense) { this.specialDefense = specialDefense }

    getSpeed () { return this.speed }

    setSpeed (speed) { this.speed = speed }

    getMoves () { return this.moves }

    setMoves (moves) { this.moves = [...moves] }

    getFrontSprite () { return this.frontSprite }

    setFrontSprite (sprite) { this.frontSprite = sprite }

    getBackSprite () { return this.backSprite }

    setBackSprite (sprite) { this.backSprite = sprite }

    _setStatToLevelHp (stat, level) {
        const currentStat = Math.floor(((((stat.getBaseStat() + this._getRandomIV()) * 2) + (Math.floor(Math.sqrt(this._getRandomStatExp()) / 4))) * level) / 100) + level + 10
        this.hp.setCurrentStat(currentStat)
    }

    _setStatToLevel (stat, level) {
        const currentStat = Math.floor(((((stat.getBaseStat() + this._getRandomIV()) * 2) + (Math.floor(Math.sqrt(this._getRandomStatExp()) / 4))) * level) / 100) + 5
        switch (stat.name) {

            case STAT.attack:
                this.attack.setCurrentStat(currentStat)
                break

            case STAT.defense:
                this.defense.setCurrentStat(currentStat)
                break

            case STAT.specialAttack:
                this.specialAttack.setCurrentStat(currentStat)
                break

            case STAT.specialDefense:
                this.specialDefense.setCurrentStat(currentStat)
                break

            case STAT.speed:
                this.speed.setCurrentStat(currentStat)
                break

            default:
                break
        }
    }

    _getRandomIV () {
        const min = 0
        const max = 15
        return this._boxMullerNormDist(min, max)
    }

    _getRandomStatExp () {
        const min = 1
        const max = 100
        return this._boxMullerNormDist(min, max)
    }

    _boxMullerNormDist (min, max) {
        let u = 0
        let v = 0;
        while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
        while (v === 0) v = Math.random();
        let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
        num = num / 10.0 + 0.5 // Translate to 0 -> 1
        if (num > 1 || num < 0) return this._boxMullerNormDist(min, max) // resample between 0 and 1
        return Math.floor(num * (max - min + 1) + min)
    }
}