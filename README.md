# Coding Assessment Repository

This repository is prepared for the campus-proctored coding assessment.

## Test Instructions

- Test location: campus only, under college/university proctoring.
- The assessment focuses on REST APIs, Data Structures & Algorithms, and OOP concepts.
- Searching online or using language models/tools such as ChatGPT, DeepSeek, Claude, GitHub Copilot, etc. is strictly prohibited during the test.
- Any evidence of plagiarism can lead to immediate disqualification.
- Existing online solutions may not match the exact questions in the assessment.

## Available Tracks

Choose only one option:

- Full Stack
- Frontend
- Backend

Additional requirements:

- Full Stack and Frontend candidates must have React installed on their system.
- Frontend will also include a basic API server question.
- Full Stack and Backend candidates may use any suitable framework such as Express, Gin, Net HTTP, etc.
- Total assessment duration: 3 hours.

## System Setup Checklist

Before the test starts, make sure the system already has:

- Git
- Node.js and npm
- React-ready environment
- VS Code or another suitable IDE
- Postman or Insomnia for API testing

No extra time will be given for installations during the assessment.

This repo also includes [`setup-assessment-tools.ps1`](./setup-assessment-tools.ps1), which can be used to install common tools like Git, VS Code, Postman, and Node.js LTS on Windows before the test.

## Important Rules

- Online IDEs or browser-based code editors are not allowed.
- The test link and access code will be shared by email at the exact test time.
- Code must be pushed to GitHub and the Google Form submission must be completed before final submission.

## Repository Submission Rules

- Use only one GitHub repository and one branch for the complete submission.
- The repository name must be your college roll number.
- Create separate folders for each attempted question.
- Submissions pushed to a different branch or different repository may be disregarded.
- Make commits regularly during the test instead of pushing everything at the very end.

Suggested structure:

```text
459/
  question-1/
  question-2/
  question-3/
```

Current repo layout follows this structure:

- `459/question-1`: Stage 1 backend/DSA solution
- `459/question-2`: Stage 2 React/Next frontend solution
- `459/question-3`: reserved for any third attempted question

## Git Ignore Requirements

Before pushing code, make sure unnecessary files are ignored, including:

- `node_modules`
- `.DS_Store`
- logs
- build output
- local environment files

The `.gitignore` in this repository already covers the common entries needed for React/Node-based assessment work.
