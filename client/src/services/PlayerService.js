/*
    function to conduct manage player's turn/attack

    3) Check if move has remaining PP
        - Check target
            - If 'user' then apply change to player's active pokemon
            - Else return

    NOTE: Evasion and Accuracy are ignored in this simulation

    return { pokemon: Pokemon, move: Move, faint: Boolean }
*/

import { STAT } from '../constants/stat'

export class PlayerService {

    static createMove (pokemon, move) {
        const STAT_CHANGE_USER = 'user'
        let bApplyMoveToOpponent = true

        if (move.getTarget() === STAT_CHANGE_USER) {
            bApplyMoveToOpponent = false
            move.getStatChanges().forEach((statChangeObj) => {

                switch (statChangeObj.getName()) {

                    case STAT.attack: {
                        const attack = pokemon.getAttack()
                        attack.changeStage(statChangeObj.getChange())
                        pokemon.setAttack(attack)
                        break
                    }

                    case STAT.defense: {
                        const defense = pokemon.getDefense()
                        defense.changeStage(statChangeObj.getChange())
                        pokemon.setDefense(defense)
                        break
                    }

                    case STAT.specialAttack: {
                        const specialAttack = pokemon.getSpecialAttack()
                        specialAttack.changeStage(statChangeObj.getChange())
                        pokemon.setSpecialAttack(specialAttack)
                        break
                    }

                    case STAT.specialDefense: {
                        const specialDefense = pokemon.getSpecialDefense()
                        specialDefense.changeStage(statChangeObj.getChange())
                        pokemon.setSpecialDefense(specialDefense)
                        break
                    }

                    case STAT.speed: {
                        const speed = pokemon.getSpeed()
                        speed.changeStage(statChangeObj.getChange())
                        pokemon.setSpeed(speed)
                        break
                    }

                    default:
                        break
                }
            })
        }

        return { pokemon, move, bApplyMoveToOpponent, faint: false }
    }
}