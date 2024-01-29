import React, { useState, useEffect } from "react";
import axios from "axios";

import { NavLink, useParams } from "react-router-dom";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  const { movieID } = useParams();

  useEffect(() => {
    fetchMovieTitles();
    fetchMovie();
    // renderMoviesTitle();
  }, []);

  const fetchMovieTitles = async () => {
    console.log("FETCH MOVIES TITLES");
    setLoading(true);
    try {
      const res = await axios.get(
        "http://decouple-drupal.ddev.site/jsonapi/node/movie?fields[node--movie]=title"
      );
      const data = await res.data.data;
      setMovies(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const fetchMovie = async (nid) => {
    console.log("FETCH MOVIE");

    var id;
    if (nid !== undefined) {
      id = nid;
    } else if (movieID !== undefined) {
      id = movieID;
    } else {
      id = "7b2c706b-11cf-4f66-8998-b0d2d2c0f7dd";
    }
    const res = await axios.get(
      "http://decouple-drupal.ddev.site/jsonapi/node/movie/" + id
    );
    const data = res.data.data;

    setTitle(data.attributes.title);
    setBody(data.attributes?.body?.value);
  };

  const updateSearchKeyword = (event) => {
    setKeyword(event.target.value);
  };

  const updateSelectedMovie = (event) => {
    fetchMovie(event.target.getAttribute("data-value"));
  };

  return (
    <>
      {loading && <div>Loading...</div>}
      <div className="row top-buffer">
        <div className="col-md-4">
          <form>
            <div className="form-group">
              <input
                name="keyword"
                value={keyword}
                onChange={updateSearchKeyword}
                type="text"
                className="form-control"
                placeholder="Search movies"
              />
            </div>
          </form>
          <div className="list-group mt-3">
            {movies.map((movie) => {
              if (
                movie.attributes.title
                  .toLowerCase()
                  .indexOf(keyword.toLowerCase()) !== -1
              ) {
                return (
                  <NavLink
                    key={movie.id}
                    data-value={movie.id}
                    onClick={updateSelectedMovie}
                    to={"/movies/" + movie.id}
                    className="list-group-item list-group-item-action"
                  >
                    {movie.attributes.title}
                  </NavLink>
                );
              }
            })}
          </div>
          <br />
        </div>
        <div className="col-md-8">
          {loading && <div>Loading...</div>}
          <div className="card text-center">
            <div className="card-header">{title}</div>
            <div
              className="card-block"
              dangerouslySetInnerHTML={{ __html: body }}
            />
            <div className="card-footer text-muted text-left">
              <em>
                <small>Actor Ahsan.</small>
              </em>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Movies;
