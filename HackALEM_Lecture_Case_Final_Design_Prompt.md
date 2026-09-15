# HackALEM — Final Project Commitment and Codex-Ready Product Specification

We have completed broad discovery using the five-artifact foundation and the candidate field already in this conversation. We now have a specific supplied case: **creating lecture notes and study materials from a lecture transcript**. The complete technical specification follows this prompt.

This is the transition from discovery to one committed project design. **Choose and fully specify the project we should build for this case.** Do not return another candidate field, a research roadmap, or a menu of architectures. Do not start implementation yet. The result must be concrete enough to become the product specification for a repository built with Codex, without another round of fundamental product decisions.

Our objective remains **first place in the strongest award pool actually accessible through this case**. Design both for the highest attainable case score and for a substantive reason to prefer our work over excellent eligible submissions with equally strong rubric performance. Do not guarantee victory, assign us a hypothetical 100, invent extra points, or assume an unannounced tie-breaking or event-wide ranking procedure.

## 1. Use the foundation and the new case correctly

Read the supplied technical specification in full. Apply the existing corpus rather than summarizing it again:

- Start Point supplies the reconciled judgment; Requirements preserves the documentary conditions and unresolved boundaries.
- The institutional investigation and Strategic Research Foundation remain supporting context, not assignments to reopen.
- The previous candidate field is available intellectual material, not a commitment we must preserve. Use a prior mechanism only when it genuinely improves this case. Do not force a formerly attractive project into a lecture-study interface.

For this design, the supplied case is the concrete task and case-level scoring target. Do not silently replace its rubric with the earlier provisional general rubric, or infer how case scores enter broader awards. Its permission to choose a model does not by itself establish that event-level Codex/OpenAI requirements have been waived. Preserve the published event position while proposing a compatible implementation.

We have three unusually strong, cross-functional, AI-assisted builders. Fit the complete competitive product—including integration, testing, deployment, README, and submission—inside the five-hour planning constraint. Do not assume specialist expertise, private data, existing code, subscriptions, hardware, or permissions that the conversation has not established.

Advance understanding and practice are separate from permission to import code, prepared datasets, configured models, or other artifacts. Do not use review week as additional development time.

## 2. Commit to an accomplished difference, not a collection of features

The case requires a student to enter lecture text and receive four genuinely generated outputs: a concise summary, a separate list of key points, a quiz with correct answers, and flashcards containing questions or terms with answers or explanations. The complete live journey must continue from reviewing the material to answering questions and revising difficult topics. Processing the lecture again must work.

A competent rival can already produce all four outputs, add citations, and present an attractive interface. **That is the comparison to beat, not a broken or simplistic summarizer.**

Find the strongest coherent project within this task. Its advantage may come from the quality of the study materials, preservation of consequential lecture distinctions, the student's transition from reading to testing and targeted revision, an unusually effective interaction, or a better combination. Determine the actual mechanism and completed result; do not select an architecture because it sounds advanced.

Do not make source links, a coverage percentage, a confidence badge, or a large evaluation layer the thesis unless they materially improve what the student can accomplish. Equally, do not pursue novelty by leaving the mandatory task behind.

Speech recognition, lecture chat, and export are optional in the TS and may differentiate otherwise equal core performance without raising the maximum above 100. Assess them seriously, then decide which belong in our submitted product. Neither implement them automatically nor dismiss them automatically. Every included addition must earn its integration cost and must work end to end.

“Every feature covered” means **every committed feature is fully specified and every case requirement is accounted for**. It does not mean every conceivable feature belongs in the product. Avoid both a thin checklist implementation and an unfocused platform.

## 3. Establish the competitive reason for this exact project

Begin your answer with one committed project: descriptive name, plain-language thesis, the result present at submission, and why it is the strongest choice for this case on the available basis.

Separately compare it with:

1. The strongest relevant current alternative a student could realistically use, including a capable direct-model workflow or existing study product.
2. Two or three plausible excellent eligible rival approaches to this same case, operating under comparable conditions.

Use narrowly targeted current primary-source checks only where an existing capability, API behavior, access condition, or licence could change the design. Do not claim that a capability is missing from current products without checking. Distinguish verified product behavior from an untested comparative hypothesis. Do not claim measured superiority without a fair actual test.

Explain which tempting additions or previous directions you rejected because they weakened this specific entry. Keep this brief and decision-relevant. Do not reproduce the brainstorm.

## 4. Specify the complete final product and UX

