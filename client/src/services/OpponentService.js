/*
    function to conduct opponent's turn/attack
    randomly selects one of the available moves

    1) Check if any move has PP remaining
        - If no PP remaining faint pokemon, get next pokemon from opponent's bench and end turn
    2) Select move
    3) Check if move has remaining PP
        - PP--
        - Check target
            - If 'user' then apply change to opponent's active pokemon
            - Else return
    4) If move has no remaining PP then select another move

    NOTE: Evasion and Accuracy are ignored in this simulation

    return { pokemon: Pokemon, move: Move, faint: Boolean }
*/

import { STAT } from '../constants/stat'

export default class OpponentService {

    static chooseMove (pokemon) {
        const STAT_CHANGE_USER = 'user'

        let bMovesHavePp = false

        const moves = pokemon.getMoves()
        const selectedMoveElement = Math.floor(Math.random() * moves.length)
        const move = moves[selectedMoveElement]

        for (let i = 0; i < moves.length; i++) {
            if (moves[i].getPp() > 0) {
                bMovesHavePp = true
                break
            }
        }

        if (!bMovesHavePp) {
            return { pokemon, move, faint: true }
        }

        if (move.getPp() > 0) {

            if (move.getTarget() === STAT_CHANGE_USER) {

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

            moves[selectedMoveElement].setPp(moves[selectedMoveElement].getPp() - 1)
            pokemon.setMoves([...moves])

            return { pokemon, move, faint: false }
        }

        this.attack(pokemon)

    }

}