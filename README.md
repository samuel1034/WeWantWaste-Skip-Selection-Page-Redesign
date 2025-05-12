# WeWantWaste Skip Selection Page Redesign

This project is a redesign of the skip selection page for WeWantWaste.co.uk, focusing on improving the look and feel, user experience (UI/UX), and responsiveness, while maintaining the core functionality of selecting a skip. The project is built using Next.js, TypeScript, and Tailwind CSS, and populates skip options using a provided API endpoint.

## Project Goal

The primary goal was to take the existing skip selection page (reached after entering a postcode, selecting an address, and choosing 'garden waste' on the WeWantWaste website) and redesign its front-end presentation. Key objectives included:

- Creating a clean, modern, and user-friendly interface.
- Ensuring the page is fully responsive and displays correctly on both mobile and desktop browsers.
- Maintaining the functionality of displaying and allowing the selection of skip options.
- Integrating data from the provided API to populate the skip list.
- Considering and visually representing restrictions based on selected waste types (specifically the heavy waste limitations shown in the provided screenshot).
- Building the project with clean and maintainable React code using Next.js and TypeScript.
- Styling the application efficiently with Tailwind CSS.

## Approach

The project was developed using the following technologies and architectural choices:

- **Next.js (App Router)**: Provides a robust framework for building React applications with features like file-system routing, API routes, and server-side rendering capabilities (though client-side fetching was used for the skip data in this specific component as it depends on user input).
- **TypeScript**: Enhances code quality and maintainability by adding static typing, helping to catch errors early in the development process.
- **Tailwind CSS**: A utility-first CSS framework used for rapid and consistent styling, facilitating the creation of a responsive design directly within the JSX.
- **React Hooks**: Utilized useState for managing component state (loading, error, skips data, selected skip) and useEffect for fetching data from the API when the component mounts.
- **Component Structure**: The page is structured into a main page component (`src/app/skip-select/page.tsx`) which fetches data and manages the overall state, and a reusable SkipItem component (`src/app/skip-select/SkipItem.tsx`) responsible for displaying individual skip details.

## Data Fetching

The skip options are populated by fetching data from the provided API endpoint: `https://app.wewantwaste.co.uk/api/skips/by-location?postcode=NR32&area=Lowestoft`. The fetched data is typed using a TypeScript interface (`src/types/index.ts`) to ensure data consistency and enable type checking.

## Handling Waste Type Restrictions

Based on the screenshot showing the "Heavy Waste Types" modal and the associated restrictions (specifically the 8-yard limit for heavy waste), the redesign incorporates logic to visually represent these constraints.

- The Skip type includes properties like `allows_heavy_waste` and `size` from the API response.
- A `isSkipSuitable` function in the main page component determines if a skip is suitable based on a placeholder `selectedWasteInfo` (which would be connected to the actual waste type selection in a complete application flow) and the skip's properties.
- The SkipItem component receives an `isSuitable` prop and applies conditional styling (e.g., greying out, adding a "Not suitable" message, using line-through text) using Tailwind CSS to clearly indicate skips that cannot be selected for the chosen waste type.
- Relevant notices from the screenshot (like the heavy waste size limit) are conditionally displayed on the page to inform the user.

## Responsiveness

Tailwind CSS's responsive utility classes (e.g., `sm:`, `md:`, `lg:`) are used extensively to ensure the grid layout, spacing, typography, and other visual elements adapt correctly to different screen sizes, providing a seamless experience on both mobile and desktop.

## Setup and Running the Project

To set up and run this project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone [Your Public GitHub Repository Link Here]
   cd [your-repository-name]
## Installation

### Install dependencies:

```bash
npm install
# or yarn install
# or pnpm install

### Run Development Server
npm run dev
# or yarn dev
# or pnpm dev
```
### Open your browser and visit http://localhost:3000/skip-select to see the redesigned skip selection page.