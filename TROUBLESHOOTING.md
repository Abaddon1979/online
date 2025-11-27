# Troubleshooting Guide - Discord Style Chat

## Sidebar Not Appearing

If the online users sidebar is not showing up, follow these debugging steps:

### Step 1: Check Theme is Active

1. Go to **Admin Panel** → **Customize** → **Themes**
2. Verify "Discord Style Chat" is in your **Active Themes** or **Components** list
3. If not, click on it and select "Add to [Your Theme]"

### Step 2: Verify Settings

1. Go to **Admin Panel** → **Customize** → **Themes**
2. Click on "Discord Style Chat"
3. Click **Settings** (or **Edit CSS/HTML** → **Settings** tab)
4. Ensure these settings are configured:
   - `enable_online_sidebar`: **checked** ✓
   - `sidebar_width`: 240 (or your preferred width)
   - `user_refresh_interval`: 30000

### Step 3: Check Browser Console

1. Open your Discourse site
2. Press **F12** to open Developer Tools
3. Click the **Console** tab
4. Look for messages starting with `[Discord Style Chat]`

**Expected console output:**
```
[Discord Style Chat] Plugin initializing...
[Discord Style Chat] Initializing...
[Discord Style Chat] Settings: {enable_online_sidebar: true, sidebar_width: 240, user_refresh_interval: 30000}
[Discord Style Chat] Added body class: enable-online-sidebar
[Discord Style Chat] Creating sidebar...
[Discord Style Chat] Sidebar created and appended to body
[Discord Style Chat] Fetching online users...
[Discord Style Chat] Received data: {...}
[Discord Style Chat] Found X users
[Discord Style Chat] Updating users list with X users
[Discord Style Chat] Users list updated
```

**If you see errors**, note what they say and check the solutions below.

### Step 4: Inspect the DOM

1. With Developer Tools open (F12), click the **Elements** or **Inspector** tab
2. Press **Ctrl+F** (or **Cmd+F** on Mac) to search
3. Search for: `discord-online-users-sidebar`
4. If found: The sidebar exists but might be hidden by CSS
5. If not found: The JavaScript isn't creating it

### Common Issues & Solutions

#### Issue 1: "Settings undefined" or "enable_online_sidebar is undefined"

**Solution:** The settings haven't been recognized yet. Try:
1. Go to theme settings
2. Toggle `enable_online_sidebar` OFF, save
3. Toggle it back ON, save
4. Refresh your Discourse page

#### Issue 2: Sidebar exists in DOM but not visible

**Solution:** CSS might not be loading. Check:
1. In Developer Tools → Elements, find the `<div id="discord-online-users-sidebar">`
2. Check its computed styles
3. Make sure it has `display: block` (not `display: none`)
4. Verify `right: 0` and `position: fixed` are applied

**Fix:** Add this to **common.scss** temporarily:
```scss
.discord-sidebar {
  display: block !important;
  visibility: visible !important;
  z-index: 9999 !important;
}
```

#### Issue 3: "Failed to fetch users" or API errors

**Solution:** Check API permissions:
1. Verify `/directory_items.json` is accessible
2. Test by visiting: `https://your-discourse-site.com/directory_items.json`
3. If you get a 403 or 404, adjust your Discourse permissions

#### Issue 4: Sidebar appears but no users shown

**Possible causes:**
- No users in the directory
- API returned empty data
- Avatar URLs failing to load

**Solution:**
1. Check console for data received: Look for `[Discord Style Chat] Received data:`
2. If `directory_items` is empty, try changing the fetch period in the JavaScript
3. Verify users exist in Admin → Users

#### Issue 5: JavaScript not loading at all

**Solution:** 
1. Clear browser cache (Ctrl+Shift+Delete)
2. In Discourse Admin, click "Rebuild" on the theme
3. If using a CDN, purge the cache
4. Check that the JavaScript file path is correct:
   - Should be: `javascripts/discourse/initializers/discord-style-chat.js`

### Step 5: Force Enable for Debugging

If nothing works, temporarily modify `common.scss` to show a test sidebar:

Add this at the END of `common.scss`:

```scss
// DEBUG: Force show a test sidebar
body::after {
  content: "TEST SIDEBAR";
  position: fixed;
  top: 60px;
  right: 0;
  width: 240px;
  height: calc(100vh - 60px);
  background-color: #2f3136;
  color: white;
  padding: 20px;
  z-index: 9999;
  font-family: 'Quicksand', sans-serif;
}
```

If you see "TEST SIDEBAR" appear:
- ✅ CSS is loading correctly
- ❌ JavaScript is not creating the sidebar

If you don't see "TEST SIDEBAR":
- ❌ CSS is not loading
- Check that the theme is active
- Try rebuilding the theme

### Step 6: Check for Conflicts

Other themes or components might conflict:

1. Temporarily disable all other theme components
2. Reload the page
3. Check if sidebar appears
4. If yes, re-enable components one by one to find the conflict

### Manual Installation Checklist

Ensure your file structure is exactly:

```
online/
├── about.json                               ✓
├── settings.yml                             ✓
├── common/
│   ├── common.scss                         ✓
│   └── header.html                         ✓
├── desktop/
│   └── desktop.scss                        ✓
├── mobile/
│   └── mobile.scss                         ✓
└── javascripts/
    └── discourse/
        └── initializers/
            └── discord-style-chat.js       ✓
```

### Getting Help

If none of these solutions work, please provide:

1. **Console output** (copy all `[Discord Style Chat]` messages)
2. **Discourse version** (found in Admin → Dashboard)
3. **Browser and version** (Chrome 120, Firefox 121, etc.)
4. **Screenshot** of:
   - Theme settings page
   - Browser console
   - Developer Tools → Elements tab (searching for discord-online-users-sidebar)

---

## Additional Resources

- [Discourse Theme Development Guide](https://meta.discourse.org/t/developer-s-guide-to-discourse-themes/93648)
- [Theme Component Best Practices](https://meta.discourse.org/t/theme-components/32460)
- [Debugging JavaScript in Discourse](https://meta.discourse.org/t/debugging-javascript-in-discourse/96648)
