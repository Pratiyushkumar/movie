import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    MovieBasic,
    MovieDetails,
    MovieSearchResponse,
} from '../types/movieTypes';
import MovieListItems from './MovieListItems';

const MovieList: React.FC = () => {
    const [movieList, setMovieList] = useState<MovieDetails[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

    const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
    const observer = useRef<IntersectionObserver | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const debounceTimerRef = useRef<any>(null);

    const fetchMovies = useCallback(async () => {
        if (!searchTerm) return;

        setIsLoading(true);
        setError(null);

        try {
            const searchResponse = await fetch(
                `https://www.omdbapi.com/?apikey=${API_KEY}&s=${searchTerm}&page=${page}`
            );
            const searchData: MovieSearchResponse = await searchResponse.json();

            if (searchData.Response === 'False') {
                setError(searchData.Error || 'No movies found');
                setIsLoading(false);
                return;
            }

            const detailedMovies = await Promise.all(
                searchData.Search.map(async (movie: MovieBasic) => {
                    const detailResponse = await fetch(
                        `https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}&plot=full`
                    );
                    return detailResponse.json();
                })
            );

            setMovieList((prev) => [...prev, ...detailedMovies]);
            setPage((prev) => prev + 1);
        } catch (err) {
            setError('Error fetching movies');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [searchTerm, page, API_KEY]);

    const debouncedFetchMovies = useCallback(() => {
        // Clear any existing timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Set a new timer
        debounceTimerRef.current = setTimeout(() => {
            if (searchTerm.length > 2) {
                // Reset list and page when starting a new search
                setMovieList([]);
                setPage(1);
                setExpandedCards(new Set());
                fetchMovies();
            }
        }, 500); // 500ms debounce delay
    }, [searchTerm, fetchMovies]);

    const lastMovieElementRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (isLoading || page === 1) return;

            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    fetchMovies();
                }
            });

            if (node) observer.current.observe(node);
        },
        [isLoading, fetchMovies, page]
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);

        // Use debounced fetch instead of immediate fetch
        debouncedFetchMovies();
    };

    const toggleCardExpansion = (imdbID: string) => {
        setExpandedCards((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(imdbID)) {
                newSet.delete(imdbID);
            } else {
                newSet.add(imdbID);
            }
            return newSet;
        });
    };

    // Cleanup debounce timer on unmount
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    return (
        <div className='p-4 max-w-6xl mx-auto'>
            <h1 className='text-2xl font-bold mb-4'>Movie Infinite Scroll</h1>

            <input
                type='text'
                placeholder='Search movies...'
                value={searchTerm}
                onChange={handleSearchChange}
                className='w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />

            {error && <div className='text-red-500 text-center mb-4'>{error}</div>}

            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                {movieList.map((movie, index) => {
                    const isLastElement = movieList.length === index + 1;
                    const isExpanded = expandedCards.has(movie.imdbID);
                    return (
                        <MovieListItems
                            key={movie.imdbID}
                            movie={movie}
                            isLastElement={isLastElement}
                            isExpanded={isExpanded}
                            toggleCardExpansion={toggleCardExpansion}
                            lastMovieElementRef={lastMovieElementRef}
                        />
                    );
                })}
            </div>

            {isLoading && <div className='text-center mt-4'>Loading...</div>}
        </div>
    );
};

export default MovieList;