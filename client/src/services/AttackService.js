import { PHYSICAL_ATTACK_TYPES, MOVES_EXEMPT_FROM_RANDOM_ATTACK_COEFFICIENT } from '../constants/attackTypes'
import HttpService from './HttpService'
import { getTypeModifierByMove } from '../assets/graphql/queries'
import { STAT } from '../constants/stat'

export class AttackService {

    static async applyAttack (move, attackingPokemon, defendingPokemon) {

        if (move.getPower() !== null) {

            let attackApplied
            let defenseApplied
            let random
            let stab = 1

            const bAttackIsPhysical = PHYSICAL_ATTACK_TYPES.includes(move.getType())

            if (bAttackIsPhysical) {
                attackApplied = Math.floor(attackingPokemon.getAttack().getCurrentStat() * this._getStageMultiplier(attackingPokemon.getAttack().getStage()))
                defenseApplied = Math.floor(defendingPokemon.getDefense().getCurrentStat() * this._getStageMultiplier(defendingPokemon.getDefense().getStage()))
            } else {
                attackApplied = Math.floor(attackingPokemon.getSpecialAttack().getCurrentStat() * this._getStageMultiplier(attackingPokemon.getSpecialAttack().getStage()))
                defenseApplied = Math.floor(defendingPokemon.getSpecialDefense().getCurrentStat() * this._getStageMultiplier(defendingPokemon.getSpecialDefense().getStage()))
            }

            if (MOVES_EXEMPT_FROM_RANDOM_ATTACK_COEFFICIENT.includes(move.getName())) {
                random = 1
            } else {
                random = this._getRandomCoefficient()
            }

            const defendingPokemonTypes = defendingPokemon.getTypes()
            for (let i = 0; i < defendingPokemonTypes.length; i++) {
                if (defendingPokemonTypes.includes(move.getType())) {
                    stab = 1.5
                    break
                }
            }

            const typeEffectiveness = await this._calculateTypeEffectiveness(move, defendingPokemon)

            const damage = Math.floor(((((((2 * attackingPokemon.getLevel()) / 5) + 2) * move.getPower() * (attackApplied / defenseApplied)) / 50) + 2) * random * stab * typeEffectiveness)
            return { bDamageDealtToDefendingPokemon: true, damage }

        }

        // move affects defendingPokemon's stat(s)
        move.getStatChanges().forEach((statChangeObj) => {
            switch (statChangeObj.getName()) {

                case STAT.attack: {
                    const attack = defendingPokemon.getAttack()
                    attack.changeStage(statChangeObj.getChange())
                    defendingPokemon.setAttack(attack)
                    break
                }

                case STAT.defense: {
                    const defense = defendingPokemon.getDefense()
                    defense.changeStage(statChangeObj.getChange())
                    defendingPokemon.setDefense(defense)
                    break
                }

                case STAT.specialAttack: {
                    const specialAttack = defendingPokemon.getSpecialAttack()
                    specialAttack.changeStage(statChangeObj.getChange())
                    defendingPokemon.setSpecialAttack(specialAttack)
                    break
                }

                case STAT.specialDefense: {
                    const specialDefense = defendingPokemon.getSpecialDefense()
                    specialDefense.changeStage(statChangeObj.getChange())
                    defendingPokemon.setSpecialDefense(specialDefense)
                    break
                }

                case STAT.speed: {
                    const speed = defendingPokemon.getSpeed()
                    speed.changeStage(statChangeObj.getChange())
                    defendingPokemon.setSpeed(speed)
                    break
                }

                default:
                    break
            }
        })

        return { bDamageDealtToDefendingPokemon: false, defendingPokemon }
    }

    static _getRandomCoefficient() {
        const min = 217
        const max = 255
        return this._boxMullerNormDist(min, max) / 255
    }

    static _boxMullerNormDist(min, max) {
        let u = 0
        let v = 0;
        while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
        while (v === 0) v = Math.random();
        let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
        num = num / 10.0 + 0.5 // Translate to 0 -> 1
        if (num > 1 || num < 0) return this._boxMullerNormDist(min, max) // resample between 0 and 1
        return Math.floor(num * (max - min + 1) + min)
    }

    static async _calculateTypeEffectiveness(move, defendingPokemon) {

        const FAIRY_TYPE = 'fairy'
        const NORMAL_TYPE = 'normal'

        const typeModifiersRes = await HttpService.graphql(getTypeModifierByMove, { attackTypeModifier: move.getType() })

        let typeEffectiveness
        let tmpDefendingPokemonType
        const typeModifierObj = typeModifiersRes.data.data.typeModifiers[0]

        defendingPokemon.getTypes().forEach((defendingPokemonType, i) => {
            tmpDefendingPokemonType = defendingPokemonType

            if (defendingPokemonType === FAIRY_TYPE) {
                tmpDefendingPokemonType = NORMAL_TYPE
            }

            if (i < 1) {
                typeEffectiveness = typeModifierObj[tmpDefendingPokemonType]
            } else {
                typeEffectiveness *= typeModifierObj[tmpDefendingPokemonType]
            }
        })
        return typeEffectiveness
    }

    static _getStageMultiplier(stage) {
        if (stage === 6) { return 4 }
        if (stage === 5) { return 7 / 2 }
        if (stage === 4) { return 3 }
        if (stage === 3) { return 5 / 2 }
        if (stage === 2) { return 2 }
        if (stage === 1) { return 3 / 2 }
        if (stage === -1) { return 2 / 3 }
        if (stage === -2) { return 1 / 2 }
        if (stage === -3) { return 2 / 5 }
        if (stage === -4) { return 1 / 3 }
        if (stage === -5) { return 2 / 7 }
        if (stage === -6) { return 1 / 4 }
        return 1
    }

}