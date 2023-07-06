import React from "react";
import Carousel from "react-bootstrap/Carousel";

function Slider() {
  const carouselItems = [
    {
      id: 1,
      imgSrc: "http://placehold.it/1140x350",
      imgAlt: "First slide",
      caption: "Nulla vitae elit libero, a pharetra augue mollis interdum.",
    },
    {
      id: 2,
      imgSrc: "http://placehold.it/1140x350",
      imgAlt: "Second slide",
      caption: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      id: 3,
      imgSrc: "http://placehold.it/1140x350",
      imgAlt: "Third slide",
      caption:
        "Praesent commodo cursus magna, vel scelerisque nisl consectetur.",
    },
  ];
  return (
    <Carousel className="mt-3">
      {carouselItems.map((item) => (
        <Carousel.Item key={item.id}>
          <img className="d-block w-100" src={item.imgSrc} alt={item.imgAlt} />
          <Carousel.Caption>
            <p>{item.caption}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default Slider;
