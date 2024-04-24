"use client";

import React, { useState, useEffect, useCallback } from "react";
import QuizItem from "./item-data.js";
import "./globals.css";

const Test = () => {
    const questions = QuizItem;

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [score, setScore] = useState(0);
    const [quizStarted, setQuizStarted] = useState(false);
    const [timer, setTimer] = useState(15);

    const handleStartQuiz = () => {
        setQuizStarted(true);
        };

    const handleAnswerOptionClick = useCallback((isCorrect) => {
        if (isCorrect) {
            setScore(score + 1);
        }

    const nextQuestion = currentQuestion + 1;
        if (nextQuestion < questions.length) {
            setCurrentQuestion(nextQuestion);
            setTimer(15); 
        } else {
            setShowScore(true);
        }
        }, [currentQuestion, score]);

    useEffect(() => {
        let timerId;

        if (quizStarted && !showScore) {
            timerId = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer === 0) {
                clearInterval(timerId);
                handleAnswerOptionClick(false);
                return 15;
                }
                return prevTimer - 1;
            });
            }, 1000);
        }

        return () => {
            clearInterval(timerId);
        };
    }, [handleAnswerOptionClick, quizStarted, showScore, timer]);

    const handleRetry = () => {
        setCurrentQuestion(0);
        setShowScore(false);
        setScore(0);
        setTimer(15);
        };

    const calculateTimerPercentage = () => {
        return (timer / 15) * 100;
        };

    return (
        <div className="app">
            {!quizStarted ? (
            <div className="start-section">
                <h2>Hey! Are you really a wizard?</h2>
                <p>If you want to find out, click START</p>
                <button className="start-button"onClick={handleStartQuiz}>Start</button>
            </div>
            ) : showScore ? (
            <div className="results-section">
                <h2>You scored {score} out of {questions.length}!</h2>
                <p>Press Retry to play again.</p>
                <button className="reset-button" onClick={handleRetry}>Retry</button>
            </div>
            ) : (
            <>
                <div className="timer-bar">
                    <div className="timer-bar-fill" style={{ width: `${calculateTimerPercentage()}%` }}></div>
                </div>
                <div className="question-section">
                <div className="question-count">
                    <span>Question {currentQuestion + 1}</span>/{questions.length}
                </div>
                <div className="question-text">{questions[currentQuestion].questionText}</div>
                </div>
                <div className="answer-options">
                {questions[currentQuestion].answerOptions.map((answerOption, index) => (
                    <button key={index} onClick={() => handleAnswerOptionClick(answerOption.isCorrect)}>
                    {answerOption.answerText}
                    </button>
                ))}
                </div>
            </>
            )}
        </div>
        );
    };

export default Test;
