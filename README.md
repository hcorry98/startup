# CS 260

**Domain:**
https://delligator.link

**Web Server IP:**
18.217.204.184

**Command to SSH:**
`ssh -i [key pair file] ubuntu@delligator.link`

**Deployment Command:**
```
./deployWebsite.sh -k ~/Documents/College/2023\ -\ a\)\ Winter/CS\ 260/AWS_KeyPair_production.pem -h delligator.link
```

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

### CSS

I learned how to combine Bootstrap with CSS to achieve the look and feel we want while maintaining the web standards. I also learned how to use CSS to override the typical Bootstrap appearance using `!important`. I also experienced how using HTML and CSS together can simplify a lot of the code instead of just trying to use HTML by itself (especially without Bootstrap). The `play` page is a perfect example of this.

**Markdown Cheat Sheet:**
https://www.markdownguide.org/cheat-sheet/

## Delligator

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
