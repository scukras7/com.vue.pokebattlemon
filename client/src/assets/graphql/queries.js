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