"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  groupSchema,
  GroupFormValues,
} from "@/lib/validations/group-schema";

import { createGroup } from "@/actions/group";

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

export function CreateGroupDialog() {
  const [open, setOpen] = useState(false);

  const form =
    useForm<GroupFormValues>({
      resolver:
        zodResolver(groupSchema),

      defaultValues: {
        name: "",
        description: "",
      },
    });

  async function onSubmit(
    data: GroupFormValues
  ) {
    const result =
      await createGroup(data);

    if (!result.success) {
      toast.error(
        result.message
      );

      return;
    }

    toast.success(
      "Group created successfully"
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
          Create Group
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Create Group
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
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Group Name
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Young Adult Fellowship"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Description
                  </FormLabel>

                  <FormControl>
                    <Textarea
                      placeholder="Describe this group..."
                      className="min-h-[120px]"
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
              Create Group
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}