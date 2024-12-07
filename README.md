# Overview
 The implementation has an infinite scroll functionality to fetch movie data from the OMDb API. It allows users to search for movies by title, fetches movie details dynamically, and loads more movies as the user scrolls down the page.
 Additionally, it includes features like:
  - Debounced search input to reduce redundant API calls.
  - Expandable movie cards to show/hide detailed information.
  - Error handling for API failures or invalid search queries.

### Local Development
  - clone the Git repository using  `git clone https://github.com/Pratiyushkumar/movie.git`.
  - install pnpm if it does not exists in your system by command `npm install -g pnpm`.
- run the command `pnpm install`.
- then start the project using `pnpm dev`.
- Ensure to create a .env file with `VITE_OMDB_API_KEY=your_api_key`
  
### Technologies Used
- React
- TypeScript
- Tailwind CSS
- Vite
- OMDb API
- Lucide React Icons

### Production Link -
https://movie-ixa9n6ca5-pratiyushs-projects-ca86160b.vercel.app/