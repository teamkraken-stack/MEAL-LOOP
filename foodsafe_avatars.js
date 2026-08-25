/**
 * FoodSafe / Meal Loop - Avatar Catalog & Selection System
 * Inspired by colorful, cartoon-style circular character & mascot design.
 * Contains 16 original scalable SVG avatars across Kitchen Staff & Food Heroes.
 */

(function (global) {
    'use strict';

    // 16 Original SVG Vector Avatars (100x100 ViewBox)
    const AVATAR_CATALOG = [
        // ================= ROW 1: KITCHEN STAFF & HEROES =================
        {
            id: 'chef-mia',
            name: 'Chef Mia',
            title: 'Head Kitchen Manager',
            category: 'staff',
            tagline: 'Passionate about culinary excellence and zero waste.',
            bgColors: ['#FF6B8B', '#FF8E53'],
            accentColor: '#FF6B8B',
            svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="bg-mia" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#FF758C" />
                        <stop offset="100%" stop-color="#FF7EB3" />
                    </linearGradient>
                    <linearGradient id="hair-mia" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="#5D4037" />
                        <stop offset="100%" stop-color="#3E2723" />
                    </linearGradient>
                </defs>
                <!-- Background Circle -->
                <circle cx="50" cy="50" r="48" fill="url(#bg-mia)" />
                <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2" />
                
                <!-- Shoulders & Outfit -->
                <path d="M22 92 C24 74 38 70 50 70 C62 70 76 74 78 92 Z" fill="#FFFFFF" />
                <path d="M44 70 L50 78 L56 70 Z" fill="#187F87" />
                <!-- Neck -->
                <path d="M43 60 H57 V72 H43 Z" fill="#FFDBAC" />
                <!-- Hair Back / Bun -->
                <circle cx="50" cy="30" r="28" fill="url(#hair-mia)" />
                <circle cx="50" cy="18" r="12" fill="#3E2723" />
                <circle cx="50" cy="18" r="7" fill="#187F87" />
                <!-- Face -->
                <ellipse cx="50" cy="48" rx="20" ry="21" fill="#FFE0BD" />
                <!-- Ears -->
                <circle cx="30" cy="48" r="4.5" fill="#FFDBAC" />
                <circle cx="70" cy="48" r="4.5" fill="#FFDBAC" />
                <!-- Cheeks Blush -->
                <circle cx="38" cy="53" r="3.5" fill="#FF8A80" opacity="0.6" />
                <circle cx="62" cy="53" r="3.5" fill="#FF8A80" opacity="0.6" />
                <!-- Hair Bangs / Front -->
                <path d="M30 42 C33 26 67 26 70 42 C64 33 58 35 50 35 C42 35 36 33 30 42 Z" fill="url(#hair-mia)" />
                <path d="M30 42 C30 52 33 55 35 56 C34 48 35 44 35 42 Z" fill="url(#hair-mia)" />
                <path d="M70 42 C70 52 67 55 65 56 C66 48 65 44 65 42 Z" fill="url(#hair-mia)" />
                <!-- Eyes -->
                <ellipse cx="41" cy="47" rx="3" ry="3.8" fill="#2C3E50" />
                <ellipse cx="59" cy="47" rx="3" ry="3.8" fill="#2C3E50" />
                <circle cx="42" cy="45.5" r="1.2" fill="#FFFFFF" />
                <circle cx="60" cy="45.5" r="1.2" fill="#FFFFFF" />
                <!-- Eyebrows -->
                <path d="M37 41 Q41 39 45 42" fill="none" stroke="#3E2723" stroke-width="1.8" stroke-linecap="round" />
                <path d="M55 42 Q59 39 63 41" fill="none" stroke="#3E2723" stroke-width="1.8" stroke-linecap="round" />
                <!-- Smile -->
                <path d="M45 56 Q50 61 55 56" fill="none" stroke="#D84315" stroke-width="2" stroke-linecap="round" />
            </svg>`
        },
        {
            id: 'master-pierre',
            name: 'Master Pierre',
            title: 'Executive Pastry Chef',
            category: 'staff',
            tagline: 'Master of recipe precision and batch consistency.',
            bgColors: ['#4E65FF', '#92EFFD'],
            accentColor: '#4E65FF',
            svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="bg-pierre" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#4CA1AF" />
                        <stop offset="100%" stop-color="#C4E0E5" />
                    </linearGradient>
                </defs>
                <!-- Background Circle -->
                <circle cx="50" cy="50" r="48" fill="url(#bg-pierre)" />
                <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2" />
                
                <!-- Shoulders & Chef Coat -->
                <path d="M22 92 C24 74 38 72 50 72 C62 72 76 74 78 92 Z" fill="#F8FAFC" />
                <circle cx="48" cy="80" r="1.8" fill="#1E293B" />
                <circle cx="52" cy="80" r="1.8" fill="#1E293B" />
                <circle cx="48" cy="86" r="1.8" fill="#1E293B" />
                <circle cx="52" cy="86" r="1.8" fill="#1E293B" />
                <!-- Red Neckerchief -->
                <path d="M44 72 L50 79 L56 72 Z" fill="#E53935" />
                <!-- Neck -->
                <path d="M42 62 H58 V73 H42 Z" fill="#F5CBA7" />
                <!-- Face -->
                <ellipse cx="50" cy="52" rx="21" ry="19" fill="#FADBD8" />
                <!-- Bald Head Side Hair -->
                <path d="M28 48 C27 55 31 60 33 60 C32 54 32 50 34 46 Z" fill="#E59866" />
                <path d="M72 48 C73 55 69 60 67 60 C68 54 68 50 66 46 Z" fill="#E59866" />
                <!-- Ears -->
                <circle cx="28" cy="52" r="4.5" fill="#F5CBA7" />
                <circle cx="72" cy="52" r="4.5" fill="#F5CBA7" />
                <!-- Rosy Cheeks & Nose -->
                <circle cx="36" cy="55" r="4" fill="#F1948A" opacity="0.7" />
                <circle cx="64" cy="55" r="4" fill="#F1948A" opacity="0.7" />
                <ellipse cx="50" cy="51" rx="5" ry="4" fill="#EDBB99" />
                <!-- Eyes (Happy Arcs) -->
                <path d="M37 46 Q42 42 45 46" fill="none" stroke="#2C3E50" stroke-width="2.2" stroke-linecap="round" />
                <path d="M55 46 Q58 42 63 46" fill="none" stroke="#2C3E50" stroke-width="2.2" stroke-linecap="round" />
                <!-- French Curled Mustache -->
                <path d="M50 56 C44 53 36 53 32 49 C35 58 46 60 50 58 C54 60 65 58 68 49 C64 53 56 53 50 56 Z" fill="#D35400" />
                <!-- Chef Hat (Toque) -->
                <path d="M34 38 H66 V43 H34 Z" fill="#E2E8F0" />
                <path d="M33 38 C28 35 26 24 35 18 C38 10 62 10 65 18 C74 24 72 35 67 38 Z" fill="#FFFFFF" filter="drop-shadow(0 2px 2px rgba(0,0,0,0.1))" />
                <path d="M42 20 V38" stroke="#E2E8F0" stroke-width="1.5" />
                <path d="M50 18 V38" stroke="#E2E8F0" stroke-width="1.5" />
                <path d="M58 20 V38" stroke="#E2E8F0" stroke-width="1.5" />
            </svg>`
        },
        {
            id: 'maya-nutrition',
            name: 'Maya Vance',
            title: 'Lead Dietitian',
            category: 'staff',
            tagline: 'Optimizing balanced meals and nutrient profiles.',
            bgColors: ['#8E2DE2', '#4A00E0'],
            accentColor: '#8E2DE2',
            svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="bg-maya" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#654EA3" />
                        <stop offset="100%" stop-color="#EAAFC8" />
                    </linearGradient>
                </defs>
                <!-- Background Circle -->
                <circle cx="50" cy="50" r="48" fill="url(#bg-maya)" />
                <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2" />
                
                <!-- Shoulders / Top -->
                <path d="M22 92 C24 74 38 70 50 70 C62 70 76 74 78 92 Z" fill="#4A148C" />
                <!-- Gold Necklace -->
                <path d="M40 70 Q50 77 60 70" fill="none" stroke="#FFD700" stroke-width="2" />
                <!-- Neck -->
                <path d="M44 60 H56 V72 H44 Z" fill="#8D5524" />
                <!-- Voluminous Braided Afro Hair Back -->
                <circle cx="50" cy="40" r="29" fill="#1C1917" />
                <!-- Face -->
                <ellipse cx="50" cy="49" rx="19" ry="20" fill="#A06437" />
                <!-- Gold Hoop Earrings -->
                <circle cx="28" cy="52" r="5.5" fill="none" stroke="#FFD700" stroke-width="2.5" />
                <circle cx="72" cy="52" r="5.5" fill="none" stroke="#FFD700" stroke-width="2.5" />
                <!-- Hair Front & Side Braids -->
                <path d="M29 38 C32 25 68 25 71 38 C65 32 55 33 50 35 C45 33 35 32 29 38 Z" fill="#1C1917" />
                <path d="M27 38 C26 50 28 58 31 62 C29 55 28 48 29 38 Z" fill="#1C1917" />
                <path d="M73 38 C74 50 72 58 69 62 C71 55 72 48 73 38 Z" fill="#1C1917" />
                <!-- Eyes -->
                <ellipse cx="42" cy="48" rx="3.2" ry="3.6" fill="#1C1917" />
                <ellipse cx="58" cy="48" rx="3.2" ry="3.6" fill="#1C1917" />
                <circle cx="43" cy="46.5" r="1.2" fill="#FFFFFF" />
                <circle cx="59" cy="46.5" r="1.2" fill="#FFFFFF" />
                <!-- Eyelashes -->
                <path d="M37 44 Q42 41 46 44" fill="none" stroke="#1C1917" stroke-width="2" stroke-linecap="round" />
                <path d="M54 44 Q58 41 63 44" fill="none" stroke="#1C1917" stroke-width="2" stroke-linecap="round" />
                <!-- Soft Glow Blush -->
                <circle cx="37" cy="55" r="3.5" fill="#D84315" opacity="0.4" />
                <circle cx="63" cy="55" r="3.5" fill="#D84315" opacity="0.4" />
                <!-- Lips -->
                <path d="M44 58 Q50 63 56 58" fill="#C2185B" stroke="#880E4F" stroke-width="1" />
            </svg>`
        },
        {
            id: 'leo-apprentice',
            name: 'Leo Spark',
            title: 'Junior Sous Chef',
            category: 'staff',
            tagline: 'Speedy prep specialist with great kitchen energy.',
            bgColors: ['#F6D365', '#FDA085'],
            accentColor: '#FDA085',
            svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="bg-leo" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#F9D423" />
                        <stop offset="100%" stop-color="#FF4E50" />
                    </linearGradient>
                    <linearGradient id="hair-leo" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="#FFE082" />
                        <stop offset="100%" stop-color="#FFB300" />
                    </linearGradient>
                </defs>
                <!-- Background Circle -->
                <circle cx="50" cy="50" r="48" fill="url(#bg-leo)" />
                <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2" />
                
                <!-- Shoulders & Yellow/Teal Tee -->
                <path d="M22 92 C24 74 38 70 50 70 C62 70 76 74 78 92 Z" fill="#0288D1" />
                <path d="M42 70 Q50 77 58 70 Z" fill="#FFE0BD" />
                <!-- Neck -->
                <path d="M43 60 H57 V72 H43 Z" fill="#FFDBAC" />
                <!-- Spiky Blonde Hair Back -->
                <path d="M24 45 C20 30 35 15 50 15 C65 15 80 30 76 45 C78 52 74 60 70 60 C66 40 34 40 30 60 C26 60 22 52 24 45 Z" fill="url(#hair-leo)" />
                <!-- Face -->
                <ellipse cx="50" cy="48" rx="20" ry="21" fill="#FFE0BD" />
                <!-- Ears -->
                <circle cx="29" cy="48" r="4.5" fill="#FFDBAC" />
                <circle cx="71" cy="48" r="4.5" fill="#FFDBAC" />
                <!-- Anime Hair Fringe -->
                <path d="M28 35 L38 42 L42 32 L50 44 L56 32 L64 42 L72 35 L68 24 C58 20 42 20 32 24 Z" fill="url(#hair-leo)" />
                <!-- Rosy Cheeks -->
                <circle cx="37" cy="54" r="3.5" fill="#FF8A80" opacity="0.6" />
                <circle cx="63" cy="54" r="3.5" fill="#FF8A80" opacity="0.6" />
                <!-- Starry Big Sparkle Eyes -->
                <ellipse cx="40" cy="47" rx="4" ry="5" fill="#0D47A1" />
                <ellipse cx="60" cy="47" rx="4" ry="5" fill="#0D47A1" />
                <circle cx="39" cy="44.5" r="1.8" fill="#FFFFFF" />
                <circle cx="59" cy="44.5" r="1.8" fill="#FFFFFF" />
                <circle cx="42" cy="49" r="0.9" fill="#FFFFFF" />
                <circle cx="62" cy="49" r="0.9" fill="#FFFFFF" />
                <!-- Big Open Grin -->
                <path d="M43 55 Q50 64 57 55 Z" fill="#D32F2F" />
                <path d="M45 55 Q50 57 55 55 Z" fill="#FFFFFF" />
            </svg>`
        },

        // ================= ROW 2: PLAYFUL FOOD & VEGETABLE MASCOTS =================
        {
            id: 'chili-pip',
            name: 'Chili Pip',
            title: 'Spice & Quality Champ',
            category: 'mascot',
            tagline: 'Adds fire and passion to safe cooking and storage.',
            bgColors: ['#A8FF78', '#78FFD6'],
            accentColor: '#E53935',
            svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="bg-chili" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#76B852" />
                        <stop offset="100%" stop-color="#8DC26F" />
                    </linearGradient>
                    <linearGradient id="chili-body" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#FF5252" />
                        <stop offset="60%" stop-color="#E53935" />
                        <stop offset="100%" stop-color="#B71C1C" />
                    </linearGradient>
                </defs>
                <!-- Background Circle -->
                <circle cx="50" cy="50" r="48" fill="url(#bg-chili)" />
                <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2" />
                
                <!-- Green Stem / Leaf Cap -->
                <path d="M50 25 C47 14 38 12 36 8 C46 9 52 16 54 22 Z" fill="#2E7D32" />
                <path d="M36 28 C42 22 58 22 64 28 C68 32 60 35 50 33 C40 35 32 32 36 28 Z" fill="#43A047" />
                
                <!-- Chili Pepper Body -->
                <path d="M38 28 C30 45 36 68 45 78 C48 81 55 86 52 90 C45 85 30 70 28 50 C26 34 32 28 38 28 Z" fill="url(#chili-body)" />
                <path d="M38 28 C45 28 64 35 66 52 C68 68 56 84 52 90 C50 82 44 75 40 65 C34 50 35 34 38 28 Z" fill="url(#chili-body)" />
                
                <!-- Body Gloss Highlight -->
                <path d="M34 36 C32 48 35 62 42 72" fill="none" stroke="#FFA7A6" stroke-width="3" stroke-linecap="round" opacity="0.6" />
                
                <!-- Eyes (Playful Smug Look) -->
                <ellipse cx="44" cy="46" rx="3.5" ry="4.5" fill="#1A1A1A" />
                <ellipse cx="58" cy="46" rx="3.5" ry="4.5" fill="#1A1A1A" />
                <circle cx="45.5" cy="44.5" r="1.4" fill="#FFFFFF" />
                <circle cx="59.5" cy="44.5" r="1.4" fill="#FFFFFF" />
                
                <!-- Smirk Smile -->
                <path d="M47 56 Q53 62 60 55" fill="none" stroke="#212121" stroke-width="2.5" stroke-linecap="round" />
                <!-- Rosy Blush -->
                <circle cx="39" cy="53" r="3" fill="#FF8A80" opacity="0.7" />
                <circle cx="63" cy="53" r="3" fill="#FF8A80" opacity="0.7" />
                <!-- Little Flame Sparkle -->
                <path d="M68 28 Q72 20 76 24 Q80 20 78 28 Q82 32 74 34 Z" fill="#FFD600" opacity="0.85" />
            </svg>`
        },
        {
            id: 'crisp-apple',
            name: 'Crisp Granny',
            title: 'Fresh Produce Guardian',
            category: 'mascot',
            tagline: 'Ensures farm-fresh ingredients and proper cold holds.',
            bgColors: ['#11998E', '#38EF7D'],
            accentColor: '#43A047',
            svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="bg-apple" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#56AB2F" />
                        <stop offset="100%" stop-color="#A8E063" />
                    </linearGradient>
                    <linearGradient id="apple-body" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#9CCC65" />
                        <stop offset="60%" stop-color="#7CB342" />
                        <stop offset="100%" stop-color="#558B2F" />
                    </linearGradient>
                </defs>
                <!-- Background Circle -->
                <circle cx="50" cy="50" r="48" fill="url(#bg-apple)" />
                <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2" />
                
                <!-- Brown Apple Stem -->
                <path d="M50 30 C50 18 56 16 58 14 C58 18 53 22 52 30 Z" fill="#5D4037" />
                <!-- Fresh Leaf -->
                <path d="M52 22 C62 16 70 20 72 25 C64 28 56 26 52 22 Z" fill="#66BB6A" />
                
                <!-- Apple Body Silhouette -->
                <path d="M50 33 C42 26 24 28 22 45 C20 66 36 84 48 85 C49 85 50 84 50 84 C50 84 51 85 52 85 C64 84 80 66 78 45 C76 28 58 26 50 33 Z" fill="url(#apple-body)" />
                
                <!-- Gloss Reflection -->
                <path d="M28 42 C26 52 30 64 36 72" fill="none" stroke="#DCEDC8" stroke-width="3.5" stroke-linecap="round" opacity="0.6" />
                
                <!-- Kawaii Eyes -->
                <ellipse cx="40" cy="52" rx="3.5" ry="4.5" fill="#1B5E20" />
                <ellipse cx="60" cy="52" rx="3.5" ry="4.5" fill="#1B5E20" />
                <circle cx="41.5" cy="50.5" r="1.4" fill="#FFFFFF" />
                <circle cx="61.5" cy="50.5" r="1.4" fill="#FFFFFF" />
                
                <!-- Cheeks -->
                <circle cx="34" cy="59" r="4" fill="#FF8A80" opacity="0.6" />
                <circle cx="66" cy="59" r="4" fill="#FF8A80" opacity="0.6" />
                <!-- Cute Open Smile -->
                <path d="M46 59 Q50 65 54 59" fill="none" stroke="#1B5E20" stroke-width="2.5" stroke-linecap="round" />
            </svg>`
        },
        {
            id: 'sunny-pear',
            name: 'Sunny Pera',
            title: 'Dietary Harmony Mascot',
            category: 'mascot',
            tagline: 'Promotes wholesome portioning and mindful consumption.',
            bgColors: ['#89F7FE', '#66A6FF'],
            accentColor: '#FBC02D',
            svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="bg-pear" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#4FACFE" />
                        <stop offset="100%" stop-color="#00F2FE" />
                    </linearGradient>
                    <linearGradient id="pear-body" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#FFEE58" />
                        <stop offset="60%" stop-color="#D4E157" />
                        <stop offset="100%" stop-color="#9E9D24" />
                    </linearGradient>
                </defs>
                <!-- Background Circle -->
                <circle cx="50" cy="50" r="48" fill="url(#bg-pear)" />
                <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2" />
                
                <!-- Stem & Leaf -->
                <path d="M50 25 C49 16 54 14 55 12 C56 16 52 20 51 25 Z" fill="#6D4C41" />
                <path d="M52 18 C60 14 66 18 68 22 C62 24 56 22 52 18 Z" fill="#7CB342" />
                
                <!-- Pear Body Shape -->
                <path d="M50 26 C42 26 38 34 38 45 C38 52 26 58 26 70 C26 82 36 88 50 88 C64 88 74 82 74 70 C74 58 62 52 62 45 C62 34 58 26 50 26 Z" fill="url(#pear-body)" />
                
                <!-- Highlight Curve -->
                <path d="M34 62 C32 70 36 78 44 82" fill="none" stroke="#FFF9C4" stroke-width="3" stroke-linecap="round" opacity="0.6" />
                
                <!-- Gentle Happy Curved Eyes -->
                <path d="M38 54 Q43 49 48 54" fill="none" stroke="#33691E" stroke-width="2.5" stroke-linecap="round" />
                <path d="M52 54 Q57 49 62 54" fill="none" stroke="#33691E" stroke-width="2.5" stroke-linecap="round" />
                
                <!-- Rosy Cheeks -->
                <circle cx="34" cy="62" r="4" fill="#FF8A80" opacity="0.6" />
                <circle cx="66" cy="62" r="4" fill="#FF8A80" opacity="0.6" />
                <!-- Content Smile -->
                <path d="M46 62 Q50 67 54 62" fill="none" stroke="#33691E" stroke-width="2.2" stroke-linecap="round" />
            </svg>`
        },
        {
            id: 'king-pineapple',
            name: 'King Pineapple',
            title: 'Tropical Inventory Chief',
            category: 'mascot',
            tagline: 'Crowned protector of cold-chain and dry stores.',
            bgColors: ['#FFD194', '#D1913C'],
            accentColor: '#FFA000',
            svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="bg-pine" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#FCE38A" />
                        <stop offset="100%" stop-color="#F38181" />
                    </linearGradient>
                    <linearGradient id="pine-body" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#FFD54F" />
                        <stop offset="100%" stop-color="#FF8F00" />
                    </linearGradient>
                </defs>
                <!-- Background Circle -->
                <circle cx="50" cy="50" r="48" fill="url(#bg-pine)" />
                <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2" />
                
                <!-- Spiky Tropical Leaves Crown -->
                <path d="M50 10 L45 28 L50 24 L55 28 Z" fill="#2E7D32" />
                <path d="M38 15 L44 32 L40 28 L34 22 Z" fill="#388E3C" />
                <path d="M62 15 L56 32 L60 28 L66 22 Z" fill="#388E3C" />
                <path d="M30 24 L42 36 L36 34 L26 30 Z" fill="#43A047" />
                <path d="M70 24 L58 36 L64 34 L74 30 Z" fill="#43A047" />
                
                <!-- Pineapple Body -->
                <ellipse cx="50" cy="58" rx="22" ry="26" fill="url(#pine-body)" />
                
                <!-- Diamond Texture Pattern -->
                <path d="M34 46 L66 70 M30 58 L62 82 M40 38 L70 60" stroke="#E65100" stroke-width="1.2" opacity="0.4" />
                <path d="M66 46 L34 70 M70 58 L38 82 M60 38 L30 60" stroke="#E65100" stroke-width="1.2" opacity="0.4" />
                
                <!-- Cute Enthusiastic Eyes -->
                <ellipse cx="42" cy="55" rx="3.5" ry="4.5" fill="#3E2723" />
                <ellipse cx="58" cy="55" rx="3.5" ry="4.5" fill="#3E2723" />
                <circle cx="43.5" cy="53.5" r="1.3" fill="#FFFFFF" />
                <circle cx="59.5" cy="53.5" r="1.3" fill="#FFFFFF" />
                
                <!-- Open Joyful Smile -->
                <path d="M44 63 Q50 71 56 63 Z" fill="#C2185B" />
                <circle cx="35" cy="62" r="3.5" fill="#FF8A80" opacity="0.7" />
                <circle cx="65" cy="62" r="3.5" fill="#FF8A80" opacity="0.7" />
            </svg>`
        },

        // ================= ROW 3: MORE FUN FOOD & QUIRKY CHARACTERS =================
        {
            id: 'aubergine-zen',
            name: 'Aubergine Zen',
            title: 'Kitchen Calm Mascot',
            category: 'mascot',
            tagline: 'Maintains cool kitchen composure under peak dinner rush.',
            bgColors: ['#00C6FB', '#005BEA'],
            accentColor: '#7B1FA2',
            svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="bg-eggplant" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#00C9FF" />
                        <stop offset="100%" stop-color="#92FE9D" />
                    </linearGradient>
                    <linearGradient id="eggplant-body" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#8E24AA" />
                        <stop offset="60%" stop-color="#6A1B9A" />
                        <stop offset="100%" stop-color="#4A148C" />
                    </linearGradient>
                </defs>
                <!-- Background Circle -->
                <circle cx="50" cy="50" r="48" fill="url(#bg-eggplant)" />
                <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2" />
                
                <!-- Calyx & Stem -->
                <path d="M50 20 C48 12 45 10 42 8 C48 9 52 14 52 20 Z" fill="#2E7D32" />
                <path d="M50 20 C42 22 34 26 34 32 C40 32 46 36 50 30 C54 36 60 32 66 32 C66 26 58 22 50 20 Z" fill="#43A047" />
                
                <!-- Eggplant Body -->
                <path d="M50 25 C42 25 38 36 36 48 C34 62 26 68 26 76 C26 84 36 88 50 88 C64 88 74 84 74 76 C74 68 66 62 64 48 C62 36 58 25 50 25 Z" fill="url(#eggplant-body)" />
                
                <!-- Shiny Body Highlight -->
                <path d="M34 52 C32 62 36 74 44 80" fill="none" stroke="#CE93D8" stroke-width="3.5" stroke-linecap="round" opacity="0.6" />
                
                <!-- Chill Zen Closed Eyes -->
                <path d="M38 56 Q43 51 47 56" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" />
                <path d="M53 56 Q57 51 62 56" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" />
                
                <!-- Rosy Cheeks -->
                <circle cx="34" cy="64" r="3.8" fill="#FF80AB" opacity="0.7" />
                <circle cx="66" cy="64" r="3.8" fill="#FF80AB" opacity="0.7" />
                <!-- Content Smile -->
                <path d="M46 64 Q50 69 54 64" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" />
            </svg>`
        },
        {
            id: 'shroom-cool',
            name: 'Shroomy Shades',
            title: 'Surplus Scout',
            category: 'mascot',
            tagline: 'Always scouting surplus redistribution opportunities.',
            bgColors: ['#FF9966', '#FF5E62'],
            accentColor: '#D84315',
            svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="bg-shroom" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#FF9966" />
                        <stop offset="100%" stop-color="#FF5E62" />
                    </linearGradient>
                    <linearGradient id="cap-shroom" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="#A1887F" />
                        <stop offset="100%" stop-color="#5D4037" />
                    </linearGradient>
                </defs>
                <!-- Background Circle -->
                <circle cx="50" cy="50" r="48" fill="url(#bg-shroom)" />
                <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2" />
                
                <!-- Mushroom Stem / Stalk Body -->
                <path d="M38 52 C36 68 34 84 50 84 C66 84 64 68 62 52 Z" fill="#FFF8E1" />
                
                <!-- Mushroom Cap -->
                <path d="M50 18 C24 18 18 42 22 52 C24 55 76 55 78 52 C82 42 76 18 50 18 Z" fill="url(#cap-shroom)" />
                
                <!-- Cap Dots / Texture -->
                <circle cx="34" cy="30" r="4" fill="#D7CCC8" opacity="0.6" />
                <circle cx="52" cy="25" r="5" fill="#D7CCC8" opacity="0.6" />
                <circle cx="66" cy="34" r="3.5" fill="#D7CCC8" opacity="0.6" />
                
                <!-- Cool Sunglasses -->
                <path d="M28 50 H72 V57 C72 63 60 65 52 58 C44 65 32 63 28 57 Z" fill="#212121" />
                <!-- Sunglasses Reflection Glare -->
                <path d="M33 52 L40 59 M37 52 L44 59" stroke="rgba(255,255,255,0.5)" stroke-width="1.8" />
                <path d="M58 52 L65 59 M62 52 L69 59" stroke="rgba(255,255,255,0.5)" stroke-width="1.8" />
                
                <!-- Smug Cool Smirk -->
                <path d="M46 72 Q52 77 56 71" fill="none" stroke="#4E342E" stroke-width="2.5" stroke-linecap="round" />
            </svg>`
        },
        {
            id: 'captain-carrot',
            name: 'Captain Carrot',
            title: 'Forecast Specialist',
            category: 'mascot',
            tagline: 'Predicts exact portion requirements with 20/20 clarity.',
            bgColors: ['#FF8008', '#FFC837'],
            accentColor: '#FF6D00',
            svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="bg-carrot" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#FF758C" />
                        <stop offset="100%" stop-color="#FF7EB3" />
                    </linearGradient>
                    <linearGradient id="carrot-body" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#FFA726" />
                        <stop offset="60%" stop-color="#FB8C00" />
                        <stop offset="100%" stop-color="#E65100" />
                    </linearGradient>
                </defs>
                <!-- Background Circle -->
                <circle cx="50" cy="50" r="48" fill="url(#bg-carrot)" />
                <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2" />
                
                <!-- Carrot Bushy Green Crown Leaves -->
                <path d="M50 10 C46 18 48 28 50 30 C52 28 54 18 50 10 Z" fill="#2E7D32" />
                <path d="M40 14 C40 22 45 28 48 30 C45 26 42 20 40 14 Z" fill="#388E3C" />
                <path d="M60 14 C60 22 55 28 52 30 C55 26 58 20 60 14 Z" fill="#388E3C" />
                <path d="M34 20 C36 26 44 30 48 31 Z" fill="#43A047" />
                <path d="M66 20 C64 26 56 30 52 31 Z" fill="#43A047" />
                
                <!-- Carrot Body -->
                <path d="M32 32 C42 30 58 30 68 32 C70 42 62 65 52 90 C48 90 38 65 32 32 Z" fill="url(#carrot-body)" />
                
                <!-- Horizontal Texture Lines -->
                <path d="M35 42 Q40 44 44 43" stroke="#BF360C" stroke-width="1.8" stroke-linecap="round" opacity="0.6" />
                <path d="M56 48 Q60 49 64 47" stroke="#BF360C" stroke-width="1.8" stroke-linecap="round" opacity="0.6" />
                <path d="M38 62 Q43 63 46 62" stroke="#BF360C" stroke-width="1.8" stroke-linecap="round" opacity="0.6" />
                
                <!-- Big Happy Eyes -->
                <ellipse cx="43" cy="46" rx="3.5" ry="4.5" fill="#212121" />
                <ellipse cx="57" cy="46" rx="3.5" ry="4.5" fill="#212121" />
                <circle cx="44.5" cy="44.5" r="1.3" fill="#FFFFFF" />
                <circle cx="58.5" cy="44.5" r="1.3" fill="#FFFFFF" />
                
                <!-- Cheerful Open Smile -->
                <path d="M45 56 Q50 63 55 56 Z" fill="#C2185B" />
                <circle cx="36" cy="53" r="3.5" fill="#FF8A80" opacity="0.7" />
                <circle cx="64" cy="53" r="3.5" fill="#FF8A80" opacity="0.7" />
            </svg>`
        },
        {
            id: 'berry-bunch',
            name: 'Berry Grapes',
            title: 'Community Link Mascot',
            category: 'mascot',
            tagline: 'Connecting surplus kitchens with local community shelters.',
            bgColors: ['#C33764', '#1D2671'],
            accentColor: '#8E24AA',
            svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="bg-grape" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#D299C2" />
                        <stop offset="100%" stop-color="#FEF9D7" />
                    </linearGradient>
                    <linearGradient id="grape-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#AB47BC" />
                        <stop offset="100%" stop-color="#6A1B9A" />
                    </linearGradient>
                </defs>
                <!-- Background Circle -->
                <circle cx="50" cy="50" r="48" fill="url(#bg-grape)" />
                <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2" />
                
                <!-- Stem & Vine Leaf -->
                <path d="M50 24 C50 14 56 12 58 10 C58 14 53 18 52 24 Z" fill="#5D4037" />
                <path d="M52 16 C62 12 68 16 70 20 C62 22 56 20 52 16 Z" fill="#43A047" />
                
                <!-- Grape Cluster Spheres -->
                <circle cx="34" cy="38" r="10" fill="url(#grape-grad)" />
                <circle cx="66" cy="38" r="10" fill="url(#grape-grad)" />
                <circle cx="50" cy="34" r="11" fill="url(#grape-grad)" />
                <circle cx="28" cy="54" r="11" fill="url(#grape-grad)" />
                <circle cx="72" cy="54" r="11" fill="url(#grape-grad)" />
                <circle cx="38" cy="70" r="10" fill="url(#grape-grad)" />
                <circle cx="62" cy="70" r="10" fill="url(#grape-grad)" />
                <circle cx="50" cy="82" r="9" fill="url(#grape-grad)" />
                <!-- Main Center Face Grape -->
                <circle cx="50" cy="54" r="15" fill="url(#grape-grad)" />
                
                <!-- Big Anime Sparkle Eyes -->
                <ellipse cx="44" cy="52" rx="3.5" ry="4.5" fill="#FFFFFF" />
                <ellipse cx="56" cy="52" rx="3.5" ry="4.5" fill="#FFFFFF" />
                <circle cx="44" cy="52" r="2.8" fill="#1A237E" />
                <circle cx="56" cy="52" r="2.8" fill="#1A237E" />
                <circle cx="45" cy="50.5" r="1.1" fill="#FFFFFF" />
                <circle cx="57" cy="50.5" r="1.1" fill="#FFFFFF" />
                
                <!-- Happy Sweet Smile -->
                <path d="M46 60 Q50 64 54 60" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" />
                <circle cx="38" cy="58" r="2.5" fill="#FF80AB" opacity="0.8" />
                <circle cx="62" cy="58" r="2.5" fill="#FF80AB" opacity="0.8" />
            </svg>`
        },

        // ================= ROW 4: MORE TEAM HEROES & DIVERSE STAFF =================
        {
            id: 'alex-lead',
            name: 'Alex Rivera',
            title: 'Kitchen Operations Lead',
            category: 'staff',
            tagline: 'Coordinates seamless shifts, attendance, and prep logs.',
            bgColors: ['#0BA360', '#3CBA92'],
            accentColor: '#0BA360',
            svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="bg-alex" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#30CFD0" />
                        <stop offset="100%" stop-color="#330867" />
                    </linearGradient>
                    <linearGradient id="hair-alex" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="#6D4C41" />
                        <stop offset="100%" stop-color="#3E2723" />
                    </linearGradient>
                </defs>
                <!-- Background Circle -->
                <circle cx="50" cy="50" r="48" fill="url(#bg-alex)" />
                <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2" />
                
                <!-- Shoulders & Teal Polo -->
                <path d="M22 92 C24 74 38 70 50 70 C62 70 76 74 78 92 Z" fill="#00897B" />
                <path d="M44 70 L50 78 L56 70 Z" fill="#E0F2F1" />
                <!-- Neck -->
                <path d="M43 60 H57 V72 H43 Z" fill="#FFDBAC" />
                <!-- Hair Back -->
                <circle cx="50" cy="36" r="26" fill="url(#hair-alex)" />
                <!-- Face -->
                <ellipse cx="50" cy="49" rx="20" ry="21" fill="#FFE0BD" />
                <!-- Ears -->
                <circle cx="29" cy="49" r="4.5" fill="#FFDBAC" />
                <circle cx="71" cy="49" r="4.5" fill="#FFDBAC" />
                <!-- Wavy Flowing Hair Front -->
                <path d="M26 38 C28 22 72 22 74 38 C68 30 58 32 50 32 C40 32 32 30 26 38 Z" fill="url(#hair-alex)" />
                <path d="M26 38 C28 48 32 54 34 56 C32 46 30 42 26 38 Z" fill="url(#hair-alex)" />
                <!-- Eyes -->
                <ellipse cx="41" cy="48" rx="3.2" ry="4" fill="#2C3E50" />
                <ellipse cx="59" cy="48" rx="3.2" ry="4" fill="#2C3E50" />
                <circle cx="42" cy="46.5" r="1.3" fill="#FFFFFF" />
                <circle cx="60" cy="46.5" r="1.3" fill="#FFFFFF" />
                <!-- Confident Eyebrows -->
                <path d="M36 42 Q41 39 46 42" fill="none" stroke="#3E2723" stroke-width="2" stroke-linecap="round" />
                <path d="M54 42 Q59 39 64 42" fill="none" stroke="#3E2723" stroke-width="2" stroke-linecap="round" />
                <!-- Warm Smile -->
                <path d="M44 57 Q50 63 56 57" fill="none" stroke="#D84315" stroke-width="2.4" stroke-linecap="round" />
                <circle cx="36" cy="54" r="3.5" fill="#FF8A80" opacity="0.5" />
                <circle cx="64" cy="54" r="3.5" fill="#FF8A80" opacity="0.5" />
            </svg>`
        },
        {
            id: 'zara-auditor',
            name: 'Zara Khan',
            title: 'FSSAI Safety Auditor',
            category: 'staff',
            tagline: 'Ensures strict hygiene protocols and temperature logs.',
            bgColors: ['#F093FB', '#F5576C'],
            accentColor: '#D81B60',
            svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="bg-zara" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#FA709A" />
                        <stop offset="100%" stop-color="#FEE140" />
                    </linearGradient>
                    <linearGradient id="hair-zara" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="#311B92" />
                        <stop offset="100%" stop-color="#1A237E" />
                    </linearGradient>
                </defs>
                <!-- Background Circle -->
                <circle cx="50" cy="50" r="48" fill="url(#bg-zara)" />
                <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2" />
                
                <!-- Shoulders / Blazer -->
                <path d="M22 92 C24 74 38 70 50 70 C62 70 76 74 78 92 Z" fill="#1A237E" />
                <path d="M42 70 L50 82 L58 70 Z" fill="#E8EAF6" />
                <!-- Neck -->
                <path d="M44 60 H56 V72 H44 Z" fill="#F5CBA7" />
                <!-- Sleek Indigo Hair Back -->
                <path d="M24 45 C22 28 34 18 50 18 C66 18 78 28 76 45 C78 64 74 72 70 72 C68 55 32 55 30 72 C26 72 22 64 24 45 Z" fill="url(#hair-zara)" />
                <!-- Face -->
                <ellipse cx="50" cy="48" rx="19" ry="20" fill="#FADBD8" />
                <!-- Ears -->
                <circle cx="30" cy="48" r="4.2" fill="#F5CBA7" />
                <circle cx="70" cy="48" r="4.2" fill="#F5CBA7" />
                <!-- Side Asymmetric Hair Bang -->
                <path d="M25 35 C35 18 68 22 75 35 C70 28 55 26 44 32 C34 38 28 48 26 56 Z" fill="url(#hair-zara)" />
                <!-- Chic Red Frames / Glasses -->
                <rect x="34" y="42" width="13" height="10" rx="3" fill="none" stroke="#D81B60" stroke-width="2" />
                <rect x="53" y="42" width="13" height="10" rx="3" fill="none" stroke="#D81B60" stroke-width="2" />
                <line x1="47" y1="46" x2="53" y2="46" stroke="#D81B60" stroke-width="2" />
                <!-- Smart Eyes Behind Glasses -->
                <ellipse cx="40.5" cy="47" rx="2.5" ry="3" fill="#283593" />
                <ellipse cx="59.5" cy="47" rx="2.5" ry="3" fill="#283593" />
                <circle cx="41.5" cy="45.8" r="0.9" fill="#FFFFFF" />
                <circle cx="60.5" cy="45.8" r="0.9" fill="#FFFFFF" />
                <!-- Confident Smirk -->
                <path d="M45 57 Q51 61 56 57" fill="none" stroke="#C2185B" stroke-width="2" stroke-linecap="round" />
            </svg>`
        },
        {
            id: 'chef-kabir',
            name: 'Chef Kabir',
            title: 'Hot Line & Steam Master',
            category: 'staff',
            tagline: 'Expert in high-capacity bulk cooking and temperature control.',
            bgColors: ['#96FBC4', '#F9F586'],
            accentColor: '#2E7D32',
            svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="bg-kabir" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#11998E" />
                        <stop offset="100%" stop-color="#38EF7D" />
                    </linearGradient>
                </defs>
                <!-- Background Circle -->
                <circle cx="50" cy="50" r="48" fill="url(#bg-kabir)" />
                <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2" />
                
                <!-- Shoulders & Dark Green Chef Uniform -->
                <path d="M22 92 C24 74 38 70 50 70 C62 70 76 74 78 92 Z" fill="#1B5E20" />
                <path d="M44 70 L50 78 L56 70 Z" fill="#C8E6C9" />
                <!-- Neck -->
                <path d="M43 60 H57 V72 H43 Z" fill="#D7A177" />
                <!-- Short Dark Hair -->
                <circle cx="50" cy="34" r="24" fill="#212121" />
                <!-- Face -->
                <ellipse cx="50" cy="49" rx="19" ry="20" fill="#E0AC84" />
                <!-- Ears -->
                <circle cx="30" cy="49" r="4.5" fill="#D7A177" />
                <circle cx="70" cy="49" r="4.5" fill="#D7A177" />
                <!-- Hair Line -->
                <path d="M30 38 C35 28 65 28 70 38 C62 34 58 35 50 35 C42 35 38 34 30 38 Z" fill="#212121" />
                <!-- Neat Mustache & Goatee -->
                <path d="M42 56 Q50 59 58 56 Q50 53 42 56 Z" fill="#212121" />
                <circle cx="50" cy="62" r="2.5" fill="#212121" />
                <!-- Kind Twinkling Eyes -->
                <ellipse cx="41" cy="46" rx="3.2" ry="3.6" fill="#212121" />
                <ellipse cx="59" cy="46" rx="3.2" ry="3.6" fill="#212121" />
                <circle cx="42" cy="44.8" r="1.1" fill="#FFFFFF" />
                <circle cx="60" cy="44.8" r="1.1" fill="#FFFFFF" />
                <!-- Eyebrows -->
                <path d="M36 40 Q41 37 46 40" fill="none" stroke="#212121" stroke-width="2.2" stroke-linecap="round" />
                <path d="M54 40 Q59 37 64 40" fill="none" stroke="#212121" stroke-width="2.2" stroke-linecap="round" />
                <!-- Warm Smile -->
                <path d="M44 57 Q50 61 56 57" fill="none" stroke="#B71C1C" stroke-width="2" stroke-linecap="round" />
            </svg>`
        },
        {
            id: 'sam-delivery',
            name: 'Sam Wilson',
            title: 'Logistics & Dispatch Hero',
            category: 'staff',
            tagline: 'Speeds verified surplus food to partner shelters safely.',
            bgColors: ['#667EEA', '#764BA2'],
            accentColor: '#3949AB',
            svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="bg-sam" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#5B86E5" />
                        <stop offset="100%" stop-color="#36D1DC" />
                    </linearGradient>
                </defs>
                <!-- Background Circle -->
                <circle cx="50" cy="50" r="48" fill="url(#bg-sam)" />
                <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2" />
                
                <!-- Shoulders / Sporty Crew Tee -->
                <path d="M22 92 C24 74 38 70 50 70 C62 70 76 74 78 92 Z" fill="#1565C0" />
                <path d="M43 70 Q50 76 57 70 Z" fill="#FFDBAC" />
                <!-- Neck -->
                <path d="M43 60 H57 V72 H43 Z" fill="#FFDBAC" />
                <!-- Face -->
                <ellipse cx="50" cy="50" rx="19" ry="20" fill="#FFE0BD" />
                <!-- Ears -->
                <circle cx="30" cy="50" r="4.5" fill="#FFDBAC" />
                <circle cx="70" cy="50" r="4.5" fill="#FFDBAC" />
                <!-- Backwards Baseball Cap -->
                <path d="M28 42 C30 26 70 26 72 42 Z" fill="#283593" />
                <path d="M24 42 C24 38 76 38 76 42 Z" fill="#1A237E" />
                <ellipse cx="50" cy="42" rx="24" ry="4" fill="#3949AB" />
                <!-- Small Bangs peaking out -->
                <path d="M34 42 C36 46 40 45 42 42" stroke="#5D4037" stroke-width="2" fill="none" />
                <!-- Energetic Bright Eyes -->
                <ellipse cx="41" cy="49" rx="3.4" ry="4" fill="#1A237E" />
                <ellipse cx="59" cy="49" rx="3.4" ry="4" fill="#1A237E" />
                <circle cx="42" cy="47.5" r="1.3" fill="#FFFFFF" />
                <circle cx="60" cy="47.5" r="1.3" fill="#FFFFFF" />
                <!-- Confident Open Grin -->
                <path d="M43 57 Q50 65 57 57 Z" fill="#D32F2F" />
                <path d="M45 57 Q50 59 55 57 Z" fill="#FFFFFF" />
                <circle cx="36" cy="55" r="3.5" fill="#FF8A80" opacity="0.6" />
                <circle cx="64" cy="55" r="3.5" fill="#FF8A80" opacity="0.6" />
            </svg>`
        }
    ];

    // Core Avatar System Controller
    const FoodSafeAvatars = {
        catalog: AVATAR_CATALOG,

        /**
         * Get all available avatars or filter by category ('all', 'staff', 'mascot')
         */
        getAll(category = 'all') {
            if (!category || category === 'all') return this.catalog;
            return this.catalog.filter(a => a.category === category);
        },

        /**
         * Find avatar by unique ID
         */
        getById(id) {
            if (!id) return this.catalog[0];
            const found = this.catalog.find(a => a.id === id);
            return found || this.catalog[0];
        },

        /**
         * Get the current active user's avatar ID and object
         */
        getCurrent() {
            let session = {};
            try {
                if (typeof FoodSafe !== 'undefined' && FoodSafe.getSession) {
                    session = FoodSafe.getSession() || {};
                } else {
                    const raw = localStorage.getItem('foodsafe_user_session');
                    if (raw) session = JSON.parse(raw);
                }
            } catch (e) {
                console.error('Error getting current avatar', e);
            }

            const currentId = session.avatarId || 'chef-mia';
            const avatarObj = this.getById(currentId);
            return {
                ...avatarObj,
                customUrl: session.avatarCustomUrl || null,
                isCustom: Boolean(session.avatarCustomUrl)
            };
        },

        /**
         * Render avatar SVG or Custom Image markup at a given pixel size
         */
        renderAvatarMarkup(avatarIdOrObj, size = 48, className = '') {
            let avatar = typeof avatarIdOrObj === 'string' ? this.getById(avatarIdOrObj) : (avatarIdOrObj || this.catalog[0]);
            
            // Check if current user has custom photo upload
            if (typeof avatarIdOrObj === 'string' && avatarIdOrObj === 'custom') {
                const current = this.getCurrent();
                if (current.customUrl) {
                    return `<div class="foodsafe-avatar-rendered ${className}" style="width:${size}px; height:${size}px; border-radius:50%; overflow:hidden; display:inline-flex; align-items:center; justify-content:center; flex-shrink:0;">
                        <img src="${current.customUrl}" alt="User Avatar" style="width:100%; height:100%; object-fit:cover;" />
                    </div>`;
                }
            }

            return `<div class="foodsafe-avatar-rendered ${className}" style="width:${size}px; height:${size}px; border-radius:50%; overflow:hidden; display:inline-flex; align-items:center; justify-content:center; flex-shrink:0; position:relative;">
                ${avatar.svg}
            </div>`;
        },

        /**
         * Set & persist new avatar for user session
         */
        setAvatar(avatarId, customUrl = null) {
            try {
                let session = {};
                if (typeof FoodSafe !== 'undefined' && FoodSafe.getSession) {
                    session = FoodSafe.getSession() || {};
                } else {
                    const raw = localStorage.getItem('foodsafe_user_session');
                    if (raw) session = JSON.parse(raw);
                }

                session.avatarId = avatarId;
                session.avatarCustomUrl = customUrl;

                if (typeof FoodSafe !== 'undefined' && FoodSafe.setSession) {
                    FoodSafe.setSession(session);
                } else {
                    localStorage.setItem('foodsafe_user_session', JSON.stringify(session));
                }

                // Dispatch global event for live UI synchronization
                window.dispatchEvent(new CustomEvent('foodsafe-avatar-change', {
                    detail: { avatarId, customUrl, avatar: this.getById(avatarId) }
                }));

                // Auto-sync all avatar elements on the active page
                this.syncAllAvatars();

                if (typeof FoodSafe !== 'undefined' && FoodSafe.toast) {
                    const chosen = this.getById(avatarId);
                    FoodSafe.toast(`Profile avatar updated to ${chosen.name}!`, 'success');
                }

                return session;
            } catch (e) {
                console.error('Error saving avatar', e);
            }
        },

        /**
         * Synchronize all avatar elements across the DOM
         */
        syncAllAvatars() {
            const current = this.getCurrent();
            
            // 1. Header User Avatar
            const headerAvatar = document.getElementById('headerUserAvatar') || 
                                 document.getElementById('summaryUserAvatar') || 
                                 document.getElementById('forecastUserAvatar');
            if (headerAvatar) {
                if (current.customUrl) {
                    headerAvatar.innerHTML = `<img src="${current.customUrl}" alt="Avatar" style="width:100%; height:100%; border-radius:50%; object-fit:cover;" />`;
                    headerAvatar.style.background = 'transparent';
                } else {
                    headerAvatar.innerHTML = current.svg;
                    headerAvatar.style.background = 'transparent';
                    headerAvatar.style.padding = '0';
                }
            }

            // 2. Any dedicated avatar preview widgets on the page
            const previewContainers = document.querySelectorAll('.foodsafe-avatar-sync-target');
            previewContainers.forEach(el => {
                const size = parseInt(el.getAttribute('data-avatar-size') || '48', 10);
                if (current.customUrl) {
                    el.innerHTML = `<img src="${current.customUrl}" alt="Avatar" style="width:${size}px; height:${size}px; border-radius:50%; object-fit:cover;" />`;
                } else {
                    el.innerHTML = this.renderAvatarMarkup(current.id, size);
                }
            });

            // 3. Update any display names / badges if present
            const avatarNameEls = document.querySelectorAll('.foodsafe-avatar-name-target');
            avatarNameEls.forEach(el => {
                el.textContent = current.name;
            });
        },

        /**
         * Open the Full Modern Interactive Avatar Picker Modal
         */
        openPicker(options = {}) {
            const current = this.getCurrent();
            let selectedId = current.id;
            let activeCategory = 'all';

            // Remove existing modal if any
            const existing = document.getElementById('foodsafe-avatar-modal');
            if (existing) existing.remove();

            // Create Modal DOM
            const modal = document.createElement('div');
            modal.id = 'foodsafe-avatar-modal';
            modal.className = 'foodsafe-avatar-modal-overlay';
            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-modal', 'true');
            modal.setAttribute('aria-labelledby', 'avatarModalTitle');

            modal.innerHTML = `
                <div class="foodsafe-avatar-modal-card">
                    
                    <!-- Header -->
                    <div class="avatar-modal-header">
                        <div class="avatar-modal-title-group">
                            <div class="avatar-modal-icon-badge">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            </div>
                            <div>
                                <h2 id="avatarModalTitle" class="avatar-modal-title" style="color: #ffffff !important;">Choose Your Kitchen Avatar</h2>
                                <p class="avatar-modal-subtitle">Select a colorful cartoon character or food mascot to represent your kitchen</p>
                            </div>
                        </div>
                        <button type="button" class="avatar-modal-close-btn" id="btnCloseAvatarModal" aria-label="Close modal" title="Close">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    <!-- Category Filter Tabs & Quick Actions -->
                    <div class="avatar-modal-toolbar">
                        <div class="avatar-filter-pills" role="tablist">
                            <button type="button" class="avatar-pill active" data-cat="all">All Characters (16)</button>
                            <button type="button" class="avatar-pill" data-cat="staff">Kitchen Staff &amp; Chefs (8)</button>
                            <button type="button" class="avatar-pill" data-cat="mascot">Food Heroes &amp; Mascots (8)</button>
                        </div>
                        <div class="avatar-toolbar-actions">
                            <button type="button" class="avatar-tool-btn" id="btnSurpriseAvatar" title="Roll a random avatar">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                                <span>Surprise Me</span>
                            </button>
                            <label class="avatar-tool-btn avatar-upload-label" title="Upload custom photo">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                                <span>Upload Photo</span>
                                <input type="file" id="customAvatarFileInput" accept="image/*" style="display:none;" />
                            </label>
                        </div>
                    </div>

                    <!-- Main Grid & Preview Split -->
                    <div class="avatar-modal-body">
                        
                        <!-- 4x4 Responsive Grid -->
                        <div class="avatar-grid-container" id="avatarGridContainer">
                            <!-- Cards dynamically rendered here -->
                        </div>

                        <!-- Live Selected Preview Sidebar / Panel -->
                        <div class="avatar-preview-panel" id="avatarPreviewPanel">
                            <div class="avatar-preview-badge" id="avatarPreviewGlow">
                                <div class="avatar-preview-circle" id="avatarPreviewCircle">
                                    <!-- Big 80px SVG rendered here -->
                                </div>
                                <div class="avatar-preview-check-badge">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                                </div>
                            </div>
                            <div class="avatar-preview-info">
                                <span class="avatar-preview-role-pill" id="avatarPreviewCategory">Kitchen Staff</span>
                                <h3 class="avatar-preview-name" id="avatarPreviewName">Chef Mia</h3>
                                <p class="avatar-preview-title" id="avatarPreviewTitle">Head Kitchen Manager</p>
                                <p class="avatar-preview-tagline" id="avatarPreviewTagline">Passionate about culinary excellence and zero waste.</p>
                            </div>
                        </div>

                    </div>

                    <!-- Footer Action Bar -->
                    <div class="avatar-modal-footer">
                        <div class="avatar-modal-footer-hint">
                            <span class="pulse-indicator"></span>
                            <span>Selected avatar synchronizes instantly across all kitchen screens.</span>
                        </div>
                        <div class="avatar-modal-footer-btns">
                            <button type="button" class="btn-cancel-modal" id="btnCancelAvatar">Cancel</button>
                            <button type="button" class="btn-apply-avatar" id="btnApplyAvatar">
                                <span>Apply Avatar</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                            </button>
                        </div>
                    </div>

                </div>
            `;

            document.body.appendChild(modal);

            // Function to render grid items based on category
            const renderGrid = (category = 'all') => {
                const container = document.getElementById('avatarGridContainer');
                if (!container) return;
                
                const list = this.getAll(category);
                container.innerHTML = list.map(item => {
                    const isSelected = item.id === selectedId;
                    return `
                        <button type="button" class="avatar-grid-item ${isSelected ? 'selected' : ''}" data-avatar-id="${item.id}" title="${item.name} - ${item.title}">
                            <div class="avatar-item-circle">
                                ${item.svg}
                            </div>
                            <div class="avatar-item-active-check">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                            </div>
                        </button>
                    `;
                }).join('');

                // Attach click listeners to grid cards
                container.querySelectorAll('.avatar-grid-item').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const id = btn.getAttribute('data-avatar-id');
                        selectedId = id;
                        container.querySelectorAll('.avatar-grid-item').forEach(b => b.classList.remove('selected'));
                        btn.classList.add('selected');
                        updatePreview(id);
                    });
                });
            };

            // Function to update preview panel
            const updatePreview = (id, customUrl = null) => {
                const circle = document.getElementById('avatarPreviewCircle');
                const nameEl = document.getElementById('avatarPreviewName');
                const titleEl = document.getElementById('avatarPreviewTitle');
                const tagEl = document.getElementById('avatarPreviewTagline');
                const catEl = document.getElementById('avatarPreviewCategory');

                if (customUrl) {
                    if (circle) circle.innerHTML = `<img src="${customUrl}" alt="Custom" style="width:100%; height:100%; border-radius:50%; object-fit:cover;" />`;
                    if (nameEl) nameEl.textContent = 'Custom Photo';
                    if (titleEl) titleEl.textContent = 'Uploaded Kitchen Avatar';
                    if (tagEl) tagEl.textContent = 'Custom manager profile photo.';
                    if (catEl) {
                        catEl.textContent = 'Custom Photo';
                        catEl.style.background = 'rgba(24,127,135,0.15)';
                    }
                    return;
                }

                const item = this.getById(id);
                if (circle) circle.innerHTML = item.svg;
                if (nameEl) nameEl.textContent = item.name;
                if (titleEl) titleEl.textContent = item.title;
                if (tagEl) tagEl.textContent = item.tagline;
                if (catEl) {
                    catEl.textContent = item.category === 'staff' ? 'Kitchen Staff' : 'Food Mascot';
                    catEl.style.background = item.category === 'staff' ? 'rgba(24,127,135,0.15)' : 'rgba(234,179,8,0.18)';
                    catEl.style.color = item.category === 'staff' ? 'var(--primary)' : '#b45309';
                }
            };

            // Category Tab Clicks
            modal.querySelectorAll('.avatar-pill').forEach(pill => {
                pill.addEventListener('click', () => {
                    modal.querySelectorAll('.avatar-pill').forEach(p => p.classList.remove('active'));
                    pill.classList.add('active');
                    const cat = pill.getAttribute('data-cat');
                    activeCategory = cat;
                    renderGrid(cat);
                });
            });

            // Surprise Me / Randomizer Button
            const surpriseBtn = document.getElementById('btnSurpriseAvatar');
            if (surpriseBtn) {
                surpriseBtn.addEventListener('click', () => {
                    const all = this.getAll('all');
                    const filtered = all.filter(a => a.id !== selectedId);
                    const random = filtered[Math.floor(Math.random() * filtered.length)];
                    selectedId = random.id;
                    
                    // Switch tab to 'all' if not already
                    modal.querySelectorAll('.avatar-pill').forEach(p => {
                        if (p.getAttribute('data-cat') === 'all') p.classList.add('active');
                        else p.classList.remove('active');
                    });
                    renderGrid('all');
                    updatePreview(random.id);

                    // Add bounce animation
                    const circle = document.getElementById('avatarPreviewCircle');
                    if (circle) {
                        circle.classList.remove('avatar-bounce');
                        void circle.offsetWidth;
                        circle.classList.add('avatar-bounce');
                    }
                });
            }

            // Custom Photo Upload
            const fileInput = document.getElementById('customAvatarFileInput');
            if (fileInput) {
                fileInput.addEventListener('change', (e) => {
                    const file = e.target.files && e.target.files[0];
                    if (!file) return;
                    if (!file.type.startsWith('image/')) {
                        alert('Please select a valid image file (PNG, JPG, WebP).');
                        return;
                    }
                    if (file.size > 2 * 1024 * 1024) {
                        alert('Please select an image smaller than 2MB.');
                        return;
                    }
                    const reader = new FileReader();
                    reader.onload = (evt) => {
                        const dataUrl = evt.target.result;
                        modal._customDataUrl = dataUrl;
                        selectedId = 'custom';
                        updatePreview('custom', dataUrl);
                    };
                    reader.readAsDataURL(file);
                });
            }

            // Apply Button
            const applyBtn = document.getElementById('btnApplyAvatar');
            if (applyBtn) {
                applyBtn.addEventListener('click', () => {
                    if (selectedId === 'custom' && modal._customDataUrl) {
                        FoodSafeAvatars.setAvatar('custom', modal._customDataUrl);
                    } else {
                        FoodSafeAvatars.setAvatar(selectedId, null);
                    }
                    modal.classList.add('closing');
                    setTimeout(() => modal.remove(), 220);
                    if (options.onSelect) options.onSelect(selectedId);
                });
            }

            // Close & Cancel Buttons
            const closeBtn = document.getElementById('btnCloseAvatarModal');
            const cancelBtn = document.getElementById('btnCancelAvatar');
            const closeModal = () => {
                modal.classList.add('closing');
                setTimeout(() => modal.remove(), 220);
            };
            if (closeBtn) closeBtn.addEventListener('click', closeModal);
            if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });

            // Initial render
            renderGrid('all');
            updatePreview(selectedId);
        }
    };

    // Auto-initialize on load
    document.addEventListener('DOMContentLoaded', () => {
        FoodSafeAvatars.syncAllAvatars();
    });

    window.addEventListener('foodsafe-avatar-change', () => {
        FoodSafeAvatars.syncAllAvatars();
    });

    // Expose globally
    global.FoodSafeAvatars = FoodSafeAvatars;

})(typeof window !== 'undefined' ? window : this);
