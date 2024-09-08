"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { correct, wrong, gold_tropy, loading_question } from '../../../assets';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const loadingMessages = ["Fetching...", "AI Is Working On It...."];

interface QuestionData {
  question: string;
  answers: string[];
  correct_answer: string;
  explanation: string;
}

interface AnswerData {
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  explanation: string;
  isCorrect: boolean;
}

const SecondPage: React.FC = () => {
  const searchParams = useSearchParams();
  const [questionData, setQuestionData] = useState<QuestionData | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loadingText, setLoadingText] = useState(loadingMessages[0]);
  const [savedQuestionData, setSavedQuestionData] = useState<AnswerData[]>([]);
  const [timer, setTimer] = useState(0);
  const [pauseTimer, setPauseTimer] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

  const resetTimer = (timeLimit: number) => {
    setTimer(timeLimit * 60);
  };

  const fetchQuestion = async () => {
    try {
      const numberOfQuestions = parseInt(searchParams.get("numberOfQuestions") || "0");
      setTotalQuestions(numberOfQuestions);
      if (answeredQuestions < numberOfQuestions) {
        const category = searchParams.get('category') || '';
        const age = searchParams.get('age') || '';
        setLoadingText(loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);
        const response = await fetch(`https://server-production-2de3.up.railway.app/generate-random-question/${category}/${age}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch question: ${response.status} - ${response.statusText}`);
        }

        const data: QuestionData = await response.json();
        setQuestionData(data);
        setPauseTimer(false);
        setSelectedAnswer(null);
      }
    } catch (error) {
      console.error('Error fetching question:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    }
  };

  const handleNext = () => {
    if (answeredQuestions < totalQuestions && selectedAnswer && questionData) {
      const isCorrect = selectedAnswer === questionData.correct_answer;

      const answerData: AnswerData = {
        question: questionData.question,
        selectedAnswer: selectedAnswer,
        correctAnswer: questionData.correct_answer,
        explanation: questionData.explanation,
        isCorrect: isCorrect
      };
      setSavedQuestionData([...savedQuestionData, answerData]);
      setAnsweredQuestions(answeredQuestions + 1);
      if (isCorrect) {
        setCorrectAnswers(correctAnswers + 1);
      }
      setIsDialogOpen(true);
      setIsAnswerSubmitted(true);
    }
  };
  
  const handleNextQuestion = () => {
    setIsDialogOpen(false);
    if (answeredQuestions < totalQuestions) {
      setQuestionData(null);
      setPauseTimer(true);
      fetchQuestion();
      setIsAnswerSubmitted(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  useEffect(() => {
    if (!timer || pauseTimer) return;

    const intervalId = setInterval(() => {
      setTimer((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timer, pauseTimer]);

  useEffect(() => {
    setPauseTimer(true);
    const numberOfQuestions = parseInt(searchParams.get("numberOfQuestions") || "0");
    setTotalQuestions(numberOfQuestions);
    resetTimer(parseInt(searchParams.get("timeLimit") || "0"));
    fetchQuestion();
  }, [searchParams]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const getAnswerButtonClass = (answer: string) => {
    if (!isAnswerSubmitted) {
      return selectedAnswer === answer ? 'bg-gray-200' : '';
    }
    if (answer === questionData?.correct_answer) {
      return 'bg-green-200';
    }
    if (answer === selectedAnswer && selectedAnswer !== questionData?.correct_answer) {
      return 'bg-red-200';
    }
    return '';
  };

  return (
    <div className="w-full relative h-screen flex justify-center items-center">
      <div className={`absolute m-5 top-0 right-0 rounded-md border-2 w-auto h-auto p-5 text-xl font-bold font-sans ${timer === 1 ? 'text-red-500' : ''}`}>
        Time: {formatTime(timer)}
        <br />
        Score: {totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0}/100
        <br />
        Questions: {answeredQuestions}/{totalQuestions}
      </div>
      <div className="w-auto h-auto border-2 rounded-md">
        <div className="flex flex-col h-auto">
          {questionData ? (
            <div className="flex flex-col flex-1">
              <div className="border-b border-gray-200 dark:border-gray-800">
                <div className="px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-center py-4 md:py-6">
                    <div className="space-y-1">
                      <h1 className="text-lg font-bold leading-none">Quiz App</h1>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Question {answeredQuestions + 1}: {questionData?.question}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center p-4">
                <div className="space-y-4 w-full max-w-sm">
                  {questionData?.answers.map((answer, index) => (
                    <div key={index} className="grid gap-2">
                      <button
                        className={`w-full p-2 rounded-md text-sm font-medium cursor-pointer ${getAnswerButtonClass(answer)}`}
                        onClick={() => !isAnswerSubmitted && handleAnswerSelect(answer)}
                        disabled={isAnswerSubmitted}
                      >
                        {answer}
                      </button>
                    </div>
                  ))}
                  
                  <div className="flex justify-between">
                    {questionData && answeredQuestions === totalQuestions ? (
                      <Drawer>
                        <DrawerTrigger>
                          <Button type="button" variant="secondary">
                            Done
                          </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                          <div className="max-h-[80vh] overflow-y-auto">
                            <DrawerHeader>
                              <DrawerTitle>Congratulations!</DrawerTitle>
                              <DrawerDescription>You Have Successfully Completed The Quiz.</DrawerDescription>
                              <div className='w-full h-auto flex flex-col justify-center items-center'>
                                <Image src={gold_tropy} alt="correct" width={200} height={200} className='text-center'/>
                                <h1 className='font-extrabold font-sans text-xl'>{totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0}/100</h1>
                                <Table>
                                  <TableCaption>A list of your recent questions.</TableCaption>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Question</TableHead>
                                      <TableHead>Selected Answer</TableHead>
                                      <TableHead>Correct Answer</TableHead>
                                      <TableHead>Explanation</TableHead>
                                      <TableHead>Result</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {savedQuestionData.map((answerData, index) => (
                                      <TableRow key={index}>
                                        <TableCell>{answerData.question}</TableCell>
                                        <TableCell>{answerData.selectedAnswer}</TableCell>
                                        <TableCell>{answerData.correctAnswer}</TableCell>
                                        <TableCell>{answerData.explanation}</TableCell>
                                        <TableCell>{answerData.isCorrect ? "Correct" : "Incorrect"}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </DrawerHeader>
                          </div>
                          <DrawerFooter>
                            <Link href="/form">
                              <Button className='w-full'>Do It Again</Button>
                            </Link>
                            <DrawerClose>
                              <Button variant="outline" className='w-full'>Cancel</Button>
                            </DrawerClose>
                          </DrawerFooter>
                        </DrawerContent>
                      </Drawer>
                    ) : (
                      <Button onClick={handleNext} disabled={!selectedAnswer || isAnswerSubmitted}>
                        Next
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <Image src={loading_question} alt="Loading" width={500} height={500} />
              <p className="text-gray-500 text-2xl font-bold">{loadingText}</p>
            </div>
          )}
        </div>
      </div>
      
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedAnswer === questionData?.correct_answer
                ? "Correct Answer!"
                : "Incorrect Answer"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {questionData?.explanation}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex items-center justify-center space-x-2">
            <div className="grid flex-1 gap-2 justify-center items-center">
              {selectedAnswer === questionData?.correct_answer ? (
                <Image src={correct} alt="correct" width={100} height={100} />
              ) : (
                <Image src={wrong} alt="incorrect" width={100} height={100} />
              )}
            </div>
          </div>
          <AlertDialogFooter className="sm:justify-start">
            <AlertDialogAction asChild>
              <Button
                type="button"
                variant="secondary"
                onClick={handleNextQuestion}
              >
                {answeredQuestions === totalQuestions ? "Finish" : "Next Question"}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SecondPage;
