import type {
  QuartzComponentConstructor,
  QuartzComponentProps,
  QuartzPluginData,
  ValidDateType,
} from "@quartz-community/types";
import readingTime from "reading-time";
import { classNames } from "../util/lang";
import { i18n } from "../i18n";
import { DateComponent, getDate } from "../util/date";
import type { JSX } from "preact";
import style from "./styles/contentMeta.scss";

export interface ContentMetaOptions {
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

const defaultOptions: ContentMetaOptions = {
  showReadingTime: true,
  showComma: true,
  showPageviews: true,
  showEditLinks: true,
  repo: "byheaven/knowledge-garden",
  branch: "v5",
};

export default ((opts?: Partial<ContentMetaOptions>) => {
  // Merge options with defaults
  const options: ContentMetaOptions = { ...defaultOptions, ...opts };

  function ContentMetadata({ cfg, fileData, displayClass }: QuartzComponentProps) {
    const text = fileData.text;

    if (text) {
      const segments: (string | JSX.Element)[] = [];

      if (fileData.dates) {
        const locale = cfg.locale || "en-US";
        const defaultDateType =
          (fileData.defaultDateType as ValidDateType | undefined) ??
          (cfg.defaultDateType as ValidDateType | undefined);
        if (defaultDateType) {
          const dataWithDefaultDateType: QuartzPluginData = {
            ...(fileData as QuartzPluginData),
            defaultDateType,
          };
          const date = getDate(dataWithDefaultDateType);
          if (date) {
            segments.push(<DateComponent date={date} locale={locale} />);
          }
        }
      }

      // Display reading time if enabled
      if (options.showReadingTime) {
        const { minutes, words: _words } = readingTime(text as string);
        const locale = cfg.locale || "en-US";
        const i18nData = i18n(locale);
        const displayedTime = i18nData.components.contentMeta.readingTime({
          minutes: Math.ceil(minutes),
        });
        segments.push(<span>{displayedTime}</span>);
      }

      // Only real `.md`-backed content pages get the Waline pageview counter +
      // the edit/history links (the counter is filled in by the Waline client,
      // which only mounts on real article pages — see byheaven-comments).
      const filePath = fileData.filePath as string | undefined;
      const isRealFile = typeof filePath === "string" && filePath.endsWith(".md");

      // Display the Waline pageview counter if enabled. The `<span class=
      // "waline-pageview-count">` is the mount point the Waline client fills in.
      if (options.showPageviews && isRealFile) {
        segments.push(
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              style="display: inline; vertical-align: text-bottom; margin-right: 4px;"
            >
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span class="waline-pageview-count">...</span>
          </span>,
        );
      }

      const showComma = options.showComma;
      const segmentsWithCommas = segments.map((segment, index) => (
        <span key={index}>
          {segment}
          {showComma && index < segments.length - 1 ? ", " : ""}
        </span>
      ));

      // Build the edit/history links. v4 pointed these at the deployment branch;
      // `branch` MUST track the live branch so "Edit page" lands on real source.
      const editLinks =
        options.showEditLinks && isRealFile ? (
          <>
            {" "}
            <br />
            <span id="edit-btn-container">
              <a
                href={`https://github.com/${options.repo}/edit/${options.branch}/${filePath}`}
                class={classNames(displayClass, "external", "edit-btn")}
                target={"_blank"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-square-pen"
                >
                  <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
                </svg>
                Edit page
              </a>{" "}
              &nbsp;
              <a
                href={`https://github.githistory.xyz/${options.repo}/blob/${options.branch}/${filePath}`}
                class={classNames(displayClass, "external", "edit-btn")}
                target={"_blank"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-folder-clock"
                >
                  <circle cx="16" cy="16" r="6" />
                  <path d="M7 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2" />
                  <path d="M16 14v2l1 1" />
                </svg>
                View history
              </a>
            </span>
          </>
        ) : null;

      return (
        // `show-comma="false"`: commas are rendered inline above (v4 behavior),
        // so the scss `::after` comma rule (driven by `show-comma="true"`) must
        // stay off to avoid doubling.
        <p show-comma="false" class={classNames(displayClass, "content-meta")}>
          {segmentsWithCommas}
          {editLinks}
        </p>
      );
    } else {
      return null;
    }
  }

  ContentMetadata.css = style;

  return ContentMetadata;
}) satisfies QuartzComponentConstructor;
