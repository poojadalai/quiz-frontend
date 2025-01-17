import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllMovies } from "../../store/homePage/actions";
import { selectMovies } from "../../store/homePage/selectors";
import {
  ImageList,
  ImageListItem,
  Container,
  Link,
  Typography,
  Box,
} from "@mui/material";
import { apiUrlPoster } from "../../config/constants";
import "./style.css";
// import { Link } from "react-router-dom";

export default function HomePage() {
  const dispatch = useDispatch();
  const listOfMovies = useSelector(selectMovies);

  console.log("listOfMovies= ", listOfMovies);

  useEffect(() => {
    dispatch(fetchAllMovies());
  }, [dispatch]);
  return (
    <>
      {/* <h1>Welcome to Movie Quiz</h1> */}
      <Container className="overlay"></Container>
      <Box className="title-box">
        <Typography className="line home-page-title" variant="h1">
          Welcome to the Movie Quiz
        </Typography>
        <Box className="home-page-buttons">
          <Link href="/game" className="home-page-button">
            Start Game
          </Link>
          <Link href="/scoreboard" className="home-page-button">
            Scoreboard
          </Link>
        </Box>
      </Box>
      <ImageList
        className="image-list-container"
        variant="quilted"
        cols={4}
        rowHeight={191}
      >
        {listOfMovies.map((item) => (
          <ImageListItem className="image-list-item" key={item.id}>
            <img
              alt={item.title}
              loading="lazy"
              src={`${apiUrlPoster}${item.backdrop_path}`}
            />
          </ImageListItem>
        ))}
      </ImageList>
      {/* <Button className="home-page-button">Start Game</Button> */}
    </>
  );
}
