"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Switch } from "@/components/ui/switch"
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  category: z.string().min(2, { message: "Category must be at least 2 characters." }),
  age: z.string().min(1, { message: "Age must be a positive number." }),
  timeLimit: z.string().optional(),
  numberOfQuestions: z.string(),
});

export default function StepForm() {
  const navigation = useRouter();
  const [isTimeLimitEnabled, setTimeLimitEnabled] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = { ...values }; 
    if (!isTimeLimitEnabled) {
      delete formData.timeLimit; 
    }

    navigation.push(`/questions?category=${values.category}&age=${values.age}&timeLimit=${values.timeLimit}&numberOfQuestions=${values.numberOfQuestions}`); // Send data using state
  }


  return (
    <main className="h-screen w-full flex justify-center items-center">
      <div className="h-auto w-auto p-10 border-2 rounded-lg">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">


<FormField
        
        control={form.control}
        name="numberOfQuestions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Number Of Questions</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="w-[400px]">
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input className="w-[400px]" type="number" placeholder="Enter age" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Topic</FormLabel>
              <FormControl>
                <Input placeholder="Enter topic" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
                <FormField
          control={form.control}
          name="timeLimit"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="pr-5 pb-5">Time Limit</FormLabel>
              <FormControl>

              <Switch
                  checked={isTimeLimitEnabled}
                  onCheckedChange={(checked) => {
                    setTimeLimitEnabled(checked);
                    field.onChange(checked);
                  }}
                />
              </FormControl>
              <FormDescription>Add a time limit to your quiz</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {isTimeLimitEnabled && (
          <FormField
            control={form.control}
            name="timeLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time Limit</FormLabel>
                <FormControl>
                  <Input placeholder="Time Limit In Minutes" type="number" {...field}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {/* <Link
          href={{
            pathname: "/questions",
            query: { msg: "This is pass data to route" },
          }}
        > */}
                  <Button type="submit">Submit</Button>

        {/* </Link> */}
      </form>
    </Form>
    </div>
    </main>
  );
}
