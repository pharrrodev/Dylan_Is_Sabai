Design System Specification: High-End Digital Noir
1. Overview & Creative North Star
Creative North Star: "The Digital Gala"

This design system is a masterclass in cinematic luxury. It rejects the "utility-first" aesthetic of modern SaaS in favor of a "Digital Showtime" experience—think of a high-end private gallery at midnight. It is designed to feel authoritative, expensive, and exclusive.

The system breaks the standard "template" look through extreme contrast and intentional void. By utilizing surface_container_lowest (#0e0e0e) against primary (#ffffff) and surface_tint (#e9c349), we create a visual rhythm that feels more like an editorial spread than a software interface. We prioritize large, sweeping areas of darkness to allow the "Anodized Gold" and "Icy White" elements to shimmer like jewelry.

2. Colors & Surface Philosophy
The palette is strictly monochromatic with a singular metallic accent. There is no room for secondary hues; the soul of the system lies in the depth of its blacks.

The "No-Line" Rule
Traditional 1px solid borders are strictly prohibited for sectioning content. To define boundaries, designers must use:

Tonal Shifts: Transitioning from surface (#131313) to surface_container_low (#1b1b1b).

Negative Space: Using the 16 (5.5rem) or 20 (7rem) spacing tokens to create mental groupings.

The "Gold Filament": A 0.5px surface_tint line is permitted only for primary structural separators or hero-tier containers to mimic gold inlay.

Surface Hierarchy & Nesting
Treat the UI as a physical stack of smoky glass and obsidian.

Base Layer: surface_dim (#131313) or surface_container_lowest (#0e0e0e).

Floating Containers: Use surface_container (#1f1f1f) with a backdrop-filter: blur(20px).

Active/Elevated Elements: surface_container_highest (#353535).

Signature Textures
The Champagne Glow: Use a radial gradient starting from surface_tint (#e9c349) at 5% opacity, fading to 0%, to create environmental "spotlighting" behind key CTAs.

Metallic Edge: For primary buttons, use a subtle linear gradient (45deg) from surface_tint to primary_container (#f8d056) to simulate light hitting an anodized metal edge.

3. Typography: The Editorial Authority
The typographic system relies on the tension between the geometric modernism of Space Grotesk and the surgical precision of Inter.

Display & Headlines (Space Grotesk): Use display-lg and headline-lg to command attention. Letter spacing should be set to -0.02em for a tighter, high-fashion look.

Data & UI (Inter): Use for all functional elements. For label-md and label-sm, increase letter spacing to 0.05em and use uppercase to maintain an expensive, "catalog" feel.

High-Contrast Hierarchy: Never use grey for text. All primary text must be primary (#ffffff). Secondary data uses on_surface_variant (#c6c6c6). If it’s not important, it shouldn't be competing for attention.

4. Elevation & Depth
We eschew traditional material shadows in favor of Tonal Layering and Luminescence.

The Layering Principle: Place a surface_container_high card on a surface_dim background. The depth is felt through the subtle shift in charcoal values, not a drop shadow.

Ambient Gold Shadows: When an element must "float" (e.g., a luxury modal), use a wide-spread shadow (blur: 60px) using the surface_tint color at 0.05 opacity. This mimics a soft gold environmental light reflecting off a dark floor.

The Ghost Border: For input fields and secondary cards, use outline_variant (#474747) at 30% opacity. It should be felt rather than seen.

Glassmorphism: All overlays must use surface_container_low at 80% opacity with a high-density blur. This creates the "Smoky Glass" signature of the system.

5. Components
Buttons
Primary: Solid primary (#ffffff) with on_primary (#241a00) text. Sharp corners (0px).

Secondary: Transparent background with a 0.5px border of surface_tint. Text is surface_tint.

Tertiary: Pure text (primary) with an underline that appears only on hover, using surface_tint.

Input Fields
Base State: surface_container_lowest background, 0.5px border of outline_variant (20% opacity).

Focus State: Border transitions to surface_tint. A subtle 1px outer glow of surface_tint at 10% opacity is applied.

Error State: Border transitions to error (#ffb4ab). No other colors allowed.

Cards & Lists
No Dividers: Lists must be separated by 1.4rem (token 4) of vertical space or a subtle background toggle between surface_container_low and surface_container_lowest.

Interactive Cards: On hover, a card should not lift; instead, its border should transition from outline_variant (20%) to surface_tint (100%).

Chips & Status Indicators
Status: Use primary (#ffffff) for active states.

Critical: Use error (#ffb4ab) as a sharp, tiny dot—minimalist and alarming.

Glow: "Active" indicators should have a 2px blur of the same color behind them to simulate a glowing LED.

6. Do’s and Don’ts
Do:
Embrace the Dark: Use 0px border radius everywhere. Sharpness equals precision.

Use "White Space" as "Black Space": Generous margins are the hallmark of luxury.

Layer with Intent: Ensure that every nested container is either slightly lighter or darker than its parent.

Don’t:
No Rounded Corners: Ever. The radius scale is strictly 0px.

No Gradients on Text: Keep typography pure white or pure champagne gold.

No Purple/Blue: Even for "links." All links are handled through the surface_tint (Gold) or primary (White) tokens.

No Heavy Shadows: If the user can see the shadow clearly, it’s too heavy. It should be an "ambient glow" or nothing.

The provided design image serves as a direct visual implementation of this system. It correctly utilizes Space Grotesk for headlines, 0px border radius on all buttons and cards, and a deep monochromatic palette with gold/champagne accents for high-priority elements like the "Apply" CTA.