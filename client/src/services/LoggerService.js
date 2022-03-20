import HttpService from './HttpService'
import { BenchPokemonReq } from '../classes/BenchPokemonReq'
import { LOGS } from '../assets/constants'
import routes from '../assets/json/routes.json'

export class LoggerService {

    static log (log, logObj, battleId, attackObj, defendingPokemon) {

        let url
        let body

        if (log === LOGS.benches) {
            url = routes.server.api.root + routes.server.api.logBenches
            const { playerBench, opponentBench } = this._logBenches(logObj)
            body = { battleId, playerBench, opponentBench, dateCreated: new Date() }
        } else if (log === LOGS.faints) {
            url = routes.server.api.root + routes.server.api.logFaints
            this._logFaints(logObj)
        } else if (log === LOGS.move) {
            url = routes.server.api.root + routes.server.api.logMove
            const { attackingPokemon, name, damageAmountDealt } = this._logMove(logObj, attackObj)
            body = { battleId, attackingPokemon, defendingPokemon, name, damageAmountDealt, dateCreated: new Date() }
        } else if (log === LOGS.winner) {
            url = routes.server.api.root + routes.server.api.logWinner
            this._logWinner(logObj)
        }
        console.log('LOGGER')
        console.log(url)
        console.log(body)
        HttpService.post(url, body)
    }

    /*
        logObj: { playerBench, opponentBench }
    */
    static _logBenches(logObj) {

        const playerBench = []
        const opponentBench = []

        logObj.playerBench.forEach((pokemon) => {

            const moves = []
            pokemon.moves.forEach((move) => {
                moves.push(move.name)
            })

            playerBench.push(new BenchPokemonReq(
                pokemon.id,
                pokemon.name,
                pokemon.level,
                pokemon.baseExp,
                { name: pokemon.hp.name, baseStat: pokemon.hp.baseStat, currentStat: pokemon.hp.currentStat },
                { name: pokemon.attack.name, baseStat: pokemon.attack.baseStat, currentStat: pokemon.attack.currentStat },
                { name: pokemon.defense.name, baseStat: pokemon.defense.baseStat, currentStat: pokemon.defense.currentStat },
                { name: pokemon.specialAttack.name, baseStat: pokemon.specialAttack.baseStat, currentStat: pokemon.specialAttack.currentStat },
                { name: pokemon.specialDefense.name, baseStat: pokemon.specialDefense.baseStat, currentStat: pokemon.specialDefense.currentStat },
                { name: pokemon.speed.name, baseStat: pokemon.speed.baseStat, currentStat: pokemon.speed.currentStat },
                moves,
                pokemon.types
            ))
        })

        logObj.opponentBench.forEach((pokemon) => {

            const moves = []
            pokemon.moves.forEach((move) => {
                moves.push(move.name)
            })

            opponentBench.push(new BenchPokemonReq(
                pokemon.id,
                pokemon.name,
                pokemon.level,
                pokemon.baseExp,
                { name: pokemon.hp.name, baseStat: pokemon.hp.baseStat, currentStat: pokemon.hp.currentStat },
                { name: pokemon.attack.name, baseStat: pokemon.attack.baseStat, currentStat: pokemon.attack.currentStat },
                { name: pokemon.defense.name, baseStat: pokemon.defense.baseStat, currentStat: pokemon.defense.currentStat },
                { name: pokemon.specialAttack.name, baseStat: pokemon.specialAttack.baseStat, currentStat: pokemon.specialAttack.currentStat },
                { name: pokemon.specialDefense.name, baseStat: pokemon.specialDefense.baseStat, currentStat: pokemon.specialDefense.currentStat },
                { name: pokemon.speed.name, baseStat: pokemon.speed.baseStat, currentStat: pokemon.speed.currentStat },
                moves,
                pokemon.types
            ))
        })

        return { playerBench, opponentBench }
    }

    static _logFaints(logObj) {
        console.log(logObj)
    }

    static _logMove(logObj, attackObj) {

        console.log('_logMove')
        console.log(logObj)
        console.log(attackObj)
        const attackingPokemon = logObj.pokemon.getName()
        const name = logObj.move.getName()

        let damageAmountDealt = null

        if (attackObj && attackObj.bDamageDealtToDefendingPokemon) {
            damageAmountDealt = attackObj.damage
        }

        return { attackingPokemon, name, damageAmountDealt }

    }

    static _logWinner(logObj) {
        console.log(logObj)
    }

}