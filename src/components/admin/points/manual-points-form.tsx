"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { addManualPoints, deductManualPoints } from "@/actions/points";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTransition } from "react";

export function ManualPointsForm({ events, users }: { events: any[]; users: any[] }) {
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    defaultValues: {
      userId: "",
      eventId: "",
      amount: 0,
    },
  });

  const selectedEventId = form.watch("eventId");
  const selectedEvent = events.find((e) => e.id === selectedEventId);

  // Automatically update the amount when an event is selected
  useState(() => {
    if (selectedEvent) {
      form.setValue("amount", selectedEvent.defaultPoints);
    }
  });

  async function onSubmit(data: any) {
    if (!selectedEvent) return;

    startTransition(async () => {
      try {
        if (selectedEvent.type === "add") {
          await addManualPoints(data.userId, data.eventId, Number(data.amount));
        } else {
          await deductManualPoints(data.userId, data.eventId, Number(data.amount));
        }
        toast.success(`Successfully ${selectedEvent.type === "add" ? "added" : "deducted"} points`);
        form.reset();
      } catch (error) {
        toast.error("Failed to process points");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Process Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} ({user.email}) - {user.points} pts
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="eventId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      const event = events.find((e) => e.id === value);
                      if (event) {
                        form.setValue("amount", event.defaultPoints);
                      }
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {events.filter((e) => e.isActive).map((event) => (
                        <SelectItem key={event.id} value={event.id}>
                          {event.name} ({event.type === "add" ? "+" : "-"}{event.defaultPoints})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending || !form.formState.isValid}>
              {isPending ? "Processing..." : "Submit Transaction"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
