"use client";

import { openDB } from "idb";
import type { Track } from "@/lib/types";

export type LocalTrackRecord = {
  id: string;
  track: Track;
  audioBlob: Blob;
  coverBlob?: Blob;
  lrcText?: string;
  createdAt: string;
};

const databaseName = "auralis-local-media";
const storeName = "tracks";

async function localDb() {
  return openDB(databaseName, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(storeName))
        db.createObjectStore(storeName, { keyPath: "id" });
    },
  });
}

export async function saveLocalTrack(record: LocalTrackRecord) {
  const db = await localDb();
  await db.put(storeName, record);
}

export async function getLocalTrack(id: string) {
  const db = await localDb();
  return (await db.get(storeName, id)) as LocalTrackRecord | undefined;
}

export async function listLocalTracks() {
  const db = await localDb();
  return (await db.getAll(storeName)) as LocalTrackRecord[];
}

export async function deleteLocalTrack(id: string) {
  const db = await localDb();
  await db.delete(storeName, id);
}
