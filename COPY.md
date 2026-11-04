# Man Your Post: post-election email giveaway (review draft, 2026-11-04)

Review site: https://blueboxdoctor.github.io/cfl-man-your-post-review/

## Popup copy (website), v4 copy / v5 layout
- Layout (v5): left panel = the booklet cover, large, on moss green; no painting in the popup.
- Eyebrow (desktop only): FOR HUSBANDS & FATHERS
- Headline: **Liberalism may be winning. Not under your roof.**
- Line 2: **Men, fortify your household. Man your post.**
- Body: Get Philip Goodwin's 1655 booklet on Joshua 24:15: lead your family in the worship of God.
- Field: email only (first name removed)
- Button: SEND IT FREE
- Fine print: Free digital copy by email, plus occasional Church & Family Life updates. Unsubscribe anytime. Privacy
- Success: "Check your inbox." + Joshua 24:15 + "Print copies for your men's group" (product link)

v4 changes (David, 12:33pm): cut "in our government"; "It doesn't have to win in your home" became "Not under your roof."; the sign-up pitch folded into one Goodwin line; first-name field dropped. Colors moved off black/gold to the painting's parchment, moss and umber.

Alternate second lines: "Not in your home." · "Your home holds."

## Social posts

### Post 1 · today (Wed Nov 4): Facebook
Image: social/feed-1080x1350.jpg (alt: social/square-1080.jpg)

```
A lot of Christian families woke up this morning discouraged by last night's results.

Here is what no election can change: God has not handed your household to Washington. He has handed it to you.

Liberalism may be winning. Not under your roof.

More than 350 years ago, Puritan pastor Philip Goodwin warned that the enemies of church and nation "attack the home first." His answer wasn't panic. It was a man at his post: praying with his wife and children, opening the Scriptures at his own table, leading his household in the worship of God, and guarding the door.

"But as for me and my house, we will serve the Lord." (Joshua 24:15)

Men, fortify your home. Man your post.

For a limited time, we're giving away Goodwin's booklet Man Your Post free to everyone who joins the Church & Family Life email list:
https://churchandfamilylife.com/?free=man-your-post&utm_source=facebook&utm_medium=social&utm_campaign=man-your-post
```

### Post 1 · today: Instagram (feed + Story)
Image: social/feed-1080x1350.jpg (alt: social/story-1080x1920.jpg)

```
No election decides who leads your home.

Liberalism may be winning. Not under your roof.

In 1655, Philip Goodwin warned that the enemies of church and nation "attack the home first." The answer is not panic. It is a father at his post: the Word open at his table, his family on their knees, the door guarded.

"But as for me and my house, we will serve the Lord." Joshua 24:15

Men, man your post. 📖 Get Man Your Post FREE when you join our email list. Link in bio.

#ManYourPost #FamilyWorship #ChristianFatherhood #BiblicalManhood #Joshua2415 #ChurchAndFamilyLife
```

### Post 1 · today: X
Image: social/wide-1600x900.jpg

```
No election decides who leads your home.

Liberalism may be winning. Not under your roof.

Men, man your post.

Free booklet, Philip Goodwin's Man Your Post, when you join our email list:
https://churchandfamilylife.com/?free=man-your-post&utm_source=x&utm_medium=social&utm_campaign=man-your-post
```

### Post 2 · Thu/Fri: Facebook · Instagram · X
Image: social/quote-1080x1350.jpg

```
"Become a faithful keeper of your own vineyard, a watchful overseer of your household, a diligent shepherd of your flock, and a courageous defender of your fort." (Philip Goodwin, 1655)

Your post isn't in Washington. It's at your own table, tonight. Open the Word. Pray with your wife and children. Sing to the Lord together. Small, faithful, daily.

Get Man Your Post free when you join the Church & Family Life email list:
https://churchandfamilylife.com/?free=man-your-post&utm_source=social&utm_medium=social&utm_campaign=man-your-post
```

### Post 3 · weekend / Lord's Day eve: Facebook · Instagram
Image: social/square-1080.jpg

```
"Put not your trust in princes, nor in the son of man, in whom there is no help." (Psalm 146:3)

Our hope was never in a ballot. Christ is King, and He has not stepped down this week.

Reformation has always started in the home: one father, one table, one family gathered around the Word. Before Sunday, lead your household in worship tonight.

Men, man your post. Get the booklet free:
https://churchandfamilylife.com/?free=man-your-post&utm_source=social&utm_medium=social&utm_campaign=man-your-post
```

X post length: 250/280 (links count as 23).

## Notes
- Nonprofit guardrail: the copy names an ideology ("liberalism"), never a candidate or party, so it stays inside the 501(c)(3) line on campaign intervention. Keep any edits that way.
- All social links go to `?free=man-your-post`, which opens the popup immediately on any page. **Don't publish the posts until the popup is live**, or that link just lands on the homepage. Until then, point them at the product page.
- "Free copy" is set up as a **digital** copy delivered by email. The site has 50 print copies in stock, so a free print giveaway would need a shipping or quantity decision first.
- Type v3 (David, 09:26: "more modern and a bit more manly, works with the cover"): headlines are in Oswald 600 caps. The sign-off and title are in Cinzel 800, which echoes the cover's serif. Body text is Barlow. The same type is used in the popup. The v2 Caslon cards are in social/v2-caslon/.
- Artwork v2 (David, 09:06): "lighter but still strong, an image Michael Foster would use for his X articles". The background is now an AI-generated 19th-century realist oil painting (a father at his cottage gate, his family in the doorway). It's not a real artwork, so there's no artist credit. The booklet panel is unchanged. The v1 dark art is in social/v1-dark/. The headline, cover, and type are rendered on top with `render.mjs` (Libre Caslon Text + Source Sans 3), so wording edits just mean re-running `node render.mjs cards`.
