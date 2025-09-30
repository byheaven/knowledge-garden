---
title: Comments
tags:
  - component
---

Quartz also has the ability to hook into various providers to enable readers to leave comments on your site.

![[giscus-example.png]]

Currently, Quartz supports two comment providers out of the box: [Giscus](https://giscus.app/) and [Waline](https://waline.js.org/).

## Providers

### Giscus

First, make sure that the [[setting up your GitHub repository|GitHub]] repository you are using for your Quartz meets the following requirements:

1. The **repository is [public](https://docs.github.com/en/github/administering-a-repository/managing-repository-settings/setting-repository-visibility#making-a-repository-public)**, otherwise visitors will not be able to view the discussion.
2. The **[giscus](https://github.com/apps/giscus) app is installed**, otherwise visitors will not be able to comment and react.
3. The **Discussions feature is turned on** by [enabling it for your repository](https://docs.github.com/en/github/administering-a-repository/managing-repository-settings/enabling-or-disabling-github-discussions-for-a-repository).

Then, use the [Giscus site](https://giscus.app/#repository) to figure out what your `repoId` and `categoryId` should be. Make sure you select `Announcements` for the Discussion category.

![[giscus-repo.png]]

![[giscus-discussion.png]]

After entering both your repository and selecting the discussion category, Giscus will compute some IDs that you'll need to provide back to Quartz. You won't need to manually add the script yourself as Quartz will handle that part for you but will need these values in the next step!

![[giscus-results.png]]

Finally, in `quartz.layout.ts`, edit the `afterBody` field of `sharedPageComponents` to include the following options but with the values you got from above:

```ts title="quartz.layout.ts"
afterBody: [
  Component.Comments({
    provider: 'giscus',
    options: {
      // from data-repo
      repo: 'jackyzha0/quartz',
      // from data-repo-id
      repoId: 'MDEwOlJlcG9zaXRvcnkzODcyMTMyMDg',
      // from data-category
      category: 'Announcements',
      // from data-category-id
      categoryId: 'DIC_kwDOFxRnmM4B-Xg6',
      // from data-lang
      lang: 'en'
    }
  }),
],
```

### Customization

Quartz also exposes a few of the other Giscus options as well and you can provide them the same way `repo`, `repoId`, `category`, and `categoryId` are provided.

```ts
type Options = {
  provider: "giscus"
  options: {
    repo: `${string}/${string}`
    repoId: string
    category: string
    categoryId: string

    // Url to folder with custom themes
    // defaults to 'https://${cfg.baseUrl}/static/giscus'
    themeUrl?: string

    // filename for light theme .css file
    // defaults to 'light'
    lightTheme?: string

    // filename for dark theme .css file
    // defaults to 'dark'
    darkTheme?: string

    // how to map pages -> discussions
    // defaults to 'url'
    mapping?: "url" | "title" | "og:title" | "specific" | "number" | "pathname"

    // use strict title matching
    // defaults to true
    strict?: boolean

    // whether to enable reactions for the main post
    // defaults to true
    reactionsEnabled?: boolean

    // where to put the comment input box relative to the comments
    // defaults to 'bottom'
    inputPosition?: "top" | "bottom"

    // set your preference language here
    // defaults to 'en'
    lang?: string
  }
}
```

#### Custom CSS theme

Quartz supports custom theme for Giscus. To use a custom CSS theme, place the `.css` file inside the `quartz/static` folder and set the configuration values.

For example, if you have a light theme `light-theme.css`, a dark theme `dark-theme.css`, and your Quartz site is hosted at `https://example.com/`:

```ts
afterBody: [
  Component.Comments({
    provider: 'giscus',
    options: {
      // Other options

      themeUrl: "https://example.com/static/giscus", // corresponds to quartz/static/giscus/
      lightTheme: "light-theme", // corresponds to light-theme.css in quartz/static/giscus/
      darkTheme: "dark-theme", // corresponds to dark-theme.css quartz/static/giscus/
    }
  }),
],
```

#### Conditionally display comments

Quartz can conditionally display the comment box based on a field `comments` in the frontmatter. By default, all pages will display comments, to disable it for a specific page, set `comments` to `false`.

```
---
title: Comments disabled here!
comments: false
---
```

### Waline

[Waline](https://waline.js.org/) is a simple, safe, and fast comment system that supports anonymous comments without requiring users to log in with GitHub. It's free to deploy on Vercel.

#### Setup

1. **Deploy Waline Server**

   The easiest way is to deploy on Vercel (free):

   - Click the deploy button on [Waline Quick Start](https://waline.js.org/en/guide/get-started.html)
   - Login with GitHub
   - Click "Deploy" to create your Waline instance
   - After deployment, you'll get a URL like `https://your-waline-server.vercel.app`

2. **Configure Waline in Quartz**

   In `quartz.layout.ts`, edit the `afterBody` field of `sharedPageComponents`:

   ```ts title="quartz.layout.ts"
   afterBody: [
     Component.Comments({
       provider: 'waline',
       options: {
         serverURL: 'https://your-waline-server.vercel.app',
         lang: 'en',
       }
     }),
   ],
   ```

#### Customization

Waline supports various configuration options:

```ts
type WalineOptions = {
  provider: "waline"
  options: {
    // Waline server URL (required)
    serverURL: string

    // Article path for comments, defaults to window.location.pathname
    path?: string

    // Language for UI
    // defaults to 'en'
    lang?: string

    // Custom locale strings
    locale?: Record<string, string>

    // Emoji presets
    // defaults to Waline's built-in emojis
    emoji?: string[]

    // Dark mode support
    // can be true, false, or 'auto'
    // defaults to 'auto'
    dark?: boolean | "auto"

    // User metadata fields to display
    // defaults to ['nick', 'mail', 'link']
    meta?: string[]

    // Required metadata fields
    // defaults to []
    requiredMeta?: string[]

    // Word limit for comments
    wordLimit?: number

    // Number of comments per page
    // defaults to 10
    pageSize?: number

    // Login mode
    // 'enable': login is optional (default)
    // 'disable': anonymous only
    // 'force': login required
    login?: "enable" | "disable" | "force"

    // Show copyright info
    // defaults to true
    copyright?: boolean
  }
}
```

#### Anonymous Comments

One of Waline's key features is support for anonymous comments. Users can leave comments without logging in. You can control this behavior with the `login` option:

- `'enable'` (default): Users can optionally log in
- `'disable'`: Only anonymous comments allowed
- `'force'`: Login required for all comments

```ts title="quartz.layout.ts"
Component.Comments({
  provider: 'waline',
  options: {
    serverURL: 'https://your-waline-server.vercel.app',
    login: 'disable', // Anonymous only
  }
})
```

#### Conditionally display comments

Just like Giscus, Waline also respects the `comments` frontmatter field:

```
---
title: Comments disabled here!
comments: false
---
```

## Comparison

| Feature | Giscus | Waline |
|---------|--------|--------|
| Authentication | Requires GitHub login | Supports anonymous |
| Backend | GitHub Discussions | Self-hosted (Vercel free tier) |
| Setup Complexity | Easy | Easy |
| Data Ownership | GitHub | Your database |
| Comment Moderation | GitHub Discussion tools | Waline admin panel |
