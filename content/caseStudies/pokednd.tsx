import {
  CaseStudyHero,
  CaseStudySection,
  KeySystemsGrid,
  ScreenshotGrid,
  StackChips,
} from "@/components/CaseStudyLayout";
import {
  ArchitectureLayer,
  ArchitectureNode,
} from "@/components/Architecture";
import MermaidDiagram from "@/components/MermaidDiagram";
import type { CaseStudyMeta } from "./index";
import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiPrisma,
  SiPostgresql,
  SiTailwindcss,
  SiZod,
  SiFramer,
  SiSpotify,
  SiYoutube,
  SiDocker,
  SiRailway,
  SiVitest,
} from "react-icons/si";
import { TbBroadcast, TbShield } from "react-icons/tb";
import { FaDiceD20, FaTheaterMasks } from "react-icons/fa";
import { HiOutlineSpeakerWave } from "react-icons/hi2";

const PENDING_REACTION_SEQUENCE = `sequenceDiagram
    autonumber
    participant A as Attacker browser
    participant API as API route
    participant BSvc as Battle service
    participant DB as PostgreSQL
    participant Hub as battleHub
    participant D as Defender browser

    A->>API: POST /api/battle/attack
    API->>BSvc: resolveAttack(ctx)
    BSvc->>BSvc: hit check, roll damage context

    alt defender has valid reactions, pause pipeline
        BSvc->>DB: INSERT PendingReaction (status=PENDING, ctx JSON, expiresAt)
        BSvc->>Hub: broadcast("reaction:prompt")
        par fan-out (same payload, client gates UI)
            Hub-->>D: SSE reaction:prompt
        and
            Hub-->>A: SSE reaction:prompt
        end
        BSvc-->>API: outcome=PENDING_REACTION
        API-->>A: 200 PENDING_REACTION

        D->>D: picks Counter / Protect / pass

        D->>API: POST /api/battle/reaction (id, chosen move)
        API->>DB: SELECT PendingReaction WHERE id

        opt row.status === PENDING
            API->>DB: rehydrate modifiers by stored ids
            API->>BSvc: resolveAttack(ctx, reactionMove)
            BSvc->>DB: apply reaction, UPDATE HP, insert BattleEvent,<br>set status=CHOSEN (one txn)
            BSvc->>Hub: broadcast("battle:update")
            par fan-out
                Hub-->>A: SSE attack resolved
            and
                Hub-->>D: SSE attack resolved
            end
            API-->>D: 200 OK
        end
    end
`;

const BROADCAST_FILTERED = `flowchart LR
    Event[/"BattleEvent<br>{ type, channelId, payload }"/]

    subgraph Hub["battleHub<br><span style='opacity:0.6'>Map&lt;channelId, Set&lt;Subscriber&gt;&gt;</span>"]
        direction TB
        Iter["for each subscriber in channel"]
        Build["build(subscriber.ctx, event)"]
        Iter --> Build
    end

    Event --> Hub

    Build -->|"if role: DM"| DMP["full battle state<br>nothing hidden"]
    Build -->|"if role: PLAYER"| PP["own party state<br>visible enemy info only"]

    DMP ==>|"SSE"| DMC["DM browser"]
    PP ==>|"SSE"| PC["Player browsers"]
`;

