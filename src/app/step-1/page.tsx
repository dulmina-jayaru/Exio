"use client"
import React, { useEffect, useState } from 'react';
import { BellRing, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const withoutAccount = [
  {
    title: "Up To 10 Questions.",
  },
  {
    title: "Always Free.",
  },
];

const withAccount = [
  {
    title: "Up To 20 Questions.",
  },
  {
    title: "Always Free.",
  },
];

type CardProps = React.ComponentProps<typeof Card>;

export default function Step1({ className, ...props }: CardProps) {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("https://opentdb.com/api.php?amount=10&category=20&difficulty=easy");
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        const data = await response.json();
        setQuestions(data.results);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  return (
    <main className="h-screen w-full bg-slate-200">
      <div className="w-full h-full pt-[200px]">
        <h1 className="text-4xl font-bold text-center p-10">Chose One Option To Continue.</h1>
        <div className="w-full flex justify-center items-center">
          <Card className={cn("w-[380px]", className)} {...props}>
            <CardHeader>
              <CardTitle>Without An Account</CardTitle>
              <CardDescription>Go Without An Account.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div>
                {withoutAccount.map((notification, index) => (
                  <div
                    key={index}
                    className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                  >
                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {notification.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Check className="mr-2 h-4 w-4" /> Go Without Account
              </Button>
            </CardFooter>
          </Card>
          <h1 className="p-10 text-xl">OR</h1>
          <Card className={cn("w-[380px]", className)} {...props}>
            <CardHeader>
              <CardTitle>With An Account</CardTitle>
              <CardDescription>Go With An Account.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div>
                {withAccount.map((notification, index) => (
                  <div
                    key={index}
                    className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                  >
                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {notification.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Check className="mr-2 h-4 w-4" /> Go With Account
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
}
