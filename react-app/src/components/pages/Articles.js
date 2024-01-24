import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import axios from "axios";
import { Link } from "react-router-dom";

function Articles() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_BASE_URL}jsonapi/node/article`
      );
      const data = await result.data.data;

      setArticles(data);
    } catch (error) {
      setError(true);
      console.log("Error fetching articles", error);
    }
  };

  return (
    <>
      <div className="mt-4 fs-5 font-monospace">
        <Link to="/articles/new">Create New Article</Link>
      </div>
      {error && <h2>Something went wrong</h2>}
      <div className="d-sm-block d-md-flex flex-wrap gap-3 mt-3">
        {articles.map((item) => (
          <Link
            className="width-30 text-decoration-none d-flex"
            to={`edit/${item.id}`}
            key={item.id}
          >
            <Card className="my-3 d-flex w-100">
              <Card.Header as="h5">{item.attributes?.title}</Card.Header>
              <Card.Body>
                <Card.Text
                  className="truncate"
                  dangerouslySetInnerHTML={{
                    __html: item.attributes?.body?.value,
                  }}
                ></Card.Text>
              </Card.Body>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}

export default Articles;
