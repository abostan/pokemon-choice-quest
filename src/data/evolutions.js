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
  // Eevee → Espeon (giorno) / Umbreon (notte): unica evoluzione con una vera
  // condizione avanzata reale (ciclo giorno/notte) invece della soglia di
  // livello equivalente usata per tutte le altre — vedi il caso speciale in
  // checkEvolution() più sotto, che ignora evolvesTo per questo id specifico
  // e decide dinamicamente in base all'ora reale del sistema.
  133:{ evolvesAt: 36, evolvesTo: 196 },
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

  // --- Gen 5 Starter ---
  495:{ evolvesAt: 17, evolvesTo: 496 }, // Snivy      → Servine
  496:{ evolvesAt: 36, evolvesTo: 497 }, // Servine    → Serperior
  498:{ evolvesAt: 17, evolvesTo: 499 }, // Tepig      → Pignite
  499:{ evolvesAt: 36, evolvesTo: 500 }, // Pignite    → Emboar
  501:{ evolvesAt: 17, evolvesTo: 502 }, // Oshawott   → Dewott
  502:{ evolvesAt: 36, evolvesTo: 503 }, // Dewott     → Samurott

  // --- Gen 5 selvatici/avversari ---
  504:{ evolvesAt: 20, evolvesTo: 505 }, // Patrat     → Watchog
  506:{ evolvesAt: 16, evolvesTo: 507 }, // Lillipup   → Herdier
  507:{ evolvesAt: 32, evolvesTo: 508 }, // Herdier    → Stoutland
  509:{ evolvesAt: 20, evolvesTo: 510 }, // Purrloin   → Liepard
  511:{ evolvesAt: 36, evolvesTo: 512 }, // Pansage    → Simisage
  513:{ evolvesAt: 36, evolvesTo: 514 }, // Pansear    → Simisear
  515:{ evolvesAt: 36, evolvesTo: 516 }, // Panpour    → Simipour
  517:{ evolvesAt: 36, evolvesTo: 518 }, // Munna      → Musharna
  519:{ evolvesAt: 21, evolvesTo: 520 }, // Pidove     → Tranquill
  520:{ evolvesAt: 32, evolvesTo: 521 }, // Tranquill  → Unfezant
  522:{ evolvesAt: 27, evolvesTo: 523 }, // Blitzle    → Zebstrika
  524:{ evolvesAt: 25, evolvesTo: 525 }, // Roggenrola → Boldore
  525:{ evolvesAt: 36, evolvesTo: 526 }, // Boldore    → Gigalith
  527:{ evolvesAt: 20, evolvesTo: 528 }, // Woobat     → Swoobat
  529:{ evolvesAt: 31, evolvesTo: 530 }, // Drilbur    → Excadrill
  532:{ evolvesAt: 25, evolvesTo: 533 }, // Timburr    → Gurdurr
  533:{ evolvesAt: 36, evolvesTo: 534 }, // Gurdurr    → Conkeldurr
  535:{ evolvesAt: 25, evolvesTo: 536 }, // Tympole    → Palpitoad
  536:{ evolvesAt: 36, evolvesTo: 537 }, // Palpitoad  → Seismitoad
  540:{ evolvesAt: 20, evolvesTo: 541 }, // Sewaddle   → Swadloon
  541:{ evolvesAt: 30, evolvesTo: 542 }, // Swadloon   → Leavanny
  543:{ evolvesAt: 22, evolvesTo: 544 }, // Venipede   → Whirlipede
  544:{ evolvesAt: 30, evolvesTo: 545 }, // Whirlipede → Scolipede
  546:{ evolvesAt: 36, evolvesTo: 547 }, // Cottonee   → Whimsicott
  548:{ evolvesAt: 36, evolvesTo: 549 }, // Petilil    → Lilligant
  551:{ evolvesAt: 29, evolvesTo: 552 }, // Sandile    → Krokorok
  552:{ evolvesAt: 40, evolvesTo: 553 }, // Krokorok   → Krookodile
  554:{ evolvesAt: 35, evolvesTo: 555 }, // Darumaka   → Darmanitan
  557:{ evolvesAt: 34, evolvesTo: 558 }, // Dwebble    → Crustle
  559:{ evolvesAt: 39, evolvesTo: 560 }, // Scraggy    → Scrafty
  562:{ evolvesAt: 34, evolvesTo: 563 }, // Yamask     → Cofagrigus
  564:{ evolvesAt: 37, evolvesTo: 565 }, // Tirtouga   → Carracosta
  566:{ evolvesAt: 37, evolvesTo: 567 }, // Archen     → Archeops
  568:{ evolvesAt: 36, evolvesTo: 569 }, // Trubbish   → Garbodor
  570:{ evolvesAt: 30, evolvesTo: 571 }, // Zorua      → Zoroark
  572:{ evolvesAt: 36, evolvesTo: 573 }, // Minccino   → Cinccino
  574:{ evolvesAt: 32, evolvesTo: 575 }, // Gothita    → Gothorita
  575:{ evolvesAt: 41, evolvesTo: 576 }, // Gothorita  → Gothitelle
  577:{ evolvesAt: 32, evolvesTo: 578 }, // Solosis    → Duosion
  578:{ evolvesAt: 41, evolvesTo: 579 }, // Duosion    → Reuniclus
  580:{ evolvesAt: 35, evolvesTo: 581 }, // Ducklett   → Swanna
  582:{ evolvesAt: 35, evolvesTo: 583 }, // Vanillite  → Vanillish
  583:{ evolvesAt: 47, evolvesTo: 584 }, // Vanillish  → Vanilluxe
  585:{ evolvesAt: 34, evolvesTo: 586 }, // Deerling   → Sawsbuck
  588:{ evolvesAt: 36, evolvesTo: 589 }, // Karrablast → Escavalier
  590:{ evolvesAt: 39, evolvesTo: 591 }, // Foongus    → Amoonguss
  592:{ evolvesAt: 40, evolvesTo: 593 }, // Frillish   → Jellicent
  595:{ evolvesAt: 36, evolvesTo: 596 }, // Joltik     → Galvantula
  597:{ evolvesAt: 40, evolvesTo: 598 }, // Ferroseed  → Ferrothorn
  599:{ evolvesAt: 38, evolvesTo: 600 }, // Klink      → Klang
  600:{ evolvesAt: 49, evolvesTo: 601 }, // Klang      → Klinklang
  602:{ evolvesAt: 39, evolvesTo: 603 }, // Tynamo     → Eelektrik
  603:{ evolvesAt: 48, evolvesTo: 604 }, // Eelektrik  → Eelektross
  605:{ evolvesAt: 42, evolvesTo: 606 }, // Elgyem     → Beheeyem
  607:{ evolvesAt: 41, evolvesTo: 608 }, // Litwick    → Lampent
  608:{ evolvesAt: 50, evolvesTo: 609 }, // Lampent    → Chandelure
  610:{ evolvesAt: 38, evolvesTo: 611 }, // Axew       → Fraxure
  611:{ evolvesAt: 48, evolvesTo: 612 }, // Fraxure    → Haxorus
  613:{ evolvesAt: 37, evolvesTo: 614 }, // Cubchoo    → Beartic
  616:{ evolvesAt: 36, evolvesTo: 617 }, // Shelmet    → Accelgor
  619:{ evolvesAt: 50, evolvesTo: 620 }, // Mienfoo    → Mienshao
  622:{ evolvesAt: 43, evolvesTo: 623 }, // Golett     → Golurk
  624:{ evolvesAt: 52, evolvesTo: 625 }, // Pawniard   → Bisharp
  627:{ evolvesAt: 54, evolvesTo: 628 }, // Rufflet    → Braviary
  629:{ evolvesAt: 54, evolvesTo: 630 }, // Vullaby    → Mandibuzz
  633:{ evolvesAt: 50, evolvesTo: 634 }, // Deino      → Zweilous
  634:{ evolvesAt: 64, evolvesTo: 635 }, // Zweilous   → Hydreigon
  636:{ evolvesAt: 59, evolvesTo: 637 }, // Larvesta   → Volcarona

  // --- Gen 6 Starter ---
  650:{ evolvesAt: 16, evolvesTo: 651 }, // Chespin    → Quilladin
  651:{ evolvesAt: 36, evolvesTo: 652 }, // Quilladin  → Chesnaught
  653:{ evolvesAt: 16, evolvesTo: 654 }, // Fennekin   → Braixen
  654:{ evolvesAt: 36, evolvesTo: 655 }, // Braixen    → Delphox
  656:{ evolvesAt: 16, evolvesTo: 657 }, // Froakie    → Frogadier
  657:{ evolvesAt: 36, evolvesTo: 658 }, // Frogadier  → Greninja

  // --- Gen 6 selvatici/avversari ---
  659:{ evolvesAt: 20, evolvesTo: 660 }, // Bunnelby   → Diggersby
  661:{ evolvesAt: 17, evolvesTo: 662 }, // Fletchling → Fletchinder
  662:{ evolvesAt: 35, evolvesTo: 663 }, // Fletchinder→ Talonflame
  664:{ evolvesAt: 9,  evolvesTo: 665 }, // Scatterbug → Spewpa
  665:{ evolvesAt: 12, evolvesTo: 666 }, // Spewpa     → Vivillon
  667:{ evolvesAt: 35, evolvesTo: 668 }, // Litleo     → Pyroar
  669:{ evolvesAt: 19, evolvesTo: 670 }, // Flabébé    → Floette
  670:{ evolvesAt: 36, evolvesTo: 671 }, // Floette    → Florges
  672:{ evolvesAt: 32, evolvesTo: 673 }, // Skiddo     → Gogoat
  674:{ evolvesAt: 32, evolvesTo: 675 }, // Pancham    → Pangoro
  677:{ evolvesAt: 25, evolvesTo: 678 }, // Espurr     → Meowstic
  679:{ evolvesAt: 35, evolvesTo: 680 }, // Honedge    → Doublade
  680:{ evolvesAt: 45, evolvesTo: 681 }, // Doublade   → Aegislash
  682:{ evolvesAt: 36, evolvesTo: 683 }, // Spritzee   → Aromatisse
  684:{ evolvesAt: 36, evolvesTo: 685 }, // Swirlix    → Slurpuff
  686:{ evolvesAt: 30, evolvesTo: 687 }, // Inkay      → Malamar
  688:{ evolvesAt: 39, evolvesTo: 689 }, // Binacle    → Barbaracle
  690:{ evolvesAt: 48, evolvesTo: 691 }, // Skrelp     → Dragalge
  692:{ evolvesAt: 37, evolvesTo: 693 }, // Clauncher  → Clawitzer
  694:{ evolvesAt: 36, evolvesTo: 695 }, // Helioptile → Heliolisk
  696:{ evolvesAt: 39, evolvesTo: 697 }, // Tyrunt     → Tyrantrum
  698:{ evolvesAt: 39, evolvesTo: 699 }, // Amaura     → Aurorus
  704:{ evolvesAt: 40, evolvesTo: 705 }, // Goomy      → Sliggoo
  705:{ evolvesAt: 50, evolvesTo: 706 }, // Sliggoo    → Goodra
  708:{ evolvesAt: 36, evolvesTo: 709 }, // Phantump   → Trevenant
  710:{ evolvesAt: 36, evolvesTo: 711 }, // Pumpkaboo  → Gourgeist
  712:{ evolvesAt: 37, evolvesTo: 713 }, // Bergmite   → Avalugg
  714:{ evolvesAt: 48, evolvesTo: 715 }, // Noibat     → Noivern

  // --- Gen 7 Starter & Specie ---
  722:{ evolvesAt: 17, evolvesTo: 723 }, // Rowlet     → Dartrix
  723:{ evolvesAt: 34, evolvesTo: 724 }, // Dartrix    → Decidueye
  725:{ evolvesAt: 17, evolvesTo: 726 }, // Litten     → Torracat
  726:{ evolvesAt: 34, evolvesTo: 727 }, // Torracat   → Incineroar
  728:{ evolvesAt: 17, evolvesTo: 729 }, // Popplio    → Brionne
  729:{ evolvesAt: 34, evolvesTo: 730 }, // Brionne    → Primarina
  731:{ evolvesAt: 14, evolvesTo: 732 }, // Pikipek    → Trumbeak
  732:{ evolvesAt: 28, evolvesTo: 733 }, // Trumbeak   → Toucannon
  734:{ evolvesAt: 20, evolvesTo: 735 }, // Yungoos    → Gumshoos
  736:{ evolvesAt: 20, evolvesTo: 737 }, // Grubbin    → Charjabug
  737:{ evolvesAt: 36, evolvesTo: 738 }, // Charjabug  → Vikavolt
  739:{ evolvesAt: 36, evolvesTo: 740 }, // Crabrawler → Crabominable
  742:{ evolvesAt: 25, evolvesTo: 743 }, // Cutiefly   → Ribombee
  744:{ evolvesAt: 25, evolvesTo: 745 }, // Rockruff   → Lycanroc
  746:{ evolvesAt: 20, evolvesTo: 747 }, // Wishiwashi → School Form
  747:{ evolvesAt: 38, evolvesTo: 748 }, // Mareanie   → Toxapex
  749:{ evolvesAt: 30, evolvesTo: 750 }, // Mudbray    → Mudsdale
  751:{ evolvesAt: 22, evolvesTo: 752 }, // Dewpider   → Araquanid
  753:{ evolvesAt: 34, evolvesTo: 754 }, // Fomantis   → Lurantis
  755:{ evolvesAt: 24, evolvesTo: 756 }, // Morelull   → Shiinotic
  757:{ evolvesAt: 33, evolvesTo: 758 }, // Salandit   → Salazzle
  759:{ evolvesAt: 27, evolvesTo: 760 }, // Stufful    → Bewear
  761:{ evolvesAt: 18, evolvesTo: 762 }, // Bounsweet  → Steenee
  762:{ evolvesAt: 28, evolvesTo: 763 }, // Steenee    → Tsareena
  766:{ evolvesAt: 36, evolvesTo: 767 }, // Passimian  → Oranguru
  769:{ evolvesAt: 42, evolvesTo: 770 }, // Sandygast  → Palossand
  782:{ evolvesAt: 35, evolvesTo: 783 }, // Jangmo-o   → Hakamo-o
  783:{ evolvesAt: 45, evolvesTo: 784 }, // Hakamo-o   → Kommo-o

  // --- Gen 8 Starter & Specie ---
  810:{ evolvesAt: 16, evolvesTo: 811 }, // Grookey    → Thwackey
  811:{ evolvesAt: 35, evolvesTo: 812 }, // Thwackey   → Rillaboom
  813:{ evolvesAt: 16, evolvesTo: 814 }, // Scorbunny  → Raboot
  814:{ evolvesAt: 35, evolvesTo: 815 }, // Raboot     → Cinderace
  816:{ evolvesAt: 16, evolvesTo: 817 }, // Sobble     → Drizzile
  817:{ evolvesAt: 35, evolvesTo: 818 }, // Drizzile   → Inteleon
  819:{ evolvesAt: 24, evolvesTo: 820 }, // Skwovet    → Greedent
  821:{ evolvesAt: 18, evolvesTo: 822 }, // Rookidee   → Corvisquire
  822:{ evolvesAt: 38, evolvesTo: 823 }, // Corvisquire→ Corviknight
  824:{ evolvesAt: 10, evolvesTo: 825 }, // Blipbug    → Dottler
  825:{ evolvesAt: 30, evolvesTo: 826 }, // Dottler    → Orbeetle
  827:{ evolvesAt: 18, evolvesTo: 828 }, // Nickit     → Thievul
  829:{ evolvesAt: 20, evolvesTo: 830 }, // Gossifleur → Eldegoss
  831:{ evolvesAt: 24, evolvesTo: 832 }, // Wooloo     → Dubwool
  833:{ evolvesAt: 22, evolvesTo: 834 }, // Chewtle    → Drednaw
  835:{ evolvesAt: 25, evolvesTo: 836 }, // Yamper     → Boltund
  837:{ evolvesAt: 18, evolvesTo: 838 }, // Rolycoly   → Carkol
  838:{ evolvesAt: 34, evolvesTo: 839 }, // Carkol     → Coalossal
  840:{ evolvesAt: 30, evolvesTo: 841 }, // Applin     → Flapple
  843:{ evolvesAt: 36, evolvesTo: 844 }, // Silicobra  → Sandaconda
  846:{ evolvesAt: 26, evolvesTo: 847 }, // Arrokuda   → Barraskewda
  848:{ evolvesAt: 30, evolvesTo: 849 }, // Toxel      → Toxtricity
  850:{ evolvesAt: 28, evolvesTo: 851 }, // Sizzlipede → Centiskorch
  852:{ evolvesAt: 30, evolvesTo: 853 }, // Clobbopus  → Grapploct
  856:{ evolvesAt: 32, evolvesTo: 857 }, // Hatenna    → Hattrem
  857:{ evolvesAt: 42, evolvesTo: 858 }, // Hattrem    → Hatterene
  859:{ evolvesAt: 32, evolvesTo: 860 }, // Impidimp   → Morgrem
  860:{ evolvesAt: 42, evolvesTo: 861 }, // Morgrem    → Grimmsnarl
  868:{ evolvesAt: 30, evolvesTo: 869 }, // Milcery    → Alcremie
  872:{ evolvesAt: 42, evolvesTo: 873 }, // Snom       → Frosmoth
  885:{ evolvesAt: 50, evolvesTo: 886 }, // Dreepy     → Drakloak
  886:{ evolvesAt: 60, evolvesTo: 887 }, // Drakloak   → Dragapult

  // --- Gen 9 Starter & Specie ---
  906:{ evolvesAt: 16, evolvesTo: 907 }, // Sprigatito → Floragato
  907:{ evolvesAt: 36, evolvesTo: 908 }, // Floragato  → Meowscarada
  909:{ evolvesAt: 16, evolvesTo: 910 }, // Fuecoco    → Crocalor
  910:{ evolvesAt: 36, evolvesTo: 911 }, // Crocalor   → Skeledirge
  912:{ evolvesAt: 16, evolvesTo: 913 }, // Quaxly     → Quaxwell
  913:{ evolvesAt: 36, evolvesTo: 914 }, // Quaxwell   → Quaquaval
  915:{ evolvesAt: 18, evolvesTo: 916 }, // Lechonk    → Oinkologne
  917:{ evolvesAt: 15, evolvesTo: 918 }, // Tarountula → Spidops
  919:{ evolvesAt: 24, evolvesTo: 920 }, // Nymble     → Lokix
  921:{ evolvesAt: 18, evolvesTo: 922 }, // Pawmi      → Pawmo
  922:{ evolvesAt: 32, evolvesTo: 923 }, // Pawmo      → Pawmot
  926:{ evolvesAt: 26, evolvesTo: 927 }, // Fidough    → Dachsbun
  928:{ evolvesAt: 25, evolvesTo: 929 }, // Smoliv     → Dolliv
  929:{ evolvesAt: 35, evolvesTo: 930 }, // Dolliv     → Arboliva
  932:{ evolvesAt: 24, evolvesTo: 933 }, // Nacli      → Naclstack
  933:{ evolvesAt: 38, evolvesTo: 934 }, // Naclstack  → Garganacl
  935:{ evolvesAt: 30, evolvesTo: 936 }, // Charcadet  → Armarouge
  938:{ evolvesAt: 30, evolvesTo: 939 }, // Tadbulb    → Bellibolt
  940:{ evolvesAt: 26, evolvesTo: 941 }, // Wattrel    → Kilowattrel
  942:{ evolvesAt: 30, evolvesTo: 943 }, // Maschiff   → Mabosstiff
  944:{ evolvesAt: 28, evolvesTo: 945 }, // Shroodle   → Grafaiai
  948:{ evolvesAt: 30, evolvesTo: 949 }, // Toedscool  → Toedscruel
  953:{ evolvesAt: 35, evolvesTo: 954 }, // Rellor     → Rabsca
  955:{ evolvesAt: 30, evolvesTo: 956 }, // Flittle    → Espathra
  957:{ evolvesAt: 24, evolvesTo: 958 }, // Tinkatink  → Tinkatuff
  958:{ evolvesAt: 38, evolvesTo: 959 }, // Tinkatuff  → Tinkaton
  963:{ evolvesAt: 24, evolvesTo: 964 }, // Finizen    → Palafin
  968:{ evolvesAt: 40, evolvesTo: 969 }, // Varoom     → Revavroom
  971:{ evolvesAt: 30, evolvesTo: 972 }, // Greavard   → Houndstone
  974:{ evolvesAt: 40, evolvesTo: 975 }, // Cetoddle   → Cetitan
  996:{ evolvesAt: 35, evolvesTo: 997 }, // Frigibax   → Arctibax
  997:{ evolvesAt: 54, evolvesTo: 998 }, // Arctibax   → Baxcalibur


};

const EEVEE_ID = 133;
const ESPEON_ID = 196;
const UMBREON_ID = 197;

/**
 * Risolve la destinazione di evoluzione di Eevee in base all'ora reale del
 * sistema: Espeon di giorno (6:00-17:59), Umbreon di notte — l'unica
 * condizione di evoluzione "avanzata" reale implementata in questo gioco
 * (tutte le altre, pietre/scambio/amicizia, restano semplificate a soglie
 * di livello equivalenti per design, vedi commento in cima al file).
 * @param {Date} now iniettabile per i test
 */
export function resolveEeveeEvolution(now = new Date()) {
  const hour = now.getHours();
  return hour >= 6 && hour < 18 ? ESPEON_ID : UMBREON_ID;
}

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
  if (!evo || pokemon.level < evo.evolvesAt) return pokemon;

  if (pokemon.id === EEVEE_ID) {
    return { ...pokemon, id: resolveEeveeEvolution(), evolvedFrom: pokemon.id };
  }

  if (evo.evolvesTo !== pokemon.id) {
    return { ...pokemon, id: evo.evolvesTo, evolvedFrom: pokemon.id };
  }
  return pokemon;
}
