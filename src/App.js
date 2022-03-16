import React, { useEffect, useState } from "react";
import { randSix } from "./helpers";
// npm packages
import { nanoid } from "nanoid";
// confetti
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
// components
import Die from "./Die";
import Stats from "./Stats";

export default function App() {
  // confetti canvas dimensions
  const { width, height } = useWindowSize();
  
  //States
  const [dice, setDice] = useState(newDice());
  const [tenzies, setTenzies] = useState(false);
  const [count, setCount] = useState(0);

  // stopwatch start state 
  const [start, setStart] = useState(false);
  const [time, setTime] = useState(0);
  const [best, setBest] = useState(
    JSON.parse(localStorage.getItem("personalBest")) || {
      current: 0,
      previous: 0,
    }
  );

  useEffect(() => {
    function checkWin() {
      // check if every element is held AND
      // every element is equal to the first one, i.e. they're all the same
      return dice.every((elem) => elem.isHeld && elem.value === dice[0].value);
    }
    if (checkWin()) {
      setTenzies(true);
    }
  }, [dice]);

  // stopping the stopwatch and updating best time
  useEffect(() => {
    if (tenzies) {
      setStart(false);
      
      if (best.current === 0 || time < best.current) {
        
        setBest((prev) => ({ previous: prev.current, current: time }));
        localStorage.setItem(
          "personalBest",
          JSON.stringify({ current: time, previous: 0 })
        );
        setTime(time);
      }
    }
  }, [tenzies, best, time]);

  function newDice() {
    let diceArray = [];
    for (let i = 0; i < 10; i++) {
      diceArray.push({
        id: nanoid(),
        value: randSix(),
        isHeld: false,
      });
    }
    return diceArray;
  }

  function rollDice() {
    setCount((prev) => prev + 1);
    if (!tenzies) {
      setStart(true);
      setDice((prev) =>
        prev.map((elem) => (elem.isHeld ? elem : { ...elem, value: randSix() }))
      );
    } else {
      setTenzies(false);
      // reseting stats
      setCount(0);
      setTime(0);
      setDice(newDice());
    }
  }

  function hold(id) {
    setDice((prev) =>
      prev.map((elem) => {
        return id === elem.id ? { ...elem, isHeld: !elem.isHeld } : elem;
      })
    );
  }

  const mappedDice = dice.map((elem) => (
    <Die {...elem} key={elem.id} hold={() => hold(elem.id)} />
  ));

  return (
    <>
      {tenzies && <Confetti width={width} height={height} />}
      <main className="main">
        <h1>Tenzies</h1>
        <h3>
          Roll until all dice are the same. Click each die to freeze it at its
          current value between rolls.
        </h3>
        <div className="dice-grid">{mappedDice}</div>
        <button onClick={() => rollDice()}>
          {tenzies ? "New Game" : "Roll"}
        </button>
        <Stats
          count={count}
          start={start}
          time={time}
          setTime={setTime}
          best={best}
        />
      </main>
    </>
  );
}
