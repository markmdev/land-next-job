# JobHunt Demo Script

**Intro (0:00 – 0:25)**
Hi, I’m Mark, and this is JobHunt—your AI command center for tailoring resumes to specific job postings. Instead of rewriting bullet points for every application, JobHunt orchestrates a trio of specialized agents that think like a company’s ATS, a resume coach, and a professional writer. The result? A truthful, on-brand resume tuned for the role in minutes.

**Purpose (0:25 – 0:45)**
Hiring teams rely on keyword-driven filters, so being “qualified” isn’t enough. You have to speak the job’s language. JobHunt automates that translation. It grades your fit, highlights gaps, and generates an updated resume while keeping your original intact. All you need is your master resume and the job posting.

**Walkthrough (0:45 – 1:45)**

1. **Control Room** – I paste my master resume on the left, the job posting on the right. --Textareas auto-scroll and start prefilled from my saved drafts.--
2. **Start Run** – Tapping “Start tailoring run” kicks off our queue. Behind the scenes BullMQ runs the flow, but for this demo we’re pulling from cache with a slight delay so you can see each stage in sequence.
3. **Progress Tracker** – Watch the top rail: the ATS Evaluation lights up first. It delivers an initial score and grade—Green for “Great fit,” Amber for “Moderate fit,” Red for “No chances.” Next, the Tailoring Plan agent produces quick wins, and then the Professional Writer drafts the adjusted resume. Each step card shows a punchy status like “7 quick wins” or “Draft generated.”
4. **Writer Insights** – This panel summarizes what changed and what still needs work. If there’s more than two notes, I can expand it to review every bullet.
5. **Adjusted Resume Toggle** – On the right editor I flip to “Adjusted Resume” to preview the rewrite. It’s the same structure as my original, just rewritten with Microsoft’s phrasing, and still 100% truthful.

**Wrap (1:45 – 2:00)**
In under two minutes I have a resume ready to ship, a transparent report of what changed, and cache-backed speed for demos like this. That’s JobHunt—resume tailoring that feels like a backstage crew working just for you. Thanks for watching!
