import { Stat } from './Stat'

export class HpStat extends Stat {

    /*
        remainingHp: Number
    */

    constructor (name, baseStat) {
        super()
        this.name = name
        this.baseStat = baseStat
        this.currentStat = null
        this.remainingHp = null
    }

    getCurrentStat () { return this.currentStat }

    getRemainingHp () { return this.remainingHp }

    setRemainingHp (remainingHp) { this.remainingHp = remainingHp }
}