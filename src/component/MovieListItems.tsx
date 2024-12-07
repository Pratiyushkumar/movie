import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { MovieListItemsProps } from '../types/movieTypes';

const MovieListItems: React.FC<MovieListItemsProps> = ({
    movie,
    isLastElement,
    lastMovieElementRef,
    toggleCardExpansion,
    isExpanded,
}) => {
    return (
        <div
            key={movie.imdbID}
            ref={isLastElement ? lastMovieElementRef : null}
            className='border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow'
        >
            {movie.Poster !== 'N/A' ? (
                <img
                    src={movie.Poster}
                    alt={movie.Title}
                    className='w-full h-64 object-cover'
                />
            ) : (
                <div className='w-full h-64 bg-gray-200 flex items-center justify-center'>
                    No Image
                </div>
            )}

            <div className='p-4'>
                <div className='flex justify-between items-center mb-2'>
                    <h2 className='text-lg font-bold'>{movie.Title}</h2>
                    <button
                        onClick={() => toggleCardExpansion(movie.imdbID)}
                        className='text-gray-500 hover:text-gray-700'
                    >
                        {isExpanded ? <ChevronUp /> : <ChevronDown />}
                    </button>
                </div>

                <p className='text-sm text-gray-600 mb-2'>
                    {movie.Year} | {movie.Genre}
                </p>

                {isExpanded && (
                    <>
                        <p className='text-xs text-gray-500 mb-2'>{movie.Plot}</p>
                        <div className='mt-2 text-xs'>
                            <span className='font-semibold'>Directed by:</span>{' '}
                            {movie.Director}
                        </div>
                        <div className='mt-1 text-xs'>
                            <span className='font-semibold'>Actors:</span> {movie.Actors}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MovieListItems;
