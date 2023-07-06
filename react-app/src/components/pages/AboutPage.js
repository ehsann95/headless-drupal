import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import axios from "axios";

function AboutPage() {
  const [page, setPage] = useState({});

  const fetchPage = async () => {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_BASE_URL}jsonapi/node/page`
      );
      const data = await result.data.data[0];
      setPage(data);
      console.log(data);
    } catch (error) {
      console.log("Error fetching About page", error.response.data);
    }
  };

  useEffect(() => {
    fetchPage();
  }, []);

  return (
    <div className="row top-buffer">
      <div className="col">
        <Card className="text-center">
          <Card.Header>{page?.attributes?.title}</Card.Header>
          <Card.Body
            dangerouslySetInnerHTML={{ __html: page?.attributes?.body.value }}
          ></Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default AboutPage;
