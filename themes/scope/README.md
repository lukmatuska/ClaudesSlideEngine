# scope theme

An oscilloscope look, made for a talk about measuring impedance with a microcontroller (KTE Project3): a glowing beam
writes the next slide like a trace, the old slide switches off like a CRT, a graticule with two phosphor traces
(a voltage and a phase-shifted current) runs behind dark slides, and the lines of a diagram draw themselves.

Demo: [Impedance-demo](../../demo/Impedance-demo/deck.html) (Czech) and the
[showcase](../../demo/showcase/deck.html).

```html
<script src="themes/scope/theme.js" defer></script>   <!-- before engine.js -->
```

| name | kind | what it does |
|---|---|---|
| `scope-sweep` | transition | a vertical beam in the accent colour sweeps across with an afterglow band; the new slide is written behind it, the old one dims (going back sweeps the other way) |
| `crt` | transition | the old slide collapses into a bright horizontal line and a dot like a CRT switching off, then the new slide opens out of the line |
| `trace` | effect | on an `<svg>`: every stroked `path`, `line`, `polyline`, `polygon`, `circle`, `rect`, `ellipse` draws itself (stroke-dashoffset), fills and `text` fade in after |
| `scope-grid` | ambient | an oscilloscope graticule (120 px divisions, centre axes) on a dark screen, with two sine traces written by a sweeping beam and fading behind it (phosphor persistence); good on dark title and closing slides |

Options on `<body>`: `data-scope-bg` = the screen colour of the `scope-grid` ambient (default `#08110d`). Everything
glows in the accent colour (`data-accent`); the talk it was made for uses `#4FE3A0` (phosphor green).
