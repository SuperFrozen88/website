# Social Studies: Lesson 4 scope and sources

## Supplied classroom scope

The [33 original screenshots](reference/tci-lesson-4-2026-10-21/README.md) now provide the actual classroom lesson content. They were moved from Desktop at the family’s explicit request, with original filenames and image bytes preserved and SHA-256 hashes recorded. The earlier [year-plan photo](reference/README.md) also remains archived.

The captures show the introduction, **1. Underwater Archaeology; 2. Ocean Crossing; 3. Directions; 4. Maps; 5. Claimed Lands; 6. Religious Beliefs; 7. Wealth; 8. New Foods; 9. Cash Crops**, the summary, reading checks, and activities. They also include **Read & Do: Changes in Europe Spur Exploration** and **Explore: The Columbian Exchange**. The app labels these extension skills separately, while including them in the supplied practice scope. Exact classroom quiz coverage is still unconfirmed.

The previous [TCI published outline](https://cdnproduction.teachtci.com/review/Social%20Studies/EL/G5_TCI_AP_OR%20Correlations.pdf) was an initial reference. The supplied edition explicitly numbers Underwater Archaeology as its first section; the screenshots now take precedence. `verified: true` means scope was checked against these supplied materials. It does not certify an exact quiz match or a test-passing probability.

## Original study content and preservation

`src/engine/exploration-bank.json` holds **184 original questions**: the original 80 definitions unchanged, plus 104 appended questions. New entries have `screenshotNumbers` that refer to the archive’s numbered manifest. Existing `ss-*:0` through `ss-*:7` IDs, definitions, answer keys, and shuffle order remain unchanged. A frozen save from commit `1c20b61` and hashes of all 80 prior question definitions verify compatibility, including five active/parked missions, XP, and history.

Ten existing skills now have 16 questions each; **Changes in Europe** and **The Columbian Exchange** each have 12 questions. The two new skills require their own independent evidence. An older profile can therefore have evidence gaps without losing its prior responses. Eighteen original intel cards summarize the nine sections and extension readings, with writing prompts. Multiple-choice questions assess recognition of reasoning; the scratchpad is available for written arguments, which the app does not automatically grade.

Each 12-question diagnostic samples all twelve skills. Once the first three standard diagnostics are complete, balanced adaptation still introduces newly unassessed areas through coverage slots. Selection prefers unseen prompts, then spaced review after a skill’s pool is exhausted. A fixed 20-question practice test represents every skill, with at most two per skill; twenty questions cannot take two for each of twelve skills. Hints and practice answers are visible as before, while test feedback stays concealed until debrief. All twelve skills can attain mastery under the configured sustained-evidence rules.

## Coverage changes from the screenshots

| Supplied material | Added or refined practice |
| --- | --- |
| Underwater Archaeology | Ship records and survivor accounts, sonar, grid locations, photographing/tagging before recovery, measurements/lab study, organic fragility, context |
| Ocean Crossing | Circular metal body, movable bar, sky objects and horizon, day/night observations, latitude rather than heading or longitude |
| Directions | Magnetic needle and free movement, cardinal orientation, fog/darkness, direction versus position |
| Maps | Scale and a small calculation, nautical coastal features, winds/currents, map revisions, round Earth versus incomplete geographic knowledge, imagined monsters |
| Claimed Lands | Funding ships/crews, cross and F/Y symbols, Ferdinand/Ysabel, resources and state power, claims versus consent |
| Religious Beliefs | Middle Eastern origin, later spread, Catholic/Protestant traditions, Bible parts, missionary motives |
| Wealth | Costly warfare, precious metals/coins, Mexico and South America, forced mining labor, shipment to Spain |
| New Foods | Corn preparations, cacao, tomatoes/pineapple, food origins and dietary change, natural products versus manufactured tools |
| Cash Crops | Leaves, cultural uses, historical medicinal belief versus safety, demand/addiction, export income and imports |
| Read & Do | Granada/1492; Isabella’s support; Luther/1517, Reformation and Catholic response; England/Spain, Elizabeth I, Armada/1588; chronology and rivalry |
| Explore | Two-way biological/cultural transfers; introduced crops/livestock; disease and immunity; coerced movement; triangular-trade model; cultural contributions; evidence and perspective in arguments |

The reading-check targets informed new original practice; official questions were not copied. Entered student responses are not answer keys. We avoid repeating historical overgeneralizations: other Christian traditions existed in Europe in 1517; Granada’s conquest does not establish complete political unification of modern Spain; the triangular trade is a simplified model rather than every voyage’s itinerary. Figures about deaths or forced transportation are not turned into arithmetic challenges or quiz trivia.

## Historical fact checks

The National Park Service references below support the historical concepts. They supplement the supplied classroom screenshots; exact quiz coverage remains unconfirmed. All question wording and distractors were authored for this app.

| Concepts | Reference |
| --- | --- |
| Demand for Asian goods, sea routes, exploration technology and era | [NPS: Prelude to Jamestown](https://www.nps.gov/jame/learn/historyculture/prelude-to-jamestown.htm) |
| Compass, astrolabe, latitude, lack of landmarks, and complementary navigation methods | [NPS: Navigating the Atlantic World](https://www.nps.gov/articles/navigatingtheatlanticworld.htm) |
| Columbus’s search for Asia, and later motives including claims, resources, religion and power | [NPS: When Worlds Collide](https://www.nps.gov/places/when-worlds-collide.htm) |
| Religion, political authority, missionary activity and resource extraction | [NPS: Significance of Spanish Colonial Missions](https://www.nps.gov/articles/significance-of-missions.htm) |
| Indigenous cultivation and the global spread of American foods | [NPS: American Latino Theme Study—Food](https://www.nps.gov/articles/latinothemefood.htm) |
| Exchange of plants and changes after transatlantic contact | [NPS: Columbian Exchange](https://www.nps.gov/casa/learn/historyculture/columbian-exchange.htm) |
| Tobacco, colonial profit and cash-crop production | [NPS: A Short History of Jamestown](https://www.nps.gov/jame/learn/historyculture/a-short-history-of-jamestown.htm) |
| Tobacco cultivation, trade and exploited/enslaved labor | [NPS: Tobacco—Colonial Cultivation Methods](https://www.nps.gov/jame/learn/historyculture/tobacco-colonial-cultivation-methods.htm) |
| Archaeologists, artifacts, context and material evidence | [NPS: About Archeology](https://www.nps.gov/subjects/archeology/about-archeology.htm), [NPS: Archaeology at Mount Rainier](https://www.nps.gov/mora/learn/historyculture/archaeology.htm) |

References were checked October 21, 2026. These sources can include older terminology or broad generalizations; the app uses its own age-appropriate wording, limits claims to the evidence, and does not present “new” as “uninhabited.”

## Boundaries and preservation

European tools explain methods; trade, religion and power explain motives; crops and metals can be products. Multiple motives could coexist. A single artifact cannot establish every traveler’s intentions. A flag represents a claim, not proof of Indigenous consent. Include Indigenous knowledge and communities, and describe land loss, coercion and labor exploitation without turning them into game rewards. Game language frames the student’s study activity, not conquest.

Keep explorer-by-explorer route matching from Lesson 5 outside this unit; the Columbus background and extension events supplied in Lesson 4 are included. Future lessons in the [year plan](reference/README.md) are planning references, not silently added assessed scope. Existing math and science questions, IDs, answers, saves and XP remain intact. The existing `exploration` unit and `ss-` skills keep their evidence and fifth saved mission; the two appended skills start unassessed. A frozen pre-change save from commit `5862871` tests import compatibility.
