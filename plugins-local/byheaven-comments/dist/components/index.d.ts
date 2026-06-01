import { QuartzComponentConstructor } from '@quartz-community/types';

interface WalineOptions {
    serverURL: string;
    path?: string;
    lang?: string;
    emoji?: string[];
    dark?: boolean | "auto";
    meta?: string[];
    requiredMeta?: string[];
    wordLimit?: number;
    pageSize?: number;
    login?: "enable" | "disable" | "force";
    copyright?: boolean;
    pageview?: boolean;
}
declare const Comments: QuartzComponentConstructor<WalineOptions>;

export { Comments, type WalineOptions };
