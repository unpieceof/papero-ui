\## Workflow Orchestration

\### 1. Plan Mode Default

&nbsp;⁃ ﻿﻿Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)

&nbsp;⁃ ﻿﻿If something goes sideways, STOP and re-plan immediately - don't keep pushing

&nbsp;⁃ ﻿﻿Use plan mode for verification steps, not just building

&nbsp;⁃ ﻿﻿Write detailed specs upfront to reduce ambiguity

\## 2. Subagent Strategy

&nbsp;⁃ ﻿﻿Use subagents liberally to keep main context window clean

&nbsp;⁃ ﻿﻿Offload research, exploration, and parallel analysis to subagents

&nbsp;⁃ ﻿﻿For complex problems, throw more compute at it via subagents

&nbsp;⁃ ﻿﻿One task per subagent for focused execution

\### 3. Self-Improvement Loop

&nbsp;⁃ ﻿﻿After ANY correction from the user: update "tasks/lessons.md" with the pattern

&nbsp;⁃ ﻿﻿Write rules for yourself that prevent the same mistake

&nbsp;⁃ ﻿﻿Ruthlessly iterate on these lessons until mistake rate drops

&nbsp;⁃ ﻿﻿Review lessons at session start for relevant project

\### 4. Verification Before Done

&nbsp;⁃ ﻿﻿Never mark a task complete without proving it works

&nbsp;⁃ ﻿﻿Diff behavior between main and your changes when relevant

&nbsp;⁃ ﻿﻿Ask yourself: "Would a staff engineer approve this?"

&nbsp;⁃ ﻿﻿Run tests, check logs, demonstrate correctness

\## 5. Demand Elegance (Balanced)

&nbsp;⁃ ﻿﻿For non-trivial changes: pause and ask "is there a more elegant way?"

&nbsp;⁃ ﻿﻿If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"

&nbsp;⁃ ﻿﻿Skip this for simple, obvious fixes - don't over-engineer

&nbsp;⁃ ﻿Challenge your own work before presenting it

\### 6. Autonomous Bug Fixing

&nbsp;⁃ ﻿﻿When given a bug report: just fix it. Don't ask for hand-holding

&nbsp;⁃ ﻿﻿Point at logs, errors, failing tests - then resolve them

&nbsp;⁃ ﻿﻿Zero context switching required from the user

&nbsp;⁃ ﻿﻿Go fix failing CI tests without being told how

\*\* Task Management

&nbsp;1. ﻿﻿﻿\*\*Plan First\*\*: Write plan to tasks/todo.md with checkable items

&nbsp;2. ﻿﻿﻿\*\*Verify Plan\*\*: Check in before starting implementation

&nbsp;3. ﻿﻿﻿\*\*Track Progress\*\*: Mark items complete as you go

&nbsp;4. ﻿﻿﻿\*\*Explain Changes\*\*: High-level summary at each step

&nbsp;5. ﻿﻿﻿\*\*Document Results\*\*: Add review section to tasks/todo.md"

&nbsp;6. ﻿﻿﻿\*\*Capture Lessons\*\*: Update tasks/lessons.md' after corrections

\## Core Principles

&nbsp;⁃ ﻿﻿\*\*Simplicity First\*\*: Make every change as simple as possible. Impact minimal code.

&nbsp;⁃ ﻿﻿\*\*No Laziness\*\*: Find root causes, No temporary fixes, Senior developer standards.

&nbsp;⁃ ﻿﻿\*\*Minimal Impact\*\*: Changes should only touch what's necessary. Avoid introducing bugs.

