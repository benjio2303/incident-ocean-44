
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/5806e7c9-02ed-4561-84a8-facb88df13c4

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/5806e7c9-02ed-4561-84a8-facb88df13c4) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## CI/CD Pipeline with Jenkins

This project includes a complete CI/CD setup with Jenkins, Docker, and GitHub integration.

### How to use the CI/CD pipeline:

1. **Initial Setup**:
   - Start the Jenkins container: `docker-compose up -d jenkins`
   - Access Jenkins at: http://localhost:8090
   - Login with username: `admin`, password: `admin`

2. **Configure Credentials**:
   - Navigate to Jenkins > Manage Jenkins > Manage Credentials
   - Update the Docker Hub credentials with your actual username and password
   - Add GitHub credentials if your repository is private

3. **Pipeline Operation**:
   - The pipeline will automatically check for changes in your GitHub repository
   - When changes are detected, it will:
     - Build the application
     - Create a Docker image
     - Push the image to Docker Hub
     - Deploy the updated application

4. **Manual Trigger**:
   - You can also manually trigger builds from the Jenkins dashboard

### What happens during the pipeline:

- Code is pulled from GitHub
- Dependencies are installed
- Application is built
- Docker image is created and tagged
- Image is pushed to Docker Hub
- Application is deployed using the latest image

## How can I deploy this project?

You have two options:

1. **Automatic Deployment**:
   - Push changes to the configured GitHub repository
   - Let the Jenkins pipeline handle the deployment

2. **Manual Deployment**:
   - Use the Docker deployment script: `./scripts/deploy-docker.sh`
   - Use Lovable: Click on Share -> Publish

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
