export const getFrontSprites = `
    query {
        pokemon {
            id
            name
            sprites {
            front_default
            }
        }
    }
`

export const getSpritesByPokemonName = `
    query ($pokemon: String) {
        pokemon (name: $pokemon) {
            name
            sprites {
                front_default
                back_default
            }
        }
    }
`

export const getStatsByPokemonName = `
    query ($pokemon: String) {
        pokemon (name: $pokemon) {
            name
            stats {
                base_stat
                effort
                stat {
                    name
                }
            }
        }
    }
`

export const getAllPokemonAndStats = `
    query {
        pokemon {
            id
            name
            base_experience
            stats {
                base_stat
                effort
                stat {
                    name
                }
            }
            sprites {
                back_default
                front_default
            }
        }
    }
`

export const getMovesByPokemon = `
    query ($name: String, $levelLearnedAtLTE: Int, $moveLearnMethod: String) {
        pokemon (name: $name, levelLearnedAtLTE: $levelLearnedAtLTE, moveLearnMethod: $moveLearnMethod) {
            moves {
                move {
                    name
                }
                version_group_details {
                    level_learned_at
                    move_learn_method {
                        name
                    }
                    version_group {
                        name
                    }
                }
            }
        }
    }
`

export const getMoveDetails = `
    query ($name: [String]) {
        moves (name: $name){
            id
            name
            accuracy
            power
            pp
            priority
            type {
                name
            }
            stat_changes {
                change
                stat {
                    name
                }
            }
            target {
                name
            }
        }
    }
`