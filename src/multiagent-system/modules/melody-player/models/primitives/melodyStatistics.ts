import { Statistics } from '@/multiagent-system/modules/common/models/primitives/statistics';

export interface MelodyStatistics extends Statistics {
    playedNotesPercent: number;
}
