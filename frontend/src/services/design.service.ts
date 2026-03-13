import type { Design } from '@/types/design.types';
import { mockDesigns } from '@/lib/mock-data';

function delay(ms: number = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let localDesigns: Design[] = [...mockDesigns];

/** Fetch all designs for the current user */
export async function getDesigns(): Promise<Design[]> {
  await delay();
  return [...localDesigns];
}

/** Fetch a single design by ID */
export async function getDesignById(id: string): Promise<Design | null> {
  await delay(300);
  return localDesigns.find((d) => d.id === id) ?? null;
}

/** Create a new design */
export async function createDesign(design: Omit<Design, 'id' | 'createdAt' | 'updatedAt'>): Promise<Design> {
  await delay(800);
  const newDesign: Design = {
    ...design,
    id: `design-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  localDesigns.push(newDesign);
  return newDesign;
}

/** Update an existing design */
export async function updateDesign(id: string, updates: Partial<Design>): Promise<Design> {
  await delay(600);
  const index = localDesigns.findIndex((d) => d.id === id);
  if (index === -1) throw new Error('Design not found');

  const existing = localDesigns[index];
  if (!existing) throw new Error('Design not found');

  const updated: Design = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  localDesigns[index] = updated;
  return updated;
}

/** Delete a design by ID */
export async function deleteDesign(id: string): Promise<void> {
  await delay(500);
  localDesigns = localDesigns.filter((d) => d.id !== id);
}

/** Duplicate a design */
export async function duplicateDesign(id: string): Promise<Design> {
  await delay(600);
  const original = localDesigns.find((d) => d.id === id);
  if (!original) throw new Error('Design not found');

  const duplicate: Design = {
    ...original,
    id: `design-${Date.now()}`,
    name: `${original.name} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  localDesigns.push(duplicate);
  return duplicate;
}
