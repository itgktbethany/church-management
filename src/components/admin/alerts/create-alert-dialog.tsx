"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  alertSchema,
  AlertFormValues,
} from "@/lib/validations/alert-schema";

import { createAlert } from "@/actions/alert";

import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export function CreateAlertDialog() {
  const [open, setOpen] = useState(false);

  const form = useForm<AlertFormValues>({
    resolver: zodResolver(alertSchema),

    defaultValues: {
      title: "",
      message: "",
      sendPush: false,
      displayAt: "",
      targetType: "all"
    },
  });

  async function onSubmit(
    data: AlertFormValues
  ) {
    const result =
      await createAlert({
        ...data,
        targetType: "all",
        displayAt: new Date(
          data.displayAt
        ),
      });

    if (!result.success) {
      toast.error(
        result.message
      );

      return;
    }

    toast.success(
      "Alert created successfully"
    );

    form.reset();

    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Alert
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Create Alert
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Title
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Church Announcement"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Message
                  </FormLabel>

                  <FormControl>
                    <Textarea
                      placeholder="Write alert message..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="displayAt"
            render = {({field})=>(
              <FormItem>
                <FormLabel>
                  Display at
                </FormLabel>

                <FormControl>
                  <Input
                    type="datetime-local"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}/>

            <FormField
              control={form.control}
              name="sendPush"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <FormLabel>
                      Send Push Notification
                    </FormLabel>

                    <p className="text-sm text-muted-foreground">
                      Send notification to users'
                      devices when this alert
                      is published.
                    </p>
                  </div>

                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={
                        field.onChange
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
            >
              Create Alert
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}