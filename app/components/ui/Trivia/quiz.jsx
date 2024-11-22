"use client";
import React, { useState } from "react";
import { verses } from "./verses";

const ClozeTest = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [score, setScore] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [isCorrect, setIsCorrect] = useState(false);

    const currentVerse = verses[currentIndex];

    // Split the verse into parts, identifying blanks with placeholders
    const parts = currentVerse.text.split("____");

    const handleInputChange = (e, index) => {
        const updatedAnswers = [...userAnswers];
        updatedAnswers[index] = e.target.value;
        setUserAnswers(updatedAnswers);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let correctCount = 0;
        currentVerse.answers.forEach((answer, i) => {
            if (userAnswers[i]?.trim().toLowerCase() === answer.toLowerCase()) {
                correctCount++;
            }
        });

        if (correctCount === currentVerse.answers.length) {
            setScore(score + correctCount);
            setFeedback("Congratulations! You got it right!");
            setIsCorrect(true);

            if (currentIndex < verses.length - 1) {
                setTimeout(() => {
                    setCurrentIndex(currentIndex + 1);
                    setFeedback("");
                    setIsCorrect(false);
                }, 2000);
            } else {
                setCompleted(true);
            }
        } else {
            const fullVerse = currentVerse.text.replace(/____/g, (match, offset, string) => {
                const index = string.slice(0, offset).split("____").length - 1;
                return currentVerse.answers[index];
            });
            setFeedback(`Incorrect. The correct verse is: ${fullVerse}`);
            setIsCorrect(false);
        }

        setUserAnswers([]);
    };

    const restartQuiz = () => {
        setCurrentIndex(0);
        setScore(0);
        setCompleted(false);
        setFeedback("");
        setIsCorrect(false);
    };

    return (
        <div className="flex flex-col items-center p-6 min-h-screen ">
            {!completed ? (
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col items-center gap-4 p-6 shadow-lg rounded-md max-w-md w-full bg-slate-300 text-slate-600 shadow-cyan-300"
                >
                    <p className="text-lg font-semibold">
                        {parts.map((part, index) => (
                            <span key={index}>
                                {part}
                                {index < currentVerse.answers.length && (
                                    <input
                                        type="text"
                                        value={userAnswers[index] || ""}
                                        onChange={(e) => handleInputChange(e, index)}
                                        placeholder="Fill in the blank"
                                        className="inline-block mx-1 w-23 border-b border-gray-400 focus:outline-none focus:border-blue-500 rounded-md px-2 py-1 transition-all duration-300 ease-in-out transform hover:scale-105 focus:scale-105 text-[var(--foreground)] bg-[var(--background)]"
                                    />
                                )}
                            </span>
                        ))}
                    </p>
                    <button
                        type="submit"
                        className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                    >
                        Submit Answer
                    </button>
                    <p className="text-sm text-gray-500">{currentVerse.reference}</p>
                    {feedback && (
                        <p className={`mt-4 ${isCorrect ? "text-green-500" : "text-red-500"}`}>
                            {feedback}
                        </p>
                    )}
                </form>
            ) : (
                <div className="p-6 shadow-lg rounded-md max-w-md w-full text-center bg-[var(--background)] text-[var(--foreground)]">
                    <h2 className="text-2xl font-bold">Quiz Completed</h2>
                    <p className="text-lg my-4">
                        You scored {score} out of {verses.reduce((acc, v) => acc + v.answers.length, 0)}.
                    </p>
                    <button
                        onClick={restartQuiz}
                        className="py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                    >
                        Restart Quiz
                    </button>
                </div>
            )}
        </div>
    );
};

export default ClozeTest;
