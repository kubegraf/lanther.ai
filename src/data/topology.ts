/**
 * The hero topology, read left to right the way a request travels: developer,
 * Lanther, then one row per environment (cloud, workload, service).
 * Coordinates are in the SVG's own 1060x440 space.
 */

export type NodeKind = "entry" | "core" | "cloud" | "workload" | "service";

export type TopoNode = {
  id: string;
  label: string;
  sub: string;
  x: number;
  y: number;
  w: number;
  h: number;
  kind: NodeKind;
};

export type TopoEdge = {
  id: string;
  d: string;
  /** Baseline latency in ms, jittered at runtime. */
  latency?: number;
  label?: { x: number; y: number };
  standby?: boolean;
};

export const VIEW = { w: 1060, h: 440 } as const;
export const ROWS = [90, 220, 350] as const;

export const nodes: TopoNode[] = [
  { id: "dev", label: "Developers", sub: "cli · api · internet", x: 96, y: 220, w: 176, h: 52, kind: "entry" },
  { id: "lanther", label: "Lanther", sub: "control plane", x: 318, y: 220, w: 204, h: 72, kind: "core" },
  { id: "aws", label: "AWS", sub: "eu-west-1", x: 592, y: 90, w: 164, h: 50, kind: "cloud" },
  { id: "gcp", label: "GCP", sub: "us-central1", x: 592, y: 220, w: 164, h: 50, kind: "cloud" },
  { id: "onprem", label: "On-prem", sub: "dc-frankfurt", x: 592, y: 350, w: 164, h: 50, kind: "cloud" },
  { id: "eks", label: "EKS", sub: "prod-eu", x: 790, y: 90, w: 156, h: 50, kind: "workload" },
  { id: "gke", label: "GKE", sub: "analytics", x: 790, y: 220, w: 156, h: 50, kind: "workload" },
  { id: "papi", label: "Private API", sub: "10.40.2.18:8443", x: 790, y: 350, w: 156, h: 50, kind: "workload" },
  { id: "svc-payments", label: "svc/payments", sub: "", x: 982, y: 90, w: 124, h: 32, kind: "service" },
  { id: "svc-events", label: "svc/events", sub: "", x: 982, y: 220, w: 124, h: 32, kind: "service" },
  { id: "db-ledger", label: "db/ledger", sub: "", x: 982, y: 350, w: 124, h: 32, kind: "service" },
];

export const edges: TopoEdge[] = [
  { id: "dev", d: "M184 220 L216 220" },
  { id: "aws", d: "M420 206 C466 206 464 90 510 90", latency: 14, label: { x: 465, y: 142 } },
  { id: "gcp", d: "M420 220 L510 220", latency: 22, label: { x: 465, y: 220 } },
  { id: "onprem-a", d: "M420 234 C466 234 464 340 510 340", latency: 9, label: { x: 465, y: 292 } },
  { id: "onprem-b", d: "M392 256 C392 334 446 362 510 362", latency: 11, standby: true, label: { x: 420, y: 338 } },
  { id: "aws-eks", d: "M674 90 L712 90" },
  { id: "gcp-gke", d: "M674 220 L712 220" },
  { id: "onprem-papi", d: "M674 350 L712 350" },
  { id: "eks-svc", d: "M868 90 L920 90" },
  { id: "gke-svc", d: "M868 220 L920 220" },
  { id: "papi-svc", d: "M868 350 L920 350" },
];

/**
 * The loop the hero plays: steady state, a degraded tunnel, a failover to the
 * standby path, recovery, then the primary coming back.
 */
export type Phase = {
  ai: "nominal" | "investigating" | "rerouting" | "recovered";
  status: string;
  event: string;
  primary: "ok" | "warn" | "down";
  standby: "idle" | "active";
};

export const phases: Phase[] = [
  { ai: "nominal", status: "38 routes healthy", event: "All routes healthy across 3 environments", primary: "ok", standby: "idle" },
  { ai: "nominal", status: "38 routes healthy", event: "Route added: eks/prod-eu → db/ledger", primary: "ok", standby: "idle" },
  { ai: "investigating", status: "latency spike · dc-frankfurt", event: "p95 latency 212ms on tunnel onprem-a", primary: "warn", standby: "idle" },
  { ai: "rerouting", status: "failing over to onprem-b", event: "Traffic moved to standby tunnel onprem-b", primary: "down", standby: "active" },
  { ai: "recovered", status: "recovered · p95 18ms", event: "Connectivity verified: 0 dropped requests", primary: "down", standby: "active" },
  { ai: "nominal", status: "38 routes healthy", event: "Primary tunnel onprem-a restored", primary: "ok", standby: "idle" },
];