Describe the product as it should exist at submission, not as a backlog or a vague MVP. Make the complete student journey reconstructable from input to targeted revision and a fresh processing run.

Choose the information architecture and interaction model. Specify the screens or views, their hierarchy, primary actions, transitions, and meaningful states. Cover at least:

- Transcript entry, input limits, selected-lecture loading if provided, and clear empty/too-short errors.
- Real processing states, partial success or failure where applicable, retry behavior, and prevention of duplicate or stale runs.
- The distinct presentation and purpose of summary and key points.
- Quiz format, answer selection or entry, when answers become visible, feedback, scoring, and retry behavior.
- Flashcard fronts and backs, reveal and navigation behavior, and how revision relates to topics the student found difficult.
- Source inspection and navigation if included, without making the student search manually through unrelated text.
- Fresh generation, reset behavior, persistence, and isolation between different reviewer sessions.
- Every additional feature you actually commit to shipping.

Do not call a small quiz result “mastery,” claim improved grades, or infer durable learning from prototype interactions. Any progress indicator must describe what was actually observed.

For each feature or coherent feature group, specify its trigger, inputs, processing or state change, visible outcome, significant failure behavior, and a testable acceptance condition. Distinguish mandatory functionality, chosen competitive differentiators, and explicitly excluded functionality.

Define the visual direction without waiting for UX/UI references: layout, typography hierarchy, spacing, component behavior, source presentation, responsive behavior, keyboard operation, focus, and accessible loading/error feedback. Give concrete microcopy for critical states. Do not stop at “clean, modern, intuitive.” References could later refine the visual execution, but the design must stand without them.

## 5. Design generation, grounding, and study quality together

All study content must be based on the submitted lecture. The generation path must not rely on external factual lookup or silently supplement the lecture with the model's general knowledge.

Specify how the system produces high-quality outputs rather than merely valid output shapes. Address:

- Identification of important topics and preservation of qualifications, exceptions, quantities, and relationships.
- Concision without losing the lecturer's central ideas; summary and key points should have distinct uses rather than duplicate each other.
- Meaningful question and flashcard coverage across the lecture, avoiding repetitive questions from one convenient section.
- Question difficulty that comes from lecture-supported understanding, not obscure wording or required outside knowledge.
- Unambiguous correct answers, plausible but clearly adjudicable distractors, and supported explanations. Incorrect answer options must not become fabricated teaching content.
- Appropriate card granularity and avoidance of oversized, ambiguous, or answer-revealing cards.
- Handling of ambiguity, conflicting statements, incomplete transcription, and factual errors in the lecture. Faithfulness to the source is not certification that the lecture itself is true.
- Treatment of any hypothetical application question: its hypothetical premises must be explicit, and answering it must not require unstated external facts.

Choose the processing architecture rather than presupposing retrieval, embeddings, multiple agents, or a large orchestration framework. Explain what the OpenAI model does, what ordinary code checks, and what neither can guarantee. A valid quotation or source link does not by itself prove that a generated claim follows from it. A second model agreeing is not independent ground truth.

Make source references, if included, stable and genuinely inspectable. Define the behavior when support is insufficient: revise, omit, flag, or fail as appropriate. Do not hide reduced coverage behind “verification.”

The entered lecture is untrusted content, not an instruction source. Specify a proportionate approach to embedded instructions, HTML/script content, and accidental prompt contamination. Avoid making the security layer a separate project.

Define supported input size, language scope, output sizes, model-call structure, validation, bounded retries, and material latency/cost dependencies. Distinguish proposed operating limits from measured results. Never invent tested performance or account access.

## 6. Supply a Codex-ready implementation blueprint

Choose one practical stack and deployment approach. Verify decision-critical current API details against official documentation. Use configurable model identifiers and server-side credentials; do not assume a particular model or free credit allocation is available to our account.

Provide a concrete repository/module structure, principal data contracts, generation and validation boundaries, API contracts, client state model, and persistence approach. Define the relationships among source fragments, topics, generated materials, quiz answers, and revision state where the design uses them. Include schema-level examples sufficient to prevent incompatible parallel implementations.

Specify necessary configuration, launch/build/test commands, deployment requirements, and reviewer access. The URL must expose actual processing, not a presentation or prerecorded result. Avoid unnecessary accounts, infrastructure, or external dependencies, but do not remove an important part of the accomplishment merely to simplify deployment.

Explain the critical path and division of substantive work across our three roles: product/core mechanism, systems/delivery, and experience/validation. Identify what must be agreed first so parallel Codex work converges. Include a realistic five-hour build allocation that reserves time for integration, full live testing, deployment, and submission. Do not present timing estimates as established performance or use AI coding as an explanation for every feasibility claim.