const POKEDND_ARCHITECTURE = `flowchart TB
    %% === Clients (subgraph keeps them tight on top row) ===
    subgraph Clients[" Clients "]
        direction LR
        DM["DM"]
        Players["Players"]
        Owl["Owlbear Extension"]
    end

    %% === Next.js process (single Railway deployment) ===
    subgraph Server[" Next.js on Railway "]
        direction TB
        API["APIs / Server Actions"]

        subgraph Domain[" Domain services "]
            direction LR
            Auth["Auth Sync"]
            BSvc["Battle service"]
            OtherSvc["Other services"]
        end

        Rules["Rules engine / RuleHook"]
        Pend["PendingReaction"]
        Hubs["Realtime hubs<br>battle, music, roll, trade, catch"]
        Prisma["Prisma client"]
        SSE["SSE endpoints"]
    end

    %% === Data + External (floating, dagre places near callers) ===
    DB[("PostgreSQL")]
    OryDisc["Ory Cloud<br>Discord OIDC"]
    Spot["Spotify Web API"]
    YT["YouTube IFrame"]

    %% === Client → API (one-way; SSE return path lives in prose) ===
    DM ==>|"HTTPS / SSE"| API
    Players ==> API
    Owl ==>|"/api/owlbear"| API

    %% === API → Domain ===
    API --> Auth
    API --> BSvc
    API --> OtherSvc

    %% === Battle internals ===
    BSvc --> Rules
    BSvc --> Pend

    %% === Realtime fan-out (dotted = publish, not call) ===
    BSvc -.-> Hubs
    OtherSvc -.-> Hubs
    Hubs --> SSE

    %% === Persistence ===
    BSvc --> Prisma
    Pend --> Prisma
    OtherSvc --> Prisma
    Prisma -->|"SQL"| DB

    %% === External integrations ===
    Auth -->|"OIDC"| OryDisc
    API -->|"OAuth"| Spot
    OtherSvc -.->|"iframe"| YT
`;

export const meta: CaseStudyMeta = {
  title: "PokeDnD",
  description:
    "A Pokémon-themed tabletop RPG. A real-time multiplayer web app with a full battle engine.",
  ogImage: "/img/previews/pokednd.png",
  dateRange: "Sep 2025 - Present",
  tagline: "Pokémon combat running on top of D&D 5e.",
  primaryLink: { label: "Live site", href: "https://pokednd.live/" },
  heroPreviewClass: "preview-pokednd",
};

