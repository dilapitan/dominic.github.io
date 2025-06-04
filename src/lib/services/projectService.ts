import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  screenshots: string[];
  createdAt?: any;
  updatedAt?: any;
}

export interface ProjectFormData {
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  screenshots: string[];
}

const COLLECTION_NAME = 'projects';

class ProjectService {
  async uploadScreenshot(file: File): Promise<string> {
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const storageRef = ref(storage, `${COLLECTION_NAME}/${filename}`);

    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }

  async deleteScreenshot(url: string) {
    try {
      const storageRef = ref(storage, url);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting screenshot:', error);
    }
  }

  async addProject(projectData: ProjectFormData): Promise<Project> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...projectData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return {
      id: docRef.id,
      ...projectData,
    };
  }

  async updateProject(id: string, projectData: ProjectFormData): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...projectData,
      updatedAt: serverTimestamp(),
    });
  }

  async deleteProject(id: string, screenshots: string[]): Promise<void> {
    // Delete all screenshots from storage
    await Promise.all(screenshots.map(url => this.deleteScreenshot(url)));
    
    // Delete project document from Firestore
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  }

  async getProjects(): Promise<Project[]> {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Project));
  }
}

export const projectService = new ProjectService(); 