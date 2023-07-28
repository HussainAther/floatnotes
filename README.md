# Float Notes
Float Notes is an augmented reality (AR) application that allows users to create and display virtual sticky notes in their physical environment using their device's camera. Users can write notes on these virtual sticky notes, position them in 3D space, and have them persist in their AR scene.

For realtime Firebase database access, view on the hosted site: https://www.8thwall.com/floatnotesapp/floatnotes

## Features
Create virtual sticky notes with customizable text and colors.
Position and rotate sticky notes in 3D space using gestures.
Save sticky notes in the AR scene, allowing them to persist across sessions.
View and edit existing sticky notes in the AR scene.
Display inspirational quotes as virtual sticky notes from a remote server.

## Technologies Used
A-Frame: A web framework for building AR and VR experiences using HTML and JavaScript.
Firebase Realtime Database: A cloud-hosted NoSQL database used to store and retrieve sticky note data.

## Getting Started
Clone the repository to your local machine:

```
git clone https://github.com/HussainAther/floatnotes.git
```

Open the project in a code editor of your choice.

## Set up Firebase Realtime Database:

1. Create a Firebase project on the Firebase Console (https://console.firebase.google.com/).
2. Enable the Realtime Database in the Firebase project.
3. Copy the Firebase configuration object and replace it in `firebase-config.js`.
4. Host the project on a local server or deploy it to a web server.
5. Open the project in a web browser on a device with AR capabilities.

## How to Use
Allow the browser to access your device's camera.

Use gestures (touch or mouse) to interact with the AR scene:

* Tap on the screen to create a new sticky note.
* Tap on an existing sticky note to start editing its text.
* Drag and move a sticky note to reposition it in the 3D space.
* Use pinch gestures to rotate and resize a sticky note.
* To view an inspirational quote, click on the "Get Quote" button.
* To sign up or sign in, click on the "Sign Up" or "Sign In" button respectively.

## License
This project is licensed under the MIT License.

## Credits
Float Notes is inspired by the "Floaty Plane" example from A-Frame (https://aframe.io/).


