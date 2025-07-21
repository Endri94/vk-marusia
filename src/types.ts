// src/types.ts
export type Movie = {
    id: number
    title: string
    originalTitle: string
    language: string
    releaseYear: number
    releaseDate: string
    genres: string[]
    plot: string
    runtime: number
    budget: string | null
    revenue: string | null
    homepage: string
    status: string
    posterUrl: string
    backdropUrl: string | null
    trailerUrl: string
    trailerYouTubeId: string
    tmdbRating: number
    searchL: string
    keywords: string[]
    countriesOfOrigin: string[]
    languages: string[]
    cast: string[]
    director: string
    production: string | null
    awardsSummary: string | null
}

export type Genre = {
    id: number;
    name: string;
    image: string;
    key: string  // <== добавь это
}