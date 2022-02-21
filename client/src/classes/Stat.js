import { STAGE_MAX, STAGE_MIN } from '../constants/stages'

export class Stat {

    /*
        name: String,
        baseStat: Number
        currentStat: Number - baseStat adjusted for pokemon's level
    */

    constructor (name, baseStat) {
        this.name = name
        this.baseStat = baseStat
        this.currentStat = null
        this.stage = 0
    }

    getName () { return this.name }

    setName (name) { this.name = name }

    getBaseStat () { return this.baseStat }

    setBaseStat (baseStat) { this.baseStat = baseStat }

    getCurrentStat () { return this.currentStat }

    setCurrentStat (currentStat) { this.currentStat = currentStat }

    getStage () { return this.stage }

    setStage (stage) { this.stage = stage }

    /*
        Use changeStage() to increment or decrement this.stage
    */
    changeStage (val) {
        if (val > 0) {
            if (this.stage + val > STAGE_MAX) {
                this.stage = STAGE_MAX
            } else {
                this.stage += val
            }
        } else {
            if (this.stage + val < STAGE_MIN) {
                this.stage = STAGE_MIN
            } else {
                this.stage += val
            }
        }
    }

}