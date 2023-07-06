import React from "react";
import Card from "react-bootstrap/Card";

function Footer() {
  const footerItems = [
    {
      id: 1,
      href: "https://www.drupal.org",
      src: "/images/drupal8.png",
    },
    {
      id: 2,
      href: "https://facebook.github.io/react/",
      src: "/images/react.png",
    },
    {
      id: 3,
      href: "http://getbootstrap.com",
      src: "/images/bootstrap4.png",
    },
  ];
  return (
    <div className="row top-buffer bottom-buffer">
      <div className="col">
        <Card className="text-center">
          <Card.Body>
            <div className="mb-3">
              <small>
                Created by <em>Ahsan Nazir</em> |{" "}
                <a
                  rel="noreferrer"
                  href="http://www.github.com"
                  target="_blank"
                >
                  Get the code from Github
                </a>
              </small>
            </div>

            <div className="row">
              {footerItems.map((item) => (
                <div key={item.id} className="col-md">
                  <a rel="noreferrer" href={item.href} target="_blank">
                    <img alt="" src={item.src} height="30" />
                  </a>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default Footer;
