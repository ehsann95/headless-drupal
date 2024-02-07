import React, { useState, useEffect } from "react";
import axios from "axios";

import { NavLink, useParams } from "react-router-dom";

const Movies = (props) => {
  const [movies, setMovies] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [movie, setMovie] = useState({
    title: "",
    body: "",
    actor: [],
  });
  const [loading, setLoading] = useState(false);

  const { movieID } = useParams();

  useEffect(() => {
    fetchMovieTitles();
    fetchMovie();
  }, []);

  const fetchMovieTitles = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}jsonapi/node/movie?fields[node--movie]=title`
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
    var id;
    if (nid !== undefined) {
      id = nid;
    } else if (movieID !== undefined) {
      id = movieID;
    } else {
      id = "7b2c706b-11cf-4f66-8998-b0d2d2c0f7dd";
    }
    const res = await axios.get(
      `${process.env.REACT_APP_BASE_URL}jsonapi/node/movie/${id}?include=field_actors`
    );
    const data = res.data.data;
    const actorsData = await res.data.included;

    setMovie({
      title: data.attributes.title,
      body: data.attributes?.body?.value,
      actor: actorsData.map((item) => item.attributes.title),
    });
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
          <div className="card text-center">
            <div className="card-header">{movie.title}</div>
            <div
              className="card-block"
              dangerouslySetInnerHTML={{ __html: movie.body }}
            />
            <div className="card-footer text-muted text-left">
              <em>
                <small>
                  Actor(s):{" "}
                  {movie.actor.map((actor, i) => (
                    <span key={`${actor}${i}`} className="me-1">
                      {actor}{" "}
                    </span>
                  ))}
                </small>
              </em>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Movies;
