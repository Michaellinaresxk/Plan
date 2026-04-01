# SEO Guide — Luxe Punta Cana

Complete reference for managing SEO and social sharing (Open Graph) across all service pages.

---

## How It Works

Every service page at `/standard-package/{id}` and `/premium-package/{id}` automatically gets:

- A unique `<title>` tag for Google
- A `<meta name="description">` for search results
- `og:title`, `og:description`, `og:image` for link previews (WhatsApp, Facebook, Instagram, iMessage)
- Twitter/X card with image
- `canonical` URL to avoid duplicate content
- Schema.org structured data (Product + Breadcrumb) for rich results

All of this comes from one single file.

---

## The File You Edit

```
src/constants/services/Servicemetadata.ts
```

This file contains the `SERVICE_METADATA` record — one entry per service.

### Entry structure

```ts
'airport-transfers': {
  id: 'airport-transfers',
  title: 'Airport Transfers Punta Cana | Private & Reliable | Luxe Punta Cana',
  description:
    'Skip the hassle — our professional drivers meet you at Punta Cana Airport...',
  image: 'https://images.unsplash.com/photo-xxx?w=1200',  // full URL, 1200×630
  imageAlt: 'Private airport transfer van in Punta Cana',
  keywords: ['airport transfer punta cana', 'punta cana transportation'],
  duration: '30 – 60 min',   // optional
  price: 'From $45',          // optional
},
```

### Rules for a good entry

| Field | Rule |
|---|---|
| `title` | Under 60 characters before the pipe `\|`. End with `\| Luxe Punta Cana` |
| `description` | 140–160 characters. Describe the experience, not just the name |
| `image` | Must be a full absolute URL (`https://...`). Ideal size: 1200×630 px |
| `imageAlt` | Describe what's in the photo for screen readers and crawlers |
| `keywords` | 4–6 specific phrases people actually search for |

---

## All Services and Their URLs

### Standard Package — `/standard-package/{id}`

| Service | URL slug | In metadata |
|---|---|---|
| Airport Transfers | `airport-transfers` | ✅ |
| Point-to-Point Transfers | `point-to-point-transfers` | ✅ |
| Golf Cart Rentals | `golf-cart-rentals` | ✅ |
| Bike Rentals | `bike-rentals` | ✅ |
| Yoga Sessions | `yoga-standard` | ✅ |
| Personal Training | `personal-training` | ✅ |
| Standard Massage | `standard-massage` | ✅ |
| Private Chef | `private-chef` | ✅ |
| Babysitter | `babysitter` | ✅ |
| Catamaran Trips | `catamaran-trips` | ✅ |
| Saona Island Tour | `saona-island-tour` | ✅ |
| Horseback Riding | `horseback-riding` | ✅ |
| Horseback Sunset | `horseback-sunset` | ✅ |
| ATV Excursions | `atv-excursions` | ✅ |
| Adventure Excursions | `adventure-excursions` | ✅ |
| Deep-Sea Fishing | `deep-sea-fishing` | ✅ |
| Private Fishing Trip | `private-fishing-trip` | ✅ |
| Karaoke | `karaoke` | ✅ |
| Live Music | `live-music` | ✅ |
| Custom Decorations | `custom-decorations` | ✅ |

### Premium Package — `/premium-package/{id}`

| Service | URL slug | In metadata |
|---|---|---|
| Luxe Golf Cart | `luxe-golf-cart` | ✅ |
| Luxe Yoga | `luxe-yoga` | ✅ |
| Luxe Fitness | `luxe-fitness` | ✅ |
| Luxe E-Bikes | `luxe-e-bikes` | ✅ |
| Luxe Yacht | `luxe-yacht` | ✅ |
| Private Yacht Experience | `private-yacht-experience` | ✅ |
| Private Catamaran | `private-catamaran` | ✅ |
| Luxe Culinary | `luxe-culinary` | ✅ |
| Luxe Masseuse | `luxe-masseuse` | ✅ |
| Luxe Arrival | `luxe-arrival` | ✅ |

---

## Adding a New Service

