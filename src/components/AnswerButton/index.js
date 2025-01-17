import { useState, useEffect, useRef } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Button, Typography } from "@mui/material";
import rightIcon from "../../assests/right.gif";
import wrongIcon from "../../assests/wrong2.gif";
import "./styles.css";
import { useDispatch, useSelector } from "react-redux";
import {
  selectQuestionCounter,
  selectRoundProgress,
  selectScore,
} from "../../store/game/selectors";
import {
  selectCorrectButton,
  selectShuffledQuestions,
} from "../../store/question/selector";
import {
  incrementQuestionCounter,
  incrementScore,
} from "../../store/game/actions";
import { useNavigate } from "react-router-dom";
import { resetQuestionStore } from "../../store/question/actions";

const initialButtonState = [
  { id: 0, correct: false },
  { id: 1, correct: false },
  { id: 2, correct: false },
  { id: 3, correct: false },
];

const TIME_PER_QUESTION = 10;

export default function RowAndColumnSpacing() {
  const score = useSelector(selectScore);
  console.log(score);

  const shuffledQuestions = useSelector(selectShuffledQuestions);
  const { correctButton, questionNumber } = useSelector(selectCorrectButton);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const roundProgress = useSelector(selectRoundProgress);
  const counter = useSelector(selectQuestionCounter);

  const [buttonsState, setButtonState] = useState(initialButtonState);
  const [timerState, setTimerState] = useState(null);
  const [timePassed, setTimePassed] = useState(0);
  const timeRef = useRef(timePassed);
  timeRef.current = timePassed;
  // after user clicks => true
  // when we load the next question => false
  const [answered, setAnswered] = useState(false);

  const createInterval = () => {
    const timer = setInterval(() => {
      setTimePassed(timeRef.current + 1);
    }, 1000);

    setTimerState(timer);
  };

  useEffect(() => {
    createInterval(); // start timer
  }, []);

  const resetEverything = () => {
    // 1. Reset buttonState + answered.
    // setButtonState();
    // 2. Load next question
    // 3. Restart interval (10 secs)

    setTimeout(() => {
      setAnswered(false);
      setButtonState(initialButtonState);
      setTimePassed(0);
      if (0 !== roundProgress) {
        dispatch(incrementQuestionCounter());
      } else if (counter === 12) {
        navigate("/gameover");
      } else {
        navigate("/game");
        dispatch(resetQuestionStore());
        dispatch(incrementQuestionCounter());
      }

      createInterval();
    }, 1500);
  };

  useEffect(() => {
    if (timeRef.current === TIME_PER_QUESTION) {
      console.log("Reset timer! next question");
      clearInterval(timerState);
      updateButtonState(); // shows answers

      // when timeout is finished => reset everything
      resetEverything(); // waits X seconds and resets everything
    }
  }, [timeRef.current]);

  const updateButtonState = () => {
    const updatedButtonState = buttonsState.map((b) => ({
      ...b,
      correct:
        b.id === correctButton[roundProgress !== 0 ? roundProgress - 1 : 3],
    }));
    setButtonState(updatedButtonState);
    setAnswered(true);
  };

  const handleClick = (buttonNr) => {
    clearInterval(timerState);
    // know which option was selected
    // check if it's the correct one
    const isCorrectAnswer =
      correctButton[roundProgress !== 0 ? roundProgress - 1 : 3] === buttonNr; // [0-3]
    // update all answers state + set answered to true
    updateButtonState();

    // if correct answer => increase score
    if (isCorrectAnswer) dispatch(incrementScore());
    resetEverything(); // wait X seconds and reset + load next question
  };

  return (
    <Box sx={{ mt: 4, mb: 2 }}>
      <Typography variant="h5">Timer: {10 - timePassed}</Typography>
      <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {[0, 1, 2, 3].map((i) => (
          <Grid item xs={6} key={i}>
            <Button
              onClick={() => {
                handleClick(i);
              }}
              color="secondary"
              xs={6}
              sx={{ width: 1, height: "130px", borderRadius: "15px" }}
              variant="contained"
              size="large"
            >
              <Typography
                className="main-button"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  fontFamily: `'Happy Monkey', cursive`,
                }}
                variant="h5"
              >
                <div sx={{ alignItems: "center", display: "flex" }}>
                  {
                    shuffledQuestions[
                      [roundProgress !== 0 ? roundProgress - 1 : 3]
                    ][i]
                  }
                </div>
                <div>
                  {answered &&
                    (buttonsState[i].correct ? (
                      <img
                        className="icons"
                        sx={{ height: "100px!important" }}
                        src={rightIcon}
                        alt="loading..."
                      />
                    ) : (
                      <img
                        className="icons"
                        sx={{ height: "100px!important" }}
                        src={wrongIcon}
                        alt="loading..."
                      />
                    ))}
                </div>
              </Typography>
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
