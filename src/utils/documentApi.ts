import { UploadedFile, DocumentComparison } from '../types';

// Use relative URL in production, fallback to localhost for dev
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export async function compareDocuments(
  oldFile: UploadedFile, 
  newFile: UploadedFile
): Promise<DocumentComparison> {
  try {
    const formData = new FormData();
    formData.append('oldDocument', oldFile.file);
    formData.append('newDocument', newFile.file);

    const response = await fetch(`${API_BASE_URL}/documents/compare`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Server error' }));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data.comparison;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please ensure the backend is running.');
    }
    throw error;
  }
}

export async function checkServerHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error('Server health check failed:', error);
    return false;
  }
}