Define what gets cut first if implementation runs behind. Cuts must preserve every mandatory requirement and, as far as possible, the distinctive achievement. Do not offer a fallback that removes the very reason the project was selected while continuing to claim the same project.

This is a specification, not a request to produce the full codebase in this response. Supply implementation-level detail where it removes consequential ambiguity, without burying the product in boilerplate.

## 7. Account for every rubric point and prove the actual result

Use the case's exact rubric:

- Working end-to-end scenario: 30.
- Quality of generated materials: 30.
- Factual reliability and error handling: 15.
- Usability: 15.
- Submission quality: 10, comprising repository 4, README 4, and features/limitations description 2.

Provide a compact traceability table connecting each criterion and mandatory deliverable to the designed behavior, reviewer-visible evidence, acceptance checks, and remaining risks. Do not award ourselves predicted points. A checklist passing does not establish that qualitative material quality deserves full marks.

Specify a selected-lecture strategy. The TS allows the team to choose the lecture; use that legitimately, without choosing a trivial text merely to conceal weak generation. Recommend the kind of representative lecture that best exposes the product's value and important failure conditions. Do not invent rights or claim to have inspected a lecture that is not actually available. A generated test fixture must not masquerade as a real lecture.

Define how the team will establish the important source facts and topics for that lecture and inspect generated statements, answers, distractors, and flashcards. Keep deterministic checks, human adjudication, and model-assisted checks distinct. A source-map completeness percentage is not a factual-accuracy measurement.

Include focused tests for empty/short input, supported input boundaries, omitted qualifications, ambiguous answers, topic imbalance, model failure, reruns, and state leakage. Include a way to establish that edited input really changes processing rather than retrieving prewritten results. Label synthetic variations honestly. Tests on variants support our claims; they are not invented additional jury requirements.

Define a fair comparison with a strong baseline using the same lecture and comparable instructions. State what result would support our proposed advantage and what result would undermine it. Do not manufacture benchmark results.

Give the live demonstration sequence: enter the lecture afresh, generate all four outputs, inspect a meaningful content decision, take part of the quiz, move into relevant revision, and demonstrate repeat processing. No manually substituted results or pre-generated screenshots count as successful execution. Any replay or video must be labeled supporting evidence, not live processing.

Specify README contents, repository inspection points, credentials/configuration guidance without exposed secrets, and known limitations. Preserve an identifiable submitted version. Operational continuity is not assumed permission to change judged functionality after submission.

## 8. Finish with the commitment and its strongest objection

End with the exact committed feature set, the most consequential exclusions, the principal implementation and quality risks, and the conditions that would force a material design change.

Explain why this completed product could still deserve preference when another team also meets the rubric exceptionally well. Attach that argument to the actual result and permitted differentiators—not assumed judge tastes, feature count, a national narrative, or imaginary points above 100. Distinguish a case-level advantage from an unestablished route to a broader award.

Resolve ordinary design choices yourself. Do not ask me to approve obvious steps, request another direction-setting round, or make the response dependent on outside replies. Keep unresolved permissions and unavailable evidence explicit and local.

**Return one complete, challenged, build-ready project design in this response.** Spend the response on the product, mechanism, UX, implementation contracts, quality, and comparative merit. Do not repeat the foundation, offer multiple final options, or end with an offer to complete the specification later.

---

## Supplied case technical specification

