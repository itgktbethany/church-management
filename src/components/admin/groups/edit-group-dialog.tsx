"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Pencil } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { updateGroup } from "@/actions/group";

import { groupSchema, GroupFormValues } from "@/lib/validations/group-schema";

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

import { groups } from "@/lib/db/group-schema";

type Props = {
  group: typeof groups.$inferSelect
}

export function EditGroupDialog({
  group,
}: Props) {
  const [open, setOpen] =
    useState(false);

  const router =
    useRouter();

  const form =
    useForm<GroupFormValues>({
      resolver:
        zodResolver(
          groupSchema
        ),

      defaultValues: {
        name: group.name,
        description: group.description ?? "",
      },
    });

  async function onSubmit(
    data: GroupFormValues
  ) {
    const result =
      await updateGroup({
        id: group.id,
        name: data.name,
        description: data.description,
        isActive: group.isActive
      });

    if (!result.success) {
      toast.error(
        result.message
      );
      return;
    }

    toast.success(
      "Group updated"
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
            Edit Group
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
              name="name"
              render={({
                field,
              }) => (
                <FormItem>
                  <FormLabel>
                    Group Name
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
              name="description"
              render={({
                field,
              }) => (
                <FormItem>
                  <FormLabel>
                    Description
                  </FormLabel>

                  <FormControl>
                    <Textarea
                      className="min-h-[150px]"
                      {...field}
                      value={field.value ?? ""}
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