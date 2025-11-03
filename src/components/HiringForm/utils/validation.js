// Validation patterns and rules
export const validationPatterns = {
  name: /^[A-Za-zÀ-ÿ\s'-]{2,50}$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^(\+\d{1,3}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
  linkedin: /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]{5,100}\/?$/,
  url: /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
  location: /^[A-Za-z\s,'-.]{2,100}$/,
  year: /^(19|20)\d{2}$/,
  text: /^.{10,500}$/,
  skill: /^[A-Za-z0-9\s+#.-]{2,50}$/
};

export const validationMessages = {
  required: 'This field is required',
  invalidEmail: 'Please enter a valid email address (e.g., name@company.com)',
  invalidPhone: 'Please enter a valid phone number (e.g., +1 (555) 123-4567)',
  invalidLinkedIn: 'Please enter a valid LinkedIn URL (e.g., https://linkedin.com/in/username)',
  invalidUrl: 'Please enter a valid website URL',
  invalidName: 'Name must be 2-50 characters and contain only letters, spaces, hyphens, or apostrophes',
  invalidLocation: 'Please enter a valid location (2-100 characters)',
  invalidYear: 'Please enter a valid year between 1900 and current year',
  textTooShort: 'Please enter at least 10 characters',
  textTooLong: 'Please limit to 500 characters',
  invalidSkill: 'Skill must be 2-50 characters and contain only letters, numbers, spaces, and basic symbols'
};

// Field-specific validation functions
export const validateField = (name, value, formData = {}) => {
  if (!value || value.toString().trim() === '') {
    return validationMessages.required;
  }

  const trimmedValue = value.toString().trim();

  switch (name) {
    case 'firstName':
    case 'lastName':
      if (!validationPatterns.name.test(trimmedValue)) {
        return validationMessages.invalidName;
      }
      break;

    case 'email':
      if (!validationPatterns.email.test(trimmedValue)) {
        return validationMessages.invalidEmail;
      }
      break;

    case 'contactNumber':
      if (!validationPatterns.phone.test(trimmedValue.replace(/\s/g, ''))) {
        return validationMessages.invalidPhone;
      }
      break;

    case 'linkedin':
      if (!validationPatterns.linkedin.test(trimmedValue)) {
        return validationMessages.invalidLinkedIn;
      }
      break;

    case 'portfolio':
    case 'website':
      if (trimmedValue && !validationPatterns.url.test(trimmedValue)) {
        return validationMessages.invalidUrl;
      }
      break;

    case 'location':
      if (trimmedValue && !validationPatterns.location.test(trimmedValue)) {
        return validationMessages.invalidLocation;
      }
      break;

    case 'professionalSummary':
      if (trimmedValue.length < 10) {
        return validationMessages.textTooShort;
      }
      if (trimmedValue.length > 500) {
        return validationMessages.textTooLong;
      }
      break;

    case 'jobTitle':
      // Job title is required but no pattern validation
      break;

    default:
      // Handle nested fields (experiences, projects, education)
      if (name.includes('_')) {
        const [section, index, field] = name.split('_');
        return validateNestedField(section, field, trimmedValue, formData);
      }
      break;
  }

  return '';
};

// Validate nested array fields
const validateNestedField = (section, field, value, formData) => {
  if (!value || value.toString().trim() === '') {
    return validationMessages.required;
  }

  const trimmedValue = value.toString().trim();

  switch (section) {
    case 'experiences':
      return validateExperienceField(field, trimmedValue, formData);
    
    case 'projects':
      return validateProjectField(field, trimmedValue);
    
    case 'education':
      return validateEducationField(field, trimmedValue);
    
    default:
      return '';
  }
};

const validateExperienceField = (field, value) => {
  switch (field) {
    case 'jobTitle':
    case 'company':
      if (value.length < 2) {
        return 'Please enter at least 2 characters';
      }
      if (value.length > 100) {
        return 'Please limit to 100 characters';
      }
      break;
    
    case 'responsibilities':
    case 'achievements':
      if (value.length < 10) {
        return 'Please provide more details (at least 10 characters)';
      }
      if (value.length > 1000) {
        return 'Please limit to 1000 characters';
      }
      break;
    
    default:
      return '';
  }
  return '';
};

const validateProjectField = (field, value) => {
  switch (field) {
    case 'projectName':
    case 'role':
      if (value.length < 2) {
        return 'Please enter at least 2 characters';
      }
      if (value.length > 100) {
        return 'Please limit to 100 characters';
      }
      break;
    
    case 'description':
    case 'achievements':
      if (value.length < 10) {
        return 'Please provide more details (at least 10 characters)';
      }
      if (value.length > 500) {
        return 'Please limit to 500 characters';
      }
      break;
    
    case 'projectLink':
      if (value && !validationPatterns.url.test(value)) {
        return validationMessages.invalidUrl;
      }
      break;
    
    default:
      return '';
  }
  return '';
};

const validateEducationField = (field, value) => {
  switch (field) {
    case 'degree':
    case 'institution':
    case 'university':
      if (value.length < 2) {
        return 'Please enter at least 2 characters';
      }
      if (value.length > 100) {
        return 'Please limit to 100 characters';
      }
      break;
    
    case 'startYear':
    case 'endYear':
      if (!validationPatterns.year.test(value)) {
        return validationMessages.invalidYear;
      }
      const year = parseInt(value);
      const currentYear = new Date().getFullYear();
      if (year < 1900 || year > currentYear) {
        return `Please enter a year between 1900 and ${currentYear}`;
      }
      break;
    
    default:
      return '';
  }
  return '';
};

// Step validation functions
export const validateStep = (step, formData) => {
  const errors = {};

  switch (step) {
    case 0: // Personal Info
      ['firstName', 'lastName', 'jobTitle', 'email', 'contactNumber', 'linkedin'].forEach(field => {
        const error = validateField(field, formData[field], formData);
        if (error) errors[field] = error;
      });
      
      // Optional fields with validation
      ['portfolio', 'website', 'location'].forEach(field => {
        if (formData[field]) {
          const error = validateField(field, formData[field], formData);
          if (error) errors[field] = error;
        }
      });
      break;

    case 1: // Professional Summary
      if (!formData.professionalSummary || formData.professionalSummary.trim() === '') {
        errors.professionalSummary = 'Professional summary is required';
      } else if (formData.professionalSummary.length < 10) {
        errors.professionalSummary = 'Professional summary must be at least 10 characters';
      } else if (formData.professionalSummary.length > 1000) {
        errors.professionalSummary = 'Professional summary must be less than 1000 characters';
      }
      break;

    case 2: // Experience & Skills
      formData.experiences.forEach((exp, index) => {
        ['jobTitle', 'company', 'startDate', 'responsibilities'].forEach(field => {
          const error = validateField(`experiences_${index}_${field}`, exp[field], formData);
          if (error) errors[`experiences_${index}_${field}`] = error;
        });
        
        // Validate end date if not currently working
        if (!exp.currentlyWorking && !exp.endDate) {
          errors[`experiences_${index}_endDate`] = 'End date is required when not currently working';
        }
      });
      break;

    case 3: // Projects & Education
      // Validate projects
      formData.projects.forEach((project, index) => {
        ['projectName', 'description', 'role'].forEach(field => {
          const error = validateField(`projects_${index}_${field}`, project[field], formData);
          if (error) errors[`projects_${index}_${field}`] = error;
        });
        
        if (project.projectLink) {
          const error = validateField(`projects_${index}_projectLink`, project.projectLink, formData);
          if (error) errors[`projects_${index}_projectLink`] = error;
        }
      });

      // Validate education
      formData.education.forEach((edu, index) => {
        ['degree', 'institution', 'startYear'].forEach(field => {
          const error = validateField(`education_${index}_${field}`, edu[field], formData);
          if (error) errors[`education_${index}_${field}`] = error;
        });
        
        // Validate end year if not currently studying
        if (!edu.currentlyStudying && !edu.endYear) {
          errors[`education_${index}_endYear`] = 'End year is required when not currently studying';
        }
      });
      break;

    case 4: // Documents
      if (!formData.resume) {
        errors.resume = 'Resume is required';
      }
      break;

    case 5: // Review
      if (!formData.termsAccepted) {
        errors.termsAccepted = 'You must accept the terms and conditions';
      }
      if (!formData.privacyAccepted) {
        errors.privacyAccepted = 'You must accept the privacy policy';
      }
      break;

    default:
      break;
  }

  return errors;
};

// Helper function to format phone numbers
export const formatPhoneNumber = (value) => {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length <= 3) {
    return numbers;
  } else if (numbers.length <= 6) {
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
  } else if (numbers.length <= 10) {
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  } else {
    return `+${numbers.slice(0, numbers.length - 10)} (${numbers.slice(numbers.length - 10, numbers.length - 7)}) ${numbers.slice(numbers.length - 7, numbers.length - 4)}-${numbers.slice(numbers.length - 4)}`;
  }
};

// Helper function to normalize URLs
export const normalizeUrl = (url, domain = '') => {
  if (!url) return '';
  
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  if (url.startsWith('www.')) {
    return `https://${url}`;
  }
  
  if (domain === 'linkedin' && !url.includes('linkedin.com')) {
    return `https://linkedin.com/in/${url.replace(/^\/+|\/+$/g, '')}`;
  }
  
  if (!url.includes('://') && url.includes('.')) {
    return `https://${url}`;
  }
  
  return url;
};