/**
 * Build-time US state outlines. us-atlas states-10m → d3-geo Albers USA,
 * viewBox 0 0 975 610. Runs only in Astro frontmatter; nothing here ships to the client.
 */
import { geoAlbersUsa, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import type { Feature, Geometry } from 'geojson';
import { createRequire } from 'node:module';

export const MAP_W = 975;
export const MAP_H = 610;

export interface StatePath {
  fips: string;
  d: string;
  /** Centroid in viewBox units. */
  cx: number;
  cy: number;
  /** Bounding-box height in viewBox units. */
  bh: number;
}

let cache: Map<string, StatePath> | undefined;

/** All state outlines keyed by 2-digit FIPS. Cached for the build. */
export const statePaths = (): Map<string, StatePath> => {
  if (cache) return cache;
  const require = createRequire(import.meta.url);
  const topo = require('us-atlas/states-10m.json') as Topology<{
    states: GeometryCollection;
  }>;
  const projection = geoAlbersUsa()
    .scale(1300)
    .translate([MAP_W / 2, MAP_H / 2]);
  const path = geoPath(projection);
  const feats = (
    feature(topo, topo.objects.states) as unknown as {
      features: Feature<Geometry>[];
    }
  ).features;
  cache = new Map();
  for (const f of feats) {
    const d = path(f);
    if (!d) continue;
    const [cx, cy] = path.centroid(f);
    const [[, y0], [, y1]] = path.bounds(f);
    cache.set(String(f.id).padStart(2, '0'), {
      fips: String(f.id).padStart(2, '0'),
      d: d.replace(/(\d+\.\d)\d+/g, '$1'),
      cx: Math.round(cx * 10) / 10,
      cy: Math.round(cy * 10) / 10,
      bh: Math.round((y1 - y0) * 10) / 10,
    });
  }
  return cache;
};
