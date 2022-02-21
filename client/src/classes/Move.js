export class Move {

    /*
        id: Number
        name: String
        accuracy: Number
        power: Number
        pp: Number
        priority: Number
        type: String
        statChange: StatChange
    */

    constructor (id, name, accuracy, power, pp, priority, type, statChanges, target) {
        this.id = id
        this.name = name
        this.accuracy = accuracy
        this.power = power
        this.pp = pp
        this.priority = priority
        this.type = type
        this.statChanges = statChanges
        this.target = target
    }

    getId () { return this.id }

    setId (id) { this.id = id }

    getName () { return this.name }

    setName (name) { this.name = name }

    getAccuracy () { return this.accuracy }

    setAccuracy (accuracy) { this.accuracy = accuracy }

    getPower () { return this.power }

    setPower (power) { this.power = power }

    getPp () { return this.pp }

    setPp (pp) { this.pp = pp }

    getPriority () { return this.priority }

    setPriority (priority) { this.priority = priority }

    getType () { return this.type }

    setType (type) { this.type = type }

    getStatChanges () { return this.statChanges }

    setStatChanges (statChanges) { this.statChanges = statChanges }

    getTarget () { return this.target }

    setTarget (target) { this.target = target }
}