import { QuartzComponentProps } from '@quartz-community/types';
export { QuartzComponent, QuartzComponentProps, StringResource } from '@quartz-community/types';
import { JSX } from 'preact';

interface ContentMetaOptions {
    /**
     * Whether to display reading time
     */
    showReadingTime: boolean;
    showComma: boolean;
    /**
     * Whether to display the Waline pageview counter (the eye icon + count span
     * that the Waline client fills in on the page).
     */
    showPageviews: boolean;
    /**
     * Whether to render the "Edit page" (GitHub edit) + "View history"
     * (githistory.xyz) links under the meta line.
     */
    showEditLinks: boolean;
    /**
     * `owner/name` of the GitHub repository backing the content, used to build the
     * edit + history URLs.
     */
    repo: string;
    /**
     * Branch the edit + history links point at. This MUST match the deployment
     * branch so "Edit page" lands on the live source (v4 used `v4`; v5 uses `v5`).
     */
    branch: string;
}
declare const _default: (opts?: Partial<ContentMetaOptions>) => {
    ({ cfg, fileData, displayClass }: QuartzComponentProps): JSX.Element | null;
    css: string;
};

export { _default as ContentMeta, type ContentMetaOptions };
