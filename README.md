# CS 260

**Domain:**
https://delligator.link

**Web Server IP:**
18.217.204.184

**Command to SSH:**
```
ssh -i ~/Documents/College/2023\ -\ a\)\ Winter/CS\ 260/AWS_KeyPair_production.pem ubuntu@delligator.link
```

**Deployment Command:**
```
./deployWebsite.sh -k ~/Documents/College/2023\ -\ a\)\ Winter/CS\ 260/AWS_KeyPair_production.pem -h delligator.link
```

**Markdown Cheat Sheet:**
https://www.markdownguide.org/cheat-sheet/

This is my public repository for the start up application for CS 260.

I'm excited to learn more about web programming.

I learned how to resolve merge conflicts and what the default pull options are when a conflict exists. I also learned the process of editing, committing, pushing, and pulling. 

## Simon

**Deployment Command:**
```
./deployFiles.sh -k ~/Documents/College/2023\ -\ a\)\ Winter/CS\ 260/AWS_KeyPair_production.pem -h delligator.link -s simon
```

### HTML

I learned how to setup the basic webpages and link them together. I learned how to properly specify the head tags. I also learned how to use a script to deploy my files to my webserver.

It was interesting to see how easy it is to set the width and scale of the viewport so that it works for any device. I also
liked how the project uses a defined header and footer that is the same for every page. This resembles actual webpages for
easy navigation. I liked how you can use a menu instead of an unordered list even though it does the same thing. It makes
the code more readable. Lastly, I thought it was super interesting how we could use quadratic equations in an svg to draw
the shape of the buttons for Simon.

### CSS

I learned how to combine Bootstrap with CSS to achieve the look and feel we want while maintaining the web standards. I also learned how to use CSS to override the typical Bootstrap appearance using `!important`. I also experienced how using HTML and CSS together can simplify a lot of the code instead of just trying to use HTML by itself (especially without Bootstrap). The `play` page is a perfect example of this.

### JavaScript

I learned how to store items in the local cache using the localStorage. This allows for persistent data between sessions and between web pages. I also learned how to use classes and functions to be able to fully implement the game, keep track of the score, and push the final result to the cache. It was very interesting to see when to use await/async with promises to ensure everything happens in the correct order. I also liked seeing how the allowPlayer variable was used to pause the user's ability to input while the program executed calculations and then resumed allowed input.

### Service

Using Node.js with Express made it incredibly easy to implement local services as well as external services. By altering the already existing JavaScript functions to use the fetch function and await on the responses, we could produce the same output while accessing the web application rather than the JavaScript application.

### MongoDB

It's best to set environment variables to connect to the database so that your username, password, and hostname aren't exposed to the public. You can use Atlas to view the collections of documents in the database to make sure data is persisting correctly. If you run into errors, you can ssh into the EC2 instance, check the hosted process using `pm2 ls`, restart the service if necessary (e.g. `pm2 restart simon`), and monitor the process during execution using `pm2 monit`. This will help the debugging process to identify what is going on.

### Login

When storing user data, we need to hash it using bcrypt before sending the password to the database. When a user tries to log on, we can use their provided password with the hashed password from the database and compare them. For an authentication token, we can generate one using uuid. When the user is logged in, we will store the token in a cookie, and we will delete that cookie when they log out. We will wrap the rest of our API calls using another api router that will verify the authentication token for each call.

### WebSocket

When we open a WebSocket, we can specify the protocol based on what protocol the client is currently using. Then, the server upgrades the connection to a WebSocket connection, allowing the server to send messages to the client instead of just responses. We can keep track of the connection IDs to send messages to all players except the client who sent the message. We will also ping each client every 10 seconds to avoid the WebSocket from automatically closing.

### React

I learned how to take a web application written in JavaScript and convert it into a web application using React. I then learned how to deploy the application to the server for production. I learned how to create a template React application, clean up the template code, convert to React Bootstrap, populate App.jsx, create React components, and create a router. I also learned how to test and debug a React application.

## Delligator

**Deployment Command:**
```
./deployFiles.sh -k ~/Documents/College/2023\ -\ a\)\ Winter/CS\ 260/AWS_KeyPair_production.pem -h delligator.link -s startup
```

### What I've Learned:

***HTML & CSS***

I've learned how to utilize various components and form from Bootstrap 5. I've also learned how to use CSS to alter the color and behavior of any element on the page. I've practiced using Chrome's debugging tools to understand why my code is behaving a certain way. I've also learned that some Bootstrap elements need JavaScript to function, and I've learned how to include that script.

I've learned how to utilize `div`s along with `display`s to achieve the lookout and layout I want. I've learned how to design the page to work on full-screen displays, resizable displays, and on mobile displays. I've also learned how to add `hover` and `active` design elements to my components.

***JavaScript***

I've learned how to alter the DOM with javascript to dynamically place and remove elements as the user interacts with my application. I've also learned how to build element templates, clone them, and then append them to a parent element. I've practiced navigating the DOM tree, altering styles and attributes of elements, as well as doing error checking and logic to ensure the user's experience is as intended. I've also practiced using the cache to load and set variables to provide temporary persistent data.

***Services***

I learned how to create various api endpoints to allow for various services with Node.js. I also learned how to call third party endpoints within my own application. I learned how to implement a MongoDB database to allow for persistent data. I also learned how to create a secure router to allow for authentication through user accounts and authentication tokens. Finally, I learned how to implement a websocket to allow for peer to peer communication. This allowed my application to provide live updates as well as reload necessary data when another member on the team made changes. 

### Elevator Pitch:

I’ve come up with this app that allows teams to divide tasks to more easily manage a project. It’s called “Delligator”. We can set up a project on there and then assign tasks, or parts of the project, to each member in the group. That way we know exactly what portions of the group project we’re each in charge of, and we can see in real-time where everyone is at with their responsibilities. It’ll help increase productivity and avoid confusion as to who is in charge of what. It will also help improve and ease communication about the progress of our project.

The mascot and logo for the app is an alligator named Del.

Design sketches can be found at: https://ninjamock.com/s/NV2TVKx

**Key Features:**
- Secure login through HTTPS
- Make a new project
- Add tasks to project
- Assign tasks to group members
- Real-time notification when group member completes a task
- Progress displayed for each project
- Manage multiple projects at once
- Persistently stores tasks info
