import { DealDetailsType } from './deals.types';

export type DealKanBanType = DealDetailsType & {
  dealId: number;
  stageId: number;
  stage: string;
  dealName: string;
  stageType: string;
};
