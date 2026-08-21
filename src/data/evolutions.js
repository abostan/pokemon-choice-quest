// Evoluzioni semplificate a soglie di livello per tutte le specie
// presenti nelle generazioni Kanto e Johto implementate.
// Le evoluzioni con condizioni speciali (pietre, scambio, amicizia) sono
// mappate a un livello-soglia equivalente per mantenere il gameplay narrativo.

export const EVOLUTIONS = {
  // --- Gen 1 Starter ---
  1:  { evolvesAt: 16, evolvesTo: 2   }, // Bulbasaur  → Ivysaur
  2:  { evolvesAt: 32, evolvesTo: 3   }, // Ivysaur    → Venusaur
  4:  { evolvesAt: 16, evolvesTo: 5   }, // Charmander → Charmeleon
  5:  { evolvesAt: 36, evolvesTo: 6   }, // Charmeleon → Charizard
  7:  { evolvesAt: 16, evolvesTo: 8   }, // Squirtle   → Wartortle
  8:  { evolvesAt: 36, evolvesTo: 9   }, // Wartortle  → Blastoise

  // --- Gen 1 selvatici/avversari ---
  10: { evolvesAt: 7,  evolvesTo: 11  }, // Caterpie   → Metapod
  11: { evolvesAt: 10, evolvesTo: 12  }, // Metapod    → Butterfree
  13: { evolvesAt: 7,  evolvesTo: 14  }, // Weedle     → Kakuna
  14: { evolvesAt: 10, evolvesTo: 15  }, // Kakuna     → Beedrill
  16: { evolvesAt: 18, evolvesTo: 17  }, // Pidgey     → Pidgeotto
  17: { evolvesAt: 36, evolvesTo: 18  }, // Pidgeotto  → Pidgeot
  19: { evolvesAt: 20, evolvesTo: 20  }, // Rattata    → Raticate
  21: { evolvesAt: 20, evolvesTo: 22  }, // Spearow    → Fearow
  23: { evolvesAt: 22, evolvesTo: 24  }, // Ekans      → Arbok
  25: { evolvesAt: 26, evolvesTo: 26  }, // Pikachu    → Raichu  (pietra tuono → lv26)
  27: { evolvesAt: 22, evolvesTo: 28  }, // Sandshrew  → Sandslash
  29: { evolvesAt: 16, evolvesTo: 30  }, // Nidoran♀  → Nidorina
  30: { evolvesAt: 36, evolvesTo: 31  }, // Nidorina   → Nidoqueen (pietra luna → lv36)
  32: { evolvesAt: 16, evolvesTo: 33  }, // Nidoran♂  → Nidorino
  33: { evolvesAt: 36, evolvesTo: 34  }, // Nidorino   → Nidoking (pietra luna → lv36)
  35: { evolvesAt: 36, evolvesTo: 36  }, // Clefairy   → Clefable (pietra luna → lv36)
  37: { evolvesAt: 36, evolvesTo: 38  }, // Vulpix     → Ninetales (pietra fuoco → lv36)
  39: { evolvesAt: 36, evolvesTo: 40  }, // Jigglypuff → Wigglytuff (pietra luna → lv36)
  41: { evolvesAt: 22, evolvesTo: 42  }, // Zubat      → Golbat
  43: { evolvesAt: 21, evolvesTo: 44  }, // Oddish     → Gloom
  44: { evolvesAt: 36, evolvesTo: 45  }, // Gloom      → Vileplume (pietra foglia → lv36)
  46: { evolvesAt: 24, evolvesTo: 47  }, // Paras      → Parasect
  48: { evolvesAt: 31, evolvesTo: 49  }, // Venonat    → Venomoth
  50: { evolvesAt: 26, evolvesTo: 51  }, // Diglett    → Dugtrio
  52: { evolvesAt: 28, evolvesTo: 53  }, // Meowth     → Persian
  54: { evolvesAt: 33, evolvesTo: 55  }, // Psyduck    → Golduck
  56: { evolvesAt: 28, evolvesTo: 57  }, // Mankey     → Primeape
  58: { evolvesAt: 36, evolvesTo: 59  }, // Growlithe  → Arcanine (pietra fuoco → lv36)
  60: { evolvesAt: 25, evolvesTo: 61  }, // Poliwag    → Poliwhirl
  61: { evolvesAt: 36, evolvesTo: 62  }, // Poliwhirl  → Poliwrath (pietra acqua → lv36)
  63: { evolvesAt: 16, evolvesTo: 64  }, // Abra       → Kadabra
  64: { evolvesAt: 36, evolvesTo: 65  }, // Kadabra    → Alakazam (scambio → lv36)
  66: { evolvesAt: 28, evolvesTo: 67  }, // Machop     → Machoke
  67: { evolvesAt: 36, evolvesTo: 68  }, // Machoke    → Machamp (scambio → lv36)
  69: { evolvesAt: 21, evolvesTo: 70  }, // Bellsprout → Weepinbell
  70: { evolvesAt: 36, evolvesTo: 71  }, // Weepinbell → Victreebel (pietra foglia → lv36)
  72: { evolvesAt: 30, evolvesTo: 73  }, // Tentacool  → Tentacruel
  74: { evolvesAt: 25, evolvesTo: 75  }, // Geodude    → Graveler
  75: { evolvesAt: 36, evolvesTo: 76  }, // Graveler   → Golem (scambio → lv36)
  77: { evolvesAt: 40, evolvesTo: 78  }, // Ponyta     → Rapidash
  79: { evolvesAt: 37, evolvesTo: 80  }, // Slowpoke   → Slowbro
  81: { evolvesAt: 30, evolvesTo: 82  }, // Magnemite  → Magneton
  84: { evolvesAt: 31, evolvesTo: 85  }, // Doduo      → Dodrio
  86: { evolvesAt: 34, evolvesTo: 87  }, // Seel       → Dewgong
  88: { evolvesAt: 38, evolvesTo: 89  }, // Grimer     → Muk
  90: { evolvesAt: 36, evolvesTo: 91  }, // Shellder   → Cloyster (pietra acqua → lv36)
  92: { evolvesAt: 25, evolvesTo: 93  }, // Gastly     → Haunter
  93: { evolvesAt: 36, evolvesTo: 94  }, // Haunter    → Gengar (scambio → lv36)
  95: { evolvesAt: 36, evolvesTo: 208 }, // Onix       → Steelix (scambio+oggetto → lv36) [cross-gen]
  98: { evolvesAt: 28, evolvesTo: 99  }, // Krabby     → Kingler
  100:{ evolvesAt: 30, evolvesTo: 101 }, // Voltorb    → Electrode
  102:{ evolvesAt: 36, evolvesTo: 103 }, // Exeggcute  → Exeggutor (pietra foglia → lv36)
  104:{ evolvesAt: 28, evolvesTo: 105 }, // Cubone     → Marowak
  106:{ evolvesAt: 36, evolvesTo: 106 }, // Hitmonlee  (forma finale)
  107:{ evolvesAt: 36, evolvesTo: 107 }, // Hitmonchan (forma finale)
  108:{ evolvesAt: 36, evolvesTo: 108 }, // Lickitung  (forma finale)
  109:{ evolvesAt: 35, evolvesTo: 110 }, // Koffing    → Weezing
  111:{ evolvesAt: 42, evolvesTo: 112 }, // Rhyhorn    → Rhydon
  114:{ evolvesAt: 36, evolvesTo: 114 }, // Tangela    (forma finale)
  116:{ evolvesAt: 32, evolvesTo: 117 }, // Horsea     → Seadra
  117:{ evolvesAt: 36, evolvesTo: 230 }, // Seadra     → Kingdra (cross-gen, scambio → lv36)
  118:{ evolvesAt: 33, evolvesTo: 119 }, // Goldeen    → Seaking
  120:{ evolvesAt: 36, evolvesTo: 121 }, // Staryu     → Starmie (pietra acqua → lv36)
  123:{ evolvesAt: 36, evolvesTo: 123 }, // Scyther    (forma finale — Scizor cross-gen non incluso)
  124:{ evolvesAt: 36, evolvesTo: 124 }, // Jynx       (forma finale)
  125:{ evolvesAt: 36, evolvesTo: 125 }, // Electabuzz (forma finale)
  126:{ evolvesAt: 36, evolvesTo: 126 }, // Magmar     (forma finale)
  127:{ evolvesAt: 36, evolvesTo: 127 }, // Pinsir     (forma finale)
  128:{ evolvesAt: 36, evolvesTo: 128 }, // Tauros     (forma finale)
  129:{ evolvesAt: 20, evolvesTo: 130 }, // Magikarp   → Gyarados
  131:{ evolvesAt: 36, evolvesTo: 131 }, // Lapras     (forma finale)
  133:{ evolvesAt: 36, evolvesTo: 136 }, // Eevee      → Flareon (semplificato: fuoco)
  134:{ evolvesAt: 36, evolvesTo: 134 }, // Vaporeon   (forma finale)
  135:{ evolvesAt: 36, evolvesTo: 135 }, // Jolteon    (forma finale)
  136:{ evolvesAt: 36, evolvesTo: 136 }, // Flareon    (forma finale)

  // --- Gen 2 Starter ---
  152:{ evolvesAt: 16, evolvesTo: 153 }, // Chikorita  → Bayleef
  153:{ evolvesAt: 32, evolvesTo: 154 }, // Bayleef    → Meganium
  155:{ evolvesAt: 14, evolvesTo: 156 }, // Cyndaquil  → Quilava
  156:{ evolvesAt: 36, evolvesTo: 157 }, // Quilava    → Typhlosion
  158:{ evolvesAt: 18, evolvesTo: 159 }, // Totodile   → Croconaw
  159:{ evolvesAt: 30, evolvesTo: 160 }, // Croconaw   → Feraligatr

  // --- Gen 2 selvatici/avversari ---
  161:{ evolvesAt: 15, evolvesTo: 162 }, // Sentret    → Furret
  163:{ evolvesAt: 20, evolvesTo: 164 }, // Hoothoot   → Noctowl
  165:{ evolvesAt: 18, evolvesTo: 166 }, // Ledyba     → Ledian
  167:{ evolvesAt: 22, evolvesTo: 168 }, // Spinarak   → Ariados
  169:{ evolvesAt: 36, evolvesTo: 169 }, // Crobat     (forma finale — Golbat→Crobat amicizia → lv36)
  170:{ evolvesAt: 27, evolvesTo: 171 }, // Chinchou   → Lanturn
  172:{ evolvesAt: 26, evolvesTo: 25  }, // Pichu      → Pikachu (amicizia → lv26)
  173:{ evolvesAt: 36, evolvesTo: 35  }, // Cleffa     → Clefairy (amicizia → lv36)
  174:{ evolvesAt: 36, evolvesTo: 39  }, // Igglybuff  → Jigglypuff (amicizia → lv36)
  175:{ evolvesAt: 36, evolvesTo: 176 }, // Togepi     → Togetic (amicizia → lv36)
  177:{ evolvesAt: 25, evolvesTo: 178 }, // Natu       → Xatu
  179:{ evolvesAt: 15, evolvesTo: 180 }, // Mareep     → Flaaffy
  180:{ evolvesAt: 30, evolvesTo: 181 }, // Flaaffy    → Ampharos
  182:{ evolvesAt: 36, evolvesTo: 182 }, // Bellossom  (forma finale)
  183:{ evolvesAt: 18, evolvesTo: 184 }, // Marill     → Azumarill
  185:{ evolvesAt: 36, evolvesTo: 185 }, // Sudowoodo  (forma finale)
  187:{ evolvesAt: 18, evolvesTo: 188 }, // Hoppip     → Skiploom
  188:{ evolvesAt: 27, evolvesTo: 189 }, // Skiploom   → Jumpluff
  190:{ evolvesAt: 36, evolvesTo: 190 }, // Aipom      (forma finale in Gen 2)
  191:{ evolvesAt: 18, evolvesTo: 192 }, // Sunkern    → Sunflora (pietra sole → lv18)
  193:{ evolvesAt: 36, evolvesTo: 193 }, // Yanma      (forma finale in Gen 2)
  194:{ evolvesAt: 20, evolvesTo: 195 }, // Wooper     → Quagsire
  196:{ evolvesAt: 36, evolvesTo: 196 }, // Espeon     (forma finale)
  197:{ evolvesAt: 36, evolvesTo: 197 }, // Umbreon    (forma finale)
  198:{ evolvesAt: 36, evolvesTo: 198 }, // Murkrow    (forma finale in Gen 2)
  199:{ evolvesAt: 36, evolvesTo: 199 }, // Slowking   (forma finale)
  200:{ evolvesAt: 36, evolvesTo: 200 }, // Misdreavus (forma finale in Gen 2)
  203:{ evolvesAt: 36, evolvesTo: 203 }, // Girafarig  (forma finale)
  204:{ evolvesAt: 31, evolvesTo: 205 }, // Pineco     → Forretress
  206:{ evolvesAt: 36, evolvesTo: 206 }, // Dunsparce  (forma finale)
  207:{ evolvesAt: 36, evolvesTo: 207 }, // Gligar     (forma finale in Gen 2)
  209:{ evolvesAt: 23, evolvesTo: 210 }, // Snubbull   → Granbull
  211:{ evolvesAt: 36, evolvesTo: 211 }, // Qwilfish   (forma finale)
  213:{ evolvesAt: 36, evolvesTo: 213 }, // Shuckle    (forma finale)
  214:{ evolvesAt: 36, evolvesTo: 214 }, // Heracross  (forma finale)
  215:{ evolvesAt: 36, evolvesTo: 215 }, // Sneasel    (forma finale in Gen 2)
  216:{ evolvesAt: 30, evolvesTo: 217 }, // Teddiursa  → Ursaring
  218:{ evolvesAt: 38, evolvesTo: 219 }, // Slugma     → Magcargo
  220:{ evolvesAt: 33, evolvesTo: 221 }, // Swinub     → Piloswine
  222:{ evolvesAt: 36, evolvesTo: 222 }, // Corsola    (forma finale)
  223:{ evolvesAt: 30, evolvesTo: 224 }, // Remoraid   → Octillery
  225:{ evolvesAt: 36, evolvesTo: 225 }, // Delibird   (forma finale)
  226:{ evolvesAt: 36, evolvesTo: 226 }, // Mantine    (forma finale)
  227:{ evolvesAt: 36, evolvesTo: 227 }, // Skarmory   (forma finale)
  228:{ evolvesAt: 24, evolvesTo: 229 }, // Houndour   → Houndoom
  231:{ evolvesAt: 25, evolvesTo: 232 }, // Phanpy     → Donphan
  234:{ evolvesAt: 36, evolvesTo: 234 }, // Stantler   (forma finale)
  235:{ evolvesAt: 36, evolvesTo: 235 }, // Smeargle   (forma finale)
  236:{ evolvesAt: 20, evolvesTo: 106 }, // Tyrogue    → Hitmonlee (semplificato)
  237:{ evolvesAt: 36, evolvesTo: 237 }, // Hitmontop  (forma finale)
  238:{ evolvesAt: 30, evolvesTo: 124 }, // Smoochum   → Jynx
  239:{ evolvesAt: 30, evolvesTo: 125 }, // Elekid     → Electabuzz
  240:{ evolvesAt: 30, evolvesTo: 126 }, // Magby      → Magmar
  241:{ evolvesAt: 36, evolvesTo: 241 }, // Miltank    (forma finale)
  246:{ evolvesAt: 30, evolvesTo: 247 }, // Larvitar   → Pupitar
  247:{ evolvesAt: 55, evolvesTo: 248 }, // Pupitar    → Tyranitar

  // --- Gen 3 Starter ---
  252:{ evolvesAt: 16, evolvesTo: 253 }, // Treecko    → Grovyle
  253:{ evolvesAt: 36, evolvesTo: 254 }, // Grovyle    → Sceptile
  255:{ evolvesAt: 16, evolvesTo: 256 }, // Torchic    → Combusken
  256:{ evolvesAt: 36, evolvesTo: 257 }, // Combusken  → Blaziken
  258:{ evolvesAt: 16, evolvesTo: 259 }, // Mudkip     → Marshtomp
  259:{ evolvesAt: 36, evolvesTo: 260 }, // Marshtomp   → Swampert

  // --- Gen 3 selvatici/avversari ---
  261:{ evolvesAt: 18, evolvesTo: 262 }, // Poochyena  → Mightyena
  263:{ evolvesAt: 20, evolvesTo: 264 }, // Zigzagoon  → Linoone
  265:{ evolvesAt: 7,  evolvesTo: 266 }, // Wurmple    → Silcoon
  266:{ evolvesAt: 10, evolvesTo: 267 }, // Silcoon    → Beautifly
  270:{ evolvesAt: 14, evolvesTo: 271 }, // Lotad      → Lombre
  271:{ evolvesAt: 36, evolvesTo: 272 }, // Lombre     → Ludicolo
  273:{ evolvesAt: 14, evolvesTo: 274 }, // Seedot     → Nuzleaf
  274:{ evolvesAt: 36, evolvesTo: 275 }, // Nuzleaf    → Shiftry
  276:{ evolvesAt: 22, evolvesTo: 277 }, // Taillow    → Swellow
  278:{ evolvesAt: 25, evolvesTo: 279 }, // Wingull    → Pelipper
  280:{ evolvesAt: 20, evolvesTo: 281 }, // Ralts      → Kirlia
  281:{ evolvesAt: 30, evolvesTo: 282 }, // Kirlia     → Gardevoir
  283:{ evolvesAt: 22, evolvesTo: 284 }, // Surskit    → Masquerain
  285:{ evolvesAt: 23, evolvesTo: 286 }, // Shroomish  → Breloom
  287:{ evolvesAt: 18, evolvesTo: 288 }, // Slakoth    → Vigoroth
  288:{ evolvesAt: 36, evolvesTo: 289 }, // Vigoroth   → Slaking
  290:{ evolvesAt: 20, evolvesTo: 291 }, // Nincada    → Ninjask
  293:{ evolvesAt: 20, evolvesTo: 294 }, // Whismur    → Loudred
  294:{ evolvesAt: 40, evolvesTo: 295 }, // Loudred    → Exploud
  296:{ evolvesAt: 24, evolvesTo: 297 }, // Makuhita   → Hariyama
  300:{ evolvesAt: 36, evolvesTo: 301 }, // Skitty     → Delcatty
  304:{ evolvesAt: 32, evolvesTo: 305 }, // Aron       → Lairon
  305:{ evolvesAt: 42, evolvesTo: 306 }, // Lairon     → Aggron
  307:{ evolvesAt: 37, evolvesTo: 308 }, // Meditite   → Medicham
  309:{ evolvesAt: 26, evolvesTo: 310 }, // Electrike  → Manectric
  318:{ evolvesAt: 30, evolvesTo: 319 }, // Carvanha   → Sharpedo
  320:{ evolvesAt: 40, evolvesTo: 321 }, // Wailmer    → Wailord
  322:{ evolvesAt: 33, evolvesTo: 323 }, // Numel      → Camerupt
  325:{ evolvesAt: 32, evolvesTo: 326 }, // Spoink     → Grumpig
  328:{ evolvesAt: 35, evolvesTo: 329 }, // Trapinch   → Vibrava
  329:{ evolvesAt: 45, evolvesTo: 330 }, // Vibrava    → Flygon
  331:{ evolvesAt: 32, evolvesTo: 332 }, // Cacnea     → Cacturne
  333:{ evolvesAt: 35, evolvesTo: 334 }, // Swablu     → Altaria
  339:{ evolvesAt: 30, evolvesTo: 340 }, // Barboach   → Whiscash
  341:{ evolvesAt: 30, evolvesTo: 342 }, // Corphish   → Crawdaunt
  343:{ evolvesAt: 36, evolvesTo: 344 }, // Baltoy     → Claydol
  345:{ evolvesAt: 40, evolvesTo: 346 }, // Lileep     → Cradily
  347:{ evolvesAt: 40, evolvesTo: 348 }, // Anorith    → Armaldo
  349:{ evolvesAt: 36, evolvesTo: 350 }, // Feebas     → Milotic
  353:{ evolvesAt: 37, evolvesTo: 354 }, // Shuppet    → Banette
  355:{ evolvesAt: 37, evolvesTo: 356 }, // Duskull    → Dusclops
  361:{ evolvesAt: 42, evolvesTo: 362 }, // Snorunt    → Glalie
  363:{ evolvesAt: 32, evolvesTo: 364 }, // Spheal     → Sealeo
  364:{ evolvesAt: 44, evolvesTo: 365 }, // Sealeo     → Walrein
  371:{ evolvesAt: 30, evolvesTo: 372 }, // Bagon      → Shelgon
  372:{ evolvesAt: 50, evolvesTo: 373 }, // Shelgon    → Salamence
  374:{ evolvesAt: 20, evolvesTo: 375 }, // Beldum     → Metang
  375:{ evolvesAt: 45, evolvesTo: 376 }, // Metang     → Metagross

  // --- Gen 4 Starter ---
  387:{ evolvesAt: 18, evolvesTo: 388 }, // Turtwig    → Grotle
  388:{ evolvesAt: 32, evolvesTo: 389 }, // Grotle     → Torterra
  390:{ evolvesAt: 14, evolvesTo: 391 }, // Chimchar   → Monferno
  391:{ evolvesAt: 36, evolvesTo: 392 }, // Monferno   → Infernape
  393:{ evolvesAt: 16, evolvesTo: 394 }, // Piplup     → Prinplup
  394:{ evolvesAt: 36, evolvesTo: 395 }, // Prinplup   → Empoleon

  // --- Gen 4 selvatici/avversari ---
  396:{ evolvesAt: 14, evolvesTo: 397 }, // Starly     → Staravia
  397:{ evolvesAt: 34, evolvesTo: 398 }, // Staravia   → Staraptor
  399:{ evolvesAt: 15, evolvesTo: 400 }, // Bidoof     → Bibarel
  401:{ evolvesAt: 10, evolvesTo: 402 }, // Kricketot  → Kricketune
  403:{ evolvesAt: 15, evolvesTo: 404 }, // Shinx      → Luxio
  404:{ evolvesAt: 30, evolvesTo: 405 }, // Luxio      → Luxray
  406:{ evolvesAt: 16, evolvesTo: 315 }, // Budew      → Roselia
  315:{ evolvesAt: 36, evolvesTo: 407 }, // Roselia    → Roserade
  408:{ evolvesAt: 30, evolvesTo: 409 }, // Cranidos   → Rampardos
  410:{ evolvesAt: 30, evolvesTo: 411 }, // Shieldon   → Bastiodon
  412:{ evolvesAt: 20, evolvesTo: 413 }, // Burmy      → Wormadam
  415:{ evolvesAt: 21, evolvesTo: 416 }, // Combee     → Vespiquen
  418:{ evolvesAt: 26, evolvesTo: 419 }, // Buizel     → Floatzel
  420:{ evolvesAt: 25, evolvesTo: 421 }, // Cherubi    → Cherrim
  422:{ evolvesAt: 30, evolvesTo: 423 }, // Shellos    → Gastrodon
  425:{ evolvesAt: 28, evolvesTo: 426 }, // Drifloon   → Drifblim
  427:{ evolvesAt: 26, evolvesTo: 428 }, // Buneary    → Lopunny
  431:{ evolvesAt: 38, evolvesTo: 432 }, // Glameow    → Purugly
  434:{ evolvesAt: 34, evolvesTo: 435 }, // Stunky     → Skuntank
  436:{ evolvesAt: 33, evolvesTo: 437 }, // Bronzor    → Bronzong
  438:{ evolvesAt: 16, evolvesTo: 185 }, // Bonsly     → Sudowoodo
  439:{ evolvesAt: 18, evolvesTo: 122 }, // Mime Jr.   → Mr. Mime
  440:{ evolvesAt: 16, evolvesTo: 113 }, // Happiny    → Chansey
  113:{ evolvesAt: 36, evolvesTo: 242 }, // Chansey    → Blissey
  443:{ evolvesAt: 24, evolvesTo: 444 }, // Gible      → Gabite
  444:{ evolvesAt: 48, evolvesTo: 445 }, // Gabite     → Garchomp
  446:{ evolvesAt: 30, evolvesTo: 143 }, // Munchlax   → Snorlax
  447:{ evolvesAt: 26, evolvesTo: 448 }, // Riolu      → Lucario
  449:{ evolvesAt: 34, evolvesTo: 450 }, // Hippopotas → Hippowdon
  451:{ evolvesAt: 40, evolvesTo: 452 }, // Skorupi    → Drapion
  453:{ evolvesAt: 37, evolvesTo: 454 }, // Croagunk   → Toxicroak
  456:{ evolvesAt: 31, evolvesTo: 457 }, // Finneon    → Lumineon
  458:{ evolvesAt: 20, evolvesTo: 226 }, // Mantyke    → Mantine
  459:{ evolvesAt: 40, evolvesTo: 460 }, // Snover     → Abomasnow
  356:{ evolvesAt: 42, evolvesTo: 477 }, // Dusclops   → Dusknoir

};

/**
 * Controlla se un Pokémon deve evolvere al livello attuale.
 * Restituisce il Pokémon aggiornato (con il nuovo id) se c'è un'evoluzione,
 * altrimenti restituisce lo stesso oggetto invariato.
 *
 * @param {{ id: number, level: number }} pokemon
 * @returns {{ id: number, level: number, evolvedFrom?: number }}
 */
export function checkEvolution(pokemon) {
  const evo = EVOLUTIONS[pokemon.id];
  if (evo && evo.evolvesTo !== pokemon.id && pokemon.level >= evo.evolvesAt) {
    return { ...pokemon, id: evo.evolvesTo, evolvedFrom: pokemon.id };
  }
  return pokemon;
}
