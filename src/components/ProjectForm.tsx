"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { ProjectFormData } from "@/lib/services/projectService";
import ImageUploader from "./ImageUploader";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  techStack: z.array(z.string()).min(1, "At least one technology is required"),
  githubUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  liveUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  screenshots: z.array(z.string()),
});

interface ProjectFormProps {
  onSubmit: (data: ProjectFormData) => Promise<void>;
  initialData?: ProjectFormData;
}

export default function ProjectForm({ onSubmit, initialData }: ProjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [techInput, setTechInput] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      techStack: initialData?.techStack || [],
      githubUrl: initialData?.githubUrl || "",
      liveUrl: initialData?.liveUrl || "",
      screenshots: initialData?.screenshots || [],
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values as ProjectFormData);
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTech = () => {
    if (techInput.trim()) {
      const currentTech = form.getValues("techStack");
      if (!currentTech.includes(techInput.trim())) {
        form.setValue("techStack", [...currentTech, techInput.trim()]);
      }
      setTechInput("");
    }
  };

  const handleRemoveTech = (tech: string) => {
    const currentTech = form.getValues("techStack");
    form.setValue(
      "techStack",
      currentTech.filter((t: string) => t !== tech),
    );
  };

  const handleScreenshotsUploaded = (urls: string[]) => {
    const currentScreenshots = form.getValues("screenshots");
    form.setValue("screenshots", [...currentScreenshots, ...urls]);
  };

  const handleRemoveScreenshot = (url: string) => {
    const currentScreenshots = form.getValues("screenshots");
    form.setValue(
      "screenshots",
      currentScreenshots.filter((s: string) => s !== url),
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Project title" {...field} />
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Project description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="techStack"
          render={() => (
            <FormItem>
              <FormLabel>Tech Stack</FormLabel>
              <div className="flex gap-2">
                <Input
                  placeholder="Add technology"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTech();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddTech}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {form.getValues("techStack").map((tech) => (
                  <div
                    key={tech}
                    className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center gap-2"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => handleRemoveTech(tech)}
                      className="text-secondary-foreground/50 hover:text-secondary-foreground"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="githubUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GitHub URL</FormLabel>
              <FormControl>
                <Input placeholder="https://github.com/..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="liveUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Live URL</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="screenshots"
          render={() => (
            <FormItem>
              <FormLabel>Screenshots</FormLabel>
              <FormControl>
                <ImageUploader
                  onImagesUploaded={handleScreenshotsUploaded}
                  existingImages={form.getValues("screenshots")}
                  onRemoveExisting={handleRemoveScreenshot}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Saving..." : initialData ? "Update Project" : "Add Project"}
        </Button>
      </form>
    </Form>
  );
}
