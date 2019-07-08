# Script to clean the JMdict_e data for JavaScript

# Replace special entity codes with true meaning
s/&MA;/martial arts term/g
s/&X;/rude or X-rated term (not displayed in educational software)/g
s/&abbr;/abbreviation/g
s/&adj-i;/adjective (keiyoushi)/g
s/&adj-ix;/adjective (keiyoushi) - yoi-SLASH-ii class/g
s/&adj-na;/adjectival nouns or quasi-adjectives (keiyodoshi)/g
s/&adj-no;/nouns which may take the genitive case particle 'no'/g
s/&adj-pn;/pre-noun adjectival (rentaishi)/g
s/&adj-t;/'taru' adjective/g
s/&adj-f;/noun or verb acting prenominally/g
s/&adv;/adverb (fukushi)/g
s/&adv-to;/adverb taking the 'to' particle/g
s/&arch;/archaism/g
s/&ateji;/ateji (phonetic) reading/g
s/&aux;/auxiliary/g
s/&aux-v;/auxiliary verb/g
s/&aux-adj;/auxiliary adjective/g
s/&Buddh;/Buddhist term/g
s/&chem;/chemistry term/g
s/&chn;/children's language/g
s/&col;/colloquialism/g
s/&comp;/computer terminology/g
s/&conj;/conjunction/g
s/&cop-da;/copula/g
s/&ctr;/counter/g
s/&derog;/derogatory/g
s/&eK;/exclusively kanji/g
s/&ek;/exclusively kana/g
s/&exp;/expressions (phrases, clauses, etc.)/g
s/&fam;/familiar language/g
s/&fem;/female term or language/g
s/&food;/food term/g
s/&geom;/geometry term/g
s/&gikun;/gikun (meaning as reading) or jukujikun (special kanji reading)/g
s/&hon;/honorific or respectful (sonkeigo) language/g
s/&hum;/humble (kenjougo) language/g
s/&iK;/word containing irregular kanji usage/g
s/&id;/idiomatic expression/g
s/&ik;/word containing irregular kana usage/g
s/&int;/interjection (kandoushi)/g
s/&io;/irregular okurigana usage/g
s/&iv;/irregular verb/g
s/&ling;/linguistics terminology/g
s/&m-sl;/manga slang/g
s/&male;/male term or language/g
s/&male-sl;/male slang/g
s/&math;/mathematics/g
s/&mil;/military/g
s/&n;/noun (common) (futsuumeishi)/g
s/&n-adv;/adverbial noun (fukushitekimeishi)/g
s/&n-suf;/noun, used as a suffix/g
s/&n-pref;/noun, used as a prefix/g
s/&n-t;/noun (temporal) (jisoumeishi)/g
s/&num;/numeric/g
s/&oK;/word containing out-dated kanji/g
s/&obs;/obsolete term/g
s/&obsc;/obscure term/g
s/&ok;/out-dated or obsolete kana usage/g
s/&oik;/old or irregular kana form/g
s/&on-mim;/onomatopoeic or mimetic word/g
s/&pn;/pronoun/g
s/&poet;/poetical term/g
s/&pol;/polite (teineigo) language/g
s/&pref;/prefix/g
s/&proverb;/proverb/g
s/&prt;/particle/g
s/&physics;/physics terminology/g
s/&rare;/rare/g
s/&sens;/sensitive/g
s/&sl;/slang/g
s/&suf;/suffix/g
s/&uK;/word usually written using kanji alone/g
s/&uk;/word usually written using kana alone/g
s/&unc;/unclassified/g
s/&yoji;/yojijukugo/g
s/&v1;/Ichidan verb/g
s/&v1-s;/Ichidan verb - kureru special class/g
s/&v2a-s;/Nidan verb with 'u' ending (archaic)/g
s/&v4h;/Yodan verb with 'hu-SLASH-fu' ending (archaic)/g
s/&v4r;/Yodan verb with 'ru' ending (archaic)/g
s/&v5aru;/Godan verb - -aru special class/g
s/&v5b;/Godan verb with 'bu' ending/g
s/&v5g;/Godan verb with 'gu' ending/g
s/&v5k;/Godan verb with 'ku' ending/g
s/&v5k-s;/Godan verb - Iku-SLASH-Yuku special class/g
s/&v5m;/Godan verb with 'mu' ending/g
s/&v5n;/Godan verb with 'nu' ending/g
s/&v5r;/Godan verb with 'ru' ending/g
s/&v5r-i;/Godan verb with 'ru' ending (irregular verb)/g
s/&v5s;/Godan verb with 'su' ending/g
s/&v5t;/Godan verb with 'tsu' ending/g
s/&v5u;/Godan verb with 'u' ending/g
s/&v5u-s;/Godan verb with 'u' ending (special class)/g
s/&v5uru;/Godan verb - Uru old class verb (old form of Eru)/g
s/&vz;/Ichidan verb - zuru verb (alternative form of -jiru verbs)/g
s/&vi;/intransitive verb/g
s/&vk;/Kuru verb - special class/g
s/&vn;/irregular nu verb/g
s/&vr;/irregular ru verb, plain form ends with -ri/g
s/&vs;/noun or participle which takes the aux. verb suru/g
s/&vs-c;/su verb - precursor to the modern suru/g
s/&vs-s;/suru verb - special class/g
s/&vs-i;/suru verb - irregular/g
s/&kyb;/Kyoto-ben/g
s/&osb;/Osaka-ben/g
s/&ksb;/Kansai-ben/g
s/&ktb;/Kantou-ben/g
s/&tsb;/Tosa-ben/g
s/&thb;/Touhoku-ben/g
s/&tsug;/Tsugaru-ben/g
s/&kyu;/Kyuushuu-ben/g
s/&rkb;/Ryuukyuu-ben/g
s/&nab;/Nagano-ben/g
s/&hob;/Hokkaido-ben/g
s/&vt;/transitive verb/g
s/&vulg;/vulgar expression or word/g
s/&adj-kari;/'kari' adjective (archaic)/g
s/&adj-ku;/'ku' adjective (archaic)/g
s/&adj-shiku;/'shiku' adjective (archaic)/g
s/&adj-nari;/archaic-SLASH-formal form of na-adjective/g
s/&n-pr;/proper noun/g
s/&v-unspec;/verb unspecified/g
s/&v4k;/Yodan verb with 'ku' ending (archaic)/g
s/&v4g;/Yodan verb with 'gu' ending (archaic)/g
s/&v4s;/Yodan verb with 'su' ending (archaic)/g
s/&v4t;/Yodan verb with 'tsu' ending (archaic)/g
s/&v4n;/Yodan verb with 'nu' ending (archaic)/g
s/&v4b;/Yodan verb with 'bu' ending (archaic)/g
s/&v4m;/Yodan verb with 'mu' ending (archaic)/g
s/&v2k-k;/Nidan verb (upper class) with 'ku' ending (archaic)/g
s/&v2g-k;/Nidan verb (upper class) with 'gu' ending (archaic)/g
s/&v2t-k;/Nidan verb (upper class) with 'tsu' ending (archaic)/g
s/&v2d-k;/Nidan verb (upper class) with 'dzu' ending (archaic)/g
s/&v2h-k;/Nidan verb (upper class) with 'hu-SLASH-fu' ending (archaic)/g
s/&v2b-k;/Nidan verb (upper class) with 'bu' ending (archaic)/g
s/&v2m-k;/Nidan verb (upper class) with 'mu' ending (archaic)/g
s/&v2y-k;/Nidan verb (upper class) with 'yu' ending (archaic)/g
s/&v2r-k;/Nidan verb (upper class) with 'ru' ending (archaic)/g
s/&v2k-s;/Nidan verb (lower class) with 'ku' ending (archaic)/g
s/&v2g-s;/Nidan verb (lower class) with 'gu' ending (archaic)/g
s/&v2s-s;/Nidan verb (lower class) with 'su' ending (archaic)/g
s/&v2z-s;/Nidan verb (lower class) with 'zu' ending (archaic)/g
s/&v2t-s;/Nidan verb (lower class) with 'tsu' ending (archaic)/g
s/&v2d-s;/Nidan verb (lower class) with 'dzu' ending (archaic)/g
s/&v2n-s;/Nidan verb (lower class) with 'nu' ending (archaic)/g
s/&v2h-s;/Nidan verb (lower class) with 'hu-SLASH-fu' ending (archaic)/g
s/&v2b-s;/Nidan verb (lower class) with 'bu' ending (archaic)/g
s/&v2m-s;/Nidan verb (lower class) with 'mu' ending (archaic)/g
s/&v2y-s;/Nidan verb (lower class) with 'yu' ending (archaic)/g
s/&v2r-s;/Nidan verb (lower class) with 'ru' ending (archaic)/g
s/&v2w-s;/Nidan verb (lower class) with 'u' ending and 'we' conjugation (archaic)/g
s/&archit;/architecture term/g
s/&astron;/astronomy, etc. term/g
s/&baseb;/baseball term/g
s/&biol;/biology term/g
s/&bot;/botany term/g
s/&bus;/business term/g
s/&econ;/economics term/g
s/&engr;/engineering term/g
s/&finc;/finance term/g
s/&geol;/geology, etc. term/g
s/&law;/law, etc. term/g
s/&mahj;/mahjong term/g
s/&med;/medicine, etc. term/g
s/&music;/music term/g
s/&Shinto;/Shinto term/g
s/&shogi;/shogi term/g
s/&sports;/sports term/g
s/&sumo;/sumo term/g
s/&zool;/zoology term/g
s/&joc;/jocular, humorous term/g
s/&anat;/anatomical term/g

# Replace escape characters
s/&amp;/and/g
s/&lt;/lt/g
s/&gt;/gt/g
# Finally, remove any straggling semicolons used for grammatical reasons
s/;/,/g

# Remove the ampersands
s/&//g
