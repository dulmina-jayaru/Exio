"use client"
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from 'next/image';
import { correct, wrong, gold_tropy } from '../../../assets';
import { ArrowBigRightDashIcon } from 'lucide-react';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { loading_question } from '../../../assets';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Dialog } from '@/components/ui/dialog';

// Import statements...

const loadingMessages = ["Fetching...", "AI Is Working On It...."];

const SecondPage = () => {
  const searchParams = useSearchParams();
  const [questionData, setQuestionData] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogCorrect, setDialogCorrect] = useState(false);
  const [dialogExplanation, setDialogExplanation] = useState("");
  const [loadingText, setLoadingText] = useState(loadingMessages[0]);
  const [restartAnimation, setRestartAnimation] = useState(false); // State to control animation restart
  const [savedQuestionData, setSavedQuestionData] = useState([]); // State to save the received question data
  const [timer, setTimer] = useState(0); // Timer state
  const [pauseTimer, setPauseTimer] = useState(false); // State to control whether the timer should be paused or not
  const [correctAnswers, setCorrectAnswers] = useState(0); // Number of correct answers
  const [totalQuestions, setTotalQuestions] = useState(0); // Total number of questions answered
  const [answeredQuestions, setAnsweredQuestions] = useState(0); // Total number of questions answered
  const [limit ,setLimit] = useState(false)

  const resetTimer = (timeLimit) => {
    setTimer(timeLimit * 60);
  };

  const fetchQuestion = async () => {
    try {
      const numberOfQuestions = parseInt(searchParams.get("numberOfQuestions"));
      setTotalQuestions(numberOfQuestions);
      console.log(numberOfQuestions)
      console.log(answeredQuestions)
      console.log(totalQuestions)
      console.log("d",savedQuestionData)
      console.log(process.env.API_URL)
      if (answeredQuestions < numberOfQuestions) {
        console.log("on it")
        const category = searchParams.get('category');
        const age = searchParams.get('age');
        setLoadingText(loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);

        const response = await fetch(`http://${process.env.API_URL}/generate-random-question/${category}/${age}`);

        if (!response.ok) {
          throw new Error('Failed to fetch question');
        }

        const data = await response.json();
        console.log(data);
        setQuestionData(data);
        setPauseTimer(false);
        setSelectedAnswer(null); // Reset selected answer
      } else {
        setLimit(true);
        console.log(questionData)

      }
    } catch (error) {
      console.error('Error fetching question:', error);
      // Handle error
    }
  };

  const handleNext = () => {
    if (answeredQuestions < totalQuestions) {
      if (selectedAnswer) {
        const isCorrect = selectedAnswer === questionData.correct_answer;

        const answerData = {
          question: questionData.question,
          selectedAnswer: selectedAnswer,
          correctAnswer: questionData.correct_answer,
          explanation: questionData.explanation,
          isCorrect: isCorrect
        };
        setSavedQuestionData([...savedQuestionData, answerData]);
        setAnsweredQuestions(answeredQuestions + 1);
        if (selectedAnswer === questionData.correct_answer) {
          setCorrectAnswers(correctAnswers + 1);
        }
        setDialogVisible(true);
        setDialogCorrect(selectedAnswer === questionData.correct_answer);
        setDialogExplanation(questionData.explanation);
        console.log(questionData)

      }
    } else {
      console.log("limit reached");
      console.log(questionData)
    }
  };
  
  const handleNextclick = () => {
    if (answeredQuestions < totalQuestions) {
      setQuestionData(null);
      setPauseTimer(true);
      fetchQuestion();
    }
  };

  const handlePrevious = () => {
    // Logic for moving to the previous question
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  useEffect(() => {
    if (!timer || pauseTimer) return;
    const score = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    const intervalId = setInterval(() => {
      setTimer((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timer, pauseTimer]);


  useEffect(() => {
    setPauseTimer(true);
    const numberOfQuestions = parseInt(searchParams.get("numberOfQuestions"));
    setTotalQuestions(numberOfQuestions);
    resetTimer(searchParams.get("timeLimit"));
    console.log("Form use", totalQuestions);
    fetchQuestion();

    if (restartAnimation) {
      setTimeout(() => {
        setRestartAnimation(false);
      }, 500);
    }
  }, [searchParams]);

  useEffect(() => {
    const score = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    console.log(score);
    // You can use the score state for any UI updates related to the score here
  }, [correctAnswers, totalQuestions]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
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
                      <p className="text-sm text-gray-500 dark:text-gray-400">Question 1: {questionData?.question}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center p-4">
                <div className="space-y-4 w-full max-w-sm">
                  {questionData?.answers.map((answer, index) => (
                    <div key={index} className="grid gap-2">
                      <button
                        className={`w-full p-2 rounded-md text-sm font-medium cursor-pointer ${
                          selectedAnswer === answer ? 'bg-gray-200' : ''
                        }`}
                        onClick={() => handleAnswerSelect(answer)}
                      >
                        {answer}
                      </button>
                    </div>
                  ))}
                  
                  <div className="flex justify-between">
                    <Button onClick={handlePrevious}>Previous</Button>
                    {questionData && answeredQuestions === totalQuestions ? (
                      <Drawer>
                        <DrawerTrigger>
                          <Button type="button" variant="secondary">
                            {answeredQuestions === totalQuestions ? "Done" : "Next"}
                            {answeredQuestions !== totalQuestions && <ArrowBigRightDashIcon />}
                          </Button>
                        </DrawerTrigger>
                        <DrawerContent>
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
                          <DrawerFooter>
                            <Link href={"/form"}>

                            <Button className='w-full'>Do It Again</Button>
                            </Link>
                            <DrawerClose>
                              <Button variant="outline" className='w-full'>Cancel</Button>
                            </DrawerClose>
                          </DrawerFooter>
                        </DrawerContent>
                      </Drawer>
                    ) : (
                      <Dialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button onClick={handleNext}>
                            {answeredQuestions === totalQuestions ? "Done" : "Next"}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="sm:max-w-md">
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              {selectedAnswer === questionData.correct_answer
                                ? "Correct Answer!"
                                : "Incorrect Answer"}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              {questionData.explanation}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className="flex items-center justify-center space-x-2">
                            <div className="grid flex-1 gap-2 justify-center items-center">
                              {selectedAnswer === questionData.correct_answer ? (
                                <Image src={correct} alt="correct" width={100} height={100} />
                              ) : (
                                <Image src={wrong} alt="correct" width={100} height={100} />
                              )}
                            </div>
                          </div>
                          <AlertDialogFooter className="sm:justify-start">
                            <DrawerTrigger>
                              <AlertDialogCancel asChild>
                                <Button
                                  type="button"
                                  variant="secondary"
                                  onClick={handleNextclick}
                                >
                                  {answeredQuestions === totalQuestions ? "Done" : "Next"}
                                  {answeredQuestions !== totalQuestions && (
                                    <ArrowBigRightDashIcon />
                                  )}
                                </Button>
                              </AlertDialogCancel>
                            </DrawerTrigger>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      </Dialog>
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
    </div>
  );
};

export default SecondPage;
