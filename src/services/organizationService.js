// src/services/organizationService.js

const STORAGE_KEY = 'admin_organizations';

// Get all organizations from localStorage
export const getOrganizations = () => {
  try {
    const organizations = localStorage.getItem(STORAGE_KEY);
    return organizations ? JSON.parse(organizations) : [];
  } catch (error) {
    console.error('Error getting organizations:', error);
    return [];
  }
};

// Save organizations to localStorage
export const saveOrganizations = (organizations) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(organizations));
    return true;
  } catch (error) {
    console.error('Error saving organizations:', error);
    return false;
  }
};

// Add a new organization
export const addOrganization = (organizationData) => {
  const organizations = getOrganizations();
  const newOrganization = {
    id: Date.now(), // Simple ID generation
    ...organizationData,
    createdAt: new Date().toISOString()
  };
  organizations.push(newOrganization);
  saveOrganizations(organizations);
  return newOrganization;
};

// Update organization
export const updateOrganization = (organizationId, organizationData) => {
  const organizations = getOrganizations();
  const updatedOrganizations = organizations.map(org => 
    org.id === organizationId ? { ...org, ...organizationData } : org
  );
  saveOrganizations(updatedOrganizations);
  return updatedOrganizations.find(org => org.id === organizationId);
};

// Delete organization
export const deleteOrganization = (organizationId) => {
  const organizations = getOrganizations();
  const filteredOrganizations = organizations.filter(org => org.id !== organizationId);
  saveOrganizations(filteredOrganizations);
  return true;
};

// Initialize with sample data if empty
export const initializeOrganizations = () => {
  const organizations = getOrganizations();
  if (organizations.length === 0) {
    const initialOrganizations = [
      {
        id: 1,
        name: 'Tech Corp',
        status: 'active',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Innovate LLC',
        status: 'active',
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        name: 'Global Solutions',
        status: 'inactive',
        createdAt: new Date().toISOString()
      }
    ];
    saveOrganizations(initialOrganizations);
  }
};