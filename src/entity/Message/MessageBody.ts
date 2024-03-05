import { KeepAlive } from '../KeepAlive';
import { Competition } from '../Competition';
import { PackageDetails } from '../PackageDetails';

export interface MessageBody {
  Events: Event[];
  Competition: Competition;
  KeepAlive: KeepAlive;
  PackageDetails?: PackageDetails;
}
