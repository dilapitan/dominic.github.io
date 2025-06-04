import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Github, ExternalLink } from "lucide-react";
import Image from "next/image";
import { type Project } from "@/lib/services/projectService";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Card className="w-full max-w-sm overflow-hidden bg-card h-full flex flex-col">
      <CardHeader className="p-4">
        <h3 className="text-xl font-bold">{project.title}</h3>
      </CardHeader>

      <div className="relative w-full aspect-video">
        <Carousel className="w-full">
          <CarouselContent>
            {project.screenshots.map((screenshot, index) => (
              <CarouselItem key={index}>
                <div className="relative aspect-video w-full overflow-hidden rounded-md">
                  <Image
                    src={screenshot}
                    alt={`${project.title} screenshot ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {project.screenshots.length > 1 && (
            <>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </>
          )}
        </Carousel>
      </div>

      <CardContent className="p-4 flex-grow">
        <p className="text-sm text-muted-foreground mb-4">{project.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.techStack.map((tech, index) => (
            <Badge key={index} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        {project.githubUrl && (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            asChild
          >
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4" />
              GitHub
            </a>
          </Button>
        )}

        {project.liveUrl && (
          <Button size="sm" className="flex items-center gap-2" asChild>
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              Live Site
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
