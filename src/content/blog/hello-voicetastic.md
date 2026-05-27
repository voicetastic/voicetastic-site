---
title: 'Hello, Voicetastic'
description: 'The video that introduced me to Meshtastic, a few free weeks, and a what-if about sending voice over it.'
pubDate: 2026-05-25
author: 'acarteron'
tags: ['backstory']
---

[This video](https://www.youtube.com/watch?v=UTWrq_nS56A) was where I first
ran into [Meshtastic](https://meshtastic.org/). LoRa I already knew, but
seeing it turned into an actual mesh was new. Watching it, one thought
stuck: what if it is used to send and receive voice? It would be slow, and
you would need patience waiting for each message, but maybe it could work.
The real question was whether it would ever be usable.

LoRa moves only a few hundred bytes a second on the long-range presets,
and voice is not cheap, so my expectations were low. Still, I had a few
free weeks, so I tried it anyway, hoping to get at least a proof of concept
working, even if it never turned into something usable in production.

It mostly works. Voicetastic sends short voice messages over the mesh: you
record a clip and it shows up for whoever is listening on your channel. It
is asynchronous, more like a voice note than a call. The how is a longer
story, and the rest of this site covers it properly, so I will not get into
the internals here.

Current status, honestly: voice goes end to end between the Android app and
the Linux desktop client, and I have run it on real radios, though only at
home so far, not out in the field across real distances. It is still
experimental and wants a lot more testing in the wild. Text and radio
configuration are the parts that work reliably right now.

What I am really focused on is keeping a single implementation at the
center, `voicetastic-core`, and having every client build on top of it:
Android, desktop, and a web version down the line. One core, one reference,
rather than reimplementing the protocol three times and watching the
versions drift apart.
