export type RuleTypes = {
  p_num_required: boolean;
  p_special_required: boolean;
  p_upper_lower: boolean;
  pass_expire: number | null;
  pass_reuse: number;
  pass_length: string;
  twoFA_status: boolean;
  org_ips: {
    new: ORG_IP_TYPES[];
    updated: (ORG_IP_TYPES & { id: number })[];
    deleted: number[];
    old_org_ips?: {
      id: number;
      ip: string;
      start_time: string;
      end_time: string;
    }[];
  };
};

export type ORG_IP_TYPES = {
  ip: string;
  start_time: string;
  end_time: string;
};
