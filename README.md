# Shopping List Web App

A minimalist, responsive shopping list application built with vanilla TypeScript, HTML, and CSS using a strict Model-View-Controller (MVC) architecture.

## Features

### 🧩 Modular UI Layout

- **Settings Panel** with Undo, Redo, and an “Edit Categories” button that opens a responsive overlay
- **Add Section** with:
  - A text input for entering item names
  - A dropdown for selecting a category
  - An add button to insert items into the list
- **List Section**:
  - Items are grouped by category
  - Each item includes:
    - A checkbox to mark as bought
    - A non-editable label
    - A dropdown to change category
    - A delete (🗑️) button


### ⚙️ Item and Category Management

- Add new items dynamically with associated categories
- Automatically groups items by category
- Categories are editable via a visual overlay panel
- Reassign categories and automatically update affected items


### 🔁 Undo/Redo Functionality

- Undo and Redo support for:
  - Adding and removing items
  - Category reassignments
- Checkbox interactions (bought/unbought) are not included in Undo/Redo


## Technologies Used

- TypeScript
- HTML
- CSS (custom, no frameworks)

## Running the App

1. Clone the repository:
   ```bash
   git clone https://github.com/jasminexu1/shopping-list-web-app.git
   cd shopping-list-web-app
   ```
2. Run the commands below and open the local URL shown in the output:
   ```
   npm install
   npm run dev
   ```
![image](https://github.com/user-attachments/assets/739a90f4-2939-4d82-a210-f84e62a79bcb)
![image](https://github.com/user-attachments/assets/208cf08b-4e70-4f87-ad7f-7e298255230d)

