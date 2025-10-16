# Project Setup and Start Guide

This README.md file serves as a comprehensive guide to set up and launch your React project. It includes step-by-step instructions and provides an overview of the project's folder structure, complete with explanations and examples.

## Step 1: Prerequisites

Before initiating the project setup, ensure that your system meets the following prerequisites:

1. **Node.js and Yarn (Package Manager):**
   - Download and install Node.js and Yarn from the official Node.js website [here](https://nodejs.org/).

## Step 2: Clone the Repository

Clone the project repository from your version control system (e.g., GitHub) using the following commands:

```bash
git clone <repository-url>
cd <project-directory>
```

## Step 3: Install Dependencies

Navigate to the project directory and install the required dependencies using Yarn:

```bash
yarn install
```

## Step 4: Run the Project

To launch the development server and start the project, use the following command:

```bash
yarn dev
```

Your project will be running and accessible at `http://localhost:3000`.

## Folder Structure Explanation

The project's folder structure is designed for clarity and organization. Below is a breakdown of the key directories:

```
src
│   @core
│   │   context
│   │   hooks
│   │   styles
│   │   theme
│   │   utils
│   assets
│   │   images
│   configs
│   context
│   hooks
│   layouts
│   navigation
│   │   horizontal
│   │   vertical
│   network
│   │   adapter
│   │   endpoints
│   redux
│   │   store
│   │   reducer
│   │   │   auth
│   pages
│   │   auth
│   │   home
│   │   profile
│   styles
│   │   global.scss
│   utils
│   │   dateUtils.js
│   │   stringUtils.js
│   │   constants
│   │   │   appConstants.js
│   │   │   apiConstants.js
│   views
│   │   auth
│   │   home
│   │   forms
│   │   tables
│   │   pages
│   │   │   auth
│   │   │   home
│   │   │   profile
│   App.jsx
│   main.jsx
.editorconfig
.prettierrc.js
```

### Folder Descriptions:

1. **`src/@core`:**

   - `context`: React context providers and consumers for state management and data sharing.
   - `hooks`: Custom React hooks for code reuse and state management.
   - `styles`: Shared styles and global CSS.
   - `theme`: Theme-related configurations and styling.
   - `utils`: Utility functions and helper modules.

2. **`src/assets`:**

   - `images`: Image assets used in the application.

3. **`src/configs`:**

   - Configuration files for tools and libraries used in the project.

4. **`src/context`:**

   - Context providers and consumers for state management and data sharing.

5. **`src/hooks`:**

   - Custom hooks for code reuse and state management.

6. **`src/layouts`:**

   - Layout components used to structure different pages.

7. **`src/navigation`:**

   - `horizontal`: Components related to horizontal navigation.
   - `vertical`: Components related to vertical navigation.

8. **`src/network`:**

   - `adapter`: Adapter for Axios instance.
   - `endpoints`: API endpoints.

9. **`src/redux`:**

   - `store`: Redux store configuration.
   - `reducer`: Redux reducers, e.g., for authentication (`auth`).

10. **`src/pages`:**

    - Components representing different pages of the application.
      - `auth`: Components related to authentication and login pages.
      - `home`: Components related to the home page.
      - `profile`: Components related to the user profile page.

11. **`src/styles`:**

    - Global styles, including `global.scss`.

12. **`src/utils`:**

    - Utility functions and helper modules.
      - `dateUtils.js`
      - `stringUtils.js`
      - `constants`
        - `appConstants.js`
        - `apiConstants.js`

13. **`src/views`:**

    - Reusable components used throughout the application.
      - `auth`: Components related to authentication and login forms.
      - `home`: Components specific to the home page.
      - `forms`: Reusable form components.
      - `tables`: Reusable table components.
      - `pages`: Reusable components specific to the respective page.

14. **`src/App.jsx` and `src/main.jsx`:**

    - Entry points of the application.

15. **`.editorconfig`:**

    - Editor configuration file for consistent coding styles across different editors.

16. **`.prettierrc.js`:**
    - Configuration file for Prettier, a code formatter, to maintain consistent code formatting.

## Example

Suppose you want to create a new component for displaying a user profile card. Follow these steps:

1. Create a new file `UserProfileCard.js` inside the `src/views` directory.
2. Implement the user profile card component in the newly created file.
3. Use the `UserProfileCard` component in the `src/pages/profile` directory or any other required location.

By organizing the project into different directories, you can easily locate and manage related code components, making the project more maintainable and scalable.