export default function PokeDnDCaseStudy() {
  return (
    <>
      <CaseStudyHero
        title={meta.title}
        tagline={meta.tagline}
        dateRange={meta.dateRange}
        primaryLink={meta.primaryLink}
        secondaryLink={meta.secondaryLink}
        previewClass={meta.heroPreviewClass}
        coverImage={{
          src: "/img/pokednd/home.png",
          alt: "PokeDnD landing page",
          width: 1600,
          height: 900,
        }}
      />

      <CaseStudySection title="Overview">
        <p>
          PokeDnD is a web app for running a Pokémon-themed D&amp;D 5e campaign at the
          table. It has a full Pokémon battle engine (type chart, abilities, items,
          weather, status conditions, mega and Z moves, reactions), shared character
          sheets, a 3D dice log, a synced music player, and an Owlbear Rodeo extension
          for the map. The DM and the players each get their own filtered view of
          every battle in real time.
        </p>
      </CaseStudySection>

      <CaseStudySection title="The problem">
        <p>
          The Pokémon battle system on its own has maybe 30 years of rules built up
          over time: type charts, abilities, items, weather, terrain, status
          conditions, multi-hit moves, reactions, mega and Z moves. On top of that, we
          wanted shared character sheets that the DM and the players could both see,
          hidden information per viewer, dice that everyone could see roll, a synced
          music player, and a map. Coordinating that much state between multiple
          people in real time is, of course, a real web app with a database and live
          updates.
        </p>
      </CaseStudySection>

      <CaseStudySection title="My role">
        <p>
          The project was started by{" "}
          <a
            href="https://www.linkedin.com/in/hunter-gallo-3660aa209/"
            target="_blank"
            rel="noreferrer"
          >
            Hunter Gallo
          </a>{" "}
          in May 2025 as a Python Discord bot. In September 2025 I started rewriting the whole thing from scratch
          as a Next.js web app. The first commit of the new codebase is September 5,
          2025. I&apos;ve done a lot of the work on the schema, the battle engine, the
          real-time layer, the auth integration, and the Owlbear Rodeo extension. 
          Hunter focuses on the mechanics, reviews rules from the DM
          side, and essentially functions as the product owner as well.
        </p>
      </CaseStudySection>

      <CaseStudySection title="Architecture">
        <p>
          The whole app is one Next.js process, talking to Postgres through Prisma,
          using Ory for auth, and reaching out to a few external APIs along the way
          (Spotify, YouTube, the Owlbear Rodeo extension). Nothing especially
          complex on the surface, but most of the interesting work is in how the
          realtime layer and the battle service fit together.
        </p>

        <MermaidDiagram
          source={POKEDND_ARCHITECTURE}
          ariaLabel="PokeDnD architecture: clients connect to a single Next.js process containing API routes, an auth layer, the battle pipeline, other domain services, realtime SSE hubs, and Prisma. Prisma writes to PostgreSQL. External services include Ory Cloud, Discord OIDC, Spotify Web API, and the YouTube IFrame API."
          caption="Core architecture. Full lines are direct calls (HTTP, function, or SQL). Broken lines into the hubs are in-memory publishes. Thick lines are SSE pushed back to clients."
        />

        <p>
          Say a player attacks. The request comes in as an HTTP POST to one of
          the <code>/api/battle/*</code> routes, which calls into the battle
          service. The battle service writes the result to the database, then
          calls <code>battleHub.broadcastFiltered()</code> for filtered events
          (or plain <code>broadcast()</code> for shared ones), which
          pushes a per-viewer payload over SSE to every client connected to that
          battle. The hub lives in memory on a single Node process, so the whole app
          runs as one instance on Railway. Going serverless would mean rebuilding the
          realtime layer on top of Redis, which is way more than I need for a few
          players in one campaign.
        </p>

        <h3>Reading the diagram</h3>
        <ul>
          <li>
            <strong>Full lines</strong> are direct calls. HTTP coming in from the
            client, function calls inside the server, SQL going out to Postgres.
          </li>
          <li>
            <strong>Thick lines</strong> from clients are long-lived SSE
            connections. The same connection that sends commands also receives
            pushed updates.
          </li>
          <li>
            <strong>Broken lines</strong> into the hubs are publishes, not calls.
            The battle service tells the hub something happened and moves on. The
            hub handles getting it to subscribers.
          </li>
          <li>
            <strong>External services</strong> are placed next to whoever calls
            them. Ory next to Auth. Spotify next to the API (the server refreshes
            OAuth tokens on a 10-minute buffer). YouTube next to the music service
            (the player itself runs in the client, the server just keeps everyone
            on the same track).
          </li>
        </ul>

        <h3>How filtered broadcasts work</h3>
        <p>
          One server event becomes a different payload per viewer.{" "}
          <code>broadcastFiltered</code> takes a build function that runs once per
          subscriber. It gets the subscriber&apos;s context (role, channel, viewer ids)
          and the raw event, and returns whatever that viewer is supposed to see. The
          DM gets the full battle state. Players get a filtered version with their own
          party plus whatever&apos;s currently visible to them on the enemy side.
        </p>

        <MermaidDiagram
          source={BROADCAST_FILTERED}
          height={320}
          ariaLabel="A single BattleEvent enters battleHub.broadcastFiltered, which runs a per-subscriber build function and emits two different payloads, one for DM subscribers and one for player subscribers, each pushed over SSE to its own audience."
          caption="One event in, two payloads out. The build runs once per subscriber so hidden state never leaves the server."
        />

        <h3>External integrations</h3>
        <ArchitectureLayer columns={2}>
          <ArchitectureNode
            title="Ory Cloud"
            subtitle="Identity, OIDC, admin SDK"
            detail="API routes call /sessions/whoami via getSessionUser()"
          />
          <ArchitectureNode
            title="Spotify Web API"
            subtitle="Per-user OAuth tokens on User row"
            detail="API routes refresh on a 10-min buffer"
          />
          <ArchitectureNode
            title="YouTube IFrame API"
            subtitle="Client-side player"
            detail="Synced to other clients via musicHub"
          />
          <ArchitectureNode
            title="Owlbear Rodeo extension"
            subtitle="Built into /public/owlbear/"
            detail="Calls back into /api/owlbear/* and a campaign SSE channel"
          />
        </ArchitectureLayer>
      </CaseStudySection>

      <CaseStudySection title="Key systems">
        <KeySystemsGrid
          systems={[
            {
              title: "Real-time SSE hubs",
              description: (
                <>
                  Five hubs (<code>battleHub</code>, <code>musicHub</code>,{" "}
                  <code>rollHub</code>, <code>tradeHub</code>, <code>catchHub</code>) kept
                  on <code>globalThis</code> as a{" "}
                  <code>Map&lt;channelId, Set&lt;Subscriber&gt;&gt;</code>. The battle
                  hub&apos;s <code>broadcastFiltered</code> runs a build function for each
                  subscriber, so the DM and the players can get different payloads from
                  the same event. That&apos;s how hidden HP and unscouted type info never
                  leak to non-DM clients.
                </>
              ),
            },
            {
              title: "Battle rules engine",
              description: (
                <>
                  Around 3,800 lines under <code>lib/rules/</code>. Covers type
                  effectiveness, multi-hit moves, weather and terrain, immunities, status
                  conditions, items, mega and Z moves, and reactions. Ability, accuracy,
                  power, stat, DOT, multi-target, and reaction hooks all load from JSON
                  files into a <code>RuleHook</code> table at runtime, so adding a new
                  mechanic doesn&apos;t need a deploy.
                </>
              ),
            },
            {
              title: "Auth and role-based access",
              description: (
                <>
                  The Ory session cookie gets validated by{" "}
                  <code>getSessionUser()</code>, which calls{" "}
                  <code>/sessions/whoami</code> with a 60-second positive cache and a
                  10-second negative cache for hard 401s and 403s. Routes protect
                  admin actions with <code>hasAdmin(session)</code>, and per-channel
                  DM and
                  player roles are resolved on every request so the SSE hub can build
                  the right payload for each subscriber.
                </>
              ),
            },
            {
              title: "Music sync (Spotify / YouTube)",
              description: (
                <>
                  One <code>MusicState</code> row per campaign holds the track URL,
                  source, <code>playing</code>, <code>looping</code>,{" "}
                  <code>startedAt</code>, and <code>pausedAt</code>. The server figures
                  out the time passed so every client lines up at the same point in
                  the song, plus a full state push every 60 seconds for any clients
                  that have fallen out of sync. Spotify uses per-user OAuth with a
                  10-minute refresh buffer. YouTube goes through the IFrame API.
                </>
              ),
            },
            {
              title: "Discord identity sync",
              description: (
                <>
                  Done through Ory&apos;s OIDC provider, not a bot or webhook. On first
                  login, <code>syncDiscordInfoFromOry()</code> reads the identity&apos;s
                  OIDC credentials from the Ory admin API, pulls the Discord id,
                  username, and avatar out of the id_token, and writes them to the
                  local <code>User</code> row. Fire and forget. The login flow
                  doesn&apos;t wait on it.
                </>
              ),
            },
            {
              title: "Owlbear Rodeo VTT extension",
              description: (
                <>
                  A compiled extension lives in <code>/public/owlbear/</code>. About
                  two dozen <code>/api/owlbear/*</code> routes back it: manifest
                  serving, auth, sprite proxying, scene and position sync, damage
                  application, pointer movement, reveal controls, presets, command
                  channels, and a campaign-wide SSE live channel. The DM drops trainer
                  and Pokémon tokens onto a map and HP and status updates flow both
                  directions.
                </>
              ),
            },
          ]}
        />
      </CaseStudySection>

      <CaseStudySection title="Reactions: pausing an attack midway">
        <p>
          Normally an attack resolves in one server call: hit check, damage roll,
          status effects, an HP write, and a broadcast. Pokémon reactions, however,
          break that clean flow. Moves like Protect, Counter, and Mirror Coat
          (plus the custom reaction moves I store in the DB) fire after the hit lands
          but before damage actually goes through, and they&apos;re the defender&apos;s,
          not the attacker. So the attacker is essentially done acting at that point,
          but the defender now has a window to burn one of these reactions, and what
          they pick changes what the attack actually did. Mirror Coat sends the
          special damage back at the attacker, Counter does the same for physical,
          and Protect cancels the attack entirely and burns PP on the defender. If
          the defender doesn&apos;t have anything valid to react with, or just
          passes, the attack lands like normal.
        </p>
        <p>
          The hard part is that the defender&apos;s response shows up in a
          completely different HTTP request, from a completely different client. So
          you can&apos;t just branch inside <code>resolveAttack</code> and wait,
          because <code>resolveAttack</code> is already returning to the attacker.
          You also can&apos;t hold the attacker&apos;s request open until the
          defender clicks, since the defender could easily be AFK for a while. And
          you can&apos;t recompute the attack from scratch when the reaction
          finally comes in either, because the rolled hit, the damage context, and
          a lot of used-modifier state all involved random rolls that already
          happened.
        </p>
        <p>
          So, I serialize the whole thing. When the attack pipeline reaches the
          post-hit point and sees the defender has a valid reaction available, it
          writes the entire attack context into JSON: the original request, the ids
          of any modifiers that would have been used, attacker and defender
          passives, the spread multiplier, the rolled hit, and the multi-target
          state. That JSON goes into a <code>PendingReaction</code> row with an{" "}
          <code>expiresAt</code>, and a filtered <code>reaction:prompt</code> SSE
          event goes out to just the defender. Then the attacker&apos;s request
          returns <code>PENDING_REACTION</code>, so their client puts up a
          &quot;waiting for defender&quot; state and we wait.
        </p>
        <p>
          Then, when the defender picks (or passes), they POST to{" "}
          <code>/api/battle/reaction</code>. That route loads the row, checks the
          status, rehydrates the context, re-loads the modifiers by id (still
          still in place, of course, because the attack got deferred), applies the
          reaction effect, and runs the rest of damage resolution as if it were one
          atomic call. If the row happens to expire before they respond, the next
          request that hits it just treats it as a pass.
        </p>
        <MermaidDiagram
          source={PENDING_REACTION_SEQUENCE}
          height={620}
          ariaLabel="Sequence diagram showing the PendingReaction flow. The attacker posts an attack, the battle service detects available reactions, writes a PendingReaction row, and broadcasts a filtered prompt to the defender. The defender posts their reaction; the API rehydrates the context, applies the reaction effect, finishes damage, and broadcasts the resolved attack to all subscribers."
          caption="The attack pauses across two HTTP requests from two different clients. The PendingReaction row is the only thing that lives through the wait."
        />

        <p>The hard parts:</p>
        <ul>
          <li>
            <strong>Getting the context to actually serialize.</strong> It has to
            round-trip through JSON without losing anything. Prisma Decimals and
            dates were the easy ones to forget about. I store modifier ids instead
            of the rows themselves, since the rows can change between the prompt
            going out and the response coming back.
          </li>
          <li>
            <strong>Surviving double-clicks and replays.</strong> A slow defender
            double-clicks. SSE reconnects and replays the prompt. The row&apos;s{" "}
            <code>status</code> field (<code>PENDING</code> / <code>CHOSEN</code> /{" "}
            <code>PASSED</code> / <code>TIMED_OUT</code>) is the only thing I
            trust, and anything other than <code>PENDING</code> exits early.
          </li>
          <li>
            <strong>Knowing who the prompt is for.</strong> The prompt event
            broadcasts to every subscriber in the channel with the same payload.
            Each client checks{" "}
            <code>viewerTrainerId === prompt.defenderTrainerId</code> (or admin)
            to decide whether to put up a reaction picker or a &quot;waiting for
            opponent&quot; overlay.
          </li>
          <li>
            <strong>Saving the whole thing all at once.</strong> When damage
            finally lands, the <code>BattleEvent</code>, the HP writes, the{" "}
            <code>lastAttackResult</code> snapshot, and the catch-encounter
            HP-change hooks all have to commit in one transaction. Otherwise a
            client that refreshes mid-flight catches a half-resolved attack.
          </li>
        </ul>
        <p>
          This one requires everything: the schema, the rules engine, the SSE
          layer, the client. The edge cases (timeouts, replays, races) ate way
          more time than I expected.
        </p>
      </CaseStudySection>

      <CaseStudySection title="Lessons learned">
        <ol>
          <li>
            <strong>Pick the deployment shape sooner than I did.</strong> The SSE
            hubs live on <code>globalThis</code>, which means the whole app has to
            run as one Node process. I went with Railway, but I didn&apos;t
            actually lock that in until about six months in. If I had planned for
            serverless or anything fanned out from the start, the entire SSE
            design would have been completely different. Picking the host late
            worked out, but it could have easily been a painful retrofit.
          </li>
          <li>
            <strong>
              Rules as data, editable without a deploy, was the real win.
            </strong>{" "}
            The hooks (ability, accuracy, power, stat, DOT, multi-target,
            reaction) loaded from JSON files from the start, but the JSON only
            seeded at deploy time. So when Hunter wanted to tweak an ability
            mid-campaign, it meant me pushing a deploy. Adding the{" "}
            <code>RuleHook</code> DB table and an admin page on top of it meant
            DMs could change rules in-app without me in the loop. That alone
            took the iteration time from days to seconds.
          </li>
          <li>
            <strong>Schema first for the core models, but only the core.</strong>{" "}
            The first commit modeled Campaign, Trainer, PokemonInstance, and
            Species, and those have basically held up. The battle models
            (Battle, BattleParticipant, BattleEvent, BattleSnapshot) came in
            later, in pieces, and that growth shows up in the code. Some of the
            things I never modeled out (<code>moveStates</code>,{" "}
            <code>featureUses</code>, <code>passives</code> as ad-hoc JSON) are
            still ad-hoc JSON. They work, but I&apos;ve given up any kind of
            schema-level safety on those parts. A lot of that is because it is extremely difficult to predict what these will look like, especially since the website is still in active development and new mechanics are being added. For now, the flexibility is worth the tradeoff.
          </li>
          <li>
            <strong>The battle UI never settles down.</strong> The battle page
            has been reworked more than anything else in the app. I&apos;ve done multiple
            full UI rewrites and dice reworks. I used to
            think this meant I was failing to design it right up front, but
            I think the real lesson is the opposite: multi-actor turn state
            is genuinely hard to design before you&apos;ve seen real players
            use it. Iterating on it with the group at the table was way
            faster than trying to plan the perfect version on the first pass.
          </li>
        </ol>
      </CaseStudySection>

      <CaseStudySection title="Screenshots" collapsible defaultOpen>
        <ScreenshotGrid
          columns={4}
          images={[
            {
              src: "/img/pokednd/home.png",
              alt: "Landing page",
              caption: "Landing page with sign-in and a quick tour of what's inside.",
              width: 1600,
              height: 900,
            },
            {
              src: "/img/pokednd/login.png",
              alt: "Login screen",
              caption: "Login with email/password, one-time code, or Google / Discord OAuth.",
              width: 1600,
              height: 900,
            },
            {
              src: "/img/pokednd/register.png",
              alt: "Account creation",
              caption: "Account creation with the same OAuth providers.",
              width: 1600,
              height: 900,
            },
            {
              src: "/img/pokednd/pokednd1.png",
              alt: "Home hub with active campaign and party",
              caption: "Home hub with your current campaign, party vitals, and join/create flows.",
              width: 1600,
              height: 900,
            },
            {
              src: "/img/pokednd/pokednd2.png",
              alt: "Trainer sheet with party",
              caption: "Trainer sheet: classes, ability scores, skills, and party at a glance.",
              width: 1600,
              height: 900,
            },
            {
              src: "/img/pokednd/trainerPageBottom.png",
              alt: "Trainer class features and graveyard",
              caption: "Trainer sheet, continued: class features, active effects, and graveyard.",
              width: 1600,
              height: 900,
            },
            {
              src: "/img/pokednd/pokednd3.png",
              alt: "Pokémon sheet",
              caption: "Per-Pokémon sheet with ability, IVs, moveset slots, and evolution.",
              width: 1600,
              height: 900,
            },
            {
              src: "/img/pokednd/pokednd4.png",
              alt: "Battle view with 3D dice",
              caption: "Real-time battle with 3D dice, damage resolution, and field conditions.",
              width: 1600,
              height: 900,
            },
            {
              src: "/img/pokednd/battle.png",
              alt: "Attack roller with move selection",
              caption: "Attack roller: pick a move, see target HP, and read the current field state.",
              width: 1600,
              height: 900,
            },
            {
              src: "/img/pokednd/pokednd5.png",
              alt: "Attack result breakdown modal",
              caption: "Attack result modal with the full hit/damage roll breakdown.",
              width: 1600,
              height: 900,
            },
            {
              src: "/img/pokednd/roll.png",
              alt: "Ability check dice roll",
              caption: "Ability check modal: every roll shows performer, dice, modifier, and total.",
              width: 1600,
              height: 900,
            },
            {
              src: "/img/pokednd/pokednd6.png",
              alt: "Catch encounter",
              caption: "Catch encounters with ball selection, capture DC, and modifier breakdown.",
              width: 1600,
              height: 900,
            },
            {
              src: "/img/pokednd/catch.png",
              alt: "Catch encounter with ball inventory",
              caption: "Catch encounter with full ball inventory and past-encounter history.",
              width: 1600,
              height: 900,
            },
            {
              src: "/img/pokednd/pokednd7.png",
              alt: "Trainers overview",
              caption: "Campaign trainer overview: players and NPCs with level and HP at a glance.",
              width: 1600,
              height: 900,
            },
            {
              src: "/img/pokednd/pokednd8.png",
              alt: "Trade UI",
              caption: "Two-sided trade UI; both trainers confirm before the swap commits.",
              width: 1600,
              height: 900,
            },
            {
              src: "/img/pokednd/pokednd9.png",
              alt: "Campaign Pokédex grid",
              caption: "Campaign Pokédex with discoveries, type filters, and regional forms.",
              width: 1600,
              height: 900,
            },
            {
              src: "/img/pokednd/pokednd10.png",
              alt: "Pokédex entry",
              caption: "Pokédex entry with base stats and full level-up learnset.",
              width: 1600,
              height: 900,
            },
            {
              src: "/img/pokednd/pokednd11.png",
              alt: "Rule Hooks admin",
              caption: "Rule Hooks: searchable catalog of ability/item/field effects driving combat math.",
              width: 1600,
              height: 900,
            },
            {
              src: "/img/pokednd/pokednd12.png",
              alt: "Admin dashboard",
              caption: "Admin dashboard with campaign-scoped tooling and data management.",
              width: 1600,
              height: 900,
            },
            {
              src: "/img/pokednd/profile.png",
              alt: "User preferences",
              caption: "User preferences, dice-rolling modes, and Spotify integration.",
              width: 1600,
              height: 900,
            },
          ]}
        />
      </CaseStudySection>

      <CaseStudySection title="Stack">
        <StackChips
          groups={[
            {
              title: "Frontend",
              items: [
                { label: "Next.js 15", icon: SiNextdotjs, href: "https://nextjs.org/" },
                { label: "React 19", icon: SiReact, href: "https://react.dev/" },
                { label: "TypeScript", icon: SiTypescript, href: "https://www.typescriptlang.org/" },
                { label: "Tailwind 4", icon: SiTailwindcss, href: "https://tailwindcss.com/" },
                { label: "Framer Motion", icon: SiFramer, href: "https://www.framer.com/motion/" },
                { label: "@3d-dice/dice-box", icon: FaDiceD20, href: "https://github.com/3d-dice/dice-box" },
                { label: "Howler.js", icon: HiOutlineSpeakerWave, href: "https://howlerjs.com/" },
              ],
            },
            {
              title: "Backend & data",
              items: [
                { label: "Prisma 7", icon: SiPrisma, href: "https://www.prisma.io/" },
                { label: "PostgreSQL", icon: SiPostgresql, href: "https://www.postgresql.org/" },
                { label: "Zod", icon: SiZod, href: "https://zod.dev/" },
                { label: "Server-Sent Events", icon: TbBroadcast, href: "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events" },
                { label: "Vitest", icon: SiVitest, href: "https://vitest.dev/" },
              ],
            },
            {
              title: "Auth & integrations",
              items: [
                { label: "Ory", icon: TbShield, href: "https://www.ory.sh/" },
                { label: "Spotify", icon: SiSpotify, href: "https://developer.spotify.com/documentation/web-api" },
                { label: "YouTube", icon: SiYoutube, href: "https://developers.google.com/youtube/iframe_api_reference" },
                { label: "Owlbear Rodeo", icon: FaTheaterMasks, href: "https://www.owlbear.rodeo/" },
              ],
            },
            {
              title: "Infrastructure",
              items: [
                { label: "Docker", icon: SiDocker, href: "https://www.docker.com/" },
                { label: "Railway", icon: SiRailway, href: "https://railway.com/" },
              ],
            },
          ]}
        />
      </CaseStudySection>
    </>
  );
}
