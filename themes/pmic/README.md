# pmic theme

The look of a power-management talk (made for a talk about PMICs): supply rails, switching converters and PCB
traces, glowing in the deck's accent colour (amber `#ffb000` in the demo).

Demo: the deck it was made for (a talk about PMICs); not yet in the repository.

```html
<script src="themes/pmic/theme.js" defer></script>   <!-- before engine.js -->
```

| name | kind | what it does |
|---|---|---|
| `pwm-wipe` | transition | a train of PWM pulses: 32 stripes whose "on" bar grows from 0 to 100 % (duty cycle) from left to right, with a bright rising edge, cover the screen and then shrink away to reveal the next slide |
| `rail-sweep` | transition | twelve rails power up one after another like a PMIC sequencer, each with a glowing front, cover the screen and switch off in the same order |
| `ripple` | effect | the element settles like a converter output after a load step: damped ringing up and down, with three rings of ripples; numbers inside count up (`data-fx="ripple"`) |
| `rails` | ambient | faint PCB traces with 45° jogs and pads, with short pulse trains running along them (`data-ambient="rails"`), good on dark title slides |
| `rails-dots` | dots | `data-dots="rails-dots"`: the progress dots become a staircase of rising bars, the current one glowing |

Options on `<body>`: `data-pmic-bg` = the colour the wipes fill the screen with (default `#0b1f17`). Glows follow
`data-accent` (on `<body>` or on a slide).
