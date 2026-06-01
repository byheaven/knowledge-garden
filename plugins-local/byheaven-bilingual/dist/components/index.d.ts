import { QuartzComponentConstructor } from '@quartz-community/types';

declare const LanguageSwitcher: QuartzComponentConstructor;

declare const PrevNext: QuartzComponentConstructor;

interface Options {
    links: Record<string, string>;
}
declare const Socials: QuartzComponentConstructor<Options>;

export { LanguageSwitcher, PrevNext, Socials };