[# TECHNICAL SPECIFICATION (TS)

**Case:** Creating lecture notes and study materials using AI

# 1. General Information

| **Item**            | **Description**                                    |
| ------------------- | -------------------------------------------------- |
| **Project Title**   | AI Assistant for Preparing Lecture Study Materials |
| **Project Type**    | AI-powered web prototype                           |
| **Primary User**    | A student preparing for a class or exam            |
| **Expected Output** | Lecture summary, key points, quiz, and flashcards  |

# 2. Problem Description

After a lecture, students often have to rewatch the recording or work through a long transcript on their own. Preparing structured notes, quiz questions, and flashcards manually takes a significant amount of time. During this process, it is easy to overlook an important topic or record information inaccurately.

The solution should help students quickly identify the most important information and provide several ways to test their understanding of the material.

All generated results must be based specifically on the content of the provided lecture rather than on the model’s general knowledge.

# 3. Users and User Scenario

The student pastes the lecture transcript into the interface and starts the processing.

The system generates and displays:

* a concise lecture summary;
* a list of key points;
* a quiz with correct answers;
* flashcards for revision.

After reviewing the summary, the student takes the quiz and then returns to the flashcards to review topics that caused difficulty.

During the demonstration, the team must perform this entire scenario again using the selected lecture. Pre-generated screenshots or static interface mockups without actual text processing do not demonstrate successful completion of the task.

# 4. Case Description

## Problem

Students need a convenient way to transform a lecture into useful study materials while preserving the lecturer’s main ideas and avoiding fabricated information.

## Task

Develop a service that accepts a lecture transcript and generates four types of study materials:

1. a lecture summary;
2. key points;
3. a quiz;
4. flashcards.

All generated results must be displayed in a clear and user-friendly interface.

## Input and Output

**Input:** The text transcript of one lecture selected by the team.

**Output:** Structured study materials based on that lecture.

Quiz questions must include the correct answers.

Each flashcard must contain a question or term together with the corresponding answer or explanation.

# 5. Participant Task

The team must develop a functional web prototype.

The team may independently choose:

* the AI model;
* the system architecture;
* the API integration method.

The key requirement is that the results must be generated after processing the text entered by the user and must be accessible through the interface.

Speech recognition for audio or video, a lecture-based chat, and exporting study materials may be implemented as additional features. These features are not part of the mandatory scope.

# 6. Minimum Functional Requirements

The solution must:

* accept lecture text through the user interface;
* generate a lecture summary and a separate list of key points;
* generate quiz questions with correct answers;
* generate flashcards for revision;
* display all generated materials in the interface;
* allow the user to process the lecture again.

To verify each requirement, the team must re-enter the selected lecture during the demonstration and show the corresponding generated result.

The jury will evaluate how accurately the generated materials reflect the content of the original lecture.

## Mandatory Deliverables

The submission must include:

* a working prototype;
* a source-code repository;
* a README containing:

  * setup and launch instructions;
  * required access parameters and credentials/configuration requirements;
  * a list of implemented features;
  * known limitations.

# 7. Constraints

## 7.1 Factual Accuracy

The system must not present information that is absent from the lecture as if it were part of the lecture.

If a chat feature is implemented, it must explicitly indicate when the lecture text does not contain enough information to answer a question.

## 7.2 Error Handling

If the user submits an empty or excessively short text, the system must display a clear and understandable error message.

The demonstration must not rely on manually replacing or preloading generated results.

## 7.3 Additional Features

Processing arbitrary video content and providing reliable answers to questions about any lecture require separate validation.

The presence of these additional features does not replace the mandatory scenario based on the selected lecture transcript.

# 8. Recommended Enhancements

Solutions are especially valuable when they allow students to move quickly from reviewing the lecture summary to testing their knowledge.

Quiz questions and flashcards should cover different key topics from the lecture rather than focusing on only one part of the material.

Additional value can be provided by showing which specific fragment of the lecture supports a generated answer, statement, or key point.

Speech recognition, lecture-based chat, and export functionality may serve as differentiating features when the core scores are equal. These features are considered only after the mandatory functionality has been evaluated and cannot increase the maximum score beyond 100 points.

# 9. What to Include in the Presentation

The presentation should explain:

* what student problem the prototype solves;
* what the user journey looks like, from entering lecture text to receiving study materials;
* which AI model or API is used and how the results are generated;
* how the team verified the accuracy of the generated materials using the selected lecture;
* which features are fully functional and which still require further development.

# 10. Evaluation Criteria

The maximum score is **100 points**.

The jury will test the prototype using the lecture selected by the team.

Points for individual features will only be awarded for functionality that works and can be demonstrated live.

| **Criterion**                      | **What Is Evaluated**                                                                        | **Points** |
| ---------------------------------- | -------------------------------------------------------------------------------------------- | ---------: |
| **Working End-to-End Scenario**    | Entering lecture text and successfully generating all required study materials               |         30 |
| **Quality of Generated Materials** | Accuracy and quality of the summary, quiz, and flashcards                                    |         30 |
| **Factual Reliability**            | Absence of fabricated facts and proper error handling                                        |         15 |
| **Usability**                      | Clear interface and understandable processing/loading states                                 |         15 |
| **Submission Quality**             | Repository — 4 points; README — 4 points; description of features and limitations — 2 points |         10 |
| **Total**                          |                                                                                              |    **100** |

# 11. Submission and Feasibility

The team must submit:

* a working prototype;
* a source-code repository;
* a README with instructions for launching the project;
* a list of implemented features and known limitations.]
