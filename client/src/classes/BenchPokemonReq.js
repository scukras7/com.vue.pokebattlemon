export class BenchPokemonReq {

    /*
        id: Number
        name: String
        level: Number
        baseExp: Number
        hp: { name: '', baseStat: null, currentStat: null }
        attack: { name: '', baseStat: null, currentStat: null }
        defense: { name: '', baseStat: null, currentStat: null }
        specialAttack: { name: '', baseStat: null, currentStat: null }
        specialDefense: { name: '', baseStat: null, currentStat: null }
        speed: { name: '', baseStat: null, currentStat: null }
        moves: [String]
        types: [String]
    */

    constructor (pokemonId, name, level, baseExp, hp, attack, defense, specialAttack, specialDefense, speed, moves, types) {
        this.pokemonId = pokemonId
        this.name = name
        this.level = level
        this.baseExp = baseExp
        this.hp = hp
        this.attack = attack
        this.defense = defense
        this.specialAttack = specialAttack
        this.specialDefense = specialDefense
        this.speed = speed
        this.moves = moves
        this.types = types
    }

    getPokemonId() { return this.pokemonId }

    setPokemonId(pokemonId) { this.pokemonId = pokemonId }

    getName () { return this.name }

    setName (name) { this.name = name }

    getLevel () { return this.level }

    setLevel (level) { this.level = level }

    getBaseExp () { return this.baseExp }

    setBaseExp (baseExp) { this.baseExp = baseExp }

    getHp() { return this.hp }

    setHp(name, baseStat, currentStat) { this.hp = { name, baseStat, currentStat } }

    getAttack() { return this.attack }

    setAttack(name, baseStat, currentStat) { this.attack = { name, baseStat, currentStat } }

    getDefense() { return this.defense }

    setDefense(name, baseStat, currentStat) { this.defense = { name, baseStat, currentStat } }

    getSpecialAttack() { return this.specialAttack }

    setSpecialAttack(name, baseStat, currentStat) { this.specialAttack = { name, baseStat, currentStat } }

    getSpecialDefense() { return this.specialDefense }

    setSpecialDefense(name, baseStat, currentStat) { this.specialDefense = { name, baseStat, currentStat } }

    getSpeed() { return this.speed }

    setSpeed(name, baseStat, currentStat) { this.speed = { name, baseStat, currentStat } }

    getMoves () { return this.moves }

    setMoves (moves) { this.moves = moves }

    getTypes () { return this.types }

    setTypes (types) { this.types = types }
}