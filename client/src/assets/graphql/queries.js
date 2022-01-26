export const getFrontSprites = `
    query {
        pokemon {
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