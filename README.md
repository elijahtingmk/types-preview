# 16-type personality profile (preview)

A free Jungian-style 16-type personality profile for Dr Elijah Ting, intended — once he approves it — to live at types.drelijah.org beside [big5.drelijah.org](https://big5.drelijah.org).

This repository is a **preview**. It has not been published to types.drelijah.org.

## What it is

Visitors answer 40 statements from the public-domain International Personality Item Pool (the Extraversion, Agreeableness, Conscientiousness, and Intellect/Imagination items of the 50-item Big-Five factor markers). Their answers are scored in the browser into a four-letter type, with a short description and a clear call to take the Big Five assessment on big5.drelijah.org.

The Emotional Stability items are not used, because that trait does not map onto one of the four letters.

## Source and permission

- Goldberg, L. R. (1992). The development of markers for the Big-Five factor structure. *Psychological Assessment, 4*, 26–42.
- Item wording: https://ipip.ori.org/New_IPIP-50-item-scale.htm
- Permission (public domain, including commercial use): https://ipip.ori.org/newPermission.htm

Item wording is used as published. This site does not use the Open Extended Jungian Type Scales, whose licence is not open to commercial use.

## Scoring

Each of the four scales has ten items, scored 1–5. Reverse-keyed items are scored as 6 minus the rating. The scale total runs from 10 to 50; the midpoint is 30.

- Extraversion above 30 → E; below 30 → I
- Intellect/Imagination above 30 → N (Intuition); below 30 → S (Sensing)
- Agreeableness above 30 → F (Feeling); below 30 → T (Thinking)
- Conscientiousness above 30 → J (Judging); below 30 → P (Perceiving)
- A score of exactly 30 is marked evenly balanced; the second letter of that pair is shown

Automated fixtures live in `../tests/score.test.js` (run `node tests/score.test.js` from the parent folder).

## Enquiry form

The contact form is stubbed in this preview and does not send mail or Telegram messages.

When the site is published, it should use the same two-way alert as big5.drelijah.org: a Telegram notice to the owner, and an email through the existing Google Apps Script relay to elijah@drelijah.org, with BCC drelijah-enquiries@mail.grokbot.com. Relay URL and tokens belong only in the host environment, never in this repository.

## Name and trademarks

This site uses **Dr Elijah Ting** / **Dr Elijah Ting, ED – L&D**. It does not use trademarked instrument names.

## Local preview

From this folder:

```
python3 -m http.server 4173
```

Then open http://127.0.0.1:4173/
