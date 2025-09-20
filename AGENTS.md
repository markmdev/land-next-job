## Description

This is an app powered by a system of AI agents that work together to adjust user's resume to a specific job posting. The system consists of three agents:

1. Resume-job-match-evaluation: This agent evaluates how well the user's resume matches the job posting. It returns a score and a list of missing qualifications.
2. Resume-tailoring-advisor: This agent provides advice on how to tailor the user's resume to the job posting. It returns a list of recommendations.
3. Professional-resume-writer: This agent rewrites the user's resume based on the advice from the Resume-tailoring-advisor.

The system works as follows:

1. The user inputs their master-resume and the job posting.
2. The Resume-job-match-evaluation agent evaluates how well the user's resume matches the job posting.
3. The Resume-tailoring-advisor agent provides advice on how to tailor the user's resume to the job posting.
4. The Professional-resume-writer agent rewrites the user's resume based on the advice from the Resume-tailoring-advisor.
5. The user can review the rewritten resume and make any final adjustments.

Our AI agents never invent any new information about the candidate: including their experience, skills, qualifications or any other information. What it does is adjust, reframes the user's resume to match the job posting. Mental model for that is how ATS system works. They check for specific keywords and phrases in the resume that were used in the job posting. For example, if the job posting mentions "team collaboration", but the user's resume has "working in a team", the agent will rewrite the resume to match the specific keyword "team collaboration". In general, we need to less emphasize or completely remove anything that is not relevant to the job posting and focus on the most relevant experience, skills, qualifications or any other information that is relevant to the job posting.
Master-resume is the user's resume that contains all of the user's experience, skills, qualifications and everything about the user. In the result we will have the very tailored resume that is optimized for the job posting.

## Tech Architecture

Next.js for the frontend and Next.js API routes for the backend.
openai-agents Typescript SDK for the AI agents.
Tailwind CSS, shadcn/ui for the frontend.
Stack-auth for authentication and payment processing.

## UI

Simple UI with a left sidebar with the following sections:

1. User profile (name, avatar, credits amount)
2. Master Resume (a button that opens a page with the master resume with editable text area and a button to save the changes)
3. JOB HUNT - a button that opens a main page with two text areas:
   - Current resume version
   - Job Posting
     There is also a panel on the bottom of the page with the progress of the process and a button to start the process.

## Workflow

1. We receive a resume and a job posting as input
2. Evaluate the match between the resume and the job posting
3. Provide advice on how to tailor the resume to the job posting
4. Rewrite the resume based on the advice
5. Evaluate the match between the rewritten resume and the job posting
6. Continue until we hit the target score

## Authentication and payments

We will use Stack-auth for authentication and payment processing.
User can buy credits in the following packages:

- 100 credits for $10
- 500 credits for $50
- 1000 credits for $100
  1 credits = 1 run of the flow
