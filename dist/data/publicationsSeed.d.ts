import { PublicationCategory } from '../models/Publications';
export interface PublicationSeedRow {
    title: string;
    description: string | null;
    authority_name: string;
    category: PublicationCategory;
    file_url: string;
}
export declare const PUBLICATIONS_SEED_DATA: PublicationSeedRow[];
//# sourceMappingURL=publicationsSeed.d.ts.map