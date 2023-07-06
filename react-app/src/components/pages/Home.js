import React from "react";
import Card from "react-bootstrap/Card";

function Home() {
  return (
    <div className="row top-buffer">
      <div className="col">
        <Card>
          <Card.Body>
            <Card.Title>Decupled Drupal</Card.Title>
            <Card.Text>
              Thanks to JSON API and REST web services in Drupal, we can build
              fully decoupled applications. What is the meaning of the decoupled
              in this context you may ask? Well, decoupled refers to a
              separation between the back-end and front-end. In this sense
              Drupal is used as a back-end to store your content and provide API
              to your front-end applications. This means that you can connect
              your website, mobile application and anything you want to a single
              back-end.
            </Card.Text>
            <Card.Text>
              The front-end for this website is built with React JS and
              Bootstrap 5. To achieve single application feel, I used newest
              version of React Router and this means that you don't have to
              refresh pages. To see why is decoupled Drupal a good thing visit
              the following article:{" "}
              <a href="#" target="_blank">
                The future of decoupled Drupal
              </a>
              . For now, I implemented the following things:
            </Card.Text>
            <ul className="list-group">
              <li className="list-group-item list-group-item-success">
                Articles fetching
              </li>
              <li className="list-group-item list-group-item-info">
                Basic page fetching
              </li>
              <li className="list-group-item list-group-item-danger">
                User registration
              </li>
              <li className="list-group-item list-group-item-success">
                User login
              </li>
              <li className="list-group-item list-group-item-info">
                User logout
              </li>
              <li className="list-group-item list-group-item-danger">
                User info fetching
              </li>
              <li className="list-group-item list-group-item-warning">
                Create article
              </li>
              <li className="list-group-item list-group-item-success">
                Edit article
              </li>
              <li className="list-group-item list-group-item-info">
                Delete article
              </li>
            </ul>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default Home;
