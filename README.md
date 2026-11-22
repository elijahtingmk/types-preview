# 16-type personality profile

A free Jungian-style 16-type personality profile for Dr Elijah Ting, live at [types.drelijah.org](https://types.drelijah.org) beside [big5.drelijah.org](https://big5.drelijah.org). It is served by GitHub Pages from the `main` branch; the `CNAME` file sets the custom domain.

## What it is

Visitors answer 40 statements from the public-domain International Personality Item Pool (the Extraversion, Agreeableness, Conscientiousness, and Intellect/Imagination items of the 50-item Big-Five factor markers). Their answers are scored in the browser into a four-letter type, with a short description and a clear call to take the Big Five assessment on big5.drelijah.org.

The Emotional Stability items are not used, because that trait does not map onto one of the four letters.

## Source and permission

- Goldberg, L. R. (1992). The development of markers for the Big-Five factor structure. *Psychological Assessment, 4*, 26–42.
- Item wording: https://ipip.ori.org/New_IPIP-50-item-scale.htm
- Permission (public domain, including commercial use): https://ipip.ori.org/newPermission.htm

Item wording is used as published. No items from any other type questionnaire are used.

## Scoring

Each of the four scales has ten items, scored 1–5. Reverse-keyed items are scored as 6 minus the rating. The scale total runs from 10 to 50; the midpoint is 30.

- Extraversion above 30 → E; below 30 → I
- Intellect/Imagination above 30 → N (Intuition); below 30 → S (Sensing)
- Agreeableness above 30 → F (Feeling); below 30 → T (Thinking)
- Conscientiousness above 30 → J (Judging); below 30 → P (Perceiving)
- A score of exactly 30 is marked evenly balanced; the second letter of that pair is shown

Automated fixtures live in `tests/score.test.js` (run `node tests/score.test.js` from this folder).

## Enquiry form

The contact form is a plain HTML form that posts to https://big5.drelijah.org/api/enquiry (the b5 Worker), the same endpoint as the drelijah.org contact form. The Worker saves the enquiry, sends the owner a Telegram notice and an email through the existing relay, and redirects back to `/contact?sent=1#book` (or `?error=…`). Need values: `types16`, `bigfive`, `coaching`, `unsure`. Relay URL and tokens belong only in the Worker environment, never in this repository.

## Name and trademarks

This site uses **Dr Elijah Ting** / **Dr Elijah Ting, ED – L&D**. It does not use trademarked instrument names.

## Running locally

From this folder:

```
python3 -m http.server 4173
```

Then open http://127.0.0.1:4173/
