# Hvad kan jeg lave?

Lille PWA: tryk på en Minecraft-ting og se, hvad du kan crafte med den.

- Opskrifter: Switch/tablet-udgaven (Bedrock). Mojangs officielle opskriftsfiler (Mojang/bedrock-samples, 1.26.60) har forrang; opskrifter der er indbygget i spillet (senge, knapper, uldfarvning …) tages fra minecraft-data 1.21.11. Ting der kun findes på PC (spektralpil, minecart med ovn) er fjernet.
- Danske navne fra spillets sprogfil
- Billeder: spillets teksturer (fra InventivetalentDev/minecraft-assets) ligger i `tex/`
- Hosting: læg filerne i roden af et repo → Settings → Pages → Deploy from branch `main` / root
- "Brug den i verden"-kort: `tools/world.js` · data bygges med `tools/build.js`
- Højtlæsning: tryk på navne og kort (bruger tablettens egen tale-stemme)
