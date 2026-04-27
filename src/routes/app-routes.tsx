import { BrowserRouter, Route, Routes } from "react-router";
import { TestingPage } from "../pages/testing-page";
import { TestingPage2 } from "../pages/testing-page2";

// App use react-router to handle routing in the application
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TestingPage />} />
        <Route path="testing" element={<TestingPage2 />} />
        {/* <Route path="movie/:movieId" element={<MovieDetailView />} />
        <Route path="tv-shows" element={<TvShowsView />} />
        <Route path="tv-show/:tvShowId" element={<TvShowDetailView />} />
        <Route path="*" element={<NotFoundView />} /> */}
      </Routes>
    </BrowserRouter>
  );
}