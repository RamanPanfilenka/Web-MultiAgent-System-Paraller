import { Melody } from '@/multiagent-system/modules/melody-player/models/melody';
import { ProcessProps } from '../../common/primitives/processProps';

export interface MelodyPlayerProps extends ProcessProps {
    melody: Melody;
}
