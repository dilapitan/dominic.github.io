"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProjectCard from "@/components/ProjectCard";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import { projectService, type Project } from "@/lib/services/projectService";
import { Skeleton } from "@/components/ui/skeleton";

function ProjectCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video w-full bg-muted animate-pulse" />
      <CardContent className="p-6 space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-20 w-full" />
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-6 w-16" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const fetchedProjects = await projectService.getProjects();
        setProjects(fetchedProjects);
      } catch (err) {
        setError("Failed to load projects. Please try again later.");
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Hi, I'm <span className="text-primary">Dominic</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Full-Stack Developer specializing in modern web technologies and
              scalable applications.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="#projects">
                  View My Work <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="mailto:domlapitan@gmail.com">Get In Touch</a>
              </Button>
            </div>
            <div className="flex gap-4 mt-8">
              <Link
                href="https://github.com/dilapitan"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost" size="icon">
                  <Github className="h-5 w-5" />
                </Button>
              </Link>
              <Link
                href="https://www.linkedin.com/in/dilapitan/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost" size="icon">
                  <Linkedin className="h-5 w-5" />
                </Button>
              </Link>
              <a href="mailto:domlapitan@gmail.com">
                <Button variant="ghost" size="icon">
                  <Mail className="h-5 w-5" />
                </Button>
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-full bg-gradient-to-br from-primary/20 to-primary/5 p-1">
              <div className="h-full w-full rounded-full overflow-hidden bg-background">
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/dominic-portfolio-32102.firebasestorage.app/o/assets%2Fdominic.png?alt=media&token=af5d4173-b3d0-4331-917c-a945ef3da924"
                  alt="Dominic's profile"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto bg-muted/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">About Me</h2>
          <p className="text-lg text-muted-foreground mb-8">
            I'm a passionate developer with expertise in building modern web
            applications. With a strong foundation in both frontend and backend
            technologies, I create scalable, user-friendly solutions that solve
            real-world problems. My approach combines technical excellence with
            creative problem-solving to deliver exceptional digital experiences.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-2xl font-bold">6+</h3>
                <p className="text-muted-foreground">Years Experience</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-2xl font-bold">20+</h3>
                <p className="text-muted-foreground">Projects Involved</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-2xl font-bold">20+</h3>
                <p className="text-muted-foreground">Technologies</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section
        id="projects"
        className="py-16 md:py-24 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">My Projects</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Here are some of the projects I've worked on. Each one represents a
            unique challenge and solution.
          </p>
        </div>
        {error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading
              ? Array(3)
                  .fill(0)
                  .map((_, i) => <ProjectCardSkeleton key={i} />)
              : projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
          </div>
        )}
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto bg-muted/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Get In Touch</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Interested in working together? Feel free to reach out to discuss
            your project or just say hello.
          </p>
          <Button asChild size="lg">
            <a href="mailto:domlapitan@gmail.com">Contact Me</a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto border-t">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} Dominic. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link
              href="https://github.com/dilapitan"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="icon">
                <Github className="h-5 w-5" />
              </Button>
            </Link>
            <Link
              href="https://www.linkedin.com/in/dilapitan/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="icon">
                <Linkedin className="h-5 w-5" />
              </Button>
            </Link>
            <a href="mailto:domlapitan@gmail.com">
              <Button variant="ghost" size="icon">
                <Mail className="h-5 w-5" />
              </Button>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
