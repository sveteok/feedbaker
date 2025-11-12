# Feedbaker Widget Integration Guide

## Copy the Snippet

Paste this script at the end of the page:

```html
<script
  src="http://localhost:3000/feedbaker.js"
  data-site="52be079b-b0cf-4d75-94d2-2c3b86438fa2"
  data-bg="#0088aa"
  data-fg="#ffffff"
></script>
```

## Customize Appearance

You can use predefined color styles:

```
{
  style1: { bg: "#0088aa", fg: "#ffffff" },
  style2: { bg: "#ffffff", fg: "#000000" },
  style3: { bg: "#000000", fg: "#ffffff" },
  style4: { bg: "#ffff22", fg: "#008800" }
}
```

## Validate Attributes

`data-site`: required, site UUID identifier
`data-bg`: background color (optional)
`data-fg`: text/border color (optional)

## Save and Test

Reload your website and you'll see a feedback button appear in the bottom-right corner.
