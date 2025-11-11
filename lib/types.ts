import type { Session } from "next-auth";

export interface ExtendedSession extends Session {
  accessToken?: string;
  refreshToken?: string;
}

export interface AdAccount {
  id: string;
  name: string;
  currency: string;
  account_id: string;
  account_status: number;
}

export interface Campaign {
  id: string;
  name: string;
  status: string;
  objective: string;
  created_time: string;
  updated_time: string;
  daily_budget?: string | number;
  lifetime_budget?: string | number;
}

export interface AdSet {
  id: string;
  name: string;
  campaign_id: string;
  status: string;
  targeting?: Record<string, unknown>;
  daily_budget?: string | number;
  lifetime_budget?: string | number;
  created_time: string;
  updated_time: string;
}

export interface Ad {
  id: string;
  name: string;
  adset_id: string;
  campaign_id: string;
  status: string;
  creative: {
    id: string;
    title?: string;
    body?: string;
    image_url?: string;
  };
  created_time: string;
  updated_time: string;
}

export interface AutomatedRule {
  id: string;
  name: string;
  status: string;
  evaluation_spec: Record<string, unknown>;
  execution_spec: Record<string, unknown>;
  created_time: string;
}
