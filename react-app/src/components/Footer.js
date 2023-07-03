import React from "react";
import Card from "react-bootstrap/Card";

function Footer() {
  return (
    <div className="row top-buffer bottom-buffer">
      <div className="col">
        <Card className="text-center">
          <Card.Body>
            <small>
              Created by{" "}
              <a href="#" target="_blank">
                Ahsan Nazir
              </a>{" "}
              |{" "}
              <a href="#" target="_blank">
                Get the code from Github
              </a>
            </small>
            <br />
            <br />
            <div className="row">
              <div className="col-md">
                <a href="https://www.drupal.org" target="_blank">
                  <img alt="" src="/images/drupal8.png" height="30" />
                </a>
              </div>
              <div className="col-md">
                <a href="https://facebook.github.io/react/" target="_blank">
                  <img alt="" src="/images/react.png" height="30" />
                </a>
              </div>
              <div className="col-md">
                <a href="http://getbootstrap.com" target="_blank">
                  <img alt="" src="/images/bootstrap4.png" height="30" />
                </a>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default Footer;
