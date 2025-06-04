"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ProjectForm from "@/components/ProjectForm";
import { AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { projectService, type Project, type ProjectFormData } from "@/lib/services/projectService";

export default function AdminPage() {
  const { user, loading: authLoading, error: authError, signInWithGoogle, signOutUser } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch projects when authenticated
  useEffect(() => {
    const fetchProjects = async () => {
      if (user) {
        try {
          const fetchedProjects = await projectService.getProjects();
          setProjects(fetchedProjects);
        } catch (error) {
          setError("Failed to fetch projects. Please try again.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchProjects();
  }, [user]);

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const project = projects.find(p => p.id === projectId);
      if (!project) return;
      
      await projectService.deleteProject(projectId, project.screenshots);
      setProjects(projects.filter((project) => project.id !== projectId));
    } catch (error) {
      setError("Failed to delete project. Please try again.");
    }
  };

  const handleProjectSubmit = async (projectData: ProjectFormData) => {
    try {
      if (selectedProject) {
        // Update existing project
        await projectService.updateProject(selectedProject.id, projectData);
        const updatedProjects = projects.map((project) =>
          project.id === selectedProject.id
            ? { ...project, ...projectData }
            : project
        );
        setProjects(updatedProjects);
        setSelectedProject(null);
      } else {
        // Add new project
        const newProject = await projectService.addProject(projectData);
        setProjects([newProject, ...projects]);
      }
    } catch (error) {
      setError("Failed to save project. Please try again.");
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="text-center">Admin Access</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <p className="text-center text-muted-foreground">
                Please sign in with your Google account to access the admin panel.
                Only authorized administrators can access this area.
              </p>
              <Button 
                className="w-full flex items-center justify-center gap-2 bg-white text-gray-600 hover:bg-gray-50 border"
                onClick={signInWithGoogle}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign in with Google
              </Button>
              {(error || authError) && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error || authError}</AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 bg-background">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Portfolio Admin</h1>
        <Button variant="outline" onClick={signOutUser}>
          Sign Out
        </Button>
      </div>

      <Tabs defaultValue="add" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="add">
            {selectedProject ? "Edit Project" : "Add Project"}
          </TabsTrigger>
          <TabsTrigger value="manage">Manage Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedProject ? "Edit Project" : "Add New Project"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProjectForm
                onSubmit={handleProjectSubmit}
                initialData={selectedProject ? {
                  title: selectedProject.title,
                  description: selectedProject.description,
                  techStack: selectedProject.techStack,
                  githubUrl: selectedProject.githubUrl,
                  liveUrl: selectedProject.liveUrl,
                  screenshots: selectedProject.screenshots
                } : undefined}
              />
              {selectedProject && (
                <div className="mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedProject(null)}
                  >
                    Cancel Edit
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manage Projects</CardTitle>
            </CardHeader>
            <CardContent>
              {projects.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No projects found. Add your first project!
                </p>
              ) : (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <Card key={project.id} className="overflow-hidden">
                      <div className="p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold">
                              {project.title}
                            </h3>
                            <p className="text-muted-foreground mt-1">
                              {project.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {project.techStack.map((tech, index) => (
                                <span
                                  key={index}
                                  className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditProject(project)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteProject(project.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                        {project.screenshots && project.screenshots.length > 0 && (
                          <div className="mt-4 overflow-auto flex gap-4 pb-2">
                            {project.screenshots.map((screenshot, index) => (
                              <img
                                key={index}
                                src={screenshot}
                                alt={`${project.title} screenshot ${index + 1}`}
                                className="h-24 w-auto rounded-md object-cover border"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {error && (
        <Alert variant="destructive" className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
