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

If a completed profile is still in this browser, the form offers an opt-in. Only a ticked box adds `share_type` (`1`), `type_code` (the four-letter type) and `type_detail` (a short note of the four leanings, under 500 characters). If this browser already has a result number for that completion, the same ticked box also adds `type_result_id`. The statement answers are not sent. No result in this browser, or an unticked box, means those fields are omitted, including `type_result_id`, and the enquiry can still be sent. Completing the profile stores the type under a result number. It does not create an enquiry. The opt-in payload is covered by `tests/share.test.js` (`node tests/share.test.js`).

## Result number

When the 40 statements are complete and a type has been computed, the results page sends one `POST` to `https://big5.drelijah.org/api/types-result`. The JSON body is `type_code` (the four-letter type already computed in the browser) and, when it is present and under 500 characters, `type_detail` (the same short leaning note as the enquiry opt-in). The body has no name, no email, and no statement answers. The response is `{ "id" }` where `id` is 24 hexadecimal characters. That result number is shown on the results page, with a line that the person can quote it if they contact Dr Elijah Ting.

The number is kept in `sessionStorage` under `types-result`, keyed by that set of answers. Refreshing the results page, or opening the results again in the same browser session, reuses the number. A different set of answers is a new completion and is saved on its own. If the request fails, the type is still shown, and the page says that a result number could not be issued.

Saving a profile does not send an enquiry. Mail and the private-message alert stay on the enquiry form.

`POST /api/types-result` is the contract for the Worker in `elijahtingmk/b5` (origin allowed: `https://types.drelijah.org` only). On 23 November 2026 that route was not on the `master` branch: `web/src/app/api` contained `enquiry` and `health` only. This site calls the contract anyway. The enquiry route on that `master` branch does not yet read `type_result_id`; the field is sent only after opt-in so the Worker can tie the enquiry to the result number when it does. Because the body is `application/json`, the browser sends a CORS preflight. The Worker needs to allow `POST` and the `Content-Type` header from `https://types.drelijah.org`.

`tests/result-save.test.js` (`node tests/result-save.test.js`) posts to a local stub. The test fetch refuses any host of `drelijah.org`, so the suite does not call the live endpoint.

## Name and trademarks

This site uses **Dr Elijah Ting** / **Dr Elijah Ting, ED – L&D**. It does not use trademarked instrument names.

## Running locally

From this folder:

```
python3 -m http.server 4173
```

Then open http://127.0.0.1:4173/
