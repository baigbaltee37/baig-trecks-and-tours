import React, { useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const PRODUCTION_DOMAIN = 'https://baig-treks-and-tours.vercel.app';
const DEFAULT_OG_IMAGE =
  'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=85';

// Legacy slug aliases mapped to canonical slugs
export const TOUR_SLUG_ALIASES: Record<string, string> = {
  'hunza-tour': 'hunza-tour-packages',
  'hunza-valley-discovery': 'hunza-tour-packages',
  'skardu-tour': 'skardu-tour-packages',
  'skardu-deosai-expedition': 'skardu-tour-packages',
  'naran-kaghan-tour': 'naran-kaghan-tour-packages',
  'kashmir-tour': 'kashmir-tour-packages',
  'hunza-skardu-grand-karakoram': 'hunza-skardu-tour',
  'fairy-meadows-nanga-parbat-trek': 'fairy-meadows-trek-tour',
};

export const DESTINATION_SLUG_ALIASES: Record<string, string> = {
  'khunjerab-pass': 'khunjerab',
  'deosai-plains': 'deosai',
  'shigar-valley': 'shigar',
  'khaplu-valley': 'khaplu',
  'astore-valley': 'astore',
  'naltar-valley': 'naltar',
  'ghizer-valley': 'ghizer',
  'northern-areas-of-pakistan': 'northern-areas',
};

export const GUIDE_SLUG_ALIASES: Record<string, string> = {
  'best-time-to-visit-hunza-valley': 'best-time-to-visit-hunza',
  'top-places-to-visit-in-skardu': 'how-to-plan-a-skardu-trip',
  'hunza-vs-skardu-which-to-choose': 'hunza-vs-skardu',
};

function setMetaTag(selector: string, attributeName: string, attributeValue: string, content: string) {
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attributeName, attributeValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonicalLink(href: string) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function setDynamicJsonLd(data: Record<string, unknown> | null) {
  const existing = document.getElementById('dynamic-route-jsonld');
  if (!data) {
    if (existing) existing.remove();
    return;
  }
  let script = existing as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = 'dynamic-route-jsonld';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

export const SEOHead: React.FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { tours, destinations, blogPosts, faqs, business } = useApp();

  useEffect(() => {
    const rawPath = location.pathname;
    const cleanPath = rawPath === '/' ? '/' : rawPath.replace(/\/+$/, '');

    let title = 'Baig Treks and Tours | Pakistan Tour Packages & Northern Areas';
    let description =
      'Explore Pakistan with Baig Treks and Tours. Discover tour packages for Hunza, Skardu, Naran Kaghan, Kashmir and other northern areas of Pakistan.';
    let canonicalPath = cleanPath;
    let ogType = 'website';
    let ogImage = DEFAULT_OG_IMAGE;
    let ogImageAlt =
      'Baig Treks and Tours — Tour packages for Hunza, Skardu, Naran Kaghan, Kashmir and Northern Areas of Pakistan';
    let noindex = false;
    let structuredData: Record<string, unknown> | null = null;

    // 1. Private / Auth / Admin Routes -> noindex, nofollow
    if (
      cleanPath.startsWith('/admin') ||
      cleanPath === '/baig-admin-secure-786' ||
      cleanPath.startsWith('/customer') ||
      cleanPath === '/my-bookings' ||
      cleanPath === '/profile' ||
      cleanPath === '/login' ||
      cleanPath === '/signup' ||
      cleanPath === '/forgot-password' ||
      cleanPath === '/reset-password'
    ) {
      noindex = true;
      if (cleanPath.startsWith('/admin') || cleanPath === '/baig-admin-secure-786') {
        title = 'Admin Portal | Baig Treks and Tours';
        description = 'Secure administrator portal for Baig Treks and Tours.';
      } else if (cleanPath === '/login') {
        title = 'Customer Login | Baig Treks and Tours';
        description = 'Sign in to your Baig Treks and Tours account to manage your Northern Pakistan tour bookings.';
      } else if (cleanPath === '/signup') {
        title = 'Create Account | Baig Treks and Tours';
        description = 'Register a customer account with Baig Treks and Tours to book and track your tour packages.';
      } else if (cleanPath === '/my-bookings') {
        title = 'My Bookings | Baig Treks and Tours';
        description = 'View and manage your reserved tour packages with Baig Treks and Tours.';
      } else if (cleanPath === '/profile') {
        title = 'Account Profile | Baig Treks and Tours';
        description = 'Manage your account profile and contact preferences at Baig Treks and Tours.';
      } else {
        title = 'Customer Account | Baig Treks and Tours';
        description = 'Customer account portal for Baig Treks and Tours.';
      }
    }
    // 2. Homepage (/)
    else if (cleanPath === '/') {
      title = 'Baig Treks and Tours | Pakistan Tour Packages & Northern Areas';
      description =
        'Explore Pakistan with Baig Treks and Tours. Discover tour packages for Hunza, Skardu, Naran Kaghan, Kashmir and other northern areas of Pakistan.';
      canonicalPath = '/';
      if (faqs && faqs.length > 0) {
        structuredData = {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.answer,
            },
          })),
        };
      }
    }
    // 3. Tours Listing (/tours)
    else if (cleanPath === '/tours') {
      const destQuery = (searchParams.get('destination') || '').trim();
      if (destQuery && destQuery.toLowerCase() !== 'all') {
        title = `${destQuery} Tour Packages | Pakistan Northern Areas Tours | Baig Treks and Tours`;
        description = `Explore ${destQuery} tour packages with Baig Treks and Tours. Customized family, couple, and group itineraries across Northern Pakistan.`;
      } else {
        title = 'Pakistan Tour Packages & Northern Areas Tours | Baig Treks and Tours';
        description =
          'Browse Pakistan tour packages with Baig Treks and Tours. Discover customizable family, honeymoon, private, and group trips to Hunza, Skardu, Naran Kaghan, and Kashmir.';
      }
      canonicalPath = '/tours';
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${PRODUCTION_DOMAIN}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Pakistan Tour Packages',
            item: `${PRODUCTION_DOMAIN}/tours`,
          },
        ],
      };
    }
    // 4. Individual Tour Detail (/tours/:slug)
    else if (cleanPath.startsWith('/tours/')) {
      const rawSlug = cleanPath.replace('/tours/', '');
      const canonicalSlug = TOUR_SLUG_ALIASES[rawSlug] || rawSlug;
      const tour = tours.find(
        (t) =>
          t.slug === canonicalSlug ||
          t.id === canonicalSlug ||
          t.slug === rawSlug ||
          t.id === rawSlug
      );

      if (tour) {
        canonicalPath = `/tours/${tour.slug}`;
        title =
          tour.seoTitle ||
          `${tour.title} | ${tour.destination} Tour Packages | Baig Treks and Tours`;
        description =
          tour.seoDescription ||
          `${tour.shortDescription} Plan your ${tour.destination} tour in Pakistan with Baig Treks and Tours.`;
        ogImageAlt = `${tour.title} — ${tour.destination} Tour Package by Baig Treks and Tours`;

        const graphItems: Record<string, unknown>[] = [
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: `${PRODUCTION_DOMAIN}/`,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Tours',
                item: `${PRODUCTION_DOMAIN}/tours`,
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: tour.title,
                item: `${PRODUCTION_DOMAIN}/tours/${tour.slug}`,
              },
            ],
          },
          {
            '@type': 'TouristTrip',
            name: tour.title,
            description: tour.shortDescription,
            touristType: tour.tourType,
            url: `${PRODUCTION_DOMAIN}/tours/${tour.slug}`,
            provider: {
              '@type': 'TravelAgency',
              name: 'Baig Treks and Tours',
              url: `${PRODUCTION_DOMAIN}/`,
              telephone: business.phoneInternational || '+923155449778',
            },
          },
        ];

        if (tour.faqs && tour.faqs.length > 0) {
          graphItems.push({
            '@type': 'FAQPage',
            mainEntity: tour.faqs.map((f) => ({
              '@type': 'Question',
              name: f.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: f.answer,
              },
            })),
          });
        }

        structuredData = {
          '@context': 'https://schema.org',
          '@graph': graphItems,
        };
      } else {
        title = 'Tour Package Not Found | Baig Treks and Tours';
        description =
          'Explore active Pakistan tour packages for Hunza, Skardu, Naran Kaghan, and Kashmir with Baig Treks and Tours.';
        noindex = true;
      }
    }
    // 5. Destinations Directory (/destinations)
    else if (cleanPath === '/destinations') {
      title = 'Northern Pakistan Destinations | Hunza, Skardu, Naran Kaghan & Kashmir';
      description =
        'Explore top destinations across Northern Pakistan with Baig Treks and Tours, including Hunza Valley, Skardu, Naran Kaghan, Kashmir, Fairy Meadows, Attabad Lake, and Deosai.';
      canonicalPath = '/destinations';
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${PRODUCTION_DOMAIN}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Destinations',
            item: `${PRODUCTION_DOMAIN}/destinations`,
          },
        ],
      };
    }
    // 6. Individual Destination Detail (/destinations/:slug)
    else if (cleanPath.startsWith('/destinations/')) {
      const rawSlug = cleanPath.replace('/destinations/', '');
      const canonicalSlug = DESTINATION_SLUG_ALIASES[rawSlug] || rawSlug;
      const dest = destinations.find(
        (d) =>
          d.slug === canonicalSlug ||
          d.id === canonicalSlug ||
          d.slug === rawSlug ||
          d.id === rawSlug
      );

      if (dest) {
        canonicalPath = `/destinations/${dest.slug}`;
        title =
          dest.seoTitle ||
          `${dest.name} Tour Packages & Travel Guide | Baig Treks and Tours`;
        description =
          dest.seoDescription ||
          `Explore ${dest.name} (${dest.region}) with Baig Treks and Tours. ${dest.shortDescription} Best season: ${dest.bestSeason || 'April to October'}.`;
        ogImageAlt = `${dest.name} in ${dest.region} — Baig Treks and Tours`;

        const graphItems: Record<string, unknown>[] = [
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: `${PRODUCTION_DOMAIN}/`,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Destinations',
                item: `${PRODUCTION_DOMAIN}/destinations`,
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: dest.name,
                item: `${PRODUCTION_DOMAIN}/destinations/${dest.slug}`,
              },
            ],
          },
          {
            '@type': 'TouristDestination',
            name: dest.name,
            description: dest.description || dest.shortDescription,
            url: `${PRODUCTION_DOMAIN}/destinations/${dest.slug}`,
            touristType: dest.idealFor || ['Families', 'Couples', 'Adventure Travelers'],
          },
        ];

        if (dest.faqs && dest.faqs.length > 0) {
          graphItems.push({
            '@type': 'FAQPage',
            mainEntity: dest.faqs.map((f) => ({
              '@type': 'Question',
              name: f.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: f.answer,
              },
            })),
          });
        }

        structuredData = {
          '@context': 'https://schema.org',
          '@graph': graphItems,
        };
      } else {
        title = 'Destination Not Found | Baig Treks and Tours';
        description =
          'Explore destinations across Hunza, Skardu, Naran Kaghan, Kashmir, and Northern Pakistan with Baig Treks and Tours.';
        noindex = true;
      }
    }
    // 7. Experiences (/experiences)
    else if (cleanPath === '/experiences') {
      title =
        'Family, Honeymoon, Private & Group Tours in Pakistan | Baig Treks and Tours';
      description =
        'Discover tailored travel styles in Northern Pakistan with Baig Treks and Tours: family tour packages, honeymoon tours, private tours, group trips, and mountain trekking.';
      canonicalPath = '/experiences';
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${PRODUCTION_DOMAIN}/` },
          { '@type': 'ListItem', position: 2, name: 'Experiences', item: `${PRODUCTION_DOMAIN}/experiences` },
        ],
      };
    }
    // 8. About (/about)
    else if (cleanPath === '/about') {
      title = 'About Baig Treks and Tours | Northern Pakistan Travel & Tour Operator';
      description =
        'Learn about Baig Treks and Tours, a dedicated Pakistan tour operator specializing in authentic private and group journeys across Hunza, Skardu, Naran Kaghan, Kashmir, and Gilgit-Baltistan.';
      canonicalPath = '/about';
      structuredData = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${PRODUCTION_DOMAIN}/` },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'About Baig Treks and Tours',
                item: `${PRODUCTION_DOMAIN}/about`,
              },
            ],
          },
          {
            '@type': 'AboutPage',
            name: 'About Baig Treks and Tours',
            url: `${PRODUCTION_DOMAIN}/about`,
            description:
              'Baig Treks and Tours is a Pakistan travel and tour operator organizing journeys across Hunza, Skardu, Naran Kaghan, Kashmir, and Gilgit-Baltistan.',
          },
        ],
      };
    }
    // 9. Gallery (/gallery)
    else if (cleanPath === '/gallery') {
      title = 'Northern Pakistan Photo Gallery | Hunza, Skardu & Karakoram | Baig Treks and Tours';
      description =
        'Explore scenic photography of Hunza Valley, Skardu, Attabad Lake, Passu Cones, Fairy Meadows, and Deosai Plains in Northern Pakistan by Baig Treks and Tours.';
      canonicalPath = '/gallery';
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${PRODUCTION_DOMAIN}/` },
          { '@type': 'ListItem', position: 2, name: 'Gallery', item: `${PRODUCTION_DOMAIN}/gallery` },
        ],
      };
    }
    // 10. Travel Guides Directory (/guides or /travel-guides)
    else if (cleanPath === '/guides' || cleanPath === '/travel-guides') {
      title = 'Pakistan Northern Areas Travel Guides & Seasonal Tips | Baig Treks and Tours';
      description =
        'Read practical travel guides for Hunza Valley, Skardu, Naran Kaghan, Kashmir, and Northern Pakistan. Seasonal weather advice, packing checklists, and route comparisons.';
      canonicalPath = '/guides';
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${PRODUCTION_DOMAIN}/` },
          { '@type': 'ListItem', position: 2, name: 'Travel Guides', item: `${PRODUCTION_DOMAIN}/guides` },
        ],
      };
    }
    // 11. Individual Travel Guide (/guides/:slug or /travel-guides/:slug)
    else if (cleanPath.startsWith('/guides/') || cleanPath.startsWith('/travel-guides/')) {
      const rawSlug = cleanPath.replace(/^\/(travel-)?guides\//, '');
      const canonicalSlug = GUIDE_SLUG_ALIASES[rawSlug] || rawSlug;
      const post = blogPosts.find(
        (p) =>
          p.slug === canonicalSlug ||
          p.id === canonicalSlug ||
          p.slug === rawSlug ||
          p.id === rawSlug
      );
      if (post) {
        canonicalPath = `/guides/${post.slug}`;
        ogType = 'article';
        title = post.seoTitle || `${post.title} | Baig Treks and Tours`;
        description = post.seoDescription || post.excerpt;
        ogImageAlt = post.title;
        structuredData = {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: `${PRODUCTION_DOMAIN}/` },
                { '@type': 'ListItem', position: 2, name: 'Travel Guides', item: `${PRODUCTION_DOMAIN}/guides` },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: post.title,
                  item: `${PRODUCTION_DOMAIN}/guides/${post.slug}`,
                },
              ],
            },
            {
              '@type': 'BlogPosting',
              headline: post.title,
              description: post.excerpt,
              url: `${PRODUCTION_DOMAIN}/guides/${post.slug}`,
              author: {
                '@type': 'Organization',
                name: 'Baig Treks and Tours',
                url: `${PRODUCTION_DOMAIN}/`,
              },
              publisher: {
                '@type': 'Organization',
                name: 'Baig Treks and Tours',
                url: `${PRODUCTION_DOMAIN}/`,
              },
            },
          ],
        };
      } else {
        title = 'Travel Guide Not Found | Baig Treks and Tours';
        description = 'Read Northern Pakistan travel guides and planning tips from Baig Treks and Tours.';
        noindex = true;
      }
    }
    // 12. Contact (/contact)
    else if (cleanPath === '/contact') {
      title = 'Contact Baig Treks and Tours | Book Pakistan Northern Areas Tours';
      description =
        'Contact Baig Treks and Tours via WhatsApp, phone (03155449778), or email to plan your custom tour package for Hunza, Skardu, Naran Kaghan, Kashmir, and Gilgit-Baltistan.';
      canonicalPath = '/contact';
      structuredData = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${PRODUCTION_DOMAIN}/` },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Contact Baig Treks and Tours',
                item: `${PRODUCTION_DOMAIN}/contact`,
              },
            ],
          },
          {
            '@type': 'ContactPage',
            name: 'Contact Baig Treks and Tours',
            url: `${PRODUCTION_DOMAIN}/contact`,
            description:
              'Get in touch with Baig Treks and Tours for Hunza, Skardu, Naran Kaghan, Kashmir, and Northern Pakistan tour inquiries.',
          },
        ],
      };
    }
    // 13. 404 Not Found
    else {
      title = 'Page Not Found (404) | Baig Treks and Tours';
      description =
        'The page you requested could not be found. Explore Hunza, Skardu, Naran Kaghan, and Kashmir tour packages with Baig Treks and Tours.';
      noindex = true;
    }

    const fullCanonicalUrl =
      canonicalPath === '/' ? `${PRODUCTION_DOMAIN}/` : `${PRODUCTION_DOMAIN}${canonicalPath}`;

    // Apply document title
    document.title = title;

    // Apply meta description
    setMetaTag('meta[name="description"]', 'name', 'description', description);

    // Apply robots / googlebot meta tags
    const robotsValue = noindex
      ? 'noindex, nofollow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
    setMetaTag('meta[name="robots"]', 'name', 'robots', robotsValue);
    setMetaTag('meta[name="googlebot"]', 'name', 'googlebot', noindex ? 'noindex, nofollow' : 'index, follow');

    // Apply canonical link
    setCanonicalLink(fullCanonicalUrl);

    // Apply OpenGraph tags
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', ogType);
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'Baig Treks and Tours');
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', fullCanonicalUrl);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', ogImage);
    setMetaTag('meta[property="og:image:alt"]', 'property', 'og:image:alt', ogImageAlt);

    // Apply Twitter Card tags
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage);
    setMetaTag('meta[name="twitter:image:alt"]', 'name', 'twitter:image:alt', ogImageAlt);

    // Apply route-specific structured data JSON-LD
    setDynamicJsonLd(structuredData);
  }, [location.pathname, searchParams, tours, destinations, blogPosts, faqs, business.phoneInternational]);

  return null;
};
