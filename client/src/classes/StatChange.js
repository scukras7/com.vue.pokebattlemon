export class StatChange {

    /*
        change: Number
        name: String
    */

    constructor (change, name) {
        this.change = change
        this.name = name
    }

    getChange () { return this.change }

    setChange (change) { this.change = change }

    getName () { return this.name }

    setName (name) { this.name = name }
}