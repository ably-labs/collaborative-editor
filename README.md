# Collaborative Editing Demo with Ably and FaunaDB

This is a collaborative text editor demo that uses Ably for real-time communication and Quill.js as the text editor. The backend makes use of FaunaDB to persist metadata about the editing. It demonstrates how to create a collaborative experience, with each user's cursor position and changes to the document being synced in realtime.

## Getting Started

To get the project running locally:

1. Clone this repository.
2. Navigate into the project directory and run `npm install` to install the dependencies.
3. Create a `.env` file at the root of your project and add the following variable:

```
ABLY_API_KEY=your-ably-api-key
```

Replace `your-ably-api-key` with your actual [Ably API key](https://www.ably.com/signup).

4. Run `npm run dev` to start the development server. Open `http://localhost:3000` with your browser to see the result.

## How to Use

Once the project is running, you will see a basic text editor on the main page. You can type and edit text in this editor. If you open the same page in another browser or tab, you will see that all changes are synced across all instances of the editor. This allows multiple users to edit the same document at the same time, with each user's changes being reflected in real-time for all other users.

Each user is also assigned a random username and cursor color when they load the page, and the cursor position of each user is synced across all instances of the editor. This allows users to see in real-time where other users are in the document.

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request if you have a way to improve this project.

## License

This project is open source and available under the [Apache 2.0 License](LICENSE).