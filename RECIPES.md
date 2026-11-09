# Recipes: how each kind of slide was solved

A list of solutions that already exist, so the next deck doesn't reinvent them. **Before designing a slide, look
here** for the kind of content you need to show. **After finishing a deck, add every new solution** (a new layout, a
trick for a kind of information, an interaction): one row each, with the deck and slide where it was done. Improve a
row when you find a better way. Rows are short; the deck itself is the full example to copy from.

Slide links point at the deck source; open the deck and press the slide number (or add `#n` to its URL).
Decks: [showcase](demo/showcase/deck.html) · [PixelPine](demo/PixelPine-demo/deck.html) · [Nudgy](demo/Nudgy-demo/deck.html) · [Impedance](demo/Impedance-demo/deck.html) (slide ids in the Czech decks) · PMIC talk (`presentation/deck.html` in the author's project, English; not yet in the repo).

## Opening, structure, closing

| need | solution | where |
|---|---|---|
| Title slide | Dark slide, kicker (32 px, uppercase, accent) + one 128 px `h1` + one 40 px line; an ambient background from a theme; the product's best clip or render on the right half (`flex-direction:row`) | PixelPine `#cover`, showcase 1 |
| Closing slide | Same layout as the title: "thank you" in 96 px, contact line, one looping clip; same ambient as the title so the talk ends where it started | PixelPine `#end` |
| Closing slide for a vehicle | The product's render with `data-fx="depart"`: it backs in, and every 14 s drives off and comes back while the slide stays up for questions | Nudgy `#end` |
| Section divider | Dark slide like the title: kicker naming the section, one big line, one sentence; a different transition marks the change of part | showcase 14 (theme section) |
| Statement / money slide that must stand out | The one slide in the accent colour (whole background), cards in a lighter tint of it | PixelPine `#market`, showcase 10 |

## Numbers and money

| need | solution | where |
|---|---|---|
| A few headline numbers (KPIs) | 2×2 grid (`display:grid; grid-template-columns:1fr 1fr`) or a row of cards; in each card a 64 px number + a 40 px or 32 px explanation. The numbers count up by themselves | PixelPine `#power`, showcase 3 |
| Before → after | One 64 px line `480 → 141`: counts up to the first number, then down to the second | PixelPine `#routing`, showcase 3 |
| Cost at several batch sizes | Table: rows = cost items, columns = batch sizes, numbers right-aligned (they count up), a total row with its own background (`<tr style="background:…">`), one sentence on the biggest cost below | PixelPine `#cost`, showcase 5 |
| Prices per sales channel | Accent slide, one card per channel: 32 px uppercase channel label, 64 px price, 40 px margin line; a 32 px footnote for the basis (VAT, batch size) | PixelPine `#market` |
| Costs and prices on one slide | Small cost table on top, a row of price cards below (shop, own e-shop, break-even quantity) | Nudgy `#price` |
| Numbers that need a dramatic entrance | Cards with `data-fx="wagon"` and the number inside with `data-fx="puff"`: the card rolls in, then the number comes out of steam and counts (train theme) | Nudgy `#fw`, `#brief` |
| Bill of materials | Table of the 5–8 most expensive lines (part, qty, price), the rest summed in one row; the cost driver named in a sentence | PixelPine `#bom` |

## Hardware, pictures and clips

| need | solution | where |
|---|---|---|
| Product render | Transparent PNG, large, `data-fx="spin3d"`, text column beside it | PixelPine `#board`, showcase 4 |
| Schematic | Crop of the one block that matters (not the whole sheet) as PNG, `data-fx="scan"`, 2–3 short labels | PixelPine `#schematic` |
| Result of an optimisation / algorithm | The result picture with `data-fx="radial"` on one side; the before → after number and 3 numbered steps of how it was done on the other | PixelPine `#routing` |
| What the product does (animations, modes) | A row of 2–3 short clips (`<img data-video>` with a still as poster, `data-fx="tilt"`), each with a one-line caption | PixelPine `#product`, `#personality` |
| One clip as the hero | `data-fx="power"`: it switches on like a screen | PixelPine `#cover`, showcase 7 |
| Exploded view / cross-section | Render with `data-fx="spin3d"` beside 2–4 cards that name the parts | Nudgy `#brief`, `#mech` |
| Simulation result as a clip | Screen recording of the simulator as WebM (`data-video`, poster PNG), `data-fx="power"`, the 3 key result numbers beside it | Nudgy `#sim`, `#how` |

## Interaction inside a slide

| need | solution | where |
|---|---|---|
| Walk through a big schematic block by block | One slide: the whole schematic in a fixed frame, a layer with highlight rectangles, a side panel with one text per block. `se:step` turns → / ← into zoom steps (CSS transform on the layer) before the deck moves on; `se:enter` resets to the overview. Script at the end of the deck | Nudgy `#sch` |
| Show a live app or simulator during the talk | `data-click="off"` slide with an iframe created on `se:enter` and removed on `se:leave`, a "connecting" screen while the local server isn't reachable, buttons to switch pages; keys stay with the deck | Nudgy `#simlive`, `#live` |

## Process animations (explaining how something works)

Deck: [Impedance](demo/Impedance-demo/deck.html) (Czech, scope theme).

| need | solution | where |
|---|---|---|
| Explain a process step by step, video-like | One canvas per slide inside a dark "screen" panel (`data-fx="power"`), drawn every frame by a small scene function `draw(g, S)` from `S.step` and `S.ts` (time since the step began). `se:step` turns → / ← into scene steps before the deck moves on (← shows the earlier step finished); `se:enter` restarts at step 0, `se:leave` stops the loop. Step dots in the panel corner | Impedance `#iv`, `#block`, `#avg` |
| Captions that follow the steps | Beside the panel, one `p.cap` per step with `data-step="n"`: shown from step n on, earlier ones dimmed; the container has `data-fx="none"` so the engine's builds don't fight the step classes | Impedance `#z`, `#pair` |
| Let the audience change a parameter live | Buttons inside the panel, slide marked `data-click="off"` so clicks don't change slides; the scene eases toward the new value (phase of a phasor, 1 pin vs 2 pins) | Impedance `#z`, `#pair` |
| Real measured or simulated curves in an animation | A script in the project exports the data to `media/data.js` (`window.X = {...}`), linked as a plain, not deferred, `<script>` before the engine; captions fill their numbers from it (`data-v`), so slide text can't drift from the results. `build.py` keeps non-deferred scripts in place | Impedance `#pair` (ngspice waveforms), `#cal` |
| Show why the alternatives lose | A grid of cards; each step crosses some out (a red line grows across the name, the reason appears in red), the winner gets an accent border and grows | Impedance `#methods` |
| A shift register / digital logic at work | Boxes for the cells, the bits shift on a timer, the feedback bit travels along the XOR wire as a glowing dot, the output is appended to a scrolling waveform | Impedance `#mls` |
| Averaging noise away | The same curve redrawn with fresh noise every frame (one period, red) and the running average (green) while a counter N climbs; noise exaggerated and labelled as such | Impedance `#avg` |

## Text, code and lists

| need | solution | where |
|---|---|---|
| 3 short points | `ul` (items come in one by one); never more than 4 | showcase 2, 12 |
| How something works, step by step | `ol` with 3 items at 32 px beside a picture | PixelPine `#routing` |
| Code or markup | `<pre>` on a dark box, the important part in `<b>` coloured with the accent; beside 3 bullet points | showcase 2, 9 |
| Keyboard keys / controls | Table with `<kbd>` keys in the left column | showcase 10 |
| A set of names or options | Grid of small cards (`display:grid; grid-template-columns:repeat(4,1fr)`) | showcase 8 |
| Showing several effects at once | Row of coloured tiles, each tile with its own `data-fx` and its name in it | showcase 6 |

## Diagrams without photos (PMIC talk, all inline SVG)

| need | solution | where |
|---|---|---|
| One source feeding many outputs | Battery box, one accent-filled chip box, lines fanning out to 5 labelled outputs; `data-fx="scan"` on the `<svg>` and the text column beside it | PMIC `slide 2` |
| Circuit schematic with no source image | Hand-drawn SVG (switch, inductor as arcs, diode, capacitor, ground rail), 32 px labels, `data-fx="scan"`; two KPI cards beside it | PMIC `slide 5` |
| A formula with its consequence | Formula as the 64 px heading, a plain SVG curve (axes, dashed guides, two dots for low/high) and an `ol` of 3 steps at 32 px | PMIC `slide 6` |
| A chain of stages (power path) | Three stacked rounded boxes with arrows in SVG on an accent-coloured slide; one KPI card with `data-fx="ripple"` for the headline number | PMIC `slide 8` |
| Numbers with a source | Cards `data-fx="ripple"` (settles with ringing, counts up) and a 32 px "Source: …" label under them | PMIC `slide 4` |
| Grid of equal-weight cards (6 items) | `.grid3` with `flex:1; grid-auto-rows:1fr` so the cards fill the slide height instead of floating at the top | PMIC `slides 3, 7` |
| Power tree of a real board | Left: 3 SVG boxes in a row (input → protection → PMIC in accent colour) with a 32 px source label; right: a two-column table (rail name, voltage in accent colour, counts up); say in the label that it is community reverse engineering, not an official schematic | PMIC `slide 9` |
| Block diagram with inputs left and outputs right | One tall accent box (title rotated 90°) with three white boxes on each side joined by short lines; keep labels ≤ 2 short lines at 32 px so they fit | PMIC `slide 8` |
| Photo + close-up of a board | Two photos side by side in white rounded frames (810 × 544 px); on the overview one photo gets an accent-colour ellipse (inline `<svg>` over the `<img>`, same viewBox as the picture) around the part, the other is `data-fx="scan"`; one 32 px caption under each | PMIC `slide 9` |
