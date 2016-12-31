# Script to clean the JMdict_e data for JavaScript

# Replace special entity codes with true meaning
sed -i "s/&MA;/martial arts term/g" JMdict_e
sed -i "s/&X;/rude or X-rated term (not displayed in educational software)/g" JMdict_e
sed -i "s/&abbr;/abbreviation/g" JMdict_e
sed -i "s/&adj-i;/adjective (keiyoushi)/g" JMdict_e
sed -i "s/&adj-ix;/adjective (keiyoushi) - yoi-SLASH-ii class/g" JMdict_e
sed -i "s/&adj-na;/adjectival nouns or quasi-adjectives (keiyodoshi)/g" JMdict_e
sed -i "s/&adj-no;/nouns which may take the genitive case particle 'no'/g" JMdict_e
sed -i "s/&adj-pn;/pre-noun adjectival (rentaishi)/g" JMdict_e
sed -i "s/&adj-t;/'taru' adjective/g" JMdict_e
sed -i "s/&adj-f;/noun or verb acting prenominally/g" JMdict_e
sed -i "s/&adv;/adverb (fukushi)/g" JMdict_e
sed -i "s/&adv-to;/adverb taking the 'to' particle/g" JMdict_e
sed -i "s/&arch;/archaism/g" JMdict_e
sed -i "s/&ateji;/ateji (phonetic) reading/g" JMdict_e
sed -i "s/&aux;/auxiliary/g" JMdict_e
sed -i "s/&aux-v;/auxiliary verb/g" JMdict_e
sed -i "s/&aux-adj;/auxiliary adjective/g" JMdict_e
sed -i "s/&Buddh;/Buddhist term/g" JMdict_e
sed -i "s/&chem;/chemistry term/g" JMdict_e
sed -i "s/&chn;/children's language/g" JMdict_e
sed -i "s/&col;/colloquialism/g" JMdict_e
sed -i "s/&comp;/computer terminology/g" JMdict_e
sed -i "s/&conj;/conjunction/g" JMdict_e
sed -i "s/&cop-da;/copula/g" JMdict_e
sed -i "s/&ctr;/counter/g" JMdict_e
sed -i "s/&derog;/derogatory/g" JMdict_e
sed -i "s/&eK;/exclusively kanji/g" JMdict_e
sed -i "s/&ek;/exclusively kana/g" JMdict_e
sed -i "s/&exp;/expressions (phrases, clauses, etc.)/g" JMdict_e
sed -i "s/&fam;/familiar language/g" JMdict_e
sed -i "s/&fem;/female term or language/g" JMdict_e
sed -i "s/&food;/food term/g" JMdict_e
sed -i "s/&geom;/geometry term/g" JMdict_e
sed -i "s/&gikun;/gikun (meaning as reading) or jukujikun (special kanji reading)/g" JMdict_e
sed -i "s/&hon;/honorific or respectful (sonkeigo) language/g" JMdict_e
sed -i "s/&hum;/humble (kenjougo) language/g" JMdict_e
sed -i "s/&iK;/word containing irregular kanji usage/g" JMdict_e
sed -i "s/&id;/idiomatic expression/g" JMdict_e
sed -i "s/&ik;/word containing irregular kana usage/g" JMdict_e
sed -i "s/&int;/interjection (kandoushi)/g" JMdict_e
sed -i "s/&io;/irregular okurigana usage/g" JMdict_e
sed -i "s/&iv;/irregular verb/g" JMdict_e
sed -i "s/&ling;/linguistics terminology/g" JMdict_e
sed -i "s/&m-sl;/manga slang/g" JMdict_e
sed -i "s/&male;/male term or language/g" JMdict_e
sed -i "s/&male-sl;/male slang/g" JMdict_e
sed -i "s/&math;/mathematics/g" JMdict_e
sed -i "s/&mil;/military/g" JMdict_e
sed -i "s/&n;/noun (common) (futsuumeishi)/g" JMdict_e
sed -i "s/&n-adv;/adverbial noun (fukushitekimeishi)/g" JMdict_e
sed -i "s/&n-suf;/noun, used as a suffix/g" JMdict_e
sed -i "s/&n-pref;/noun, used as a prefix/g" JMdict_e
sed -i "s/&n-t;/noun (temporal) (jisoumeishi)/g" JMdict_e
sed -i "s/&num;/numeric/g" JMdict_e
sed -i "s/&oK;/word containing out-dated kanji/g" JMdict_e
sed -i "s/&obs;/obsolete term/g" JMdict_e
sed -i "s/&obsc;/obscure term/g" JMdict_e
sed -i "s/&ok;/out-dated or obsolete kana usage/g" JMdict_e
sed -i "s/&oik;/old or irregular kana form/g" JMdict_e
sed -i "s/&on-mim;/onomatopoeic or mimetic word/g" JMdict_e
sed -i "s/&pn;/pronoun/g" JMdict_e
sed -i "s/&poet;/poetical term/g" JMdict_e
sed -i "s/&pol;/polite (teineigo) language/g" JMdict_e
sed -i "s/&pref;/prefix/g" JMdict_e
sed -i "s/&proverb;/proverb/g" JMdict_e
sed -i "s/&prt;/particle/g" JMdict_e
sed -i "s/&physics;/physics terminology/g" JMdict_e
sed -i "s/&rare;/rare/g" JMdict_e
sed -i "s/&sens;/sensitive/g" JMdict_e
sed -i "s/&sl;/slang/g" JMdict_e
sed -i "s/&suf;/suffix/g" JMdict_e
sed -i "s/&uK;/word usually written using kanji alone/g" JMdict_e
sed -i "s/&uk;/word usually written using kana alone/g" JMdict_e
sed -i "s/&unc;/unclassified/g" JMdict_e
sed -i "s/&yoji;/yojijukugo/g" JMdict_e
sed -i "s/&v1;/Ichidan verb/g" JMdict_e
sed -i "s/&v1-s;/Ichidan verb - kureru special class/g" JMdict_e
sed -i "s/&v2a-s;/Nidan verb with 'u' ending (archaic)/g" JMdict_e
sed -i "s/&v4h;/Yodan verb with 'hu-SLASH-fu' ending (archaic)/g" JMdict_e
sed -i "s/&v4r;/Yodan verb with 'ru' ending (archaic)/g" JMdict_e
sed -i "s/&v5aru;/Godan verb - -aru special class/g" JMdict_e
sed -i "s/&v5b;/Godan verb with 'bu' ending/g" JMdict_e
sed -i "s/&v5g;/Godan verb with 'gu' ending/g" JMdict_e
sed -i "s/&v5k;/Godan verb with 'ku' ending/g" JMdict_e
sed -i "s/&v5k-s;/Godan verb - Iku-SLASH-Yuku special class/g" JMdict_e
sed -i "s/&v5m;/Godan verb with 'mu' ending/g" JMdict_e
sed -i "s/&v5n;/Godan verb with 'nu' ending/g" JMdict_e
sed -i "s/&v5r;/Godan verb with 'ru' ending/g" JMdict_e
sed -i "s/&v5r-i;/Godan verb with 'ru' ending (irregular verb)/g" JMdict_e
sed -i "s/&v5s;/Godan verb with 'su' ending/g" JMdict_e
sed -i "s/&v5t;/Godan verb with 'tsu' ending/g" JMdict_e
sed -i "s/&v5u;/Godan verb with 'u' ending/g" JMdict_e
sed -i "s/&v5u-s;/Godan verb with 'u' ending (special class)/g" JMdict_e
sed -i "s/&v5uru;/Godan verb - Uru old class verb (old form of Eru)/g" JMdict_e
sed -i "s/&vz;/Ichidan verb - zuru verb (alternative form of -jiru verbs)/g" JMdict_e
sed -i "s/&vi;/intransitive verb/g" JMdict_e
sed -i "s/&vk;/Kuru verb - special class/g" JMdict_e
sed -i "s/&vn;/irregular nu verb/g" JMdict_e
sed -i "s/&vr;/irregular ru verb, plain form ends with -ri/g" JMdict_e
sed -i "s/&vs;/noun or participle which takes the aux. verb suru/g" JMdict_e
sed -i "s/&vs-c;/su verb - precursor to the modern suru/g" JMdict_e
sed -i "s/&vs-s;/suru verb - special class/g" JMdict_e
sed -i "s/&vs-i;/suru verb - irregular/g" JMdict_e
sed -i "s/&kyb;/Kyoto-ben/g" JMdict_e
sed -i "s/&osb;/Osaka-ben/g" JMdict_e
sed -i "s/&ksb;/Kansai-ben/g" JMdict_e
sed -i "s/&ktb;/Kantou-ben/g" JMdict_e
sed -i "s/&tsb;/Tosa-ben/g" JMdict_e
sed -i "s/&thb;/Touhoku-ben/g" JMdict_e
sed -i "s/&tsug;/Tsugaru-ben/g" JMdict_e
sed -i "s/&kyu;/Kyuushuu-ben/g" JMdict_e
sed -i "s/&rkb;/Ryuukyuu-ben/g" JMdict_e
sed -i "s/&nab;/Nagano-ben/g" JMdict_e
sed -i "s/&hob;/Hokkaido-ben/g" JMdict_e
sed -i "s/&vt;/transitive verb/g" JMdict_e
sed -i "s/&vulg;/vulgar expression or word/g" JMdict_e
sed -i "s/&adj-kari;/'kari' adjective (archaic)/g" JMdict_e
sed -i "s/&adj-ku;/'ku' adjective (archaic)/g" JMdict_e
sed -i "s/&adj-shiku;/'shiku' adjective (archaic)/g" JMdict_e
sed -i "s/&adj-nari;/archaic-SLASH-formal form of na-adjective/g" JMdict_e
sed -i "s/&n-pr;/proper noun/g" JMdict_e
sed -i "s/&v-unspec;/verb unspecified/g" JMdict_e
sed -i "s/&v4k;/Yodan verb with 'ku' ending (archaic)/g" JMdict_e
sed -i "s/&v4g;/Yodan verb with 'gu' ending (archaic)/g" JMdict_e
sed -i "s/&v4s;/Yodan verb with 'su' ending (archaic)/g" JMdict_e
sed -i "s/&v4t;/Yodan verb with 'tsu' ending (archaic)/g" JMdict_e
sed -i "s/&v4n;/Yodan verb with 'nu' ending (archaic)/g" JMdict_e
sed -i "s/&v4b;/Yodan verb with 'bu' ending (archaic)/g" JMdict_e
sed -i "s/&v4m;/Yodan verb with 'mu' ending (archaic)/g" JMdict_e
sed -i "s/&v2k-k;/Nidan verb (upper class) with 'ku' ending (archaic)/g" JMdict_e
sed -i "s/&v2g-k;/Nidan verb (upper class) with 'gu' ending (archaic)/g" JMdict_e
sed -i "s/&v2t-k;/Nidan verb (upper class) with 'tsu' ending (archaic)/g" JMdict_e
sed -i "s/&v2d-k;/Nidan verb (upper class) with 'dzu' ending (archaic)/g" JMdict_e
sed -i "s/&v2h-k;/Nidan verb (upper class) with 'hu-SLASH-fu' ending (archaic)/g" JMdict_e
sed -i "s/&v2b-k;/Nidan verb (upper class) with 'bu' ending (archaic)/g" JMdict_e
sed -i "s/&v2m-k;/Nidan verb (upper class) with 'mu' ending (archaic)/g" JMdict_e
sed -i "s/&v2y-k;/Nidan verb (upper class) with 'yu' ending (archaic)/g" JMdict_e
sed -i "s/&v2r-k;/Nidan verb (upper class) with 'ru' ending (archaic)/g" JMdict_e
sed -i "s/&v2k-s;/Nidan verb (lower class) with 'ku' ending (archaic)/g" JMdict_e
sed -i "s/&v2g-s;/Nidan verb (lower class) with 'gu' ending (archaic)/g" JMdict_e
sed -i "s/&v2s-s;/Nidan verb (lower class) with 'su' ending (archaic)/g" JMdict_e
sed -i "s/&v2z-s;/Nidan verb (lower class) with 'zu' ending (archaic)/g" JMdict_e
sed -i "s/&v2t-s;/Nidan verb (lower class) with 'tsu' ending (archaic)/g" JMdict_e
sed -i "s/&v2d-s;/Nidan verb (lower class) with 'dzu' ending (archaic)/g" JMdict_e
sed -i "s/&v2n-s;/Nidan verb (lower class) with 'nu' ending (archaic)/g" JMdict_e
sed -i "s/&v2h-s;/Nidan verb (lower class) with 'hu-SLASH-fu' ending (archaic)/g" JMdict_e
sed -i "s/&v2b-s;/Nidan verb (lower class) with 'bu' ending (archaic)/g" JMdict_e
sed -i "s/&v2m-s;/Nidan verb (lower class) with 'mu' ending (archaic)/g" JMdict_e
sed -i "s/&v2y-s;/Nidan verb (lower class) with 'yu' ending (archaic)/g" JMdict_e
sed -i "s/&v2r-s;/Nidan verb (lower class) with 'ru' ending (archaic)/g" JMdict_e
sed -i "s/&v2w-s;/Nidan verb (lower class) with 'u' ending and 'we' conjugation (archaic)/g" JMdict_e
sed -i "s/&archit;/architecture term/g" JMdict_e
sed -i "s/&astron;/astronomy, etc. term/g" JMdict_e
sed -i "s/&baseb;/baseball term/g" JMdict_e
sed -i "s/&biol;/biology term/g" JMdict_e
sed -i "s/&bot;/botany term/g" JMdict_e
sed -i "s/&bus;/business term/g" JMdict_e
sed -i "s/&econ;/economics term/g" JMdict_e
sed -i "s/&engr;/engineering term/g" JMdict_e
sed -i "s/&finc;/finance term/g" JMdict_e
sed -i "s/&geol;/geology, etc. term/g" JMdict_e
sed -i "s/&law;/law, etc. term/g" JMdict_e
sed -i "s/&mahj;/mahjong term/g" JMdict_e
sed -i "s/&med;/medicine, etc. term/g" JMdict_e
sed -i "s/&music;/music term/g" JMdict_e
sed -i "s/&Shinto;/Shinto term/g" JMdict_e
sed -i "s/&shogi;/shogi term/g" JMdict_e
sed -i "s/&sports;/sports term/g" JMdict_e
sed -i "s/&sumo;/sumo term/g" JMdict_e
sed -i "s/&zool;/zoology term/g" JMdict_e
sed -i "s/&joc;/jocular, humorous term/g" JMdict_e
sed -i "s/&anat;/anatomical term/g" JMdict_e

# Replace escape characters
sed -i "s/&amp;/and/g" JMdict_e
sed -i "s/&lt;/lt/g" JMdict_e
sed -i "s/&gt;/gt/g" JMdict_e
# Finally, remove any straggling semicolons used for grammatical reasons
sed -i "s/;/,/g" JMdict_e
