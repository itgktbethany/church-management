"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Pencil } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { updateAlert } from "@/actions/alert";

import {
  alertSchema,
  AlertFormValues,
} from "@/lib/validations/alert-schema";

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

import { toast } from "sonner";

type Props = {
  alert: {
    id: string;
    title: string;
    message: string;
    sendPush: boolean;
    targetType: string;
    displayAt: Date | null;
  };
};

export function EditAlertDialog({
  alert,
}: Props) {
  const [open, setOpen] =
    useState(false);

  const router =
    useRouter();

  const form =
    useForm<AlertFormValues>({
      resolver:
        zodResolver(
          alertSchema
        ),

      defaultValues: {
        title:
          alert.title,

        message:
          alert.message,

        targetType:
          alert.targetType,

        sendPush:
          alert.sendPush,

        displayAt:
          alert.displayAt
            ? new Date(
                alert.displayAt
              )
                .toISOString()
                .slice(0, 16)
            : "",
      },
    });

  async function onSubmit(
    data: AlertFormValues
  ) {
    const result =
      await updateAlert({
        id: alert.id,
        title: data.title,
        message:
          data.message,
        sendPush:
          data.sendPush,
        targetType:
          data.targetType,
        displayAt:
          data.displayAt
            ? new Date(
                data.displayAt
              )
            : null,
      });

    if (!result.success) {
      toast.error(
        result.message
      );
      return;
    }

    toast.success(
      "Alert updated"
    );

    router.refresh();
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Edit Alert
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              onSubmit
            )}
            className="space-y-4"
          >
            <FormField
              control={
                form.control
              }
              name="title"
              render={({
                field,
              }) => (
                <FormItem>
                  <FormLabel>
                    Title
                  </FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={
                form.control
              }
              name="message"
              render={({
                field,
              }) => (
                <FormItem>
                  <FormLabel>
                    Message
                  </FormLabel>

                  <FormControl>
                    <Textarea
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={
                form.control
              }
              name="targetType"
              render={({
                field,
              }) => (
                <FormItem>
                  <FormLabel>
                    Target Type
                  </FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={
                form.control
              }
              name="displayAt"
              render={({
                field,
              }) => (
                <FormItem>
                  <FormLabel>
                    Display At
                  </FormLabel>

                  <FormControl>
                    <Input
                      type="datetime-local"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
            >
              Save Changes
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}