1. Add the service ID to `src/constants/services/serviceId.ts`
2. Open `src/constants/services/Servicemetadata.ts`
3. Add a new entry following the structure above
4. Done — the page automatically picks it up

Example:
```ts
'new-service-id': {
  id: 'new-service-id',
  title: 'New Service Punta Cana | Short Description | Luxe Punta Cana',
  description: '140–160 character description that sells the experience...',
  image: 'https://your-cloudinary-or-unsplash-url.jpg',
  imageAlt: 'Describe the image',
  keywords: ['keyword 1 punta cana', 'keyword 2 dominican republic'],
  duration: 'X hours',
  price: 'From $XX',
},
```

---

## Updating an Existing Service

Open `src/constants/services/Servicemetadata.ts`, find the service by its ID and edit the fields you want.

The page regenerates the metadata on the next build (or on-demand in production with ISR).

---

## Changing the OG Image for a Service

The `image` field must be a **full absolute URL**. Options:

### Use a Cloudinary image (best)
```ts
image: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1234567/my-image.jpg',
```

### Use a local public image
Files in `/public/img/` are accessible at `https://luxpuntacana.com/img/filename.jpg`:
```ts
image: 'https://luxpuntacana.com/img/yacht.jpg',
```

### Use Unsplash or Pexels
Both allow hotlinking and work with OG crawlers:
```ts
image: 'https://images.unsplash.com/photo-xxx?q=80&w=1200&auto=format&fit=crop',
```

### Available local images in `/public/img/`
```
/img/beach-bg.jpg
/img/beach.jpg
/img/bike.jpg
/img/cheff.jpg
/img/concierge.jpg
/img/gallery-golf-cart.jpg
/img/horse-bg.png
/img/horseback.jpeg
/img/saona.jpeg
/img/saona-island/saona-1.jpg
/img/saona-island/saona-2.jpg
/img/saona-island/saona-3.jpg
/img/saona-island/saona-4.jpg
/img/trainer.jpg
/img/yacht.jpg
```

---

## How the Pages Generate Metadata

```
src/app/standard-package/[id]/page.tsx   ← generateMetadata()
src/app/premium-package/[id]/page.tsx    ← generateMetadata()
```

Both files:
1. Call `getServiceMetadata(id)` from `Servicemetadata.ts`
2. If found → use the human-written title, description and image
3. If not found → generate a generic fallback automatically
4. Always inject Schema.org structured data (Product + Breadcrumb)

You never need to edit these files to update SEO — only edit `Servicemetadata.ts`.

---

## Verifying Your Links Look Correct

After deploying, test how your links look when shared:

| Tool | What it checks |
|---|---|
| [Facebook Debugger](https://developers.facebook.com/tools/debug/) | Facebook & WhatsApp previews |
| [Twitter Card Validator](https://cards-dev.twitter.com/validator) | Twitter/X previews |
| [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) | LinkedIn previews |
| [Google Rich Results Test](https://search.google.com/test/rich-results) | Schema.org structured data |
| [Open Graph Check](https://www.opengraph.xyz/) | Quick preview of all OG tags |

Paste any service URL like `https://luxpuntacana.com/standard-package/saona-island-tour` and verify:
- The correct image appears (not bike.jpg or a generic photo)
- The title and description are readable and relevant
- No missing tag warnings

---

## SEO Best Practices for This Site

### Title format
```
{Specific Service} {Location} | {Hook} | Luxe Punta Cana
```
Example: `Saona Island Tour Punta Cana | Full-Day Paradise | Luxe Punta Cana`

### Description format
Write for a person, not a crawler. Mention:
- What they get
- What's included or notable
- One compelling detail

Bad: `Saona Island tour service in Punta Cana Dominican Republic`
Good: `Visit Saona Island — one of the most beautiful islands in the Caribbean. White sand beaches, crystal water, open bar, fresh seafood lunch and natural starfish pools included.`

### Keywords
Use phrases people actually type, not single words:
- `saona island tour punta cana` ✅
- `tour` ❌
- `best day trip from punta cana` ✅
- `excursion` ❌

### Image size
OG images must be at least `1200 × 630 px`. Smaller images are ignored by most platforms.
