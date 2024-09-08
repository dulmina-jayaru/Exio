"use client";

import React, { useEffect, useState } from 'react';
import { Check } from "lucide-react";
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

interface NotificationItem {
  title: string;
}

interface CardOptionProps {
  title: string;
  description: string;
  items: NotificationItem[];
  buttonText: string;
}

const withoutAccount: NotificationItem[] = [
  { title: "Up To 10 Questions." },
  { title: "Always Free." },
];

const withAccount: NotificationItem[] = [
  { title: "Up To 20 Questions." },
  { title: "Always Free." },
];

function CardOption({ title, description, items, buttonText }: CardOptionProps) {
  return (
    <Card className={cn("w-[380px]")}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div>
          {items.map((item, index) => (
            <div
              key={index}
              className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
            >
              <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <Check className="mr-2 h-4 w-4" /> {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function Step1() {
  const [questions, setQuestions] = useState<any[]>([]);

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
    <main className="min-h-screen w-full bg-slate-200">
      <div className="w-full h-full pt-[200px]">
        <h1 className="text-4xl font-bold text-center p-10">Choose One Option To Continue</h1>
        <div className="w-full flex flex-col md:flex-row justify-center items-center gap-6">
          <CardOption
            title="Without An Account"
            description="Go Without An Account"
            items={withoutAccount}
            buttonText="Go Without Account"
          />
          <h1 className="p-4 text-xl">OR</h1>
          <CardOption
            title="With An Account"
            description="Go With An Account"
            items={withAccount}
            buttonText="Go With Account"
          />
        </div>
      </div>
    </main>
  );
}
